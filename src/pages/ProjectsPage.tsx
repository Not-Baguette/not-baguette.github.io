import React from 'react';
import './Pages.css';
import { GitHubRepos } from '../components/sections/GitHubRepos';

export const ProjectsPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-box">
          <h2 className="page-title">
            ♡ My Projects ♡
          </h2>
          <div className="page-text">
            <p>Welcome to my project showcase! Here you'll find my latest work and creations.</p>
            <p>This includes:</p>
            <ul>
              <li>Web development projects</li>
              <li>Creative coding experiments</li>
              <li>Open source contributions</li>
              <li>Personal side projects</li>
            </ul>
            <div className="construction-note">
              Repositories loaded dynamically from GitHub!
            </div>
          </div>
        </div>
        <GitHubRepos />
      </div>
    </div>
  );
};