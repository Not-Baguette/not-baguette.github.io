import React, { useState, useEffect } from 'react';
import { fetchGuestbookEntries, formatTimestamp, sanitizeText, GOOGLE_FORM_URL, type GuestbookEntry } from '../utils/guestbook';
import './LatestComments.css';

export const LatestComments: React.FC = () => {
  const [latestComments, setLatestComments] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    const fetchLatestComments = async () => {
      try {
        const entries = await fetchGuestbookEntries();
        setLatestComments(entries.slice(0, 3)); // Show only latest 3 comments
      } catch (error) {
        console.error('Failed to fetch guestbook entries:', error);
      }
    };

    fetchLatestComments();
  }, []);

  return (
    <div className="comments-box">
      <h4 className="comments-title">
        ♡ Latest Comments ♡
      </h4>
      <div className="comments-list">
        {latestComments.length > 0 ? (
          latestComments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-header">
                <strong>{sanitizeText(comment.email.split('@')[0])}:</strong>
                <span className="comment-date">{formatTimestamp(comment.timestamp)}</span>
              </div>
              <div className="comment-text">
                "{sanitizeText(comment.comment).substring(0, 80)}{sanitizeText(comment.comment).length > 80 ? '...' : ''}"
              </div>
            </div>
          ))
        ) : (
          <div className="comment-item">
            <strong>No comments yet!</strong><br/>
            "Be the first to leave a comment! ♡"
          </div>
        )}
      </div>
      <div className="comment-form-button">
        <a 
          href={GOOGLE_FORM_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="form-button"
        >
          Leave a Comment!
        </a>
      </div>
    </div>
  );
};