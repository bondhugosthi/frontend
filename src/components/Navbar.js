import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { settingsAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './Navbar.css';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const getInitialTheme = () => {
    return 'light';
  };

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [theme, setTheme] = useState(getInitialTheme);
  const [branding, setBranding] = useState({
    logo: '',
    websiteName: '',
    tagline: ''
  });
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return;
    }

    document.documentElement.setAttribute('data-theme', theme);
    if (window.localStorage.getItem('theme')) {
      window.localStorage.removeItem('theme');
    }
  }, [theme]);

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

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrolled(currentScroll > 50);

      if (currentScroll > 120 && currentScroll > lastScrollY.current && !isOpen) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }

      lastScrollY.current = currentScroll;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
    setIsHidden(false);
  }, [location]);

  const handleThemeToggle = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/about', label: t('nav.about') },
    { path: '/events', label: t('nav.events') },
    { path: '/sports', label: t('nav.sports') },
    { path: '/social-work', label: t('nav.socialWork') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/members', label: t('nav.members') },
    { path: '/news', label: t('nav.news') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'zh', label: '中文(简体)' },
    { code: 'hi', label: 'हिन्दी' },
    { code: 'es', label: 'Español' },
    { code: 'ar', label: 'العربية' },
    { code: 'fr', label: 'Français' },
    { code: 'bn', label: 'বাংলা' },
    { code: 'pt', label: 'Português' },
    { code: 'ru', label: 'Русский' },
    { code: 'ur', label: 'اردو' }
  ];

  const handleLanguageChange = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''} ${isHidden ? 'navbar-hidden' : ''} ${isOpen ? 'navbar-open' : ''}`}
    >
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
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
            </div>
          </Link>

          <div className={`navbar-menu ${isOpen ? 'navbar-menu-open' : ''}`}>
            <ul className="navbar-nav">
              {navLinks.map((link) => (
                <li key={link.path} className="nav-item">
                  <Link
                    to={link.path}
                    className={`nav-link ${location.pathname === link.path ? 'nav-link-active' : ''}`}
                    aria-current={location.pathname === link.path ? 'page' : undefined}
                  >
                    <span className="nav-label">{link.label}</span>
                  </Link>
                </li>
              ))}
              <li className="nav-item nav-item-theme">
                <button
                  className="theme-toggle"
                  type="button"
                  onClick={handleThemeToggle}
                  aria-label={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
                  aria-pressed={theme === 'dark'}
                  title={theme === 'dark' ? t('nav.themeLight') : t('nav.themeDark')}
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
              </li>
            </ul>
          </div>
          <div className="navbar-right">
            <div className="nav-language">
              <select
                className="language-select"
                value={i18n.resolvedLanguage || i18n.language}
                onChange={handleLanguageChange}
                aria-label={t('nav.language')}
              >
                {languages.map((language) => (
                  <option key={language.code} value={language.code}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
            <button 
              className={`navbar-toggle ${isOpen ? 'navbar-toggle-open' : ''}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
