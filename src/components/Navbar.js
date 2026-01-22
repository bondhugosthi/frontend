import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';
import { settingsAPI } from '../utils/api';
import './Navbar.css';

const Navbar = () => {
  const getInitialTheme = () => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'light' || storedTheme === 'dark') {
      return storedTheme;
    }

    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
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
    window.localStorage.setItem('theme', theme);
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
    { path: '/', label: 'Home' },
    { path: '/about', label: 'About' },
    { path: '/events', label: 'Events' },
    { path: '/sports', label: 'Sports' },
    { path: '/social-work', label: 'Social Work' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/members', label: 'Members' },
    { path: '/news', label: 'News' },
    { path: '/contact', label: 'Contact' }
  ];

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
                  src={branding.logo}
                  alt={branding.websiteName || 'Bondhu Gosthi'}
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
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                  aria-pressed={theme === 'dark'}
                  title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                </button>
              </li>
            </ul>
          </div>
          <div className="navbar-right">
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
