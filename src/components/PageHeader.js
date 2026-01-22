import React from 'react';
import './PageHeader.css';

const PageHeader = ({ title, subtitle, breadcrumbs }) => {
  return (
    <div className="site-page-header">
      <div className="site-page-header-overlay"></div>
      <div className="container">
        <div className="site-page-header-content">
          {breadcrumbs && (
            <nav className="site-breadcrumbs">
              {breadcrumbs.map((crumb, index) => (
                <span key={index}>
                  {crumb}
                  {index < breadcrumbs.length - 1 && <span className="site-breadcrumb-separator">/</span>}
                </span>
              ))}
            </nav>
          )}
          <h1 className="site-page-title">{title}</h1>
          {subtitle && <p className="site-page-subtitle">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
