import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaCalendarAlt, FaEye, FaTag, FaStar } from 'react-icons/fa';
import { newsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import usePageSeo from '../utils/usePageSeo';
import './NewsDetails.css';

const NewsDetails = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [relatedNews, setRelatedNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNewsDetails = useCallback(async () => {
    try {
      const [newsRes, allNewsRes] = await Promise.all([
        newsAPI.getById(id),
        newsAPI.getAll({ limit: 4 })
      ]);
      
      setNews(newsRes.data);
      setRelatedNews(allNewsRes.data.filter(item => item._id !== id).slice(0, 3));
    } catch (error) {
      console.error('Error fetching news details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNewsDetails();
  }, [fetchNewsDetails]);

  usePageSeo({
    pageName: 'news',
    title: news?.title || 'News Details',
    description: news?.description || news?.content?.substring(0, 160) || '',
    ogImage: news?.image ? resolveMediaUrl(news.image) : ''
  });

  if (loading) {
    return <LoadingSpinner text="Loading news..." />;
  }

  if (!news) {
    return (
      <div className="container" style={{ marginTop: '150px', textAlign: 'center' }}>
        <h2>News not found</h2>
        <Link to="/news" className="btn btn-primary">Back to News</Link>
      </div>
    );
  }

  const getTypeBadgeColor = (type) => {
    const colors = {
      news: 'badge-primary',
      notice: 'badge-warning',
      announcement: 'badge-success',
      festival: 'badge-purple'
    };
    return colors[type] || 'badge-secondary';
  };

  return (
    <div className="news-details-page">
      {/* News Header */}
      <div className="news-details-header">
        <div className="container">
          <Link to="/news" className="back-link">
            <FaArrowLeft /> Back to News
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="header-badges">
              <span className={`badge ${getTypeBadgeColor(news.type)}`}>
                {news.type}
              </span>
              {news.isImportant && (
                <span className="badge badge-important">
                  <FaStar /> Important
                </span>
              )}
            </div>
            <h1 className="news-details-title">{news.title}</h1>
            <div className="news-details-meta">
              <div className="meta-item">
                <FaCalendarAlt />
                <span>{new Date(news.publishDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="meta-item">
                <FaEye />
                <span>{news.views || 0} Views</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* News Content */}
      <section className="section">
        <div className="container">
          <div className="news-details-grid">
            <motion.article
              className="news-article"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {news.image && (
                <div className="article-image">
                  <img
                    src={resolveMediaUrl(news.image)}
                    alt={news.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}

              <div className="article-content">
                <div className="content-text" dangerouslySetInnerHTML={{ __html: (news.content || '').replace(/\n/g, '<br>') }} />
              </div>

              {news.tags && news.tags.length > 0 && (
                <div className="article-tags">
                  <FaTag />
                  <div className="tags-list">
                    {news.tags.map((tag, index) => (
                      <span key={index} className="tag-item">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.article>

            {/* Sidebar */}
            <motion.aside
              className="news-sidebar"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {relatedNews.length > 0 && (
                <div className="sidebar-section">
                  <h3 className="sidebar-title">Related News</h3>
                  <div className="related-news-list">
                    {relatedNews.map((item) => (
                      <Link 
                        key={item._id} 
                        to={`/news/${item._id}`} 
                        className="related-news-item"
                      >
                        {item.image && (
                          <div className="related-image">
                            <img
                              src={resolveMediaUrl(item.image)}
                              alt={item.title}
                              loading="lazy"
                              decoding="async"
                            />
                          </div>
                        )}
                        <div className="related-content">
                          <h4 className="related-title">{item.title}</h4>
                          <span className="related-date">
                            {new Date(item.publishDate).toLocaleDateString()}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="sidebar-section cta-section">
                <h3 className="sidebar-title">Stay Updated</h3>
                <p>Want to receive updates about our events and activities?</p>
                <Link to="/contact" className="btn btn-primary btn-block">
                  Subscribe to Updates
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NewsDetails;
