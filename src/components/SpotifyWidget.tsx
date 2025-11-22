import { useState, useEffect } from 'react';
import { getCurrentlyPlaying, getTopTracks, ensureValidToken, hasSpotifyCredentials } from '../utils/spotify';
import './SpotifyWidget.css';

// Utility function to format milliseconds to MM:SS
const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

interface Track {
  id: string;
  name: string;
  artists: string;
  album: string;
  image?: string;
  external_url: string;
  is_playing?: boolean;
  progress_ms?: number;
  duration_ms?: number;
}

export const SpotifyWidget = () => {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasCredentials, setHasCredentials] = useState(false);
  const [realtimeProgress, setRealtimeProgress] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(0);

  useEffect(() => {
    const fetchSpotifyData = async () => {
      try {
        setLoading(true);
        
        // Check if we have the credentials needed
        if (!hasSpotifyCredentials()) {
          setHasCredentials(false);
          setLoading(false);
          return;
        }
        
        setHasCredentials(true);
        
        // Ensure we have a valid token before making requests
        await ensureValidToken();
        
        // Fetch current track and top tracks
        const [current, top] = await Promise.all([
          getCurrentlyPlaying(),
          getTopTracks('medium_term', 3)
        ]);

        setCurrentTrack(current);
        setTopTracks(top);
        
        // Initialize real-time progress tracking
        if (current && current.progress_ms !== undefined) {
          setRealtimeProgress(current.progress_ms);
          setLastUpdateTime(Date.now());
        }
      } catch (error) {
        // Silently handle errors - component will show fallback state
      } finally {
        setLoading(false);
      }
    };

    fetchSpotifyData();

    // Refresh current track every 30 seconds with token validation
    const interval = setInterval(async () => {
      try {
        await ensureValidToken();
        const current = await getCurrentlyPlaying();
        setCurrentTrack(current);
        
        // Reset real-time progress tracking with fresh data
        if (current && current.progress_ms !== undefined) {
          setRealtimeProgress(current.progress_ms);
          setLastUpdateTime(Date.now());
        } else {
          setRealtimeProgress(null);
        }
      } catch (error) {
        // Silently handle refresh errors
      }
    }, 30000);

    // Refresh token every 50 minutes preventively
    const tokenRefreshInterval = setInterval(async () => {
      try {
        await ensureValidToken();
      } catch (error) {
        // Silently handle token refresh errors
      }
    }, 3000000); // 50 minutes

    return () => {
      clearInterval(interval);
      clearInterval(tokenRefreshInterval);
    };
  }, []);

  // Real-time progress updates (every second)
  useEffect(() => {
    if (!currentTrack || !currentTrack.is_playing || realtimeProgress === null || !currentTrack.duration_ms) {
      return;
    }

    const progressInterval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastUpdate = now - lastUpdateTime;
      const newProgress = realtimeProgress + timeSinceLastUpdate;
      
      // Don't exceed the song duration
      if (newProgress < currentTrack.duration_ms!) {
        setRealtimeProgress(newProgress);
        setLastUpdateTime(now);
      }
    }, 1000); // Update every second

    return () => clearInterval(progressInterval);
  }, [currentTrack, realtimeProgress, lastUpdateTime]);

  // Calculate the progress to display (use real-time if available, fallback to track data)
  const displayProgress = realtimeProgress !== null ? realtimeProgress : currentTrack?.progress_ms;

  if (loading) {
    return (
      <div className="spotify-widget-loading">
        Loading music...
      </div>
    );
  }

  if (!hasCredentials) {
    return (
      <div className="spotify-widget">
        <h4 className="spotify-widget-title">
          ♪ My Music ♪
        </h4>
        <div className="spotify-setup">
          <p>Spotify integration not configured yet</p>
          <p className="spotify-setup-note">
            (Your spotify creds broke again baguuu)
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="spotify-widget">
      <h4 className="spotify-widget-title">
        My Music ♪
      </h4>

      {/* Now Playing */}
      <div className="now-playing-section">
        <div className="now-playing-label">
          Now Playing:
        </div>
        {currentTrack ? (
          <div className={`now-playing-track ${currentTrack.is_playing ? 'bobbing' : ''}`}>
            {currentTrack.image && (
              <img 
                src={currentTrack.image} 
                alt={currentTrack.name}
                className="track-image"
              />
            )}
            <div className="track-info">
              <div className="track-name">
                {currentTrack.name}
              </div>
              <div className="track-artist">
                by {currentTrack.artists}
              </div>
              {/* Progress Bar */}
              {displayProgress !== undefined && currentTrack.duration_ms && (
                <div className="progress-container">
                  <div className="progress-time">
                    {formatTime(displayProgress)}
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${(displayProgress / currentTrack.duration_ms) * 100}%` 
                      }}
                    />
                  </div>
                  <div className="progress-time">
                    {formatTime(currentTrack.duration_ms)}
                  </div>
                </div>
              )}
            </div>
            <span className="play-status">
              {currentTrack.is_playing ? '♪' : '⏸'}
            </span>
          </div>
        ) : (
          <div className="nothing-playing">
            Nothing playing right now
          </div>
        )}
      </div>

      {/* Top Songs */}
      <div className="top-songs-section">
        <div className="top-songs-label">
          Top Songs:
        </div>
        {topTracks.length > 0 ? (
          <div>
            {topTracks.map((track, index) => (
              <div key={track.id} className="top-song-item">
                <span className="song-number">
                  {index + 1}.
                </span>
                {track.image && (
                  <img 
                    src={track.image} 
                    alt={track.name}
                    className="top-song-image"
                  />
                )}
                <div className="top-song-info">
                  <div className="top-song-name">
                    {track.name}
                  </div>
                  <div className="top-song-artist">
                    {track.artists}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-top-songs">
            No top songs available
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="spotify-footer">
        via Spotify ♪
      </div>
    </div>
  );
};