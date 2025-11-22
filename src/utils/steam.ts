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
      return getSampleGames();
    }

    const url = `https://api.steampowered.com/IPlayerService/GetRecentlyPlayedGames/v1/?key=${STEAM_API_KEY}&steamid=${STEAM_ID}&format=json`;
    
    // Try direct access first
    let response = await fetch(url);
    
    // If CORS fails, try with proxy
    if (!response.ok) {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      response = await fetch(proxyUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const steamData: SteamRecentGamesResponse = JSON.parse(data.contents);
      return steamData.response.games.slice(0, 4); // Show top 4 games
    }
    
    const steamData: SteamRecentGamesResponse = await response.json();
    return steamData.response.games.slice(0, 4); // Show top 4 games
    
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    return getSampleGames();
  }
};

/**
 * Get sample games for fallback
 */
const getSampleGames = (): SteamGame[] => {
  return [
    {
      appid: 1206560,
      name: "WorldBox - God Simulator",
      playtime_2weeks: 314,
      playtime_forever: 44925,
      img_icon_url: "8f619ad226e578bcdc8be419f7b73e583b5b9cad"
    },
    {
      appid: 2386250,
      name: "It gets so lonely here",
      playtime_2weeks: 194,
      playtime_forever: 194,
      img_icon_url: "4c7ca16b7f2ae792bae811f31af54a9bb1c28923"
    },
    {
      appid: 1118200,
      name: "People Playground",
      playtime_2weeks: 82,
      playtime_forever: 16999,
      img_icon_url: "41b6bdf6fb9feae9c966d414c2acddd77aaafa7f"
    }
  ];
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