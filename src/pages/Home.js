import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaRunning, FaHandsHelping, FaImages, FaArrowRight, FaTrophy, FaUsers, FaHeart, FaQuoteLeft, FaNewspaper } from 'react-icons/fa';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';
import { eventsAPI, galleryAPI, newsAPI, sliderImagesAPI, pagesAPI, publicAPI, socialWorkAPI, membersAPI, testimonialsAPI, socialFeedAPI, pressMentionsAPI } from '../utils/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import CtaSection from '../components/CtaSection';
import useSettings from '../utils/useSettings';
import usePageSeo from '../utils/usePageSeo';
import './Home.css';

const Home = () => {
  const { t } = useTranslation();
  const settings = useSettings();
  usePageSeo({ pageName: 'home' });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentGalleries, setRecentGalleries] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const [highlightEvents, setHighlightEvents] = useState([]);
  const [next30Events, setNext30Events] = useState([]);
  const [spotlightMembers, setSpotlightMembers] = useState([]);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [committeeYear, setCommitteeYear] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [pressMentions, setPressMentions] = useState([]);
  const [impactSummary, setImpactSummary] = useState(null);
  const [homePageContent, setHomePageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: 0,
    members: 0,
    socialWork: 0,
    tournaments: 0,
    peopleHelped: 0
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

  const formatRole = (role) => {
    if (!role) return '';
    return role
      .split('_')
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(' ');
  };

  useEffect(() => {
    fetchHomeData();
    const interval = setInterval(fetchHomeData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchHomeData = async () => {
    try {
      const now = new Date();
      const next30 = new Date();
      next30.setDate(next30.getDate() + 30);

      const [
        eventsRes,
        highlightRes,
        next30Res,
        galleriesRes,
        newsRes,
        sliderRes,
        homePageRes,
        statsRes,
        impactRes,
        spotlightRes,
        committeeRes,
        testimonialsRes,
        socialFeedRes,
        pressMentionsRes
      ] = await Promise.all([
        eventsAPI.getUpcoming(),
        eventsAPI.getAll({ isHighlight: true }).catch(() => ({ data: [] })),
        eventsAPI.getAll({
          status: 'upcoming',
          from: now.toISOString(),
          to: next30.toISOString(),
          sort: 'date:asc',
          limit: 6
        }).catch(() => ({ data: [] })),
        galleryAPI.getAll({ limit: 6 }),
        newsAPI.getAll({ limit: 3 }),
        sliderImagesAPI.getLatest({ limit: 3 }).catch(() => ({ data: [] })),
        pagesAPI.getByName('home').catch(() => ({ data: null })),
        publicAPI.getStats().catch(() => ({ data: null })),
        socialWorkAPI.getImpactSummary().catch(() => ({ data: null })),
        membersAPI.getAll({ isSpotlight: true, isActive: true }).catch(() => ({ data: [] })),
        membersAPI.getLatestCommittee().catch(() => ({ data: { year: null, members: [] } })),
        testimonialsAPI.getAll({ limit: 6 }).catch(() => ({ data: [] })),
        socialFeedAPI.getAll({ limit: 6 }).catch(() => ({ data: [] })),
        pressMentionsAPI.getAll({ limit: 6 }).catch(() => ({ data: [] }))
      ]);

      setUpcomingEvents(eventsRes.data.slice(0, 3));
        setHighlightEvents(
          highlightRes.data && highlightRes.data.length > 0
            ? highlightRes.data.slice(0, 3)
            : eventsRes.data.slice(0, 3)
        );
        setNext30Events(next30Res.data || []);
        setRecentGalleries(galleriesRes.data.slice(0, 6));
        setLatestNews(newsRes.data.slice(0, 3));
        setSliderImages(sliderRes.data || []);
        setHomePageContent(homePageRes?.data || null);
        setImpactSummary(impactRes?.data || null);
        setSpotlightMembers(spotlightRes.data?.slice(0, 4) || []);
        setCommitteeMembers(committeeRes.data?.members?.slice(0, 6) || []);
        setCommitteeYear(committeeRes.data?.year || null);
        setTestimonials(testimonialsRes.data || []);
      setSocialPosts(socialFeedRes.data || []);
      setPressMentions(pressMentionsRes.data || []);

      if (statsRes?.data) {
        setStats({
          events: Number(statsRes.data.events) || 0,
          members: Number(statsRes.data.members) || 0,
          socialWork: Number(statsRes.data.socialWork) || 0,
          tournaments: Number(statsRes.data.tournaments) || 0,
          peopleHelped: Number(statsRes.data.peopleHelped) || 0
        });
      }

      const updateItems = [
        ...eventsRes.data.slice(0, 3).map((event) => ({
          id: event._id,
          type: 'event',
          title: event.title,
          date: event.date,
          link: `/events/${event._id}`
        })),
        ...newsRes.data.slice(0, 3).map((news) => ({
          id: news._id,
          type: 'news',
          title: news.title,
          date: news.publishDate || news.createdAt,
          link: `/news/${news._id}`
        }))
      ];

      updateItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      setLatestUpdates(updateItems.slice(0, 6));
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

  const findSectionByKey = (sections, keys) => {
    if (!Array.isArray(sections)) {
      return null;
    }
    return sections.find((section) => {
      const normalized = normalizeSectionName(
        `${section.sectionName || ''} ${section.title || ''}`
      );
      return keys.some((key) => normalized.includes(key));
    });
  };

  const impactSection = findSectionByKey(homePageContent?.sections, ['impact']);
  const highlightsSection = findSectionByKey(homePageContent?.sections, ['highlights', 'highlight']);
  const next30Section = findSectionByKey(homePageContent?.sections, ['next_30_days', 'next30', 'next_30']);
  const trustSection = findSectionByKey(homePageContent?.sections, ['trust', 'why_trust', 'credibility']);
  const committeeSection = findSectionByKey(homePageContent?.sections, ['committee', 'leadership', 'leadership_committee']);
  const spotlightSection = findSectionByKey(homePageContent?.sections, ['spotlight', 'member_spotlight']);
  const updatesSection = findSectionByKey(homePageContent?.sections, ['updates', 'latest_updates']);
  const testimonialsSection = findSectionByKey(homePageContent?.sections, ['testimonial', 'testimonials']);
  const heroSupportSection = findSectionByKey(homePageContent?.sections, ['hero_support', 'hero_line']);
  const socialFeedSection = findSectionByKey(homePageContent?.sections, ['social_feed', 'social']);
  const pressSection = findSectionByKey(homePageContent?.sections, ['press', 'media']);

  const next30ButtonLabel = next30Section?.images?.[0] || 'View Calendar';
  const next30ButtonLink = next30Section?.images?.[1] || '/events';
  const committeeButtonLabel = committeeSection?.images?.[0] || 'View Committee';
  const committeeButtonLink = committeeSection?.images?.[1] || '/members';

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

  const formatDate = (value) => {
    if (!value) return '';
    return new Date(value).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const categoryLabels = {
    food_distribution: 'Food Distribution',
    education: 'Education Support',
    health: 'Health Camps',
    disaster_relief: 'Disaster Relief',
    community_service: 'Community Service',
    other: 'Other Initiatives'
  };

  const impactCategories = (impactSummary?.categoryCounts || []).slice(0, 4);

  const testimonialSettings = {
    dots: true,
    arrows: false,
    infinite: testimonials.length > 3,
    autoplay: testimonials.length > 3,
    autoplaySpeed: 5000,
    speed: 600,
    slidesToShow: Math.min(3, testimonials.length || 1),
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: Math.min(2, testimonials.length || 1) }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  const CountUp = ({ value, suffix = '' }) => {
    const [display, setDisplay] = useState(0);

    useEffect(() => {
      let frame;
      let start;
      const duration = 1200;
      const target = Number(value) || 0;

      const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        setDisplay(Math.floor(progress * target));
        if (progress < 1) {
          frame = requestAnimationFrame(step);
        }
      };

      frame = requestAnimationFrame(step);

      return () => {
        if (frame) cancelAnimationFrame(frame);
      };
    }, [value]);

    return (
      <span>
        {display.toLocaleString()}
        {suffix}
      </span>
    );
  };

  const mapDetails = [
    {
      label: t('contact.contactInfo.location'),
      value: 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India',
      wide: true
    },
    {
      label: t('contact.contactInfo.phone'),
      value: '+91 6295221588'
    },
    {
      label: t('contact.contactInfo.email'),
      value: 'bondhugosthi2010@gmail.com'
    }
  ];

  const mapLink = 'https://www.google.com/maps?q=721454';

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
              {heroSupportSection?.content && (
                <p className="hero-support">{heroSupportSection.content}</p>
              )}
              <div className="hero-mini-stats">
                <div className="hero-mini-stat">
                  <span className="hero-mini-value">
                    <CountUp value={stats.events} />+
                  </span>
                  <span className="hero-mini-label">{t('common.eventsOrganized')}</span>
                </div>
                <div className="hero-mini-stat">
                  <span className="hero-mini-value">
                    <CountUp value={stats.members} />+
                  </span>
                  <span className="hero-mini-label">{t('common.activeMembers')}</span>
                </div>
                <div className="hero-mini-stat">
                  <span className="hero-mini-value">
                    <CountUp value={stats.peopleHelped} />+
                  </span>
                  <span className="hero-mini-label">People Helped</span>
                </div>
              </div>
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
          <div className="section-header">
            <div>
              <h2 className="section-title">{trustSection?.title || 'Why Trust Us'}</h2>
              <p className="section-subtitle">
                {trustSection?.content || 'Proven impact, trusted leadership, and a community that shows up every time.'}
              </p>
            </div>
          </div>
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
                <h3 className="stat-number">
                  <CountUp value={stats.events} />+
                </h3>
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
                <h3 className="stat-number">
                  <CountUp value={stats.members} />+
                </h3>
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
                <h3 className="stat-number">
                  <CountUp value={stats.socialWork} />+
                </h3>
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
                <h3 className="stat-number">
                  <CountUp value={stats.tournaments} />+
                </h3>
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

      {/* Impact Section */}
      <section className="section home-impact">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{impactSection?.title || 'Our Impact'}</h2>
              <p className="section-subtitle">
                {impactSection?.content || 'Real stories and measurable impact from our community programs.'}
              </p>
            </div>
            <Link to="/social-work" className="btn btn-outline">
              View Social Work <FaArrowRight />
            </Link>
          </div>

          <div className="impact-grid">
            <div className="impact-card">
              <span className="impact-label">People Helped</span>
              <h3 className="impact-value">
                <CountUp value={stats.peopleHelped} />+
              </h3>
              <p className="impact-meta">Across our outreach programs</p>
            </div>
            <div className="impact-card">
              <span className="impact-label">Initiatives</span>
              <h3 className="impact-value">
                <CountUp value={impactSummary?.totalActivities || stats.socialWork} />+
              </h3>
              <p className="impact-meta">Community projects delivered</p>
            </div>
            <div className="impact-card">
              <span className="impact-label">Active Members</span>
              <h3 className="impact-value">
                <CountUp value={stats.members} />+
              </h3>
              <p className="impact-meta">Volunteers and organizers</p>
            </div>
            <div className="impact-card">
              <span className="impact-label">Events Hosted</span>
              <h3 className="impact-value">
                <CountUp value={stats.events} />+
              </h3>
              <p className="impact-meta">Sports, culture, and service</p>
            </div>
          </div>

          {impactCategories.length > 0 && (
            <div className="impact-tags">
              {impactCategories.map((item) => (
                <span key={item._id} className="impact-tag">
                  {categoryLabels[item._id] || item._id} ({item.count})
                </span>
              ))}
            </div>
          )}
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

      {/* Highlights Section */}
      <section className="section home-highlights">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{highlightsSection?.title || 'Upcoming Highlights'}</h2>
              <p className="section-subtitle">
                {highlightsSection?.content || 'Featured events and celebrations coming up soon.'}
              </p>
            </div>
            <Link to="/events" className="btn btn-outline">
              {t('common.viewAllEvents')} <FaArrowRight />
            </Link>
          </div>

          {highlightEvents.length > 0 ? (
            <div className="events-grid">
              {highlightEvents.map((event, index) => (
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
              <p>No highlight events yet. Check back soon!</p>
            </div>
          )}
        </div>
        </section>

        {/* Next 30 Days */}
        <section className="section home-next-30">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">{next30Section?.title || 'Next 30 Days'}</h2>
                <p className="section-subtitle">
                  {next30Section?.content || 'Plan ahead with the events happening in the coming month.'}
                </p>
              </div>
              <Link to={next30ButtonLink} className="btn btn-outline">
                {next30ButtonLabel} <FaArrowRight />
              </Link>
            </div>

            {next30Events.length > 0 ? (
              <div className="next-30-grid">
                {next30Events.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No events scheduled in the next 30 days.</p>
              </div>
            )}
          </div>
        </section>

        {/* Latest Updates Strip */}
        <section className="section home-updates">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{updatesSection?.title || 'Latest Updates'}</h2>
              <p className="section-subtitle">
                {updatesSection?.content || 'Fresh news and upcoming events from Bondhu Gosthi.'}
              </p>
            </div>
            <Link to="/news" className="btn btn-outline">
              {t('common.viewAllNews')} <FaArrowRight />
            </Link>
          </div>

          {latestUpdates.length > 0 ? (
            <div className="updates-list">
              {latestUpdates.map((item) => (
                <Link key={`${item.type}-${item.id}`} to={item.link} className="update-item">
                  <span className={`update-badge update-${item.type}`}>
                    {item.type === 'news' ? <FaNewspaper /> : <FaCalendarAlt />}
                    {item.type === 'news' ? 'News' : 'Event'}
                  </span>
                  <span className="update-title">{item.title}</span>
                  <span className="update-date">{formatDate(item.date)}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No updates available right now.</p>
            </div>
          )}
        </div>
      </section>

      {/* Social Feed */}
      <section className="section home-social-feed">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{socialFeedSection?.title || 'Social Feed'}</h2>
              <p className="section-subtitle">
                {socialFeedSection?.content || 'Fresh moments from our latest social updates.'}
              </p>
            </div>
            <Link to="/gallery" className="btn btn-outline">
              View Gallery <FaArrowRight />
            </Link>
          </div>

          {socialPosts.length > 0 ? (
            <div className="social-feed-grid">
              {socialPosts.map((post) => (
                <a
                  key={post._id}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-feed-card"
                >
                  <div className="social-feed-image">
                    {post.image ? (
                      <img
                        src={resolveMediaUrl(post.image)}
                        alt={post.title || post.platform}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <div className="social-feed-placeholder">
                        {post.platform || 'social'}
                      </div>
                    )}
                  </div>
                  <div className="social-feed-content">
                    <span className={`social-feed-platform platform-${post.platform || 'other'}`}>
                      {(post.platform || 'social').toUpperCase()}
                    </span>
                    <h3>{post.title || 'Bondhu Gosthi Update'}</h3>
                    <p>{post.caption || 'Follow us for more community stories and updates.'}</p>
                    <span className="social-feed-date">
                      {post.postedAt ? formatDate(post.postedAt) : 'Just now'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No social posts yet. Add some from the admin panel.</p>
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

      {/* Member Spotlight */}
      <section className="section home-spotlight">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{spotlightSection?.title || 'Member Spotlight'}</h2>
              <p className="section-subtitle">
                {spotlightSection?.content || 'Meet the people powering Bondhu Gosthi.'}
              </p>
            </div>
            <Link to="/members" className="btn btn-outline">
              View All Members <FaArrowRight />
            </Link>
          </div>

          {spotlightMembers.length > 0 ? (
            <div className="spotlight-grid">
              {spotlightMembers.map((member, index) => (
                <motion.div
                  key={member._id}
                  className="spotlight-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="spotlight-avatar">
                    {member.photo ? (
                      <img
                        src={resolveMediaUrl(member.photo)}
                        alt={member.name}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span>{member.name?.charAt(0) || 'B'}</span>
                    )}
                  </div>
                  <div className="spotlight-info">
                    <h3>{member.name}</h3>
                    <p className="spotlight-role">
                      {(member.role || 'member').replace(/_/g, ' ')}
                    </p>
                    <p className="spotlight-bio">
                      {member.bio || 'Dedicated member of the Bondhu Gosthi community.'}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No spotlight members yet.</p>
            </div>
          )}
        </div>
        </section>

        {/* Leadership & Committee */}
        <section className="section home-committee">
          <div className="container">
            <div className="section-header">
              <div>
                <h2 className="section-title">{committeeSection?.title || 'Leadership & Committee'}</h2>
                <p className="section-subtitle">
                  {committeeSection?.content || (committeeYear ? `Meet the ${committeeYear} committee guiding our community.` : 'Meet the leaders guiding our community.')}
                </p>
              </div>
              <Link to={committeeButtonLink} className="btn btn-outline">
                {committeeButtonLabel} <FaArrowRight />
              </Link>
            </div>

            {committeeMembers.length > 0 ? (
              <div className="committee-grid">
                {committeeMembers.map((member, index) => (
                  <motion.div
                    key={member._id}
                    className="committee-card"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.08 }}
                    viewport={{ once: true }}
                  >
                    <div className="committee-avatar">
                      {member.photo ? (
                        <img
                          src={resolveMediaUrl(member.photo)}
                          alt={member.name}
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span>{member.name?.charAt(0) || 'B'}</span>
                      )}
                    </div>
                    <div className="committee-info">
                      <h3>{member.name}</h3>
                      <p className="committee-role">{formatRole(member.role || member.committee?.position || 'Member')}</p>
                      {member.committee?.position && (
                        <p className="committee-position">{member.committee.position}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>Committee details will be updated soon.</p>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials */}
        <section className="section home-testimonials">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">{testimonialsSection?.title || 'Testimonials'}</h2>
            <p className="section-subtitle">
              {testimonialsSection?.content || 'Real words from our members and community.'}
            </p>
          </div>

          {testimonials.length > 0 ? (
            <Slider {...testimonialSettings} className="testimonial-slider">
              {testimonials.map((testimonial) => (
                <div key={testimonial._id} className="testimonial-slide">
                  <div className="testimonial-card">
                    <FaQuoteLeft className="testimonial-quote-icon" />
                    <p className="testimonial-quote">"{testimonial.quote}"</p>
                    <div className="testimonial-author">
                      <div className="testimonial-avatar">
                        {testimonial.photo ? (
                          <img
                            src={resolveMediaUrl(testimonial.photo)}
                            alt={testimonial.name}
                            loading="lazy"
                            decoding="async"
                          />
                        ) : (
                          <span>{testimonial.name?.charAt(0) || 'B'}</span>
                        )}
                      </div>
                      <div>
                        <h4>{testimonial.name}</h4>
                        <span>{testimonial.role || 'Member'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <div className="no-data">
              <p>No testimonials yet. Add some from the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* Press Mentions */}
      <section className="section home-press">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">{pressSection?.title || 'Press & Media'}</h2>
              <p className="section-subtitle">
                {pressSection?.content || 'Coverage and highlights from local media.'}
              </p>
            </div>
          </div>

          {pressMentions.length > 0 ? (
            <div className="press-grid">
              {pressMentions.map((mention) => (
                <a
                  key={mention._id}
                  href={mention.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="press-card"
                >
                  <div className="press-logo">
                    {mention.logo ? (
                      <img
                        src={resolveMediaUrl(mention.logo)}
                        alt={mention.outlet}
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <span>{mention.outlet.charAt(0)}</span>
                    )}
                  </div>
                  <div className="press-content">
                    <span className="press-outlet">{mention.outlet}</span>
                    <h3>{mention.title}</h3>
                    <span className="press-date">
                      {mention.date ? formatDate(mention.date) : 'Recently'}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="no-data">
              <p>No press mentions yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <CtaSection
        title={settings?.cta?.title || 'Join the Bondhu Gosthi Community'}
        description={settings?.cta?.description || 'Connect with us to attend events, volunteer, or partner in our community programs.'}
        primaryLabel={settings?.cta?.primaryLabel || 'Get in Touch'}
        primaryLink={settings?.cta?.primaryLink || '/contact'}
        secondaryLabel={settings?.cta?.secondaryLabel || 'View Events'}
        secondaryLink={settings?.cta?.secondaryLink || '/events'}
      />

      {/* Map Image Section */}
      <section className="section home-map-section">
        <div className="container">
          <div className="home-map-grid">
            <motion.div
              className="home-map-content"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span className="home-map-kicker">{t('common.findUs')}</span>
              <h2 className="home-map-title">Visit Bondhu Gosthi Club</h2>
              <p className="home-map-subtitle">
                We're located in Purba Mednipur, West Bengal. Drop by for tournaments,
                cultural programs, and community initiatives throughout the year.
              </p>

              <div className="home-map-details">
                {mapDetails.map((detail) => (
                  <div
                    key={detail.label}
                    className={`home-map-detail${detail.wide ? ' home-map-detail-wide' : ''}`}
                  >
                    <span className="home-map-detail-label">{detail.label}</span>
                    <span className="home-map-detail-value">{detail.value}</span>
                  </div>
                ))}
              </div>

              <div className="home-map-actions">
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                >
                  Get Directions
                </a>
                <Link to="/contact" className="btn btn-outline">
                  {t('common.getInTouch')}
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="home-map-visual"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="home-map-card">
                <span className="home-map-badge">Google Map</span>
                <img
                  src="/images/Gmap.png"
                  alt="Bondhu Gosthi location map"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
