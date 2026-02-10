import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaStar } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { testimonialsAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminTestimonials.css';

Modal.setAppElement('#root');

const defaultForm = {
  name: '',
  role: '',
  quote: '',
  rating: 5,
  order: 0,
  photo: '',
  isPublished: true
};

const AdminTestimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  const fetchTestimonials = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus === 'published') params.isPublished = true;
      if (filterStatus === 'draft') params.isPublished = false;
      const response = await testimonialsAPI.getAll(params);
      setTestimonials(response.data);
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            name: item.name || '',
            role: item.role || '',
            quote: item.quote || '',
            rating: item.rating || 5,
            order: item.order || 0,
            photo: item.photo || '',
            isPublished: item.isPublished !== false
          }
        : defaultForm
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingItem(null);
    setFormData(defaultForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        photo: response.data.url
      }));
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error('Failed to upload photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim()) {
      toast.error('Name and quote are required');
      return;
    }

    const payload = {
      name: formData.name,
      role: formData.role || undefined,
      quote: formData.quote,
      rating: Number(formData.rating) || undefined,
      order: Number(formData.order) || 0,
      photo: formData.photo || undefined,
      isPublished: formData.isPublished
    };

    try {
      if (editingItem) {
        await testimonialsAPI.update(editingItem._id, payload);
        toast.success('Testimonial updated successfully');
      } else {
        await testimonialsAPI.create(payload);
        toast.success('Testimonial created successfully');
      }
      closeModal();
      fetchTestimonials();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save testimonial');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await testimonialsAPI.delete(id);
      toast.success('Testimonial deleted successfully');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  const filteredTestimonials = testimonials.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.name.toLowerCase().includes(query) ||
      (item.role || '').toLowerCase().includes(query) ||
      item.quote.toLowerCase().includes(query);
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'published'
        ? item.isPublished
        : !item.isPublished;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-testimonials-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Testimonials</h1>
          <p className="page-subtitle">Showcase member voices on the homepage</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Testimonial
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search testimonials..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading testimonials...</p>
          </div>
        ) : filteredTestimonials.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Quote</th>
                <th>Rating</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTestimonials.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="testimonial-row">
                      {item.photo ? (
                        <img
                          src={resolveMediaUrl(item.photo)}
                          alt={item.name}
                          className="testimonial-thumb"
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <div className="testimonial-thumb fallback">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="event-title">{item.name}</div>
                        <div className="event-desc">{item.role || 'Member'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {(item.quote || '').substring(0, 90)}...
                  </td>
                  <td>
                    <span className="testimonial-rating">
                      <FaStar /> {item.rating || 5}
                    </span>
                  </td>
                  <td>{item.order || 0}</td>
                  <td>
                    <span className={`badge ${item.isPublished ? 'badge-success' : 'badge-error'}`}>
                      {item.isPublished ? 'published' : 'draft'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(item)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(item._id)}
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
              <FaStar />
            </div>
            <h3>No Testimonials Found</h3>
            <p>Add member quotes to build trust.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Testimonial
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={modalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role/Title</label>
              <input
                type="text"
                name="role"
                className="form-input"
                value={formData.role}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Quote *</label>
            <textarea
              name="quote"
              className="form-textarea"
              rows="5"
              value={formData.quote}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Rating</label>
              <select
                name="rating"
                className="form-select"
                value={formData.rating}
                onChange={handleChange}
              >
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                name="order"
                className="form-input"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Photo</label>
            <input type="file" accept="image/*" className="form-input" onChange={handlePhotoUpload} />
            {formData.photo && (
              <div className="image-preview">
                <img
                  src={resolveMediaUrl(formData.photo)}
                  alt="Preview"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>
          <div className="form-row">
            <label className="form-label checkbox-row">
              <input
                type="checkbox"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handleChange}
              />
              Publish on website
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingItem ? 'Update Testimonial' : 'Create Testimonial'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminTestimonials;
