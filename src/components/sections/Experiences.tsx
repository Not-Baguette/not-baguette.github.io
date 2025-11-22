import React from 'react';
import './Experiences.css';

export const Experiences: React.FC = () => {
  const experiences = ['lorem', 'ipsum', 'dolor', 'jamet'];

  return (
    <div className="experiences-box">
      <h4 className="experiences-title">
        ♡ Experiences ♡
      </h4>
      <div className="experiences-grid">
        {experiences.map((experience, i) => (
          <div key={i} className="experience-item">
            {experience}
          </div>
        ))}
      </div>
    </div>
  );
};