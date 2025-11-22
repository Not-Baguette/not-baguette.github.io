import React from 'react';
import './Welcome.css';

export const Welcome: React.FC = () => {
  return (
    <div className="welcome-box">
      <h2 className="welcome-title">
        ✿ Welcome to My Personal Space! ✿
      </h2>
      <p className="welcome-text">
        Hiiii everyone! Welcome to my little corner of the internet! ✨ 
        I'm Bagu and I absolutely LOVE cats! :D
        This is where I share my projects, my best work, and connect with amazing people like you! ♡
      </p>
      <p className="welcome-footer">
        Thanks for visiting! Feel free to leave me a comment on da guestbook! (◕‿◕)♡
      </p>
    </div>
  );
};