import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { eventsAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import './Events.css';

const Events = () => {
  const { t } = useTranslation();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [activeType, setActiveType] = useState('all');

  const fetchEvents = useCallback(async () => {
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
  }, [activeTab, activeType]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const tabs = [
    { id: 'all', label: t('events.tabs.all', { defaultValue: 'All Events' }) },
    { id: 'upcoming', label: t('events.tabs.upcoming', { defaultValue: 'Upcoming' }) },
    { id: 'ongoing', label: t('events.tabs.ongoing', { defaultValue: 'Ongoing' }) },
    { id: 'completed', label: t('events.tabs.completed', { defaultValue: 'Completed' }) }
  ];

  const eventTypes = [
    { id: 'all', label: t('events.types.all', { defaultValue: 'All Types' }) },
    { id: 'tournament', label: t('events.types.tournaments', { defaultValue: 'Tournaments' }) },
    { id: 'puja', label: t('events.types.puja', { defaultValue: 'Puja' }) },
    { id: 'cultural', label: t('events.types.cultural', { defaultValue: 'Cultural' }) },
    { id: 'social', label: t('events.types.social', { defaultValue: 'Social' }) }
  ];

  return (
    <div className="events-page">
      <PageHeader
        title={t('nav.events')}
        subtitle={t('events.subtitle', { defaultValue: 'Explore our exciting lineup of events, tournaments, and celebrations' })}
        breadcrumbs={[t('nav.home'), t('nav.events')]}
      />

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="events-filters">
            {/* Status Tabs */}
            <div className="filter-group">
              <label className="filter-label">{t('events.statusLabel', { defaultValue: 'Status:' })}</label>
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
              <label className="filter-label">{t('events.typeLabel', { defaultValue: 'Type:' })}</label>
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
            <LoadingSpinner text={t('events.loading', { defaultValue: 'Loading events...' })} />
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
              <h3>{t('events.emptyTitle', { defaultValue: 'No Events Found' })}</h3>
              <p>{t('events.emptyText', { defaultValue: 'There are no events matching your filters. Check back soon for updates!' })}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
