import React from 'react';
import { Skills } from '../components/sections/Skills';
import './Pages.css';

export const SkillsPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        {/* Skills Section */}
        <Skills />
      </div>
    </div>
  );
};