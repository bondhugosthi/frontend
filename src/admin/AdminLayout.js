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
import { useAuth } from '../context/AuthContext';
import { settingsAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminLayout.css';

const AdminLayout = () => {
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
    { path: '/admin', label: 'Dashboard', icon: <FaTachometerAlt />, exact: true },
    { path: '/admin/events', label: 'Events', icon: <FaCalendarAlt /> },
    { path: '/admin/sports', label: 'Sports', icon: <FaRunning /> },
    { path: '/admin/social-work', label: 'Social Work', icon: <FaHandsHelping /> },
    { path: '/admin/gallery', label: 'Gallery', icon: <FaImages /> },
    { path: '/admin/slider-images', label: 'Slider Images', icon: <FaImages /> },
    { path: '/admin/members', label: 'Members', icon: <FaUsers /> },
    { path: '/admin/news', label: 'News', icon: <FaNewspaper /> },
    { path: '/admin/contact', label: 'Contact', icon: <FaEnvelope /> },
    { path: '/admin/pages', label: 'Pages', icon: <FaFileAlt /> },
    { path: '/admin/home-edit', label: 'Home Edit', icon: <FaHome /> },
    { path: '/admin/about-edit', label: 'About Edit', icon: <FaFileAlt /> },
    { path: '/admin/contact-edit', label: 'Contact Edit', icon: <FaEnvelope /> },
    { path: '/admin/footer-edit', label: 'Footer Edit', icon: <FaFileAlt /> },
    { path: '/admin/settings', label: 'Settings', icon: <FaCog /> },
    { path: '/admin/seo', label: 'SEO', icon: <FaSearch /> },
    { path: '/admin/users', label: 'Users & Roles', icon: <FaUserShield /> },
    { path: '/admin/backups', label: 'Backups', icon: <FaDatabase /> },
    { path: '/admin/security', label: 'Security', icon: <FaShieldAlt /> },
    { path: '/admin/activity-logs', label: 'Activity Logs', icon: <FaHistory /> }
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
                />
              ) : (
                'BG'
              )}
            </div>
            {sidebarOpen && (
              <div className="logo-text">
                <span className="logo-main">{branding.websiteName || 'Bondhu Gosthi'}</span>
                <span className="logo-sub">Admin Panel</span>
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
          <Link to="/" className="nav-item" title="View Website">
            <span className="nav-icon"><FaHome /></span>
            {sidebarOpen && <span className="nav-label">View Website</span>}
          </Link>
          <button onClick={handleLogout} className="nav-item logout-btn" title="Logout">
            <span className="nav-icon"><FaSignOutAlt /></span>
            {sidebarOpen && <span className="nav-label">Logout</span>}
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
