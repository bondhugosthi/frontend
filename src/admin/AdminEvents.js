import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { eventsAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import Modal from 'react-modal';
import './AdminEvents.css';

Modal.setAppElement('#root');

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const placeholderImage = '/images/event-placeholder.svg';

  const getEventCoverSrc = (event) => {
    const candidate =
      event?.coverImage ||
      event?.gallery?.[0]?.url ||
      event?.images?.[0] ||
      placeholderImage;
    return resolveMediaUrl(candidate) || placeholderImage;
  };

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'tournament',
    date: '',
    endDate: '',
    time: '',
    location: '',
    status: 'upcoming',
    organizer: '',
    participants: '',
    coverImage: ''
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterType !== 'all') params.type = filterType;

      const response = await eventsAPI.getAll(params);
      setEvents(response.data);
    } catch (error) {
      toast.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterType]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData(prev => ({
        ...prev,
        coverImage: response.data.url
      }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const conflict = events.find((event) => {
        const sameDate = event.date?.split('T')[0] === formData.date;
        const sameLocation = (event.location || '').trim() === (formData.location || '').trim();
        const notSameEvent = event._id !== editingEvent?._id;
        return sameDate && sameLocation && notSameEvent;
      });

      if (conflict) {
        toast.error('Another event is scheduled at the same date and location.');
        return;
      }

      if (editingEvent) {
        await eventsAPI.update(editingEvent._id, formData);
        toast.success('Event updated successfully');
      } else {
        await eventsAPI.create(formData);
        toast.success('Event created successfully');
      }
      
      closeModal();
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save event');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      date: event.date?.split('T')[0] || '',
      endDate: event.endDate?.split('T')[0] || '',
      time: event.time || '',
      location: event.location || '',
      status: event.status,
      organizer: event.organizer || '',
      participants: event.participants || '',
      coverImage: event.coverImage || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await eventsAPI.delete(id);
      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const openModal = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      eventType: 'tournament',
      date: '',
      endDate: '',
      time: '',
      location: '',
      status: 'upcoming',
      organizer: '',
      participants: '',
      coverImage: ''
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingEvent(null);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status) => {
    const badges = {
      upcoming: 'badge-primary',
      ongoing: 'badge-success',
      completed: 'badge-secondary',
      cancelled: 'badge-error'
    };
    return badges[status] || 'badge-secondary';
  };

  const getTypeBadge = (type) => {
    const badges = {
      tournament: 'badge-blue',
      puja: 'badge-orange',
      cultural: 'badge-green',
      social: 'badge-purple',
      other: 'badge-gray'
    };
    return badges[type] || 'badge-gray';
  };

  return (
    <div className="admin-events-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Events Management</h1>
          <p className="page-subtitle">Manage all club events and activities</p>
        </div>
        <button className="btn btn-primary" onClick={openModal}>
          <FaPlus /> Create Event
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Types</option>
            <option value="tournament">Tournament</option>
            <option value="puja">Puja</option>
            <option value="cultural">Cultural</option>
            <option value="social">Social</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Events Table */}
      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Type</th>
                <th>Date</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event, index) => (
                <motion.tr
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-info">
                      <img
                        src={getEventCoverSrc(event)}
                        alt={event.title}
                        className="event-thumb"
                        loading="lazy"
                        decoding="async"
                      />
                      <div>
                        <div className="event-title">{event.title}</div>
                        <div className="event-desc">
                          {(event.description || '').substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getTypeBadge(event.eventType)}`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <FaCalendarAlt />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="location-info">
                      <FaMapMarkerAlt />
                      {event.location || 'N/A'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(event.status)}`}>
                      {event.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => handleEdit(event)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(event._id)}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaCalendarAlt />
            </div>
            <h3>No Events Found</h3>
            <p>Create your first event to get started</p>
            <button className="btn btn-primary" onClick={openModal}>
              <FaPlus /> Create Event
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Event Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="Enter event title"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Event Type *</label>
              <select
                name="eventType"
                className="form-select"
                value={formData.eventType}
                onChange={handleInputChange}
                required
              >
                <option value="tournament">Tournament</option>
                <option value="puja">Puja</option>
                <option value="cultural">Cultural</option>
                <option value="social">Social</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleInputChange}
              required
              placeholder="Describe the event..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-input"
                value={formData.endDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Time</label>
              <input
                type="time"
                name="time"
                className="form-input"
                value={formData.time}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Event venue"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Organizer</label>
              <input
                type="text"
                name="organizer"
                className="form-input"
                value={formData.organizer}
                onChange={handleInputChange}
                placeholder="Organizer name"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Participants</label>
              <input
                type="number"
                name="participants"
                className="form-input"
                value={formData.participants}
                onChange={handleInputChange}
                placeholder="Number of participants"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="form-input"
            />
            {formData.coverImage && (
              <div className="image-preview">
                <img
                  src={resolveMediaUrl(formData.coverImage)}
                  alt="Preview"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingEvent ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminEvents;
