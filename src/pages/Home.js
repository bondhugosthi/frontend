import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaRunning, FaHandsHelping, FaImages, FaArrowRight, FaTrophy, FaUsers, FaHeart } from 'react-icons/fa';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { eventsAPI, galleryAPI, newsAPI, sliderImagesAPI, pagesAPI, publicAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
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
  const galleryPlaceholder = '/images/gallery-placeholder.svg';

  const getGalleryCoverSrc = (album) => {
    const candidate =
      album?.coverImage ||
      album?.media?.[0]?.thumbnail ||
      album?.media?.[0]?.url ||
      galleryPlaceholder;
    return resolveMediaUrl(candidate) || galleryPlaceholder;
  };

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
    titleTop: t('home.hero.titleTop'),
    titleMain: t('home.hero.titleMain'),
    subtitle: t('home.hero.subtitle'),
    description: t('home.hero.description'),
    image: '/images/hero1.jpg',
    primaryCta: { text: t('home.hero.primaryCta'), link: '/contact' },
    secondaryCta: { text: t('home.hero.secondaryCta'), link: '/about' }
  };

  const heroSlides = sliderImages.length > 0
    ? sliderImages
    : [{ imageUrl: heroContent.image, title: heroContent.titleMain }];

  const totalGalleryPhotos = recentGalleries.reduce(
    (total, album) => total + (album.media?.length || 0),
    0
  );

  const latestGalleryDate = recentGalleries[0]?.date || recentGalleries[0]?.createdAt;
  const latestGalleryLabel = latestGalleryDate
    ? new Date(latestGalleryDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : '—';

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
      title: t('home.features.items.cultural.title'),
      description: t('home.features.items.cultural.description'),
      color: 'feature-blue'
    },
    {
      icon: <FaRunning />,
      title: t('home.features.items.sports.title'),
      description: t('home.features.items.sports.description'),
      color: 'feature-green'
    },
    {
      icon: <FaHandsHelping />,
      title: t('home.features.items.social.title'),
      description: t('home.features.items.social.description'),
      color: 'feature-orange'
    },
    {
      icon: <FaImages />,
      title: t('home.features.items.moments.title'),
      description: t('home.features.items.moments.description'),
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
    return <LoadingSpinner text={t('common.loadingHome')} />;
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
                <p className="stat-label">{t('common.eventsOrganized')}</p>
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
                <p className="stat-label">{t('common.activeMembers')}</p>
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
                <p className="stat-label">{t('common.socialInitiatives')}</p>
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
                <p className="stat-label">{t('common.tournaments')}</p>
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
                <h2 className="section-title">{t('home.about.title')}</h2>
                <p className="section-subtitle">{t('home.about.subtitle')}</p>
                <p className="home-about-text">{t('home.about.text1')}</p>
                <p className="home-about-text">{t('home.about.text2')}</p>
                <Link to="/about" className="btn btn-outline">
                  {t('home.about.cta')} <FaArrowRight />
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
            <h2 className="section-title">{t('home.features.title')}</h2>
            <p className="section-subtitle">{t('home.features.subtitle')}</p>
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
              <h2 className="section-title">{t('home.events.title')}</h2>
              <p className="section-subtitle">{t('home.events.subtitle')}</p>
            </div>
            <Link to="/events" className="btn btn-outline">
              {t('common.viewAllEvents')} <FaArrowRight />
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
              <p>{t('common.noUpcomingEvents')}</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Preview Section */}
      <section className="section section-dark home-gallery">
        <div className="container">
          <div className="gallery-showcase">
            <div className="gallery-copy">
              <span className="gallery-kicker">{t('home.gallery.kicker')}</span>
              <h2 className="gallery-title">{t('home.gallery.title')}</h2>
              <p className="gallery-subtitle">{t('home.gallery.subtitle')}</p>

              <div className="gallery-metrics">
                <div className="gallery-metric">
                  <span className="gallery-metric-label">{t('common.albums')}</span>
                  <span className="gallery-metric-value">{recentGalleries.length}</span>
                </div>
                <div className="gallery-metric">
                  <span className="gallery-metric-label">{t('common.photos')}</span>
                  <span className="gallery-metric-value">{totalGalleryPhotos}</span>
                </div>
                <div className="gallery-metric">
                  <span className="gallery-metric-label">{t('common.latest')}</span>
                  <span className="gallery-metric-value">{latestGalleryLabel}</span>
                </div>
              </div>

              <div className="gallery-actions">
                <Link to="/gallery" className="btn btn-primary gallery-btn">
                  {t('common.viewFullGallery')} <FaArrowRight />
                </Link>
                {recentGalleries[0]?._id && (
                  <Link to={`/gallery/${recentGalleries[0]._id}`} className="btn btn-outline gallery-btn-outline">
                    {t('common.exploreLatestAlbum')}
                  </Link>
                )}
              </div>
            </div>

            <div className="gallery-collage">
              {recentGalleries.length > 0 ? (
                <div className={`gallery-mosaic ${recentGalleries.length < 3 ? 'gallery-mosaic-compact' : ''}`}>
                  {recentGalleries.slice(0, 3).map((album, index) => (
                    <motion.div
                      key={album._id}
                      className={`gallery-mosaic-item mosaic-${index + 1}`}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Link to={`/gallery/${album._id}`} className="gallery-mosaic-link">
                        <div className="gallery-mosaic-image">
                          <img
                            src={getGalleryCoverSrc(album)}
                            alt={album.albumName}
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="gallery-mosaic-overlay">
                          <span className="gallery-mosaic-pill">{(album.category || 'album').replace('_', ' ')}</span>
                          <div className="gallery-mosaic-info">
                    <h3>{album.albumName}</h3>
                    <p>{album.media?.length || 0} {t('common.photos')}</p>
                  </div>
                </div>
              </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="gallery-empty">
                  <div className="gallery-empty-card">
                    <FaImages />
                    <h3>{t('common.noAlbums')}</h3>
                    <p>{t('common.uploadFirstGallery')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      {latestNews.length > 0 && (
        <section className="section home-news">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">{t('home.news.title')}</h2>
                <p className="section-subtitle">{t('home.news.subtitle')}</p>
              </div>
              <Link to="/news" className="btn btn-outline">
                {t('common.viewAllNews')} <FaArrowRight />
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
                      {t('common.readMore')} <FaArrowRight />
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
            <h2 className="cta-title">{t('home.cta.title')}</h2>
            <p className="cta-description">
              {t('home.cta.description')}
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              {t('home.cta.button')} <FaArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
