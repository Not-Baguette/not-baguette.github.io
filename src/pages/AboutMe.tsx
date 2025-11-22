import React from 'react';
import './Pages.css';

export const AboutMe: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-box">
          <h2 className="page-title">
            ♡ About Me ♡
          </h2>
          <div className="page-text">
            <p>Welcome to my About Me page! This is where I'll share more details about myself.</p>
            <p>This page is under construction but will soon contain:</p>
            <ul>
              <li>My background and journey</li>
              <li>Personal interests and hobbies</li>
              <li>Life philosophy and values</li>
              <li>Fun facts about me</li>
            </ul>
            <div className="construction-note">
              Coming soon! Check back later for more content ^^
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};