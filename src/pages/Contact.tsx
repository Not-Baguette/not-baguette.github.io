import React from 'react';
import './Pages.css';
import { Contact as ContactSection } from '../components/sections/Contact';

export const Contact: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <ContactSection />
      </div>
    </div>
  );
};