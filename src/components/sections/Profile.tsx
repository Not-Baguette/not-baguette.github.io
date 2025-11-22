import React from 'react';
import './Profile.css';

interface ProfileProps {
  currentAge: number;
}

export const Profile: React.FC<ProfileProps> = ({ currentAge }) => {
  return (
    <div className="profile-box">
      <h3 className="profile-title">
        ♡ Clemens P.K. ♡
      </h3>
      <img 
        src="/rainyboots.jpg" 
        alt="Rainyboots" 
        className="profile-photo"
      />
      <div className="profile-details">
        <strong>Age:</strong> {currentAge} ♡<br/>
        <strong>Location:</strong> Jakarta, Indonesia<br/>
        <strong>Status:</strong> Single D:<br/>
        <strong>Languages:</strong> English (C1), Indonesian (Native), German (A1/A2)<br/>
      </div>
    </div>
  );
};