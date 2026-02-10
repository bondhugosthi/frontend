import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaUsers, FaTrophy, FaArrowLeft } from 'react-icons/fa';
import { format, differenceInCalendarDays } from 'date-fns';
import { eventsAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './EventDetails.css';

const extractImageUrl = (value) => {
  if (!value) {
    return '';
  }
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object') {
    return value.url || value.image || value.src || value.path || '';
  }
  return '';
};

const normalizeGalleryItems = (gallery, images) => {
  if (Array.isArray(gallery) && gallery.length > 0) {
    return gallery
      .map((item) => {
        if (!item) return null;
        if (typeof item === 'string') {
          return { url: item };
        }
        if (typeof item === 'object') {
          const url = extractImageUrl(item.url || item.image || item.src || item.path || item);
          if (!url) return null;
          return { url, caption: item.caption };
        }
        return null;
      })
      .filter((item) => item && item.url);
  }

  if (Array.isArray(images) && images.length > 0) {
    return images
      .map((item) => {
        const url = extractImageUrl(item);
        return url ? { url } : null;
      })
      .filter(Boolean);
  }

  return [];
};

const isValidDate = (value) => value instanceof Date && !Number.isNaN(value.getTime());

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

  const placeholderImage = '/images/event-placeholder.svg';
  const galleryItems = normalizeGalleryItems(event.gallery, event.images);
  const coverCandidate = extractImageUrl(event.coverImage) || galleryItems[0]?.url || placeholderImage;
  const heroImage = resolveMediaUrl(coverCandidate) || placeholderImage;

  const startDate = event?.date ? new Date(event.date) : null;
  const endDate = event?.endDate ? new Date(event.endDate) : null;
  const hasStartDate = isValidDate(startDate);
  const hasEndDate = isValidDate(endDate);
  const formattedStartDate = hasStartDate ? format(startDate, 'MMMM dd, yyyy') : 'Date TBA';
  const formattedEndDate = hasEndDate ? format(endDate, 'MMMM dd, yyyy') : null;
  const dateRangeLabel = formattedEndDate ? `${formattedStartDate} - ${formattedEndDate}` : formattedStartDate;
  const durationDays = hasStartDate && hasEndDate ? differenceInCalendarDays(endDate, startDate) + 1 : 1;
  const durationLabel = hasStartDate
    ? `${Math.max(durationDays, 1)} day${durationDays !== 1 ? 's' : ''}`
    : 'TBA';

  const descriptionParagraphs = (event.description || '')
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const summaryText = descriptionParagraphs[0] || 'Details will be announced soon.';
  const summaryPreview = summaryText.length > 180 ? `${summaryText.slice(0, 180)}...` : summaryText;

  const mapLink = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : '';

  const highlightItems = [
    { label: 'Status', value: event.status || 'upcoming' },
    { label: 'Type', value: event.eventType || 'event' },
    { label: 'Duration', value: durationLabel },
    event.organizer ? { label: 'Organizer', value: event.organizer } : null
  ].filter(Boolean);

  return (
    <div className="event-details-page">
      <div className="event-hero">
        <div
          className="event-hero-media"
          style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
        ></div>
        <div className="event-hero-overlay"></div>
        <div className="container">
          <div className="event-hero-grid">
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
                <p className="event-hero-summary">{summaryPreview}</p>
                <div className="event-meta-row">
                  <div className="meta-item">
                    <FaCalendarAlt />
                    <span>{formattedStartDate}</span>
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
                <div className="event-hero-actions">
                  <Link to="/contact" className="btn btn-secondary">
                    Get Involved
                  </Link>
                  {mapLink && (
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-outline-light"
                    >
                      View Location
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            <motion.div
              className="event-hero-card"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h3 className="event-hero-card-title">Event Snapshot</h3>
              <div className="snapshot-list">
                <div className="snapshot-row">
                  <span className="snapshot-label">Date</span>
                  <span className="snapshot-value">{dateRangeLabel}</span>
                </div>
                {event.time && (
                  <div className="snapshot-row">
                    <span className="snapshot-label">Time</span>
                    <span className="snapshot-value">{event.time}</span>
                  </div>
                )}
                {event.location && (
                  <div className="snapshot-row">
                    <span className="snapshot-label">Location</span>
                    <span className="snapshot-value">{event.location}</span>
                  </div>
                )}
              </div>
              <div className="snapshot-stats">
                <div className="snapshot-stat">
                  <span className="snapshot-stat-value">{durationLabel}</span>
                  <span className="snapshot-stat-label">Duration</span>
                </div>
                <div className="snapshot-stat">
                  <span className="snapshot-stat-value">
                    {event.participants ? event.participants.toLocaleString() : 'Open'}
                  </span>
                  <span className="snapshot-stat-label">Participants</span>
                </div>
              </div>
              <div className="snapshot-actions">
                {mapLink && (
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary btn-block"
                  >
                    Get Directions
                  </a>
                )}
                <Link to="/contact" className="btn btn-outline btn-block">
                  Contact Us
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {highlightItems.length > 0 && (
            <div className="event-highlights">
              {highlightItems.map((item) => (
                <div key={item.label} className="highlight-card">
                  <span className="highlight-label">{item.label}</span>
                  <span className="highlight-value">{item.value}</span>
                </div>
              ))}
            </div>
          )}

          <div className="event-content-grid">
            <motion.div
              className="event-main-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="content-card">
                <h2 className="content-title">Event Overview</h2>
                <div className="event-description">
                  {descriptionParagraphs.length > 0 ? (
                    descriptionParagraphs.map((text, index) => (
                      <p key={index}>{text}</p>
                    ))
                  ) : (
                    <p>Details will be announced soon. Please check back for updates.</p>
                  )}
                </div>
              </div>

              {(event.time || event.location || formattedEndDate) && (
                <div className="content-card">
                  <h2 className="content-title">Schedule & Location</h2>
                  <div className="schedule-grid">
                    <div className="schedule-item">
                      <span className="schedule-label">Date</span>
                      <span className="schedule-value">{dateRangeLabel}</span>
                    </div>
                    {event.time && (
                      <div className="schedule-item">
                        <span className="schedule-label">Time</span>
                        <span className="schedule-value">{event.time}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="schedule-item">
                        <span className="schedule-label">Location</span>
                        <span className="schedule-value">{event.location}</span>
                        {mapLink && (
                          <a
                            href={mapLink}
                            target="_blank"
                            rel="noreferrer"
                            className="schedule-link"
                          >
                            Open in Maps
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {galleryItems.length > 0 && (
                <div className="content-card">
                  <h2 className="content-title">Event Gallery</h2>
                  <div className="event-gallery-grid">
                    {galleryItems.map((image, index) => {
                      const imageSrc = resolveMediaUrl(image.url) || placeholderImage;
                      return (
                        <motion.div
                          key={`${image.url}-${index}`}
                          className="gallery-item"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <img
                            src={imageSrc}
                            alt={image.caption || `${event.title} image ${index + 1}`}
                            loading="lazy"
                            decoding="async"
                          />
                          {image.caption && (
                            <div className="gallery-caption">{image.caption}</div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

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

            <motion.aside
              className="event-sidebar"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div className="sidebar-card">
                <h3 className="sidebar-title">Event Information</h3>
                <div className="info-list">
                  <div className="info-item">
                    <strong>Status:</strong>
                    <span className={`status-pill ${getStatusColor(event.status)}`}>
                      {event.status}
                    </span>
                  </div>
                  <div className="info-item">
                    <strong>Type:</strong>
                    <span>{event.eventType}</span>
                  </div>
                  <div className="info-item">
                    <strong>Date:</strong>
                    <span>{dateRangeLabel}</span>
                  </div>
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

              <div className="sidebar-card cta-card">
                <h3 className="sidebar-title">Stay Connected</h3>
                <p>Have questions or want to participate? Reach out and we will help you get started.</p>
                <Link to="/contact" className="btn btn-primary btn-block">
                  Contact Us
                </Link>
                {mapLink && (
                  <a
                    href={mapLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-block"
                  >
                    View Location
                  </a>
                )}
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetails;
