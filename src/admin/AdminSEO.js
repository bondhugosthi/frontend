import React, { useEffect, useMemo, useState } from 'react';
import { FaSave, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { settingsAPI } from '../utils/api';
import './AdminSEO.css';

const AdminSEO = () => {
  const [formData, setFormData] = useState({
    defaultTitle: '',
    defaultDescription: '',
    defaultKeywords: '',
    ogImage: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSEO();
  }, []);

  const fetchSEO = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.get();
      const seo = response.data.seo || {};
      setFormData({
        defaultTitle: seo.defaultTitle || '',
        defaultDescription: seo.defaultDescription || '',
        defaultKeywords: seo.defaultKeywords?.join(', ') || '',
        ogImage: seo.ogImage || ''
      });
    } catch (error) {
      toast.error('Failed to load SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    const payload = {
      defaultTitle: formData.defaultTitle || undefined,
      defaultDescription: formData.defaultDescription || undefined,
      defaultKeywords: formData.defaultKeywords
        ? formData.defaultKeywords.split(',').map((word) => word.trim()).filter(Boolean)
        : [],
      ogImage: formData.ogImage || undefined
    };

    try {
      await settingsAPI.updateSEO(payload);
      toast.success('SEO settings updated');
      fetchSEO();
    } catch (error) {
      toast.error('Failed to update SEO settings');
    }
  };

  const seoStatus = useMemo(() => {
    const titleLength = formData.defaultTitle.length;
    const descLength = formData.defaultDescription.length;
    const hasImage = Boolean(formData.ogImage);

    let score = 0;
    if (titleLength >= 30 && titleLength <= 60) score += 40;
    else if (titleLength > 0) score += 20;
    if (descLength >= 70 && descLength <= 160) score += 40;
    else if (descLength > 0) score += 20;
    if (hasImage) score += 20;

    return {
      score,
      status: score >= 80 ? 'good' : score >= 50 ? 'average' : 'poor'
    };
  }, [formData]);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading SEO settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-seo-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">SEO & Metadata</h1>
          <p className="page-subtitle">Optimize search visibility and social previews</p>
        </div>
      </div>

      <div className="seo-grid">
        <div className="seo-form">
          <div className="form-group">
            <label className="form-label">Default Page Title</label>
            <input
              type="text"
              name="defaultTitle"
              className="form-input"
              value={formData.defaultTitle}
              onChange={handleChange}
              placeholder="Bondhu Gosthi Club"
            />
            <small className="helper-text">Recommended 30-60 characters</small>
          </div>
          <div className="form-group">
            <label className="form-label">Default Meta Description</label>
            <textarea
              name="defaultDescription"
              className="form-textarea"
              rows="4"
              value={formData.defaultDescription}
              onChange={handleChange}
              placeholder="Short description for search engines"
            />
            <small className="helper-text">Recommended 70-160 characters</small>
          </div>
          <div className="form-group">
            <label className="form-label">Default Keywords (comma separated)</label>
            <input
              type="text"
              name="defaultKeywords"
              className="form-input"
              value={formData.defaultKeywords}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Open Graph Image URL</label>
            <input
              type="text"
              name="ogImage"
              className="form-input"
              value={formData.ogImage}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            <FaSave /> Save SEO Settings
          </button>
        </div>

        <div className="seo-score-card">
          <h2>SEO Score</h2>
          <div className={`score-badge score-${seoStatus.status}`}>
            {seoStatus.score}
          </div>
          <div className="score-status">
            {seoStatus.status === 'good' ? (
              <span className="status-good">
                <FaCheckCircle /> Great metadata coverage
              </span>
            ) : (
              <span className="status-warning">
                <FaExclamationTriangle /> Improve title or description length
              </span>
            )}
          </div>
          <div className="score-list">
            <p>Title length: {formData.defaultTitle.length} chars</p>
            <p>Description length: {formData.defaultDescription.length} chars</p>
            <p>Open Graph image: {formData.ogImage ? 'set' : 'missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSEO;
