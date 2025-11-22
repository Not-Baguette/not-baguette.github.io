// Steam API utility for recent games

export interface SteamGame {
  appid: number;
  name: string;
  playtime_2weeks: number;
  playtime_forever: number;
  img_icon_url: string;
}

export interface SteamRecentGamesResponse {
  response: {
    total_count: number;
    games: SteamGame[];
  };
}

/**
 * Fetch recently played Steam games
 */
export const fetchRecentGames = async (): Promise<SteamGame[]> => {
  try {
    const STEAM_API_KEY = import.meta.env.VITE_STEAM_API;
    const STEAM_ID = '76561199376353655';
    
    if (!STEAM_API_KEY) {
      console.warn('Steam API key not found');
      return [];
    }

    // Use CORS proxy directly to avoid CORS errors
    const apiUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`;
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Proxy request failed: ${response.status}`);
    }
    
    const proxyData = await response.json();
    
    if (!proxyData.contents) {
      throw new Error('No data received from proxy');
    }
    
    const steamData: SteamRecentGamesResponse = JSON.parse(proxyData.contents);
    
    if (!steamData.response || !steamData.response.games) {
      throw new Error('Invalid Steam API response');
    }
    
    return steamData.response.games.slice(0, 4); // Show top 4 games
    
  } catch (error) {
    console.error('Failed to fetch Steam games:', error);
    return [];
  }
};

/**
 * Format playtime in minutes to readable format
 */
export const formatPlaytime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 100) {
    return `${hours}h`;
  }
  return `${Math.floor(hours / 10) / 10}k`;
};

/**
 * Get Steam game icon URL
 */
export const getSteamIconUrl = (appid: number, iconHash: string): string => {
  return `https://media.steampowered.com/steamcommunity/public/images/apps/${appid}/${iconHash}.jpg`;
};

/**
 * Get Steam store page URL for a game
 */
export const getSteamStoreUrl = (appid: number): string => {
  return `https://store.steampowered.com/app/${appid}/`;
};