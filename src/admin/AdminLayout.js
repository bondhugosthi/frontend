import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTachometerAlt, 
  FaCalendarAlt, 
  FaRunning, 
  FaHandsHelping, 
  FaImages, 
  FaUsers, 
  FaNewspaper, 
  FaEnvelope, 
  FaFileAlt, 
  FaCog, 
  FaHistory,
  FaSearch,
  FaUserShield,
  FaDatabase,
  FaShieldAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaHome
} from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { settingsAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminLayout.css';

const AdminLayout = () => {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { admin, logout } = useAuth();
  const [branding, setBranding] = useState({
    logo: '',
    websiteName: ''
  });

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
          websiteName: settings.websiteName || ''
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin', label: t('admin.dashboard'), icon: <FaTachometerAlt />, exact: true },
    { path: '/admin/events', label: t('admin.events'), icon: <FaCalendarAlt /> },
    { path: '/admin/sports', label: t('admin.sports'), icon: <FaRunning /> },
    { path: '/admin/social-work', label: t('admin.socialWork'), icon: <FaHandsHelping /> },
    { path: '/admin/gallery', label: t('admin.gallery'), icon: <FaImages /> },
    { path: '/admin/slider-images', label: t('admin.sliderImages'), icon: <FaImages /> },
    { path: '/admin/members', label: t('admin.members'), icon: <FaUsers /> },
    { path: '/admin/news', label: t('admin.news'), icon: <FaNewspaper /> },
    { path: '/admin/contact', label: t('admin.contact'), icon: <FaEnvelope /> },
    { path: '/admin/pages', label: t('admin.pages'), icon: <FaFileAlt /> },
    { path: '/admin/home-edit', label: t('admin.homeEdit'), icon: <FaHome /> },
    { path: '/admin/about-edit', label: t('admin.aboutEdit'), icon: <FaFileAlt /> },
    { path: '/admin/contact-edit', label: t('admin.contactEdit'), icon: <FaEnvelope /> },
    { path: '/admin/footer-edit', label: t('admin.footerEdit'), icon: <FaFileAlt /> },
    { path: '/admin/settings', label: t('admin.settings'), icon: <FaCog /> },
    { path: '/admin/seo', label: t('admin.seo'), icon: <FaSearch /> },
    { path: '/admin/users', label: t('admin.usersRoles'), icon: <FaUserShield /> },
    { path: '/admin/backups', label: t('admin.backups'), icon: <FaDatabase /> },
    { path: '/admin/security', label: t('admin.security'), icon: <FaShieldAlt /> },
    { path: '/admin/activity-logs', label: t('admin.activityLogs'), icon: <FaHistory /> }
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
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
            {sidebarOpen && (
              <div className="logo-text">
                <span className="logo-main">{branding.websiteName || 'Bondhu Gosthi'}</span>
                <span className="logo-sub">{t('admin.adminPanel')}</span>
              </div>
            )}
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-label">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item" title={t('admin.viewWebsite')}>
            <span className="nav-icon"><FaHome /></span>
            {sidebarOpen && <span className="nav-label">{t('admin.viewWebsite')}</span>}
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn" title={t('admin.logout')}>
            <span className="nav-icon"><FaSignOutAlt /></span>
            {sidebarOpen && <span className="nav-label">{t('admin.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        {/* Top Bar */}
        <header className="admin-header">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          <div className="header-right">
            <div className="admin-info">
              <span className="admin-email">{admin?.email}</span>
              <span className="admin-role">{admin?.role?.replace('_', ' ')}</span>
            </div>
            <div className="admin-avatar">
              {admin?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="admin-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
