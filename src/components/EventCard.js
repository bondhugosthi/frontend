import React from 'react';
import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './EventCard.css';

const EventCard = ({ event }) => {
  const getEventTypeColor = (type) => {
    const colors = {
      tournament: 'badge-primary',
      puja: 'badge-warning',
      cultural: 'badge-success',
      social: 'badge-info',
      other: 'badge-secondary'
    };
    return colors[type] || 'badge-secondary';
  };

  const getStatusColor = (status) => {
    const colors = {
      upcoming: 'badge-primary',
      ongoing: 'badge-success',
      completed: 'badge-secondary',
      cancelled: 'badge-error'
    };
    return colors[status] || 'badge-secondary';
  };

  return (
    <div className="event-card">
      {event.coverImage && (
        <div className="event-card-image">
          <img src={resolveMediaUrl(event.coverImage)} alt={event.title} />
          <div className="event-card-badges">
            <span className={`badge ${getEventTypeColor(event.eventType)}`}>
              {event.eventType}
            </span>
            <span className={`badge ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>
      )}
      
      <div className="event-card-content">
        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-description">
          {(event.description || '').substring(0, 120)}...
        </p>
        
        <div className="event-card-meta">
          <div className="event-meta-item">
            <FaCalendarAlt />
            <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
          </div>
          
          {event.time && (
            <div className="event-meta-item">
              <FaClock />
              <span>{event.time}</span>
            </div>
          )}
          
          {event.location && (
            <div className="event-meta-item">
              <FaMapMarkerAlt />
              <span>{event.location}</span>
            </div>
          )}
        </div>
        
        <Link to={`/events/${event._id}`} className="event-card-link">
          View Details <FaArrowRight />
        </Link>
      </div>
    </div>
  );
};

export default EventCard;
