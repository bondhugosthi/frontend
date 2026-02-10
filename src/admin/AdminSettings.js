import React, { useEffect, useState } from 'react';
import { FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { settingsAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminSettings.css';

const defaultBusinessHours = [
  { day: 'Monday', open: '', close: '', isClosed: false },
  { day: 'Tuesday', open: '', close: '', isClosed: false },
  { day: 'Wednesday', open: '', close: '', isClosed: false },
  { day: 'Thursday', open: '', close: '', isClosed: false },
  { day: 'Friday', open: '', close: '', isClosed: false },
  { day: 'Saturday', open: '', close: '', isClosed: false },
  { day: 'Sunday', open: '', close: '', isClosed: false }
];

const normalizeBusinessHours = (value) => {
  const items = Array.isArray(value) ? value : [];
  const map = new Map(items.map((item) => [item.day, item]));
  return defaultBusinessHours.map((day) => ({
    ...day,
    ...map.get(day.day)
  }));
};

const defaultForm = {
  websiteName: '',
  tagline: '',
  logo: '',
  favicon: '',
  contactEmail: '',
  contactPhone: '',
  contactAddress: '',
  mapLink: '',
  mapEmbedLink: '',
  brochureUrl: '',
  brochureLabel: '',
  ctaTitle: '',
  ctaDescription: '',
  ctaPrimaryLabel: '',
  ctaPrimaryLink: '',
  ctaSecondaryLabel: '',
  ctaSecondaryLink: '',
  businessHours: defaultBusinessHours,
  facebook: '',
  instagram: '',
  twitter: '',
  youtube: '',
  linkedin: '',
  maintenanceEnabled: false,
  maintenanceMessage: '',
  googleAnalyticsId: '',
  facebookPixelId: ''
};

const AdminSettings = () => {
  const [formData, setFormData] = useState(defaultForm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsAPI.get();
      const settings = response.data;
      setFormData({
        websiteName: settings.websiteName || '',
        tagline: settings.tagline || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
        contactEmail: settings.contactDetails?.email || '',
        contactPhone: settings.contactDetails?.phone || '',
        contactAddress: settings.contactDetails?.address || '',
        mapLink: settings.contactDetails?.mapLink || '',
        mapEmbedLink: settings.contactDetails?.mapEmbedLink || '',
        brochureUrl: settings.brochureUrl || '',
        brochureLabel: settings.brochureLabel || '',
        ctaTitle: settings.cta?.title || '',
        ctaDescription: settings.cta?.description || '',
        ctaPrimaryLabel: settings.cta?.primaryLabel || '',
        ctaPrimaryLink: settings.cta?.primaryLink || '',
        ctaSecondaryLabel: settings.cta?.secondaryLabel || '',
        ctaSecondaryLink: settings.cta?.secondaryLink || '',
        businessHours: normalizeBusinessHours(settings.businessHours),
        facebook: settings.socialMedia?.facebook || '',
        instagram: settings.socialMedia?.instagram || '',
        twitter: settings.socialMedia?.twitter || '',
        youtube: settings.socialMedia?.youtube || '',
        linkedin: settings.socialMedia?.linkedin || '',
        maintenanceEnabled: settings.maintenance?.isEnabled || false,
        maintenanceMessage: settings.maintenance?.message || '',
        googleAnalyticsId: settings.analytics?.googleAnalyticsId || '',
        facebookPixelId: settings.analytics?.facebookPixelId || ''
      });
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleBusinessHourChange = (index, field, value) => {
    setFormData((prev) => {
      const nextHours = prev.businessHours.map((item, idx) => {
        if (idx !== index) return item;
        return {
          ...item,
          [field]: field === 'isClosed' ? value : value
        };
      });
      return { ...prev, businessHours: nextHours };
    });
  };

  const handleUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        [field]: response.data.url
      }));
      toast.success('File uploaded');
    } catch (error) {
      toast.error('Failed to upload file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      websiteName: formData.websiteName,
      tagline: formData.tagline,
      logo: formData.logo || undefined,
      favicon: formData.favicon || undefined,
      contactDetails: {
        email: formData.contactEmail || undefined,
        phone: formData.contactPhone || undefined,
        address: formData.contactAddress || undefined,
        mapLink: formData.mapLink || undefined,
        mapEmbedLink: formData.mapEmbedLink || undefined
      },
      brochureUrl: formData.brochureUrl || undefined,
      brochureLabel: formData.brochureLabel || undefined,
      cta: {
        title: formData.ctaTitle || undefined,
        description: formData.ctaDescription || undefined,
        primaryLabel: formData.ctaPrimaryLabel || undefined,
        primaryLink: formData.ctaPrimaryLink || undefined,
        secondaryLabel: formData.ctaSecondaryLabel || undefined,
        secondaryLink: formData.ctaSecondaryLink || undefined
      },
      businessHours: formData.businessHours || [],
      socialMedia: {
        facebook: formData.facebook || undefined,
        instagram: formData.instagram || undefined,
        twitter: formData.twitter || undefined,
        youtube: formData.youtube || undefined,
        linkedin: formData.linkedin || undefined
      },
      maintenance: {
        isEnabled: formData.maintenanceEnabled,
        message: formData.maintenanceMessage || undefined
      },
      analytics: {
        googleAnalyticsId: formData.googleAnalyticsId || undefined,
        facebookPixelId: formData.facebookPixelId || undefined
      }
    };

    try {
      await settingsAPI.update(payload);
      toast.success('Settings saved successfully');
      fetchSettings();
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="admin-settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Website Settings</h1>
          <p className="page-subtitle">Update branding and contact information</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        <div className="settings-section">
          <h2>Branding</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Website Name</label>
              <input
                type="text"
                name="websiteName"
                className="form-input"
                value={formData.websiteName}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tagline</label>
              <input
                type="text"
                name="tagline"
                className="form-input"
                value={formData.tagline}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Logo</label>
              <input type="file" accept="image/*" className="form-input" onChange={(e) => handleUpload(e, 'logo')} />
              {formData.logo && (
                <div className="image-preview">
                  <img
                    src={resolveMediaUrl(formData.logo)}
                    alt="Logo Preview"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </div>
            <div className="form-group">
              <label className="form-label">Favicon</label>
              <input type="file" accept="image/*" className="form-input" onChange={(e) => handleUpload(e, 'favicon')} />
              {formData.favicon && (
                <div className="image-preview">
                  <img
                    src={resolveMediaUrl(formData.favicon)}
                    alt="Favicon Preview"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Contact Details</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="contactEmail"
                className="form-input"
                value={formData.contactEmail}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="contactPhone"
                className="form-input"
                value={formData.contactPhone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="contactAddress"
              className="form-textarea"
              rows="2"
              value={formData.contactAddress}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Map Link</label>
            <input
              type="text"
              name="mapLink"
              className="form-input"
              value={formData.mapLink}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Map Embed Link</label>
            <input
              type="text"
              name="mapEmbedLink"
              className="form-input"
              value={formData.mapEmbedLink}
              onChange={handleChange}
              placeholder="Paste Google Maps embed URL (Share → Embed a map)"
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Business Hours</h2>
          <div className="business-hours-grid">
            {formData.businessHours.map((item, index) => (
              <div key={item.day} className="business-hour-row">
                <div className="business-day">{item.day}</div>
                <label className="checkbox-row">
                  <input
                    type="checkbox"
                    checked={item.isClosed}
                    onChange={(e) => handleBusinessHourChange(index, 'isClosed', e.target.checked)}
                  />
                  Closed
                </label>
                <input
                  type="time"
                  className="form-input"
                  value={item.open || ''}
                  onChange={(e) => handleBusinessHourChange(index, 'open', e.target.value)}
                  disabled={item.isClosed}
                />
                <span className="time-separator">to</span>
                <input
                  type="time"
                  className="form-input"
                  value={item.close || ''}
                  onChange={(e) => handleBusinessHourChange(index, 'close', e.target.value)}
                  disabled={item.isClosed}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="settings-section">
          <h2>Brochure</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Brochure Label</label>
              <input
                type="text"
                name="brochureLabel"
                className="form-input"
                value={formData.brochureLabel}
                onChange={handleChange}
                placeholder="Download Club Brochure"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Brochure URL</label>
              <input
                type="url"
                name="brochureUrl"
                className="form-input"
                value={formData.brochureUrl}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Global Call To Action</h2>
          <div className="form-group">
            <label className="form-label">CTA Title</label>
            <input
              type="text"
              name="ctaTitle"
              className="form-input"
              value={formData.ctaTitle}
              onChange={handleChange}
              placeholder="Join Our Community"
            />
          </div>
          <div className="form-group">
            <label className="form-label">CTA Description</label>
            <textarea
              name="ctaDescription"
              className="form-textarea"
              rows="3"
              value={formData.ctaDescription}
              onChange={handleChange}
              placeholder="Invite visitors to connect, volunteer, or attend."
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Primary Button Label</label>
              <input
                type="text"
                name="ctaPrimaryLabel"
                className="form-input"
                value={formData.ctaPrimaryLabel}
                onChange={handleChange}
                placeholder="Get in Touch"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Primary Button Link</label>
              <input
                type="text"
                name="ctaPrimaryLink"
                className="form-input"
                value={formData.ctaPrimaryLink}
                onChange={handleChange}
                placeholder="/contact"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Secondary Button Label</label>
              <input
                type="text"
                name="ctaSecondaryLabel"
                className="form-input"
                value={formData.ctaSecondaryLabel}
                onChange={handleChange}
                placeholder="View Events"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Secondary Button Link</label>
              <input
                type="text"
                name="ctaSecondaryLink"
                className="form-input"
                value={formData.ctaSecondaryLink}
                onChange={handleChange}
                placeholder="/events"
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Social Media</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Facebook</label>
              <input
                type="url"
                name="facebook"
                className="form-input"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Instagram</label>
              <input
                type="url"
                name="instagram"
                className="form-input"
                value={formData.instagram}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Twitter</label>
              <input
                type="url"
                name="twitter"
                className="form-input"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">YouTube</label>
              <input
                type="url"
                name="youtube"
                className="form-input"
                value={formData.youtube}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">LinkedIn</label>
              <input
                type="url"
                name="linkedin"
                className="form-input"
                value={formData.linkedin}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Maintenance</h2>
          <label className="form-label checkbox-row">
            <input
              type="checkbox"
              name="maintenanceEnabled"
              checked={formData.maintenanceEnabled}
              onChange={handleChange}
            />
            Enable maintenance mode
          </label>
          <div className="form-group">
            <label className="form-label">Maintenance Message</label>
            <input
              type="text"
              name="maintenanceMessage"
              className="form-input"
              value={formData.maintenanceMessage}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Analytics</h2>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Google Analytics ID</label>
              <input
                type="text"
                name="googleAnalyticsId"
                className="form-input"
                value={formData.googleAnalyticsId}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Facebook Pixel ID</label>
              <input
                type="text"
                name="facebookPixelId"
                className="form-input"
                value={formData.facebookPixelId}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="btn btn-primary save-settings">
          <FaSave /> Save Settings
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;
