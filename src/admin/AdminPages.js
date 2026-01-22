import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaSave, FaTrash } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { pagesAPI, uploadAPI } from '../utils/api';
import './AdminPages.css';

Modal.setAppElement('#root');

const defaultSectionForm = {
  sectionName: '',
  title: '',
  content: '',
  images: '',
  order: 0
};

const AdminPages = ({ defaultPageName = 'home', lockPageSelect = false }) => {
  const [pages, setPages] = useState([]);
  const [selectedPageName, setSelectedPageName] = useState(defaultPageName);
  const [selectedPage, setSelectedPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [sectionForm, setSectionForm] = useState(defaultSectionForm);
  const [seoForm, setSeoForm] = useState({
    title: '',
    description: '',
    keywords: '',
    ogImage: ''
  });

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    setSelectedPageName(defaultPageName);
  }, [defaultPageName]);

  useEffect(() => {
    const page = pages.find((p) => p.pageName === selectedPageName);
    if (page) {
      setSelectedPage(page);
      setSeoForm({
        title: page.seo?.title || '',
        description: page.seo?.description || '',
        keywords: page.seo?.keywords?.join(', ') || '',
        ogImage: page.seo?.ogImage || ''
      });
    } else {
      setSelectedPage({
        pageName: selectedPageName,
        sections: [],
        seo: {}
      });
      setSeoForm({
        title: '',
        description: '',
        keywords: '',
        ogImage: ''
      });
    }
  }, [pages, selectedPageName]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await pagesAPI.getAll();
      setPages(response.data);
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const openSectionModal = (section = null) => {
    setEditingSection(section);
    setSectionForm(
      section
        ? {
            sectionName: section.sectionName || '',
            title: section.title || '',
            content: section.content || '',
            images: section.images?.join(', ') || '',
            order: section.order || 0
          }
        : defaultSectionForm
    );
    setSectionModalOpen(true);
  };

  const closeSectionModal = () => {
    setSectionModalOpen(false);
    setEditingSection(null);
    setSectionForm(defaultSectionForm);
  };

  const handleSectionChange = (e) => {
    const { name, value } = e.target;
    setSectionForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setSectionForm((prev) => {
        const images = prev.images
          ? prev.images.split(',').map((img) => img.trim()).filter(Boolean)
          : [];
        images.push(response.data.url);
        return { ...prev, images: images.join(', ') };
      });
      toast.success('Image uploaded');
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSeoChange = (e) => {
    const { name, value } = e.target;
    setSeoForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSectionSubmit = async (e) => {
    e.preventDefault();
    if (!sectionForm.sectionName.trim()) {
      toast.error('Section name is required');
      return;
    }

    const payload = {
      sectionName: sectionForm.sectionName,
      title: sectionForm.title || undefined,
      content: sectionForm.content || undefined,
      images: sectionForm.images
        ? sectionForm.images.split(',').map((img) => img.trim()).filter(Boolean)
        : [],
      order: Number(sectionForm.order) || 0
    };

    try {
      if (editingSection?._id) {
        await pagesAPI.updateSection(selectedPageName, editingSection._id, payload);
      } else {
        const nextSections = [...(selectedPage?.sections || []), payload];
        await pagesAPI.update(selectedPageName, {
          pageName: selectedPageName,
          sections: nextSections,
          seo: selectedPage?.seo || {}
        });
      }
      toast.success('Section saved successfully');
      closeSectionModal();
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save section');
    }
  };

  const handleSectionDelete = async (section) => {
    if (!section?._id) {
      toast.error('Section not found');
      return;
    }

    if (!window.confirm('Delete this section?')) {
      return;
    }

    try {
      await pagesAPI.deleteSection(selectedPageName, section._id);
      toast.success('Section deleted');
      fetchPages();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete section');
    }
  };

  const handleSeoSave = async () => {
    try {
      await pagesAPI.update(selectedPageName, {
        seo: {
          title: seoForm.title || undefined,
          description: seoForm.description || undefined,
          keywords: seoForm.keywords
            ? seoForm.keywords.split(',').map((word) => word.trim()).filter(Boolean)
            : [],
          ogImage: seoForm.ogImage || undefined
        }
      });
      toast.success('SEO settings saved');
      fetchPages();
    } catch (error) {
      toast.error('Failed to save SEO settings');
    }
  };

  return (
    <div className="admin-pages-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Page Content Management</h1>
          <p className="page-subtitle">Edit static content sections without code</p>
        </div>
      </div>

      <div className="page-select">
        <label className="form-label">Select Page</label>
        <select
          className="form-select"
          value={selectedPageName}
          onChange={(e) => setSelectedPageName(e.target.value)}
          disabled={lockPageSelect}
        >
          <option value="home">Home</option>
          <option value="about">About</option>
          <option value="contact">Contact</option>
          <option value="footer">Footer</option>
        </select>
      </div>

      <div className="page-content-grid">
        <div className="data-table-container">
          <div className="page-sections-header">
            <h2>Sections</h2>
            <button className="btn btn-primary" onClick={() => openSectionModal()}>
              <FaPlus /> Add Section
            </button>
          </div>
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading sections...</p>
            </div>
          ) : selectedPage?.sections?.length ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Section</th>
                  <th>Title</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedPage.sections
                  .sort((a, b) => (a.order || 0) - (b.order || 0))
                  .map((section, index) => (
                    <motion.tr
                      key={section._id || `${section.sectionName}-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td>
                        <div className="event-title">{section.sectionName}</div>
                        <div className="event-desc">{section.content?.substring(0, 80) || 'No content'}</div>
                      </td>
                      <td>{section.title || 'Untitled'}</td>
                      <td>{section.order || 0}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => openSectionModal(section)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleSectionDelete(section)}
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
                <FaEdit />
              </div>
              <h3>No Sections Found</h3>
              <p>Create content sections for this page.</p>
            </div>
          )}
        </div>

        <div className="seo-panel">
          <h2>Page SEO</h2>
          <div className="form-group">
            <label className="form-label">SEO Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={seoForm.title}
              onChange={handleSeoChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Meta Description</label>
            <textarea
              name="description"
              className="form-textarea"
              rows="3"
              value={seoForm.description}
              onChange={handleSeoChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Keywords (comma separated)</label>
            <input
              type="text"
              name="keywords"
              className="form-input"
              value={seoForm.keywords}
              onChange={handleSeoChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Open Graph Image URL</label>
            <input
              type="text"
              name="ogImage"
              className="form-input"
              value={seoForm.ogImage}
              onChange={handleSeoChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSeoSave}>
            <FaSave /> Save SEO
          </button>
        </div>
      </div>

      <Modal
        isOpen={sectionModalOpen}
        onRequestClose={closeSectionModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{editingSection ? 'Edit Section' : 'Add Section'}</h2>
          <button className="modal-close" onClick={closeSectionModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSectionSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Section Name *</label>
              <input
                type="text"
                name="sectionName"
                className="form-input"
                value={sectionForm.sectionName}
                onChange={handleSectionChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Order</label>
              <input
                type="number"
                name="order"
                className="form-input"
                value={sectionForm.order}
                onChange={handleSectionChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-input"
              value={sectionForm.title}
              onChange={handleSectionChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              name="content"
              className="form-textarea"
              rows="6"
              value={sectionForm.content}
              onChange={handleSectionChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Images (comma separated URLs)</label>
            <input
              type="text"
              name="images"
              className="form-input"
              value={sectionForm.images}
              onChange={handleSectionChange}
            />
            <input
              type="file"
              accept="image/*"
              className="form-input"
              onChange={handleSectionImageUpload}
            />
            {sectionForm.images && (
              <div className="image-preview">
                <img
                  src={sectionForm.images.split(',').map((img) => img.trim()).filter(Boolean)[0]}
                  alt="Section Preview"
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeSectionModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Section
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminPages;
