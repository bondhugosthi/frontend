import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaStar } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { newsAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminNews.css';

Modal.setAppElement('#root');

const defaultForm = {
  title: '',
  content: '',
  type: 'news',
  category: '',
  publishDate: '',
  expiryDate: '',
  tags: '',
  image: '',
  isImportant: false,
  isPublished: true
};

const AdminNews = () => {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterType !== 'all') params.type = filterType;
      const response = await newsAPI.getAll(params);
      setNewsItems(response.data);
    } catch (error) {
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  }, [filterType]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            title: item.title || '',
            content: item.content || '',
            type: item.type || 'news',
            category: item.category || '',
            publishDate: item.publishDate ? item.publishDate.split('T')[0] : '',
            expiryDate: item.expiryDate ? item.expiryDate.split('T')[0] : '',
            tags: item.tags?.join(', ') || '',
            image: item.image || '',
            isImportant: Boolean(item.isImportant),
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
        image: response.data.url
      }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const payload = {
      title: formData.title,
      content: formData.content,
      type: formData.type,
      category: formData.category || undefined,
      publishDate: formData.publishDate || undefined,
      expiryDate: formData.expiryDate || undefined,
      tags: formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
        : [],
      image: formData.image || undefined,
      isImportant: formData.isImportant,
      isPublished: formData.isPublished
    };

    try {
      if (editingItem) {
        await newsAPI.update(editingItem._id, payload);
        toast.success('News updated successfully');
      } else {
        await newsAPI.create(payload);
        toast.success('News created successfully');
      }
      closeModal();
      fetchNews();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save news');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this news item?')) return;
    try {
      await newsAPI.delete(id);
      toast.success('News deleted successfully');
      fetchNews();
    } catch (error) {
      toast.error('Failed to delete news');
    }
  };

  const filteredNews = newsItems.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.content.toLowerCase().includes(query);
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'published'
        ? item.isPublished
        : !item.isPublished;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-news-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">News & Announcements</h1>
          <p className="page-subtitle">Publish updates, notices, and festival news</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add News
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="news">News</option>
            <option value="notice">Notice</option>
            <option value="announcement">Announcement</option>
            <option value="festival">Festival</option>
          </select>
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
            <p>Loading news...</p>
          </div>
        ) : filteredNews.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Type</th>
                <th>Date</th>
                <th>Status</th>
                <th>Important</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{item.title}</div>
                    <div className="event-desc">
                      {(item.content || '').substring(0, 80)}...
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{item.type}</span>
                  </td>
                  <td>{new Date(item.publishDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${item.isPublished ? 'badge-success' : 'badge-error'}`}>
                      {item.isPublished ? 'published' : 'draft'}
                    </span>
                  </td>
                  <td>{item.isImportant ? <FaStar className="important-star" /> : 'No'}</td>
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
            <h3>No News Found</h3>
            <p>Share updates with your community.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add News
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
          <h2>{editingItem ? 'Edit News' : 'Add News'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
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
            <label className="form-label">Content *</label>
            <textarea
              name="content"
              className="form-textarea"
              rows="6"
              value={formData.content}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Type *</label>
              <select
                name="type"
                className="form-select"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="news">News</option>
                <option value="notice">Notice</option>
                <option value="announcement">Announcement</option>
                <option value="festival">Festival</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                className="form-input"
                value={formData.category}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Publish Date</label>
              <input
                type="date"
                name="publishDate"
                className="form-input"
                value={formData.publishDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry Date</label>
              <input
                type="date"
                name="expiryDate"
                className="form-input"
                value={formData.expiryDate}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma separated)</label>
            <input
              type="text"
              name="tags"
              className="form-input"
              value={formData.tags}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Image</label>
            <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
            {formData.image && (
              <div className="image-preview">
                <img src={resolveMediaUrl(formData.image)} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-row">
            <label className="form-label checkbox-row">
              <input
                type="checkbox"
                name="isImportant"
                checked={formData.isImportant}
                onChange={handleChange}
              />
              Mark as important
            </label>
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
              {editingItem ? 'Update News' : 'Create News'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminNews;
