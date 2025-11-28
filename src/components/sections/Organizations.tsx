import React from 'react';
import './Organizations.css';

export const Organizations: React.FC = () => {
  const organizations = [
    {
      name: "HMIF",
      role: "-",
      period: "Applying",
      description: "Students' Association of Informatics Students ♡",
      link: "https://www.instagram.com/hmif.umn/",
      backgroundImage: "/org-backgrounds/HMIF.png"
    },
    {
      name: "International Office - Exchange Student Buddy",
      role: "Buddy",
      period: "2025 - Present",
      description: "I help Korean & Russian exchange students navigate university life ♡",
      link: "https://www.instagram.com/io.umn/",
      backgroundImage: "/org-backgrounds/KUMA.webp"
    },
    {
      name: "UMN Programming Club - Website Division",
      role: "Coordinator",
      period: "2025 - Present",
      description: "Coordinating the UMNPC Website Division for 2025-2026 ♡",
      link: "https://www.instagram.com/umnprogrammingclub/",
      backgroundImage: "/org-backgrounds/UMNPC.png"
    },
    {
      name: "BYTE - DOME",
      role: "Member",
      period: "2025",
      description: "Handled security for BYTE events including FUSE, Horizon, and Infinite ♡",
      link: "https://www.instagram.com/byte_umn/",
      backgroundImage: "/org-backgrounds/BYTE.webp"
    },
        {
      name: "UESC - Model United Nations",
      role: "Member",
      period: "2024 - 2025",
      description: "Active member of my University's Model United Nations program ♡",
      link: "https://www.instagram.com/uesc_umn/",
      backgroundImage: "/org-backgrounds/UESC.jpg"
    }
  ];

  return (
    <section className="organizations-section">
      <div className="organizations-container">
        <div className="organizations-header">
          <div className="organizations-caption">
            COMMUNITY
          </div>
          <h2 className="organizations-title">
            Organizations & Activities
          </h2>
          <p className="organizations-description">
            Here are the organizations I'm actively/was part of ♡
          </p>
        </div>
        
        <div className="organizations-scroll-container">
          <div className="organizations-list">
            {organizations.map((org, index) => (
              <a 
                key={index} 
                href={org.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="organization-item"
                style={{
                  backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.85)), url(${org.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="org-header">
                  <h3 className="org-name">{org.name}</h3>
                  <span className="org-period">{org.period}</span>
                </div>
                <div className="org-role">{org.role}</div>
                <p className="org-description">{org.description}</p>
                <div className="org-link-indicator">
                  → Visit Organization ♡
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};