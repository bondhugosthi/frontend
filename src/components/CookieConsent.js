import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaCookieBite, FaBolt } from 'react-icons/fa';
import { warmCache } from '../utils/cacheWarmup';
import { registerServiceWorker } from '../utils/serviceWorker';
import './CookieConsent.css';

const COOKIE_NAME = 'bg_cookie_consent';
const ACCEPT_DAYS = 365;
const IGNORE_DAYS = 7;

const getCookieValue = () => {
  if (typeof document === 'undefined') {
    return '';
  }
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : '';
};

const setCookieValue = (value, days) => {
  if (typeof document === 'undefined') {
    return;
  }
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
};

const CookieConsent = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [warming, setWarming] = useState(false);

  useEffect(() => {
    const consent = getCookieValue();

    if (consent === 'accepted') {
      registerServiceWorker();
      return;
    }

    if (location.pathname.startsWith('/admin')) {
      setVisible(false);
      return;
    }

    if (!consent) {
      setVisible(true);
    }
  }, [location.pathname]);

  const handleAccept = async () => {
    setCookieValue('accepted', ACCEPT_DAYS);
    setVisible(false);
    setWarming(true);
    try {
      await registerServiceWorker();
      await warmCache();
    } finally {
      setWarming(false);
    }
  };

  const handleIgnore = () => {
    setCookieValue('ignored', IGNORE_DAYS);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="cookie-consent" role="dialog" aria-live="polite" aria-label="Cookie consent">
      <div className="cookie-consent__content">
        <div className="cookie-consent__icon" aria-hidden="true">
          <FaCookieBite />
        </div>
        <div className="cookie-consent__text">
          <p className="cookie-consent__eyebrow">
            <FaBolt /> Faster next visit
          </p>
          <h4>We use cookies to save images & pages</h4>
          <p>
            Accepting lets us cache important data on your device so the website loads much faster next time.
          </p>
        </div>
      </div>
      <div className="cookie-consent__actions">
        <button className="btn btn-primary cookie-consent__btn" onClick={handleAccept} disabled={warming}>
          {warming ? 'Preparing...' : 'Accept & Cache'}
        </button>
        <button className="btn btn-outline cookie-consent__btn" onClick={handleIgnore}>
          Not Now
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
