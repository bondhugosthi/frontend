import React from 'react';
import { Link } from 'react-router-dom';
import './CtaSection.css';

const isInternalLink = (value) => typeof value === 'string' && value.startsWith('/');

const CtaSection = ({
  title,
  description,
  primaryLabel,
  primaryLink,
  secondaryLabel,
  secondaryLink
}) => {
  if (!title && !description) {
    return null;
  }

  const renderLink = (label, link, variant) => {
    if (!label || !link) return null;
    if (isInternalLink(link)) {
      return (
        <Link to={link} className={`btn ${variant}`}>
          {label}
        </Link>
      );
    }
    return (
      <a href={link} className={`btn ${variant}`} target="_blank" rel="noreferrer">
        {label}
      </a>
    );
  };

  return (
    <section className="cta-block">
      <div className="container">
        <div className="cta-block-card">
          <div>
            {title && <h2 className="cta-block-title">{title}</h2>}
            {description && <p className="cta-block-description">{description}</p>}
          </div>
          <div className="cta-block-actions">
            {renderLink(primaryLabel, primaryLink, 'btn-primary')}
            {renderLink(secondaryLabel, secondaryLink, 'btn-outline')}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;
