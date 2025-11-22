import React, { useState, useEffect } from 'react';
import { fetchBlogPosts, formatBlogDate, sanitizeText, getAuthorName, truncateContent, type BlogPost } from '../utils/blog';
import './Blog.css';

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPost, setExpandedPost] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        const blogPosts = await fetchBlogPosts();
        setPosts(blogPosts);
      } catch (err) {
        setError('Failed to load blog posts');
        console.error('Error fetching blog posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleExpanded = (postId: string) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };



  if (loading) {
    return (
      <div className="blog-section">
        <div className="blog-header">
          <h3 className="blog-title">My Blog ✨</h3>
          <p className="blog-description">Thoughts, updates, and random musings ♡</p>
        </div>
        <div className="blog-loading">
          Loading blog posts...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-section">
        <div className="blog-header">
          <h3 className="blog-title">My Blog ✨</h3>
          <p className="blog-description">Thoughts, updates, and random musings ♡</p>
        </div>
        <div className="blog-error">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="blog-section">

      <div className="blog-posts">
        {posts.length === 0 ? (
          <div className="no-posts">
            No blog posts yet! Check back soon for updates ♡
          </div>
        ) : (
          posts.map((post) => {
            const isExpanded = expandedPost === post.id;
            const shouldTruncate = post.content.length > 150;
            
            return (
              <article key={post.id} className="blog-post">
                <div className="blog-post-header">
                  <div className="blog-post-author">
                    ♡ {sanitizeText(getAuthorName(post.email))}
                  </div>
                  <div className="blog-post-date">
                    {formatBlogDate(post.timestamp)}
                  </div>
                </div>

                {post.image && (
                  <div className="blog-post-image">
                    <img 
                      src={post.image} 
                      alt="Blog post" 
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}

                <div className="blog-post-content">
                  <div className="blog-content-text">
                    {sanitizeText(
                      isExpanded || !shouldTruncate
                        ? post.content
                        : truncateContent(post.content)
                    )}
                  </div>
                  
                  {shouldTruncate && (
                    <button
                      className="blog-expand-btn"
                      onClick={() => toggleExpanded(post.id)}
                    >
                      {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                  )}
                </div>

                {post.tags.length > 0 && (
                  <div className="blog-post-tags">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="blog-tag">
                        {sanitizeText(tag)}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};