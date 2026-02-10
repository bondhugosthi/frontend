import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { pressMentionsAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminPressMentions.css';

Modal.setAppElement('#root');

const defaultForm = {
  outlet: '',
  title: '',
  url: '',
  date: '',
  logo: '',
  order: 0,
  isPublished: true
};

const AdminPressMentions = () => {
  const [mentions, setMentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  const fetchMentions = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus === 'published') params.isPublished = true;
      if (filterStatus === 'draft') params.isPublished = false;
      const response = await pressMentionsAPI.getAll(params);
      setMentions(response.data);
    } catch (error) {
      toast.error('Failed to load press mentions');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchMentions();
  }, [fetchMentions]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            outlet: item.outlet || '',
            title: item.title || '',
            url: item.url || '',
            date: item.date ? item.date.split('T')[0] : '',
            logo: item.logo || '',
            order: item.order || 0,
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

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Logo size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        logo: response.data.url
      }));
      toast.success('Logo uploaded');
    } catch (error) {
      toast.error('Failed to upload logo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.outlet.trim() || !formData.title.trim() || !formData.url.trim()) {
      toast.error('Outlet, title, and URL are required');
      return;
    }

    const payload = {
      outlet: formData.outlet,
      title: formData.title,
      url: formData.url,
      date: formData.date || undefined,
      logo: formData.logo || undefined,
      order: Number(formData.order) || 0,
      isPublished: formData.isPublished
    };

    try {
      if (editingItem) {
        await pressMentionsAPI.update(editingItem._id, payload);
        toast.success('Press mention updated successfully');
      } else {
        await pressMentionsAPI.create(payload);
        toast.success('Press mention created successfully');
      }
      closeModal();
      fetchMentions();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save press mention');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this press mention?')) return;
    try {
      await pressMentionsAPI.delete(id);
      toast.success('Press mention deleted successfully');
      fetchMentions();
    } catch (error) {
      toast.error('Failed to delete press mention');
    }
  };

  const filteredMentions = mentions.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.outlet.toLowerCase().includes(query) ||
      item.title.toLowerCase().includes(query);
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'published'
        ? item.isPublished
        : !item.isPublished;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-press-mentions-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Press Mentions</h1>
          <p className="page-subtitle">Showcase media coverage and highlights</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Mention
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search mentions..."
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
            <p>Loading press mentions...</p>
          </div>
        ) : filteredMentions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Outlet</th>
                <th>Title</th>
                <th>Date</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMentions.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{item.outlet}</div>
                    <div className="event-desc">{item.url}</div>
                  </td>
                  <td>{item.title}</td>
                  <td>{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className={`badge ${item.isPublished ? 'badge-success' : 'badge-error'}`}>
                      {item.isPublished ? 'published' : 'draft'}
                    </span>
                  </td>
                  <td>{item.order || 0}</td>
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
              <FaSearch />
            </div>
            <h3>No Press Mentions Found</h3>
            <p>Add media coverage links to build credibility.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Mention
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
          <h2>{editingItem ? 'Edit Press Mention' : 'Add Press Mention'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Outlet *</label>
              <input
                type="text"
                name="outlet"
                className="form-input"
                value={formData.outlet}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>
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
            <label className="form-label">Article URL *</label>
            <input
              type="url"
              name="url"
              className="form-input"
              value={formData.url}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Outlet Logo</label>
            <input type="file" accept="image/*" className="form-input" onChange={handleLogoUpload} />
            {formData.logo && (
              <div className="image-preview">
                <img
                  src={resolveMediaUrl(formData.logo)}
                  alt="Logo preview"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>
          <div className="form-row">
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
              {editingItem ? 'Update Mention' : 'Create Mention'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPressMentions;
