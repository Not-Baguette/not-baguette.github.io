import React, { useState, useEffect } from 'react';
import './DarkModeToggle.css';

export const DarkModeToggle: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setIsDarkMode(true);
      document.body.classList.add('dark-mode');
    }
  }, []);

  const toggleDarkMode = (event: React.MouseEvent) => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Save preference to localStorage
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    // Create ripple effect
    const ripple = document.createElement('div');
    ripple.className = 'theme-ripple';
    
    // Position ripple at click location
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const size = Math.max(window.innerWidth, window.innerHeight) * 2;
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = rect.left + rect.width / 2 - size / 2 + 'px';
    ripple.style.top = rect.top + rect.height / 2 - size / 2 + 'px';
    
    document.body.appendChild(ripple);
    
    // Toggle dark mode class on body after a short delay for effect
    setTimeout(() => {
      if (newDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      
      // Remove ripple after animation
      setTimeout(() => {
        if (document.body.contains(ripple)) {
          document.body.removeChild(ripple);
        }
      }, 800);
    }, 100);
  };

  return (
    <button 
      onClick={toggleDarkMode} 
      className={`dark-mode-toggle floating ${isDarkMode ? 'dark' : 'light'}`}
      title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="moon-icon"
        >
          <path 
            d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
            fill="currentColor"
            fillOpacity="0.8"
          />
        </svg>
        <span className="toggle-text">
          {isDarkMode ? '🌙' : '☀️'}
        </span>
      </button>
  );
};