import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaEye, FaArrowRight, FaStar, FaNewspaper } from 'react-icons/fa';
import { newsAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import usePageSeo from '../utils/usePageSeo';
import './News.css';

const News = () => {
  usePageSeo({ pageName: 'news' });
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedType !== 'all') params.type = selectedType;

      const response = await newsAPI.getAll(params);
      setNews(response.data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedType]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const types = [
    { id: 'all', label: 'All Posts' },
    { id: 'news', label: 'News' },
    { id: 'notice', label: 'Notices' },
    { id: 'announcement', label: 'Announcements' },
    { id: 'festival', label: 'Festivals' }
  ];

  const getTypeBadgeColor = (type) => {
    const colors = {
      news: 'badge-primary',
      notice: 'badge-warning',
      announcement: 'badge-success',
      festival: 'badge-purple'
    };
    return colors[type] || 'badge-secondary';
  };

  if (loading) {
    return <LoadingSpinner text="Loading news..." />;
  }

  return (
    <div className="news-page">
      <PageHeader
        title="News & Updates"
        subtitle="Stay informed with the latest announcements and happenings"
        breadcrumbs={['Home', 'News']}
      />

      <section className="section">
        <div className="container">
          {/* Type Filter */}
          <div className="news-filters">
            {types.map((type) => (
              <button
                key={type.id}
                className={`news-filter-btn ${selectedType === type.id ? 'active' : ''}`}
                onClick={() => setSelectedType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </div>

          {/* News Grid */}
          {news.length > 0 ? (
            <div className="news-grid">
              {news.map((item, index) => (
                <motion.article
                  key={item._id}
                  className="news-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  {item.image && (
                    <Link to={`/news/${item._id}`} className="news-image-link">
                      <div className="news-image">
                        <img
                          src={resolveMediaUrl(item.image)}
                          alt={item.title}
                          loading="lazy"
                          decoding="async"
                        />
                        {item.isImportant && (
                          <span className="important-badge">
                            <FaStar /> Important
                          </span>
                        )}
                      </div>
                    </Link>
                  )}

                  <div className="news-content">
                    <div className="news-meta">
                      <span className={`badge ${getTypeBadgeColor(item.type)}`}>
                        {item.type}
                      </span>
                      <div className="news-info">
                        <span className="news-date">
                          <FaCalendarAlt />
                          {new Date(item.publishDate).toLocaleDateString()}
                        </span>
                        <span className="news-views">
                          <FaEye />
                          {item.views || 0}
                        </span>
                      </div>
                    </div>

                    <Link to={`/news/${item._id}`}>
                      <h2 className="news-title">{item.title}</h2>
                    </Link>

                    <p className="news-excerpt">
                      {(item.content || '').substring(0, 200)}...
                    </p>

                    {item.tags && item.tags.length > 0 && (
                      <div className="news-tags">
                        {item.tags.slice(0, 3).map((tag, idx) => (
                          <span key={idx} className="news-tag">#{tag}</span>
                        ))}
                      </div>
                    )}

                    <Link to={`/news/${item._id}`} className="read-more-link">
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="no-news">
              <div className="no-news-icon">
                <FaNewspaper />
              </div>
              <h3>No News Found</h3>
              <p>Try selecting a different category to see more posts.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
