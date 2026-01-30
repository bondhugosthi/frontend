import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaRunning, FaHandsHelping, FaImages, FaArrowRight, FaTrophy, FaUsers, FaHeart } from 'react-icons/fa';
import Slider from 'react-slick';
import { eventsAPI, galleryAPI, newsAPI, sliderImagesAPI, pagesAPI, publicAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './Home.css';

const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentGalleries, setRecentGalleries] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [homePageContent, setHomePageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: 0,
    members: 0,
    socialWork: 0,
    tournaments: 0
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [eventsRes, galleriesRes, newsRes, sliderRes, homePageRes, statsRes] = await Promise.all([
        eventsAPI.getUpcoming(),
        galleryAPI.getAll({ limit: 6 }),
        newsAPI.getAll({ limit: 3 }),
        sliderImagesAPI.getLatest({ limit: 3 }).catch(() => ({ data: [] })),
        pagesAPI.getByName('home').catch(() => ({ data: null })),
        publicAPI.getStats().catch(() => ({ data: null }))
      ]);

      setUpcomingEvents(eventsRes.data.slice(0, 3));
      setRecentGalleries(galleriesRes.data.slice(0, 6));
      setLatestNews(newsRes.data.slice(0, 3));
      setSliderImages(sliderRes.data || []);
      setHomePageContent(homePageRes?.data || null);

      if (statsRes?.data) {
        setStats({
          events: Number(statsRes.data.events) || 0,
          members: Number(statsRes.data.members) || 0,
          socialWork: Number(statsRes.data.socialWork) || 0,
          tournaments: Number(statsRes.data.tournaments) || 0
        });
      }
    } catch (error) {
      console.error('Error fetching home data:', error);
    } finally {
      setLoading(false);
    }
  };

  const heroContent = {
    titleTop: 'Welcome to',
    titleMain: 'Bondhu Gosthi',
    subtitle: 'A Family of Friends',
    description: 'Join us in creating memorable experiences through sports, culture, and community service',
    image: '/images/hero1.jpg',
    primaryCta: { text: 'Join Our Club', link: '/contact' },
    secondaryCta: { text: 'About Us', link: '/about' }
  };

  const heroSlides = sliderImages.length > 0
    ? sliderImages
    : [{ imageUrl: heroContent.image, title: heroContent.titleMain }];

  const normalizeSectionName = (value) => (value || '')
    .toLowerCase()
    .replace(/[\s-]+/g, '_')
    .trim();

  const findAboutSection = (sections) => {
    if (!Array.isArray(sections)) {
      return null;
    }

    const namedMatch = sections.find((section) => {
      const normalized = normalizeSectionName(
        `${section.sectionName || ''} ${section.title || ''}`
      );
      if (!normalized) {
        return false;
      }
      if (normalized === 'home_about' || normalized === 'about' || normalized === 'about_us') {
        return true;
      }
      return normalized.split('_').includes('about');
    });

    if (namedMatch) {
      return namedMatch;
    }

    return sections.find((section) => Array.isArray(section.images) && section.images.some(Boolean)) || null;
  };

  const aboutSection = findAboutSection(homePageContent?.sections);
  const aboutImage = aboutSection?.images?.find((img) => Boolean(img)) || null;

  const sliderSettings = {
    dots: false,
    arrows: false,
    infinite: heroSlides.length > 1,
    autoplay: heroSlides.length > 1,
    autoplaySpeed: 5000,
    speed: 1200,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false
  };

  const features = [
    {
      icon: <FaCalendarAlt />,
      title: 'Cultural Events',
      description: 'Experience vibrant cultural programs and festivals throughout the year',
      color: 'feature-blue'
    },
    {
      icon: <FaRunning />,
      title: 'Sports Tournaments',
      description: 'Compete in various sports tournaments and showcase your talent',
      color: 'feature-green'
    },
    {
      icon: <FaHandsHelping />,
      title: 'Social Work',
      description: 'Join our community service initiatives and make a positive impact',
      color: 'feature-orange'
    },
    {
      icon: <FaImages />,
      title: 'Memorable Moments',
      description: 'Capture and cherish beautiful memories with our photo galleries',
      color: 'feature-purple'
    }
  ];

  const getNewsBadge = (type) => {
    const badges = {
      news: 'badge-primary',
      notice: 'badge-warning',
      announcement: 'badge-success',
      festival: 'badge-purple'
    };
    return badges[type] || 'badge-secondary';
  };

  if (loading) {
    return <LoadingSpinner text="Loading home page..." />;
  }

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section hero-landing">
        <div className="hero-background">
          <Slider {...sliderSettings} className="hero-background-slider">
            {heroSlides.map((slide, index) => (
              <div key={slide._id || slide.imageUrl || index} className="hero-slide">
                <div
                  className="hero-slide-image"
                  style={{ backgroundImage: `url(${resolveMediaUrl(slide.imageUrl)})` }}
                  role="img"
                  aria-label={slide.title || 'Bondhu Gosthi'}
                />
              </div>
            ))}
          </Slider>
          <div className="hero-overlay"></div>
        </div>
        <div className="container">
          <div className="hero-content hero-landing-content">
            <motion.div
              className="hero-text hero-landing-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <span className="hero-kicker">{heroContent.titleTop}</span>
              <h1 className="hero-title">{heroContent.titleMain}</h1>
              <p className="hero-subtitle">{heroContent.subtitle}</p>
              <p className="hero-description">{heroContent.description}</p>
              <div className="hero-actions">
                <Link to={heroContent.primaryCta.link} className="hero-btn hero-btn-primary">
                  {heroContent.primaryCta.text}
                </Link>
                <Link to={heroContent.secondaryCta.link} className="hero-btn hero-btn-outline">
                  {heroContent.secondaryCta.text}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon stat-icon-blue">
                <FaCalendarAlt />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.events}+</h3>
                <p className="stat-label">Events Organized</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon stat-icon-green">
                <FaUsers />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.members}+</h3>
                <p className="stat-label">Active Members</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon stat-icon-orange">
                <FaHeart />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.socialWork}+</h3>
                <p className="stat-label">Social Initiatives</p>
              </div>
            </motion.div>

            <motion.div
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon stat-icon-purple">
                <FaTrophy />
              </div>
              <div className="stat-content">
                <h3 className="stat-number">{stats.tournaments}+</h3>
                <p className="stat-label">Tournaments</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="section home-about">
        <div className="container">
          <div className="home-about-grid">
            <div className="home-about-content">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="section-title">About Bondhu Gosthi</h2>
                <p className="section-subtitle">More Than Just a Club - We're a Family</p>
                <p className="home-about-text">
                  Bondhu Gosthi is a vibrant community where friendships flourish and memories are made. 
                  Since our establishment, we've been dedicated to bringing people together through sports, 
                  cultural events, and meaningful social work.
                </p>
                <p className="home-about-text">
                  Our mission is to create a positive impact in society while fostering brotherhood, 
                  sportsmanship, and cultural awareness among our members and the community at large.
                </p>
                <Link to="/about" className="btn btn-outline">
                  Learn More About Us <FaArrowRight />
                </Link>
              </motion.div>
            </div>
            <div className="home-about-image">
              {aboutImage ? (
                <motion.img
                  src={resolveMediaUrl(aboutImage)}
                  alt={aboutSection?.title || 'Bondhu Gosthi'}
                  loading="lazy"
                  decoding="async"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                />
              ) : (
                <div className="home-about-image-placeholder" aria-label="About image placeholder" />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">What We Offer</h2>
            <p className="section-subtitle">Discover the many ways to be part of our community</p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`feature-card ${feature.color}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section home-events">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don't miss out on our exciting events</p>
            </div>
            <Link to="/events" className="btn btn-outline">
              View All Events <FaArrowRight />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="events-grid">
              {upcomingEvents.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="section section-dark home-gallery">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Captured Moments</h2>
            <p className="section-subtitle">Relive the beautiful memories we've created together</p>
          </div>

          {recentGalleries.length > 0 ? (
            <div className="gallery-preview-grid">
              {recentGalleries.map((album, index) => (
                <motion.div
                  key={album._id}
                  className="gallery-preview-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Link to={`/gallery/${album._id}`}>
                    <div className="gallery-preview-image">
                      <img
                        src={resolveMediaUrl(album.coverImage)}
                        alt={album.albumName}
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="gallery-preview-overlay">
                        <h3>{album.albumName}</h3>
                        <p>{album.media?.length || 0} Photos</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No gallery albums available.</p>
            </div>
          )}

          <div className="text-center" style={{ marginTop: '2rem' }}>
            <Link to="/gallery" className="btn btn-primary">
              View Full Gallery <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <section className="section home-news">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">Latest News</h2>
                <p className="section-subtitle">Stay updated with our recent announcements</p>
              </div>
              <Link to="/news" className="btn btn-outline">
                View All News <FaArrowRight />
              </Link>
            </div>

            <div className="news-grid">
              {latestNews.map((news, index) => (
                <motion.div
                  key={news._id}
                  className="news-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -5 }}
                >
                  {news.image && (
                    <div className="news-card-image">
                      <img
                        src={resolveMediaUrl(news.image)}
                        alt={news.title}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="news-card-content">
                    <div className="news-card-meta">
                      <span className={`badge ${getNewsBadge(news.type)}`}>{news.type}</span>
                      <span className="news-date">
                        {new Date(news.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="news-card-title">{news.title}</h3>
                    <p className="news-card-excerpt">
                      {(news.content || '').substring(0, 100)}...
                    </p>
                    <Link to={`/news/${news._id}`} className="news-card-link">
                      Read More <FaArrowRight />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <motion.div
            className="cta-card"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Join Our Community</h2>
            <p className="cta-description">
              Be part of something bigger. Connect with like-minded individuals and make a difference.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Get in Touch <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
