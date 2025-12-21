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

// more cors proxy cuz reliability issues
const CORS_PROXIES = [
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/get?url=',
  'https://corsproxy.io/?',
  'https://cors-anywhere.herokuapp.com/',
];

const fetchWithProxy = async (apiUrl: string, proxyIndex = 0): Promise<any> => {
  if (proxyIndex >= CORS_PROXIES.length) {
    throw new Error('All proxy services failed');
  }
  
  const proxy = CORS_PROXIES[proxyIndex];
  let proxyUrl: string;
  
  // Different proxies have different URL formats
  if (proxy.includes('allorigins')) {
    proxyUrl = `${proxy}${encodeURIComponent(apiUrl)}`;
  } else if (proxy.includes('codetabs')) {
    proxyUrl = `${proxy}${encodeURIComponent(apiUrl)}`;
  } else {
    proxyUrl = `${proxy}${apiUrl}`;
  }
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Handle different proxy response formats
    if (proxy.includes('allorigins') && data.contents) {
      return JSON.parse(data.contents);
    } else if (proxy.includes('codetabs') && data) {
      return data;
    } else if (data) {
      return data;
    } else {
      throw new Error('No valid data in response');
    }
    
  } catch (error) {
    console.warn(`Proxy ${proxy} failed:`, error);
    // Try next proxy
    return fetchWithProxy(apiUrl, proxyIndex + 1);
  }
};

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

    // Build Steam API URL
    const apiUrl = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`;
    
    // Try fetching with different proxy services
    const steamData: SteamRecentGamesResponse = await fetchWithProxy(apiUrl);
    
    if (!steamData.response || !steamData.response.games) {
      console.warn('No recent games found in Steam API response');
      return [];
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