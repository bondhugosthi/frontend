import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaLock } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { settingsAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './Footer.css';

const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showLoginHint, setShowLoginHint] = useState(false);
  const [branding, setBranding] = useState({
    logo: '',
    websiteName: '',
    tagline: ''
  });
  const [contactDetails, setContactDetails] = useState({
    email: 'bondhugosthi2010@gmail.com',
    phone: '+91 6295221588',
    address: 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454'
  });
  const [businessHours, setBusinessHours] = useState([]);
  const [brochure, setBrochure] = useState({
    url: '',
    label: ''
  });
  const [istTime, setIstTime] = useState(() => new Date());

  const quickLinks = [
    { path: '/about', label: t('nav.about') },
    { path: '/events', label: t('nav.events') },
    { path: '/sports', label: t('nav.sports') },
    { path: '/social-work', label: t('nav.socialWork') },
    {
      path: 'https://bondhugosthi-ganpati-puja-sports.blogspot.com/',
      label: 'Blog',
      external: true
    }
  ];

  const importantLinks = [
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/members', label: t('nav.members') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const handleLoginClick = () => {
    navigate('/login');
  };

  useEffect(() => {
    let isMounted = true;

    settingsAPI.get()
      .then((response) => {
        if (!isMounted) {
          return;
        }
        const settings = response.data || {};
        setBranding({
          logo: settings.logo || '',
          websiteName: settings.websiteName || '',
          tagline: settings.tagline || ''
        });
        setContactDetails({
          email: settings.contactDetails?.email || 'bondhugosthi2010@gmail.com',
          phone: settings.contactDetails?.phone || '+91 6295221588',
          address: settings.contactDetails?.address || 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454'
        });
        setBusinessHours(settings.businessHours || []);
        setBrochure({
          url: settings.brochureUrl || '',
          label: settings.brochureLabel || ''
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIstTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const istFormatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  });

  const formatIst = (value) => {
    const parts = istFormatter.formatToParts(value);
    const data = {};
    parts.forEach((part) => {
      if (part.type !== 'literal') {
        data[part.type] = part.value;
      }
    });
    return `${data.day}/${data.month}/${data.year}, ${data.weekday}, ${data.hour}:${data.minute}:${data.second} ${data.dayPeriod}`;
  };

  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            {/* About Section */}
            <div className="footer-section">
              <div className="footer-logo">
                <div className={`logo-circle ${branding.logo ? 'logo-circle-image' : ''}`}>
                  {branding.logo ? (
                    <img
                      className="logo-image"
                      src={resolveMediaUrl(branding.logo)}
                      alt={branding.websiteName || 'Bondhu Gosthi'}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    'BG'
                  )}
                </div>
                <div className="logo-text">
                  <span className="logo-main">{branding.websiteName || 'Bondhu Gosthi'}</span>
                  <span className="logo-tagline">{branding.tagline || t('footer.taglineFallback')}</span>
                </div>
              </div>
              <p className="footer-description">
                {t('footer.description')}
              </p>
              <div className="footer-social">
                <a href="https://www.facebook.com/people/Bondhu-Gosthi/61582556837398/?rdid=E4gdSHsB06Cqk1qW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ScUAv9WJ2%2F" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebook />
                </a>
                <a href="https://www.instagram.com/bondhu.gosthi/" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
                <a href="https://www.youtube.com/@BondhuGosthi" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaYoutube />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.quickLinks')}</h3>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    {link.external ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="footer-link"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link to={link.path} className="footer-link">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Links */}
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.importantLinks')}</h3>
              <ul className="footer-links">
                {importantLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="footer-section">
              <h3 className="footer-title">{t('footer.getInTouch')}</h3>
              <ul className="footer-contact">
                <li>
                  <FaEnvelope className="contact-icon" />
                  <a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <a href={`tel:${contactDetails.phone.replace(/\s+/g, '')}`}>{contactDetails.phone}</a>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>{contactDetails.address}</span>
                </li>
              </ul>

              {businessHours.length > 0 && (
                <div className="footer-hours">
                  <h4>Business Hours</h4>
                  <ul>
                    {businessHours.map((item) => (
                      <li key={item.day}>
                        <span>{item.day}</span>
                        <span>{item.isClosed ? 'Closed' : `${item.open || '--:--'} - ${item.close || '--:--'}`}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {brochure.url && (
                <a
                  href={brochure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-brochure-link"
                >
                  {brochure.label || 'Download Brochure'}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              {t('footer.copyright', { year: new Date().getFullYear() })}{' '}
              {t('footer.madeWith')} <FaHeart className="heart-icon" /> {t('footer.byTeam')}
            </p>

            <div className="footer-live-time" aria-live="polite">
              {formatIst(istTime)}
              <span className="footer-timezone">IST</span>
            </div>
            
            <button 
              className="admin-login-btn"
              onClick={handleLoginClick}
              onMouseEnter={() => setShowLoginHint(true)}
              onMouseLeave={() => setShowLoginHint(false)}
              title={t('footer.adminLogin')}
            >
              <FaLock />
              {showLoginHint && <span className="login-hint">{t('footer.adminLogin')}</span>}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
