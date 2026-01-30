import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaImages } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { sliderImagesAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminSliderImages.css';

Modal.setAppElement('#root');

const defaultForm = {
  title: '',
  imageUrl: '',
  isActive: true
};

const AdminSliderImages = () => {
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchSliderImages();
  }, []);

  const fetchSliderImages = async () => {
    setLoading(true);
    try {
      const response = await sliderImagesAPI.getAll();
      setSliderImages(response.data || []);
    } catch (error) {
      toast.error('Failed to load slider images');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (image = null) => {
    setEditingImage(image);
    setFormData(
      image
        ? {
            title: image.title || '',
            imageUrl: image.imageUrl || '',
            isActive: image.isActive !== false
          }
        : defaultForm
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingImage(null);
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
        imageUrl: response.data.url
      }));
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.imageUrl) {
      toast.error('Please upload an image');
      return;
    }

    const payload = {
      title: formData.title || undefined,
      imageUrl: formData.imageUrl,
      isActive: formData.isActive
    };

    try {
      if (editingImage) {
        await sliderImagesAPI.update(editingImage._id, payload);
        toast.success('Slider image updated');
      } else {
        await sliderImagesAPI.create(payload);
        toast.success('Slider image created');
      }
      closeModal();
      fetchSliderImages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save slider image');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this slider image?')) return;
    try {
      await sliderImagesAPI.delete(id);
      toast.success('Slider image deleted');
      fetchSliderImages();
    } catch (error) {
      toast.error('Failed to delete slider image');
    }
  };

  return (
    <div className="admin-slider-images-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Slider Images</h1>
          <p className="page-subtitle">Upload hero slider images (latest 3 active images show on the website)</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Image
        </button>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading slider images...</p>
          </div>
        ) : sliderImages.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sliderImages.map((image, index) => (
                <motion.tr
                  key={image._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    {image.imageUrl ? (
                      <img className="slider-image-thumb" src={resolveMediaUrl(image.imageUrl)} alt={image.title || 'Slider'} />
                    ) : (
                      <div className="slider-image-placeholder">
                        <FaImages />
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="event-title">{image.title || 'Untitled'}</div>
                  </td>
                  <td>
                    <span className={`badge ${image.isActive ? 'badge-success' : 'badge-error'}`}>
                      {image.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>{new Date(image.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(image)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(image._id)}
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
            <h3>No Slider Images</h3>
            <p>Upload images to show in the homepage hero slider.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Image
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
          <h2>{editingImage ? 'Edit Slider Image' : 'Add Slider Image'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Title (optional)</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={formData.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Image *</label>
            <input type="file" accept="image/*" className="form-input" onChange={handleImageUpload} />
            {formData.imageUrl && (
              <div className="image-preview">
                <img src={resolveMediaUrl(formData.imageUrl)} alt="Preview" />
              </div>
            )}
          </div>
          <div className="form-row">
            <label className="form-label checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Show on website
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingImage ? 'Update Image' : 'Add Image'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSliderImages;
