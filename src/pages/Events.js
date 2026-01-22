import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { eventsAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [activeType, setActiveType] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, [activeTab, activeType]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeTab !== 'all') params.status = activeTab;
      if (activeType !== 'all') params.type = activeType;

      const response = await eventsAPI.getAll(params);
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'ongoing', label: 'Ongoing' },
    { id: 'completed', label: 'Completed' }
  ];

  const eventTypes = [
    { id: 'all', label: 'All Types' },
    { id: 'tournament', label: 'Tournaments' },
    { id: 'puja', label: 'Puja' },
    { id: 'cultural', label: 'Cultural' },
    { id: 'social', label: 'Social' }
  ];

  return (
    <div className="events-page">
      <PageHeader
        title="Events"
        subtitle="Explore our exciting lineup of events, tournaments, and celebrations"
        breadcrumbs={['Home', 'Events']}
      />

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="events-filters">
            {/* Status Tabs */}
            <div className="filter-group">
              <label className="filter-label">Status:</label>
              <div className="filter-tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`filter-tab ${activeTab === tab.id ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Event Types */}
            <div className="filter-group">
              <label className="filter-label">Type:</label>
              <div className="filter-tabs">
                {eventTypes.map((type) => (
                  <button
                    key={type.id}
                    className={`filter-tab ${activeType === type.id ? 'active' : ''}`}
                    onClick={() => setActiveType(type.id)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <LoadingSpinner text="Loading events..." />
          ) : events.length > 0 ? (
            <motion.div
              className="events-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EventCard event={event} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="no-events">
              <div className="no-events-icon">
                <FaCalendarAlt />
              </div>
              <h3>No Events Found</h3>
              <p>There are no events matching your filters. Check back soon for updates!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
