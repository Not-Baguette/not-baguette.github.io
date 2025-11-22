import { Container } from "../layout/Container";
import "./Hero.css";

export const Hero = () => {
  return (
    <section className="hero-section">
      {/* Retro Grid Background */}
      <div className="hero-background-grid"></div>

      <Container>
        <div className="card hero-card">
          {/* Profile Section - MySpace Style */}
          <div className="hero-profile-section">
            <div className="hero-photo-container">
              <div className="hero-photo-placeholder">
                Your Photo<br/>
                <span className="hero-photo-placeholder-subtitle">Click to upload</span>
              </div>
              {/* Scan Lines Effect */}
              <div className="hero-scan-lines"></div>
            </div>

            {/* Status */}
            <div className="hero-status">
              ●●● ONLINE ●●●
            </div>

            {/* Mood */}
            <div className="hero-mood">
              Mood: Coding & Vibing 🎵
            </div>
          </div>

          {/* Content Section */}
          <div className="hero-content">
            <div className="hero-welcome-text">
              ░░░ WELCOME TO MY PROFILE ░░░
            </div>
            
            <h1 className="display neon-text glitch-text hero-title">
              xXx_CyberDev_xXx
            </h1>

            <div className="hero-subtitle">
              Elite Hacker • Digital Artist • Code Wizard 🧙‍♀️
            </div>

            <p className="body-large hero-description">
              💻 Building the future one line of code at a time! I specialize in creating mind-blowing digital experiences that transport users to new dimensions. Always down to collab on sick projects! 🚀
            </p>

            {/* Stats */}
            <div className="hero-stats">
              <div className="hero-stat-projects">
                <div className="hero-stat-number hero-stat-number-projects">1337</div>
                <div className="hero-stat-label">Projects</div>
              </div>
              <div className="hero-stat-commits">
                <div className="hero-stat-number hero-stat-number-commits">999+</div>
                <div className="hero-stat-label">Commits</div>
              </div>
              <div className="hero-stat-ideas">
                <div className="hero-stat-number hero-stat-number-ideas">∞</div>
                <div className="hero-stat-label">Ideas</div>
              </div>
            </div>

            <div className="flex gap-4">
              <a href="#projects" className="btn-primary">
                🎮 Check My Work
              </a>
              <a href="#contact" className="btn-secondary">
                💬 Send Message
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
