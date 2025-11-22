import React from 'react';
import { BlogCalendar } from '../components/BlogCalendar';
import './Pages.css';

export const BlogPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-box">
          <h2 className="page-title">
            ♡ My Blog ♡
          </h2>
          <div className="page-text">
            <p>Welcome to my personal blog! Here I share my thoughts, experiences, and random musings.</p>
            <p>You'll find posts about:</p>
            <ul>
              <li>University life and studies</li>
              <li>Programming and tech adventures</li>
              <li>Gaming experiences</li>
              <li>Random thoughts and updates</li>
            </ul>
          </div>
        </div>
        
        {/* Blog Calendar */}
        <BlogCalendar />
      </div>
    </div>
  );
};