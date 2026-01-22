import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaCalendarAlt, 
  FaImages, 
  FaUsers, 
  FaNewspaper, 
  FaEnvelope,
  FaRunning,
  FaHandsHelping,
  FaArrowRight,
  FaClock,
  FaCheckCircle,
  FaMapMarkerAlt,
  FaPlus,
  FaEdit,
  FaTrash,
  FaLock
} from 'react-icons/fa';
import { dashboardAPI, contactAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  const statCards = [
    {
      title: 'Total Events',
      value: stats?.counts?.totalEvents || 0,
      icon: <FaCalendarAlt />,
      color: 'stat-blue',
      link: '/admin/events'
    },
    {
      title: 'Upcoming Events',
      value: stats?.counts?.upcomingEvents || 0,
      icon: <FaClock />,
      color: 'stat-orange',
      link: '/admin/events'
    },
    {
      title: 'Gallery Albums',
      value: stats?.counts?.totalGalleries || 0,
      icon: <FaImages />,
      color: 'stat-purple',
      link: '/admin/gallery'
    },
    {
      title: 'Active Members',
      value: stats?.counts?.totalMembers || 0,
      icon: <FaUsers />,
      color: 'stat-green',
      link: '/admin/members'
    },
    {
      title: 'Published News',
      value: stats?.counts?.totalNews || 0,
      icon: <FaNewspaper />,
      color: 'stat-red',
      link: '/admin/news'
    },
    {
      title: 'New Messages',
      value: stats?.counts?.newMessages || 0,
      icon: <FaEnvelope />,
      color: 'stat-yellow',
      link: '/admin/contact'
    },
    {
      title: 'Sports',
      value: stats?.counts?.totalSports || 0,
      icon: <FaRunning />,
      color: 'stat-indigo',
      link: '/admin/sports'
    },
    {
      title: 'Social Work',
      value: stats?.counts?.totalSocialWork || 0,
      icon: <FaHandsHelping />,
      color: 'stat-pink',
      link: '/admin/social-work'
    }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            <Link to={stat.link} className={`stat-card ${stat.color}`}>
              <div className="stat-icon">{stat.icon}</div>
              <div className="stat-content">
                <div className="stat-value">{stat.value}</div>
                <div className="stat-title">{stat.title}</div>
              </div>
              <div className="stat-arrow">
                <FaArrowRight />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="dashboard-grid">
        {/* Upcoming Events */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="card-header">
            <h2 className="card-title">
              <FaCalendarAlt /> Upcoming Events
            </h2>
            <Link to="/admin/events" className="card-link">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="card-content">
            {stats?.nextEvents && stats.nextEvents.length > 0 ? (
              <div className="events-list">
                {stats.nextEvents.map((event) => (
                  <div key={event._id} className="event-item">
                    <div className="event-date">
                      {new Date(event.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="event-info">
                      <div className="event-title">{event.title}</div>
                      <div className="event-meta">
                        <span className={`event-type type-${event.eventType}`}>
                          {event.eventType}
                        </span>
                        {event.location && (
                          <span className="event-location">
                            <FaMapMarkerAlt /> {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No upcoming events</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Contact Messages */}
        <motion.div
          className="dashboard-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="card-header">
            <h2 className="card-title">
              <FaEnvelope /> Recent Messages
            </h2>
            <Link to="/admin/contact" className="card-link">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="card-content">
            {stats?.recentMessages && stats.recentMessages.length > 0 ? (
              <div className="messages-list">
                {stats.recentMessages.map((message) => (
                  <div key={message._id} className="message-item">
                    <div className="message-avatar">
                      {message.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="message-info">
                      <div className="message-name">{message.name}</div>
                      <div className="message-subject">{message.subject}</div>
                      <div className="message-time">
                        {new Date(message.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`message-badge badge-${message.category}`}>
                      {message.category}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No new messages</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          className="dashboard-card full-width"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="card-header">
            <h2 className="card-title">
              <FaCheckCircle /> Recent Activities
            </h2>
            <Link to="/admin/activity-logs" className="card-link">
              View All <FaArrowRight />
            </Link>
          </div>
          <div className="card-content">
            {stats?.recentActivities && stats.recentActivities.length > 0 ? (
              <div className="activities-list">
                {stats.recentActivities.slice(0, 8).map((activity) => (
                  <div key={activity._id} className="activity-item">
                    <div className={`activity-icon activity-${activity.action}`}>
                      {activity.action === 'create' && <FaPlus />}
                      {activity.action === 'update' && <FaEdit />}
                      {activity.action === 'delete' && <FaTrash />}
                      {activity.action === 'login' && <FaLock />}
                    </div>
                    <div className="activity-info">
                      <div className="activity-description">{activity.description}</div>
                      <div className="activity-meta">
                        <span className="activity-user">
                          {activity.admin?.email}
                        </span>
                        <span className="activity-time">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <span className={`activity-badge badge-${activity.module}`}>
                      {activity.module}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No recent activities</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
