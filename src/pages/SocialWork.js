import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaHandsHelping, FaGraduationCap, FaHospital, FaHome, FaMapMarkerAlt } from 'react-icons/fa';
import { socialWorkAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import CtaSection from '../components/CtaSection';
import useSettings from '../utils/useSettings';
import usePageSeo from '../utils/usePageSeo';
import './SocialWork.css';

const SocialWork = () => {
  const settings = useSettings();
  usePageSeo({ pageName: 'social-work' });
  const [socialWork, setSocialWork] = useState([]);
  const [impactSummary, setImpactSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const fetchSocialWorkData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedYear !== 'all') params.year = selectedYear;
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const [workRes, summaryRes] = await Promise.all([
        socialWorkAPI.getAll(params),
        socialWorkAPI.getImpactSummary()
      ]);

      setSocialWork(workRes.data);
      setImpactSummary(summaryRes.data);
    } catch (error) {
      console.error('Error fetching social work:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, selectedYear]);

  useEffect(() => {
    fetchSocialWorkData();
  }, [fetchSocialWorkData]);

  const categories = [
    { id: 'all', label: 'All Categories', icon: <FaHeart /> },
    { id: 'food_distribution', label: 'Food Distribution', icon: <FaHandsHelping /> },
    { id: 'education', label: 'Education', icon: <FaGraduationCap /> },
    { id: 'health', label: 'Health', icon: <FaHospital /> },
    { id: 'disaster_relief', label: 'Disaster Relief', icon: <FaHome /> },
    { id: 'community_service', label: 'Community Service', icon: <FaHandsHelping /> },
    { id: 'other', label: 'Other', icon: <FaHeart /> }
  ];

  const currentYear = new Date().getFullYear();
  const years = ['all', currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : <FaHeart />;
  };

  if (loading) {
    return <LoadingSpinner text="Loading social work initiatives..." />;
  }

  return (
    <div className="social-work-page">
      <PageHeader
        title="Social Work"
        subtitle="Making a difference together - Our community service initiatives"
        breadcrumbs={['Home', 'Social Work']}
      />

      {/* Impact Summary */}
      {impactSummary && (
        <section className="section impact-section">
          <div className="container">
            <div className="impact-grid">
              <motion.div
                className="impact-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="impact-icon impact-icon-blue">
                  <FaHandsHelping />
                </div>
                <div className="impact-content">
                  <h3 className="impact-number">{impactSummary.totalActivities}</h3>
                  <p className="impact-label">Total Initiatives</p>
                </div>
              </motion.div>

              <motion.div
                className="impact-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="impact-icon impact-icon-green">
                  <FaHeart />
                </div>
                <div className="impact-content">
                  <h3 className="impact-number">{impactSummary.totalPeopleHelped}+</h3>
                  <p className="impact-label">People Helped</p>
                </div>
              </motion.div>

              <motion.div
                className="impact-card full-width-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h4 className="category-title">Initiatives by Category</h4>
                <div className="category-stats">
                  {(impactSummary.categoryCounts || []).map((cat, index) => (
                    <div key={index} className="category-stat">
                      <span className="stat-label">{(cat._id || 'other').replace('_', ' ')}</span>
                      <span className="stat-value">{cat.count}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Filters */}
      <section className="section">
        <div className="container">
          <div className="filters-container">
            {/* Category Filter */}
            <div className="filter-group">
              <label className="filter-label">Category:</label>
              <div className="filter-buttons">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    className={`filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat.id)}
                  >
                    {cat.icon}
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Year Filter */}
            <div className="filter-group">
              <label className="filter-label">Year:</label>
              <div className="filter-buttons">
                {years.map((year) => (
                  <button
                    key={year}
                    className={`filter-btn ${selectedYear === year ? 'active' : ''}`}
                    onClick={() => setSelectedYear(year)}
                  >
                    {year === 'all' ? 'All Years' : year}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Work Grid */}
          {socialWork.length > 0 ? (
            <div className="social-work-grid">
              {socialWork.map((work, index) => (
                <motion.div
                  key={work._id}
                  className="work-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  {work.coverImage && (
                    <div className="work-card-image">
                      <img
                        src={resolveMediaUrl(work.coverImage)}
                        alt={work.title}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="work-card-overlay">
                        <span className="category-badge">
                          {getCategoryIcon(work.category)}
                          {(work.category || 'other').replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="work-card-content">
                    <div className="work-date">
                      {new Date(work.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <h3 className="work-title">{work.title}</h3>
                    <p className="work-description">
                      {(work.description || '').substring(0, 150)}...
                    </p>

                    {work.impact && work.impact.peopleHelped && (
                      <div className="work-impact">
                        <FaHeart className="impact-heart" />
                        <span>{work.impact.peopleHelped} people helped</span>
                      </div>
                    )}

                    {work.location && (
                      <div className="work-location">
                        <FaMapMarkerAlt /> {work.location}
                      </div>
                    )}

                    {work.volunteers && work.volunteers.length > 0 && (
                      <div className="work-volunteers">
                        <strong>Volunteers:</strong> {work.volunteers.length}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-work">
              <div className="no-work-icon">
                <FaHandsHelping />
              </div>
              <h3>No Initiatives Found</h3>
              <p>Try selecting different filters to see more initiatives.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={settings?.cta?.title || 'Join Our Mission'}
        description={settings?.cta?.description || 'Want to be part of our social initiatives? Your contribution can make a real difference.'}
        primaryLabel={settings?.cta?.primaryLabel || 'Volunteer With Us'}
        primaryLink={settings?.cta?.primaryLink || '/contact'}
        secondaryLabel={settings?.cta?.secondaryLabel || 'View Events'}
        secondaryLink={settings?.cta?.secondaryLink || '/events'}
      />
    </div>
  );
};

export default SocialWork;
