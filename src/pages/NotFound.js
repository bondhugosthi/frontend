import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaSearch } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import './NotFound.css';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="not-found-page">
      <div className="not-found-card">
        <div className="not-found-icon">
          <FaSearch />
        </div>
        <h1>{t('notFound.title')}</h1>
        <p>{t('notFound.subtitle')}</p>
        <Link to="/" className="btn btn-primary">
          <FaHome /> {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
