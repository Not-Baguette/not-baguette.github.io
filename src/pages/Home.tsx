import React from 'react';
import { Welcome } from '../components/sections/Welcome';
import { AboutSection } from '../components/sections/AboutSection';
import { Projects } from '../components/sections/Projects';

export const Home: React.FC = () => {
  return (
    <div className="main-content">
      <Welcome />
      <AboutSection />
      <Projects />
    </div>
  );
};