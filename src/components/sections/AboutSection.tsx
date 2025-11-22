import React from 'react';
import './AboutSection.css';

export const AboutSection: React.FC = () => {
  return (
    <div className="about-box">
      <h3 className="about-title">
        About This Page ♡
      </h3>
      <p className="about-description">
        This page is the third version of my main page. (4th counting <a href="https://bagubaguu.carrd.co" target="_blank" rel="noopener noreferrer" className="version-link">carrd</a>) ✨
        On each iteration, I've aimed to enhance both the design and functionality,
        incorporating new technologies and things I've learned along the way.

        The first version (<a href="https://github.com/Not-Baguette/not-baguette.github.io/commit/f737144bd701fe99367b34dceae84cca5b933199" target="_blank" rel="noopener noreferrer" className="version-link">V1</a>) was a simple HTML/CSS site, while the second (<a href="https://github.com/Not-Baguette/not-baguette.github.io/tree/v2-last-ver" target="_blank" rel="noopener noreferrer" className="version-link">V2</a>) introduced
        proper Javascript for interactivity, design stuff such as parralax and animations.
        This is where I started learning React as well (Seen with <a href="https://github.com/Not-Baguette/not-baguette.github.io/tree/v2-last-ver/timeless" target="_blank" rel="noopener noreferrer" className="version-link">timeless</a>).
        <a href="https://github.com/Not-Baguette/not-baguette.github.io" target="_blank" rel="noopener noreferrer" className="version-link"> V3</a> is built with React and TypeScript, with actual API endpoints usage.
      </p>
      <div className="obsessions-box">
        <strong className="obsessions-title">Current Themes:</strong><br/>
        • Pastel color palettes<br/>
        • Modern Frameworks<br/>
        • API Integration<br/>
        • Dynamic & Interactive Content ♡
      </div>
    </div>
  );
};