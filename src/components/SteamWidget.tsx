import React, { useState, useEffect } from 'react';
import { fetchRecentGames, formatPlaytime, getSteamIconUrl, getSteamStoreUrl, type SteamGame } from '../utils/steam';
import './SteamWidget.css';

export const SteamWidget: React.FC = () => {
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const recentGames = await fetchRecentGames();
        setGames(recentGames);
      } catch (error) {
        console.error('Error loading Steam games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="steam-widget-box">
      <h4 className="steam-title">
        🎮 Recent Games 🎮
      </h4>
      <div className="steam-games-list">
        {loading ? (
          <div className="steam-loading">Loading games... ✨</div>
        ) : games.length > 0 ? (
          games.map((game) => (
            <a 
              key={game.appid} 
              href={getSteamStoreUrl(game.appid)}
              target="_blank"
              rel="noopener noreferrer"
              className="steam-game-item steam-game-link"
            >
              <div className="steam-game-icon">
                <img 
                  src={getSteamIconUrl(game.appid, game.img_icon_url)} 
                  alt={game.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="steam-game-fallback">🎮</div>
              </div>
              <div className="steam-game-info">
                <div className="steam-game-name">
                  {game.name.length > 20 ? `${game.name.substring(0, 17)}...` : game.name}
                </div>
                <div className="steam-game-time">
                  {formatPlaytime(game.playtime_2weeks)} this week
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="steam-no-games">
            No recent games! 🎮
          </div>
        )}
      </div>
    </div>
  );
};