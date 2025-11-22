import React from 'react';
import { Organizations } from '../components/sections/Organizations';
import './Pages.css';

export const OrganizationsPage: React.FC = () => {
  return (
    <div className="page-container">
      <div className="page-content">
        <Organizations />
      </div>
    </div>
  );
};