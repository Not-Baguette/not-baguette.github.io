import React, { useState, useEffect } from 'react';
import { fetchGuestbookEntries, formatTimestamp, sanitizeText, type GuestbookEntry } from '../utils/guestbook';
import './GuestbookCommentsList.css';

export const GuestbookCommentsList: React.FC = () => {
  const [comments, setComments] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const entries = await fetchGuestbookEntries();
        setComments(entries);
      } catch (error) {
        console.error('Failed to fetch guestbook entries:', error);
        setComments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  return (
    <div className="guestbook-comments-section">
      <div className="comments-header-integrated">
        <h4 className="comments-title-integrated">
          Messages from Visitors {comments.length > 0 && `(${comments.length})`} ♡
        </h4>
      </div>
      
      <div className="comments-container-wrapper">
        <div className="comments-scroll-container">
          <div className="comments-list-full">
          {loading ? (
            <div className="loading-message">
              Loading comments... ♡
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment, index) => (
              <div key={index} className="comment-item-full">
                <div className="comment-header-full">
                  <div className="comment-author">
                    ♡ {sanitizeText(comment.email.split('@')[0])}
                  </div>
                  <div className="comment-date-full">
                    {formatTimestamp(comment.timestamp)}
                  </div>
                </div>
                <div className="comment-text-full">
                  "{sanitizeText(comment.comment)}"
                </div>
              </div>
            ))
          ) : null}
          {comments.length === 0 && !loading && (
            <div className="no-comments-message">
              <div className="comment-item-full">
                <div className="comment-header-full">
                  <div className="comment-author">♡ No messages yet!</div>
                </div>
                <div className="comment-text-full">
                  "Be the first to leave a sweet message in my guestbook! ♡"
                </div>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};