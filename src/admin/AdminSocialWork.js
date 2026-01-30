import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { socialWorkAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminSocialWork.css';

Modal.setAppElement('#root');

const defaultForm = {
  title: '',
  description: '',
  category: 'food_distribution',
  date: '',
  location: '',
  impactPeople: '',
  impactDescription: '',
  volunteers: '',
  coverImage: '',
  isPublished: true
};

const AdminSocialWork = () => {
  const [initiatives, setInitiatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  const fetchInitiatives = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      const response = await socialWorkAPI.getAll(params);
      setInitiatives(response.data);
    } catch (error) {
      toast.error('Failed to load social work initiatives');
    } finally {
      setLoading(false);
    }
  }, [filterCategory]);

  useEffect(() => {
    fetchInitiatives();
  }, [fetchInitiatives]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            title: item.title || '',
            description: item.description || '',
            category: item.category || 'food_distribution',
            date: item.date ? item.date.split('T')[0] : '',
            location: item.location || '',
            impactPeople: item.impact?.peopleHelped || '',
            impactDescription: item.impact?.description || '',
            volunteers: item.volunteers?.join(', ') || '',
            coverImage: item.coverImage || '',
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

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
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

    if (!formData.title.trim() || !formData.description.trim() || !formData.date) {
      toast.error('Title, description, and date are required');
      return;
    }

    const payload = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      location: formData.location || undefined,
      coverImage: formData.coverImage || undefined,
      isPublished: formData.isPublished,
      impact: {
        peopleHelped: formData.impactPeople ? Number(formData.impactPeople) : undefined,
        description: formData.impactDescription || undefined
      },
      volunteers: formData.volunteers
        ? formData.volunteers.split(',').map((vol) => vol.trim()).filter(Boolean)
        : []
    };

    try {
      if (editingItem) {
        await socialWorkAPI.update(editingItem._id, payload);
        toast.success('Initiative updated successfully');
      } else {
        await socialWorkAPI.create(payload);
        toast.success('Initiative created successfully');
      }
      closeModal();
      fetchInitiatives();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save initiative');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this initiative?')) return;
    try {
      await socialWorkAPI.delete(id);
      toast.success('Initiative deleted successfully');
      fetchInitiatives();
    } catch (error) {
      toast.error('Failed to delete initiative');
    }
  };

  const filteredInitiatives = initiatives.filter((item) => {
    const query = searchTerm.toLowerCase();
    return (
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-social-work-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Social Work</h1>
          <p className="page-subtitle">Showcase community initiatives and impact</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Initiative
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search initiatives..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="food_distribution">Food Distribution</option>
            <option value="education">Education</option>
            <option value="health">Health</option>
            <option value="disaster_relief">Disaster Relief</option>
            <option value="community_service">Community Service</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading initiatives...</p>
          </div>
        ) : filteredInitiatives.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Initiative</th>
                <th>Category</th>
                <th>Date</th>
                <th>Impact</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInitiatives.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{item.title}</div>
                    <div className="event-desc">
                      {item.location && (
                        <span className="meta-inline">
                          <FaMapMarkerAlt /> {item.location}
                        </span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-green">
                      {(item.category || 'other').replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span className="meta-inline">
                      <FaCalendarAlt /> {new Date(item.date).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    {item.impact?.peopleHelped ? (
                      <span className="meta-inline">
                        <FaUsers /> {item.impact.peopleHelped} helped
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
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
              <FaUsers />
            </div>
            <h3>No Initiatives Found</h3>
            <p>Start by adding your first social work initiative.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Initiative
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
          <h2>{editingItem ? 'Edit Initiative' : 'Add Initiative'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="food_distribution">Food Distribution</option>
                <option value="education">Education</option>
                <option value="health">Health</option>
                <option value="disaster_relief">Disaster Relief</option>
                <option value="community_service">Community Service</option>
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
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Date *</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">People Helped</label>
              <input
                type="number"
                name="impactPeople"
                className="form-input"
                value={formData.impactPeople}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Impact Summary</label>
              <input
                type="text"
                name="impactDescription"
                className="form-input"
                value={formData.impactDescription}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Volunteers (comma separated)</label>
            <input
              type="text"
              name="volunteers"
              className="form-input"
              value={formData.volunteers}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Cover Image</label>
            <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
            {formData.coverImage && (
              <div className="image-preview">
                <img src={resolveMediaUrl(formData.coverImage)} alt="Preview" />
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
              {editingItem ? 'Update Initiative' : 'Create Initiative'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSocialWork;
