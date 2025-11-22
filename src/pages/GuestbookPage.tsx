import React from 'react';
import { GuestbookCommentsList } from '../components/GuestbookCommentsList';
import './Pages.css';

export const GuestbookPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <div className="page-box">
          <h2 className="page-title">
            ♡ Sign My Guestbook ♡
          </h2>
          <div className="page-text">
            <p>Leave me a message! I'd love to hear from you.</p>
            <p>Click the button below to write in my guestbook:</p>
            
            <div className="guestbook-button-container">
              <a 
                href="https://forms.gle/nPSg36mZ9EMkEDcv9" 
                target="_blank" 
                rel="noopener noreferrer"
                className="guestbook-button"
              >
                Write in My Guestbook
              </a>
            </div>
            
            <p>This interactive guestbook features:</p>
            <ul>
              <li>Free to make and maintain ♡</li>
              <li>Personal message display :D</li>
              <li>Name's taken from email address (So make sure to write only nice stuff!)</li>
            </ul>
            
            <div className="construction-note">
              Leave me a sweet message! I read every single one of them ♡
            </div>
          </div>
          
          {/* Integrated Comments List */}
          <GuestbookCommentsList />
        </div>
      </div>
    </div>
  );
};