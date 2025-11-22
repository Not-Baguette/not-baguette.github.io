import React from 'react';
import './Contact.css';
import { MdEmail } from 'react-icons/md';
import { FaInstagram, FaDiscord, FaLinkedin } from 'react-icons/fa';

export const Contact: React.FC = () => {
  return (
    <div className="contact-section">
      <div className="page-box">
        <h2 className="page-title">
          ♥ Contact Me ♥
        </h2>
        <div className="page-text">
          <p>Want to get in touch? Here's how you can reach me!</p>
          <p>Feel free to reach out through any of the following methods ♥</p>
        </div>
        
        <div className="contact-list">
          {/* Email */}
          <div className="contact-item">
            <div className="contact-icon"><MdEmail /></div>
            <div className="contact-info">
              <div className="contact-label">Email</div>
              <a href="mailto:clemens.joe.gh@gmail.com" className="contact-link">
                clemens.joe.gh@gmail.com
              </a>
            </div>
          </div>

          {/* Instagram */}
          <a 
            href="https://www.instagram.com/colonized.bread/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-item contact-link-item"
          >
            <div className="contact-icon"><FaInstagram /></div>
            <div className="contact-info">
              <div className="contact-label">Instagram</div>
              <div className="contact-handle">@colonized.bread</div>
            </div>
          </a>

          {/* Discord */}
          <a 
            href="https://discordapp.com/users/1100354135691382794" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-item contact-link-item"
          >
            <div className="contact-icon"><FaDiscord /></div>
            <div className="contact-info">
              <div className="contact-label">Discord</div>
              <div className="contact-handle">Click to add me!</div>
            </div>
          </a>

          {/* LinkedIn */}
          <a 
            href="https://www.linkedin.com/in/clemens-putra-667b35324/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="contact-item contact-link-item"
          >
            <div className="contact-icon"><FaLinkedin /></div>
            <div className="contact-info">
              <div className="contact-label">LinkedIn</div>
              <div className="contact-handle">Clemens Putra</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};