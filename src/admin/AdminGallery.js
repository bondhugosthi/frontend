import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaImages,
  FaUpload
} from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { galleryAPI, uploadAPI } from '../utils/api';
import './AdminGallery.css';

Modal.setAppElement('#root');

const defaultForm = {
  albumName: '',
  description: '',
  category: 'events',
  date: '',
  coverImage: '',
  isPublished: true
};

const AdminGallery = () => {
  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [formData, setFormData] = useState(defaultForm);
  const [mediaFiles, setMediaFiles] = useState([]);

  useEffect(() => {
    fetchAlbums();
  }, [filterCategory]);

  const fetchAlbums = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterCategory !== 'all') params.category = filterCategory;
      const response = await galleryAPI.getAll(params);
      setAlbums(response.data);
    } catch (error) {
      toast.error('Failed to load gallery albums');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (album = null) => {
    setEditingAlbum(album);
    setFormData(
      album
        ? {
            albumName: album.albumName || '',
            description: album.description || '',
            category: album.category || 'events',
            date: album.date ? album.date.split('T')[0] : '',
            coverImage: album.coverImage || '',
            isPublished: album.isPublished !== false
          }
        : defaultForm
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAlbum(null);
    setFormData(defaultForm);
  };

  const openMediaModal = (album) => {
    setSelectedAlbum(album);
    setMediaFiles([]);
    setMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setMediaModalOpen(false);
    setSelectedAlbum(null);
    setMediaFiles([]);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleCoverUpload = async (e) => {
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
      toast.success('Cover image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleMediaSelection = (e) => {
    setMediaFiles(Array.from(e.target.files || []));
  };

  const handleMediaUpload = async () => {
    if (!selectedAlbum || mediaFiles.length === 0) {
      toast.error('Select at least one file');
      return;
    }

    try {
      const response = await uploadAPI.uploadImages(mediaFiles);
      const media = response.data.files.map((file) => ({
        type: 'image',
        url: file.url,
        thumbnail: file.url
      }));

      await galleryAPI.addMedia(selectedAlbum._id, { media });
      toast.success('Media uploaded successfully');
      closeMediaModal();
      fetchAlbums();
    } catch (error) {
      toast.error('Failed to upload media');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.albumName.trim()) {
      toast.error('Album name is required');
      return;
    }

    const payload = {
      albumName: formData.albumName,
      description: formData.description || undefined,
      category: formData.category,
      date: formData.date || undefined,
      coverImage: formData.coverImage || undefined,
      isPublished: formData.isPublished
    };

    try {
      if (editingAlbum) {
        await galleryAPI.update(editingAlbum._id, payload);
        toast.success('Album updated successfully');
      } else {
        await galleryAPI.create(payload);
        toast.success('Album created successfully');
      }
      closeModal();
      fetchAlbums();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save album');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this album?')) return;
    try {
      await galleryAPI.delete(id);
      toast.success('Album deleted successfully');
      fetchAlbums();
    } catch (error) {
      toast.error('Failed to delete album');
    }
  };

  const filteredAlbums = albums.filter((album) => {
    const query = searchTerm.toLowerCase();
    return (
      album.albumName.toLowerCase().includes(query) ||
      (album.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-gallery-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Gallery Management</h1>
          <p className="page-subtitle">Create albums and manage photo collections</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Album
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search albums..."
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
            <option value="events">Events</option>
            <option value="sports">Sports</option>
            <option value="social_work">Social Work</option>
            <option value="december_moments">December Moments</option>
            <option value="puja">Puja</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading albums...</p>
          </div>
        ) : filteredAlbums.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Album</th>
                <th>Category</th>
                <th>Date</th>
                <th>Media</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlbums.map((album, index) => (
                <motion.tr
                  key={album._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{album.albumName}</div>
                    {album.description && <div className="event-desc">{album.description}</div>}
                  </td>
                  <td>
                    <span className="badge badge-purple">{(album.category || 'other').replace('_', ' ')}</span>
                  </td>
                  <td>{album.date ? new Date(album.date).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    <span className="meta-inline">
                      <FaImages /> {album.media?.length || 0}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${album.isPublished ? 'badge-success' : 'badge-error'}`}>
                      {album.isPublished ? 'published' : 'draft'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(album)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-secondary"
                        onClick={() => openMediaModal(album)}
                        title="Upload Media"
                      >
                        <FaUpload />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(album._id)}
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
              <FaImages />
            </div>
            <h3>No Albums Found</h3>
            <p>Create an album to showcase your photos.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Album
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
          <h2>{editingAlbum ? 'Edit Album' : 'Add Album'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Album Name *</label>
              <input
                type="text"
                name="albumName"
                className="form-input"
                value={formData.albumName}
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
                <option value="events">Events</option>
                <option value="sports">Sports</option>
                <option value="social_work">Social Work</option>
                <option value="december_moments">December Moments</option>
                <option value="puja">Puja</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="4"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Event Date</label>
              <input
                type="date"
                name="date"
                className="form-input"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image</label>
              <input type="file" accept="image/*" className="form-input" onChange={handleCoverUpload} />
            </div>
          </div>
          {formData.coverImage && (
            <div className="image-preview">
              <img src={formData.coverImage} alt="Cover Preview" />
            </div>
          )}
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
              {editingAlbum ? 'Update Album' : 'Create Album'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={mediaModalOpen}
        onRequestClose={closeMediaModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>Upload Media</h2>
          <button className="modal-close" onClick={closeMediaModal} aria-label="Close">
            x
          </button>
        </div>
        <div className="modal-form">
          <div className="form-group">
            <label className="form-label">Select Images</label>
            <input type="file" accept="image/*" multiple className="form-input" onChange={handleMediaSelection} />
          </div>
          <div className="media-upload-info">
            <p>
              {selectedAlbum ? `Uploading to: ${selectedAlbum.albumName}` : 'Select an album'}
            </p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeMediaModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" onClick={handleMediaUpload}>
              Upload Media
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminGallery;
