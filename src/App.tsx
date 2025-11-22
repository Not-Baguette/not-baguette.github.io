import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpotifyWidget } from './components/SpotifyWidget';
import { SteamWidget } from './components/SteamWidget';
import { Profile } from './components/sections/Profile';
import { Navigation } from './components/sections/Navigation';
import { Experiences } from './components/sections/Experiences';
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
    <div className="app-container">
      {/* Top Navigation Bar */}
      <div className="top-nav">
        ✨ Welcome to My Personal Space! ✨ Last Updated: {lastUpdated}
      </div>

      {/* Main Content Wrapper */}
      <div className="main-content-wrapper">
        {/* Main Layout */}
        <div className="main-layout">
          {/* Left Sidebar */}
          <div className="left-sidebar">
            {/* Profile Box */}
            <Profile currentAge={currentAge} />
            <Navigation />
            <SteamWidget />
          </div>

          {/* Main Content */}
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

          {/* Right Sidebar */}
          <div className="right-sidebar">
            <LatestComments />
            <SpotifyWidget />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer">
        © 2025 Baguette ♡ Made with love and lots of Cursing! ♡<br/>
        Best viewed in 1024x768 resolution
      </div>
      
      {/* Floating Dark Mode Toggle */}
      <DarkModeToggle />
    </div>
    </Router>
  );
}

export default App
