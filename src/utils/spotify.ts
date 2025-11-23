// Spotify Web API utility functions

// Spotify API endpoints
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const TOP_TRACKS_ENDPOINT = 'https://api.spotify.com/v1/me/top/tracks';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';

// Environment variables
const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_SPOTIFY_REFRESH_TOKEN;

// Token caching
let cachedAccessToken: string | null = null;
let tokenExpirationTime: number = 0;

/**
 * Get access token using your personal refresh token
 */
export const getAccessToken = async (): Promise<string> => {
  try {

    // Check if we have a cached token that hasn't expired
    const currentTime = Date.now();
    if (cachedAccessToken && currentTime < tokenExpirationTime) {
      return cachedAccessToken;
    }

    // Use your personal refresh token if available
    if (refresh_token && refresh_token !== 'YOUR_REFRESH_TOKEN_HERE' && client_id && client_secret) {
      const basic = btoa(`${client_id}:${client_secret}`);
      
      const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${basic}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        }).toString(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Token refresh failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          refresh_token_length: refresh_token?.length,
          has_client_id: !!client_id,
          has_client_secret: !!client_secret
        });
        throw new Error(`Token refresh failed: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      // Cache the token
      cachedAccessToken = data.access_token;
      tokenExpirationTime = currentTime + (data.expires_in ? data.expires_in * 1000 - 60000 : 3300000); // 55 minutes
      
      return data.access_token;
    }
    
    console.error('No valid credentials found');
    throw new Error('No valid Spotify credentials found. Please set up your refresh token.');
  } catch (error) {
    console.error('getAccessToken error:', error);
    throw error;
  }
};

/**
 * Check if we have the credentials needed to show your Spotify data
 */
export const hasSpotifyCredentials = (): boolean => {
  // Check if we have your personal refresh token
  if (refresh_token && refresh_token !== 'YOUR_REFRESH_TOKEN_HERE') {
    return true;
  }
  
  return false;
};

/**
 * Generic function to make requests to Spotify Web API with automatic token refresh
 */
async function fetchSpotifyApi(endpoint: string, method: string = 'GET', body?: any, retryCount: number = 0) {
  try {

    const access_token = await getAccessToken();

    if (!access_token) {
      console.error('No access token available');
      throw new Error('No Spotify access token available');
    }

    const response = await fetch(endpoint, {
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      method,
      body: body ? JSON.stringify(body) : undefined,
    });

    console.log('API response:', {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    if (!response.ok) {
      if (response.status === 401 && retryCount === 0) {
        console.log('401 error, clearing cache and retrying...');
        // Token expired, clear cache and retry once
        cachedAccessToken = null;
        tokenExpirationTime = 0;
        return fetchSpotifyApi(endpoint, method, body, 1);
      } else if (response.status === 204) {
        console.log('204 No content - user not playing anything');
        // No content - user not playing anything
        return null;
      }
      
      const errorText = await response.text();
      console.error('API error response:', errorText);
      
      // For 403 errors, provide more helpful error message
      if (response.status === 403) {
        throw new Error(`Spotify API access denied (403). Check if your app has the required scopes: user-read-currently-playing, user-read-recently-played, user-top-read`);
      }
      
      throw new Error(`Spotify API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // Handle empty responses (common for currently-playing when nothing is playing)
    const text = await response.text();    
    if (!text || text.length === 0) {
      console.log('Empty response body');
      return null;
    }
    
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch (error) {
      console.error('Failed to parse JSON:', error);
      return null;
    }
  } catch (error) {
    console.error('fetchSpotifyApi error:', error);
    throw error;
  }
}

/**
 * Get user's top tracks
 */
export async function getTopTracks(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term', limit: number = 5) {
  try {
    const endpoint = `${TOP_TRACKS_ENDPOINT}?time_range=${timeRange}&limit=${limit}`;
    const data = await fetchSpotifyApi(endpoint);
    
    if (!data || !data.items) {
      return [];
    }
    
    return data.items.map((track: any) => ({
      id: track.id,
      name: track.name,
      artists: track.artists.map((artist: any) => artist.name).join(', '),
      album: track.album.name,
      image: track.album.images[0]?.url,
      external_url: track.external_urls.spotify,
      preview_url: track.preview_url,
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Get user's top artists
 */
export async function getTopArtists(timeRange: 'short_term' | 'medium_term' | 'long_term' = 'long_term', limit: number = 5) {
  try {
    const data = await fetchSpotifyApi(`me/top/artists?time_range=${timeRange}&limit=${limit}`);
    return data.items.map((artist: any) => ({
      id: artist.id,
      name: artist.name,
      genres: artist.genres,
      image: artist.images[0]?.url,
      external_url: artist.external_urls.spotify,
      followers: artist.followers.total,
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Get currently playing track
 */
export async function getCurrentlyPlaying() {
  try {
    const data = await fetchSpotifyApi(NOW_PLAYING_ENDPOINT);
    
    if (!data || !data.item) {
      return null; // Nothing currently playing
    }

    return {
      id: data.item.id,
      name: data.item.name,
      artists: data.item.artists.map((artist: any) => artist.name).join(', '),
      album: data.item.album.name,
      image: data.item.album.images[0]?.url,
      external_url: data.item.external_urls.spotify,
      is_playing: data.is_playing,
      progress_ms: data.progress_ms,
      duration_ms: data.item.duration_ms,
      // Additional fields for compatibility
      albumImageUrl: data.item.album.images[0]?.url,
      title: data.item.name,
      artist: data.item.artists.map((artist: any) => artist.name).join(', '),
      songUrl: data.item.external_urls.spotify,
      artistUrl: data.item.album.artists[0]?.external_urls?.spotify,
      timePlayed: data.progress_ms,
      timeTotal: data.item.duration_ms,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Get recently played tracks
 */
export async function getRecentlyPlayed(limit: number = 10) {
  try {
    const data = await fetchSpotifyApi(`me/player/recently-played?limit=${limit}`);
    return data.items.map((item: any) => ({
      id: item.track.id,
      name: item.track.name,
      artists: item.track.artists.map((artist: any) => artist.name).join(', '),
      album: item.track.album.name,
      image: item.track.album.images[0]?.url,
      external_url: item.track.external_urls.spotify,
      played_at: item.played_at,
    }));
  } catch (error) {
    return [];
  }
}

/**
 * Force refresh the cached access token
 */
export const refreshAccessToken = async (): Promise<void> => {
  cachedAccessToken = null;
  tokenExpirationTime = 0;
  await getAccessToken();
};

/**
 * Check if token needs refresh and refresh if necessary
 */
export const ensureValidToken = async (): Promise<void> => {
  const currentTime = Date.now();
  
  // Refresh if token expires in the next 5 minutes
  if (currentTime >= tokenExpirationTime - 300000) {
    await refreshAccessToken();
  }
};