import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaEnvelope, FaPhone, FaMapMarkerAlt, FaHeart, FaLock } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './Footer.css';

const Footer = () => {
  const navigate = useNavigate();
  const [showLoginHint, setShowLoginHint] = useState(false);
  const [branding, setBranding] = useState({
    logo: '',
    websiteName: '',
    tagline: ''
  });

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/events', label: 'Events' },
    { path: '/sports', label: 'Sports' },
    { path: '/social-work', label: 'Social Work' }
  ];

  const importantLinks = [
    { path: '/gallery', label: 'Gallery' },
    { path: '/members', label: 'Members' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' }
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
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

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
                  <span className="logo-tagline">{branding.tagline || 'A Family of Friends'}</span>
                </div>
              </div>
              <p className="footer-description">
                Bondhu Gosthi is more than just a club - it's a family dedicated to bringing people together through sports, cultural events, and community service. Join us in making a difference!
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
              <h3 className="footer-title">Quick Links</h3>
              <ul className="footer-links">
                {quickLinks.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Important Links */}
            <div className="footer-section">
              <h3 className="footer-title">Important Links</h3>
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
              <h3 className="footer-title">Get In Touch</h3>
              <ul className="footer-contact">
                <li>
                  <FaEnvelope className="contact-icon" />
                  <a href="mailto:bondhugosthi2010@gmail.com">bondhugosthi2010@gmail.com</a>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <a href="tel:+916295221588">+91 6295221588</a>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <span>Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="footer-bottom-content">
            <p className="copyright">
              Copyright {new Date().getFullYear()} Bondhu Gosthi. Made with <FaHeart className="heart-icon" /> by Our Team
            </p>
            
            <button 
              className="admin-login-btn"
              onClick={handleLoginClick}
              onMouseEnter={() => setShowLoginHint(true)}
              onMouseLeave={() => setShowLoginHint(false)}
              title="Admin Login"
            >
              <FaLock />
              {showLoginHint && <span className="login-hint">Admin Login</span>}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
