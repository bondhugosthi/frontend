import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import { format } from 'date-fns';
import { eventsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './EventDetails.css';

const EventDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEventDetails = useCallback(async () => {
    try {
      const response = await eventsAPI.getById(id);
      setEvent(response.data);
    } catch (error) {
      console.error('Error fetching event details:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEventDetails();
  }, [fetchEventDetails]);

  if (loading) {
    return <LoadingSpinner text="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="container" style={{ marginTop: '150px', textAlign: 'center' }}>
        <h2>Event not found</h2>
        <Link to="/events" className="btn btn-primary">Back to Events</Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'status-upcoming',
      ongoing: 'status-ongoing',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return colors[status] || 'status-upcoming';
  };

  return (
    <div className="event-details-page">
      {/* Hero Section */}
      <div className="event-hero" style={{ backgroundImage: `url(${event.coverImage})` }}>
        <div className="event-hero-overlay"></div>
        <div className="container">
          <div className="event-hero-content">
            <Link to="/events" className="back-link">
              <FaArrowLeft /> Back to Events
            </Link>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="event-badges">
                <span className={`badge ${getStatusColor(event.status)}`}>
                  {event.status}
                </span>
                <span className="badge badge-type">{event.eventType}</span>
              </div>
              <h1 className="event-title">{event.title}</h1>
              <div className="event-meta-row">
                <div className="meta-item">
                  <FaCalendarAlt />
                  <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                </div>
                {event.time && (
                  <div className="meta-item">
                    <FaClock />
                    <span>{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="meta-item">
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="section">
        <div className="container">
          <div className="event-content-grid">
            {/* Main Content */}
            <motion.div
              className="event-main-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="content-card">
                <h2 className="content-title">About This Event</h2>
                <div className="event-description">
                  <p>{event.description}</p>
                </div>
              </div>

              {/* Gallery */}
              {event.gallery && event.gallery.length > 0 && (
                <div className="content-card">
                  <h2 className="content-title">Event Gallery</h2>
                  <div className="event-gallery-grid">
                    {event.gallery.map((image, index) => (
                      <motion.div
                        key={index}
                        className="gallery-item"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <img src={image.url} alt={image.caption || `Gallery ${index + 1}`} />
                        {image.caption && (
                          <div className="gallery-caption">{image.caption}</div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Results/Winners */}
              {event.results && event.results.winners && event.results.winners.length > 0 && (
                <div className="content-card results-card">
                  <h2 className="content-title">
                    <FaTrophy /> Winners & Results
                  </h2>
                  <div className="winners-list">
                    {event.results.winners.map((winner, index) => (
                      <div key={index} className="winner-item">
                        <span className="winner-position">#{index + 1}</span>
                        <span className="winner-name">{winner}</span>
                      </div>
                    ))}
                  </div>
                  {event.results.summary && (
                    <div className="results-summary">
                      <p>{event.results.summary}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              className="event-sidebar"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Event Info Card */}
              <div className="sidebar-card">
                <h3 className="sidebar-title">Event Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <strong>Date:</strong>
                    <span>{format(new Date(event.date), 'MMMM dd, yyyy')}</span>
                  </div>
                  {event.endDate && (
                    <div className="info-item">
                      <strong>End Date:</strong>
                      <span>{format(new Date(event.endDate), 'MMMM dd, yyyy')}</span>
                    </div>
                  )}
                  {event.time && (
                    <div className="info-item">
                      <strong>Time:</strong>
                      <span>{event.time}</span>
                    </div>
                  )}
                  {event.location && (
                    <div className="info-item">
                      <strong>Location:</strong>
                      <span>{event.location}</span>
                    </div>
                  )}
                  {event.organizer && (
                    <div className="info-item">
                      <strong>Organizer:</strong>
                      <span>{event.organizer}</span>
                    </div>
                  )}
                  {event.participants && (
                    <div className="info-item">
                      <strong>Participants:</strong>
                      <span>
                        <FaUsers /> {event.participants}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Card */}
              <div className="sidebar-card cta-card">
                <h3 className="sidebar-title">Interested?</h3>
                <p>Want to participate or learn more about this event?</p>
                <Link to="/contact" className="btn btn-primary btn-block">
                  Contact Us
                </Link>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;
