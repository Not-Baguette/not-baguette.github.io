import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpotifyWidget } from './components/SpotifyWidget';
import { SteamWidget } from './components/SteamWidget';
import { Profile } from './components/sections/Profile';
import { Navigation } from './components/sections/Navigation';
import { Home } from './pages/Home';
import { AboutMe } from './pages/AboutMe';
import { ProjectsPage } from './pages/ProjectsPage';
import { GuestbookPage } from './pages/GuestbookPage';
import { Contact } from './pages/Contact';
import { OrganizationsPage } from './pages/OrganizationsSkills';
import { SkillsPage } from './pages/SkillsPage';
import { BlogPage } from './pages/BlogPage';
import { useState, useEffect } from 'react';
import { getLastUpdated } from './utils/github';
import { LatestComments } from './components/LatestComments';
import { DarkModeToggle } from './components/DarkModeToggle';

function App() {
  const [lastUpdated, setLastUpdated] = useState<string>('Loading...');

  // Calculate age from birthdate (September 19, 2006)
  const calculateAge = (): number => {
    const birthDate = new Date(2006, 8, 19); // Month is 0-indexed (8 = September)
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const currentAge = calculateAge();

  useEffect(() => {
    const fetchLastUpdated = async () => {
      try {
        const date = await getLastUpdated();
        setLastUpdated(date);
      } catch (error) {
        console.error('Failed to fetch last updated date:', error);
        setLastUpdated('Unknown');
      }
    };

    fetchLastUpdated();
  }, []);
  return (
    <Router>
    <div className="app-container" itemScope itemType="https://schema.org/WebPage">
      {/* SEO: Hidden structured data for search engines */}
      <h1 style={{ position: 'absolute', left: '-9999px', visibility: 'hidden' }}>
        Clemens Putra Kusmeri (Not-Baguette) - Creative Developer Portfolio & Blog
      </h1>
      
      {/* Top Navigation Bar */}
      <header className="top-nav" role="banner">
        <span itemProp="headline">✨ Welcome to My Personal Space! ✨</span>
        <span>Last Updated: <time itemProp="dateModified">{lastUpdated}</time></span>
      </header>

      {/* Main Content Wrapper */}
      <div className="main-content-wrapper" role="main">
        {/* Main Layout */}
        <div className="main-layout" itemScope itemType="https://schema.org/BlogPosting">
          {/* Left Sidebar */}
          <aside className="left-sidebar" role="complementary" aria-label="Profile and Navigation">
            {/* Profile Box */}
            <section itemScope itemType="https://schema.org/Person">
              <Profile currentAge={currentAge} />
            </section>
            <nav role="navigation" aria-label="Main Navigation">
              <Navigation />
            </nav>
            <section aria-label="Gaming Activity">
              <SteamWidget />
            </section>
          </aside>

          {/* Main Content */}
          <main role="main" itemProp="mainContentOfPage">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutMe />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/organizations" element={<OrganizationsPage />} />
              <Route path="/skills" element={<SkillsPage />} />
              <Route path="/guestbook" element={<GuestbookPage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<BlogPage />} />
            </Routes>
          </main>

          {/* Right Sidebar */}
          <aside className="right-sidebar" role="complementary" aria-label="Social Updates">
            <section aria-label="Latest Guestbook Comments">
              <LatestComments />
            </section>
            <section aria-label="Currently Playing Music" itemScope itemType="https://schema.org/MusicRecording">
              <SpotifyWidget />
            </section>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer" role="contentinfo">
        <p itemScope itemType="https://schema.org/Person">
          © 2025 <span itemProp="alternateName">Baguette</span> ♡ Made with love and lots of Cursing! ♡<br/>
          <small>Best viewed in 1024x768 resolution</small>
        </p>
      </footer>
      
      {/* Floating Dark Mode Toggle */}
      <DarkModeToggle />
    </div>
    </Router>
  );
}

export default App
