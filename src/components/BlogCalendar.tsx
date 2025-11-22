import React, { useState, useEffect } from 'react';
import { fetchBlogPosts, formatBlogDate, sanitizeText, getAuthorName, truncateContent, type BlogPost } from '../utils/blog';
import './BlogCalendar.css';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  posts: BlogPost[];
}

export const BlogCalendar: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showPostSelector, setShowPostSelector] = useState(false);
  const [selectedDatePosts, setSelectedDatePosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const blogPosts = await fetchBlogPosts();
        setPosts(blogPosts);
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: CalendarDay[] = [];
    const today = new Date();

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const isCurrentMonth = date.getMonth() === month;
      const isToday = date.toDateString() === today.toDateString();

      // Find posts for this date
      const dayPosts = posts.filter(post => {
        const postDate = new Date(post.timestamp);
        return postDate.toDateString() === date.toDateString();
      });

      days.push({
        date: date.getDate(),
        isCurrentMonth,
        isToday,
        posts: dayPosts
      });
    }

    return days;
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.posts.length === 0) return;

    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day.date);
    setSelectedDate(clickedDate);
    setSelectedDatePosts(day.posts);

    if (day.posts.length === 1) {
      setSelectedPost(day.posts[0]);
      setShowPostSelector(false);
    } else {
      setShowPostSelector(true);
      setSelectedPost(null);
    }
  };

  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(post);
    setShowPostSelector(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="blog-calendar">
        <div className="calendar-header">
          <h3 className="calendar-title">Blog Calendar ✨</h3>
        </div>
        <div className="calendar-loading">Loading calendar...</div>
      </div>
    );
  }

  const calendarDays = generateCalendarDays();

  return (
    <div className="blog-calendar">
      <div className="calendar-header">
        <h3 className="calendar-title">Blog Calendar ✨</h3>
        <p className="calendar-description">Click on highlighted dates to read posts ♡</p>
      </div>

      <div className="calendar-nav">
        <button className="nav-btn" onClick={() => navigateMonth('prev')}>
          ❮
        </button>
        <h4 className="current-month">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <button className="nav-btn" onClick={() => navigateMonth('next')}>
          ❯
        </button>
      </div>

      <div className="calendar-grid">
        {dayNames.map(day => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${
              day.isToday ? 'today' : ''
            } ${day.posts.length > 0 ? 'has-posts' : ''}`}
            onClick={() => handleDateClick(day)}
          >
            <span className="day-number">{day.date}</span>
            {day.posts.length > 0 && (
              <div className="post-indicators">
                {day.posts.slice(0, 3).map((_, i) => (
                  <div key={i} className="post-dot" />
                ))}
                {day.posts.length > 3 && <span className="post-count">+{day.posts.length - 3}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Post Selector Modal */}
      {showPostSelector && (
        <div className="post-selector-overlay" onClick={() => setShowPostSelector(false)}>
          <div className="post-selector" onClick={e => e.stopPropagation()}>
            <h4 className="selector-title">
              Choose a post from {selectedDate?.toDateString()} ♡
            </h4>
            <div className="sticky-notes">
              {selectedDatePosts.map((post, index) => (
                <div
                  key={post.id}
                  className={`sticky-note sticky-${(index % 4) + 1}`}
                  onClick={() => handlePostSelect(post)}
                >
                  <div className="sticky-content">
                    <div className="sticky-author">♡ {getAuthorName(post.email)}</div>
                    <div className="sticky-text">
                      {truncateContent(post.content, 80)}
                    </div>
                    <div className="sticky-tags">
                      {post.tags.slice(0, 2).map((tag, i) => (
                        <span key={i} className="sticky-tag">#{tag}</span>
                      ))}
                      {post.tags.length > 2 && <span className="sticky-tag">+{post.tags.length - 2}</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="close-selector" onClick={() => setShowPostSelector(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Selected Post Display */}
      {selectedPost && !showPostSelector && (
        <div className="selected-post">
          <div className="post-header">
            <h4 className="post-title">
              Post from {selectedDate?.toDateString()} ♡
            </h4>
            <button className="close-post" onClick={() => setSelectedPost(null)}>
              ✕
            </button>
          </div>
          
          <div className="post-content">
            <div className="post-meta">
              <span className="post-author">♡ {getAuthorName(selectedPost.email)}</span>
              <span className="post-time">{formatBlogDate(selectedPost.timestamp)}</span>
            </div>

            {selectedPost.image && (
              <div className="post-image">
                <img src={selectedPost.image} alt="Blog post" />
              </div>
            )}

            <div className="post-text">
              {sanitizeText(selectedPost.content)}
            </div>

            {selectedPost.tags.length > 0 && (
              <div className="post-tags">
                {selectedPost.tags.map((tag, i) => (
                  <span key={i} className="post-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};