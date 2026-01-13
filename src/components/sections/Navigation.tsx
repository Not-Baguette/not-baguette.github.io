import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

export const Navigation: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="nav-box">
      <h4 className="nav-title">
        Navigation
      </h4>
      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
          • Home
        </Link>
        <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
          • About Me
        </Link>
        <Link to="/projects" className={`nav-link ${isActive('/projects') ? 'active' : ''}`}>
          • My Projects
        </Link>
        <Link to="/organizations" className={`nav-link ${isActive('/organizations') ? 'active' : ''}`}>
          • Organizations
        </Link>
        <Link to="/skills" className={`nav-link ${isActive('/skills') ? 'active' : ''}`}>
          • Skills
        </Link>
        <Link to="/blog" className={`nav-link ${isActive('/blog') ? 'active' : ''}`}>
          • My Blog
        </Link>
        <Link to="/tools" className={`nav-link ${isActive('/tools') ? 'active' : ''}`}>
          • Tools
        </Link>
        <Link to="/guestbook" className={`nav-link ${isActive('/guestbook') ? 'active' : ''}`}>
          • Guestbook
        </Link>
        <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
          • Contact
        </Link>
      </div>
    </div>
  );
};