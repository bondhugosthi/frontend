import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { socialFeedAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminSocialFeed.css';

Modal.setAppElement('#root');

const defaultForm = {
  platform: 'facebook',
  title: '',
  caption: '',
  url: '',
  image: '',
  postedAt: '',
  order: 0,
  isPublished: true
};

const AdminSocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus === 'published') params.isPublished = true;
      if (filterStatus === 'draft') params.isPublished = false;
      const response = await socialFeedAPI.getAll(params);
      setPosts(response.data);
    } catch (error) {
      toast.error('Failed to load social posts');
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const openModal = (item = null) => {
    setEditingItem(item);
    setFormData(
      item
        ? {
            platform: item.platform || 'facebook',
            title: item.title || '',
            caption: item.caption || '',
            url: item.url || '',
            image: item.image || '',
            postedAt: item.postedAt ? item.postedAt.split('T')[0] : '',
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
    if (!formData.url.trim()) {
      toast.error('Post URL is required');
      return;
    }

    const payload = {
      platform: formData.platform,
      title: formData.title || undefined,
      caption: formData.caption || undefined,
      url: formData.url,
      image: formData.image || undefined,
      postedAt: formData.postedAt || undefined,
      order: Number(formData.order) || 0,
      isPublished: formData.isPublished
    };

    try {
      if (editingItem) {
        await socialFeedAPI.update(editingItem._id, payload);
        toast.success('Social post updated successfully');
      } else {
        await socialFeedAPI.create(payload);
        toast.success('Social post created successfully');
      }
      closeModal();
      fetchPosts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save social post');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this social post?')) return;
    try {
      await socialFeedAPI.delete(id);
      toast.success('Social post deleted successfully');
      fetchPosts();
    } catch (error) {
      toast.error('Failed to delete social post');
    }
  };

  const filteredPosts = posts.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      (item.title || '').toLowerCase().includes(query) ||
      (item.caption || '').toLowerCase().includes(query) ||
      (item.platform || '').toLowerCase().includes(query);
    const matchesStatus =
      filterStatus === 'all'
        ? true
        : filterStatus === 'published'
        ? item.isPublished
        : !item.isPublished;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="admin-social-feed-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Social Feed</h1>
          <p className="page-subtitle">Curate posts for the homepage social section</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Post
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search posts..."
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
            <p>Loading social posts...</p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Post</th>
                <th>Platform</th>
                <th>Date</th>
                <th>Status</th>
                <th>Order</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((item, index) => (
                <motion.tr
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{item.title || item.caption || 'Social post'}</div>
                    <div className="event-desc">{item.url}</div>
                  </td>
                  <td>{item.platform}</td>
                  <td>{item.postedAt ? new Date(item.postedAt).toLocaleDateString() : 'N/A'}</td>
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
            <h3>No Social Posts Found</h3>
            <p>Add posts to keep the homepage active.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Post
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
          <h2>{editingItem ? 'Edit Social Post' : 'Add Social Post'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Platform</label>
              <select
                name="platform"
                className="form-select"
                value={formData.platform}
                onChange={handleChange}
              >
                <option value="facebook">Facebook</option>
                <option value="instagram">Instagram</option>
                <option value="youtube">YouTube</option>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Post Date</label>
              <input
                type="date"
                name="postedAt"
                className="form-input"
                value={formData.postedAt}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Caption</label>
            <textarea
              name="caption"
              className="form-textarea"
              rows="4"
              value={formData.caption}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Post URL *</label>
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
            <label className="form-label">Image</label>
            <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
            {formData.image && (
              <div className="image-preview">
                <img
                  src={resolveMediaUrl(formData.image)}
                  alt="Preview"
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
              {editingItem ? 'Update Post' : 'Create Post'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSocialFeed;
