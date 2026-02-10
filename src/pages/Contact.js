import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { contactAPI, settingsAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import usePageSeo from '../utils/usePageSeo';
import './Contact.css';

const Contact = () => {
  const { t } = useTranslation();
  usePageSeo({ pageName: 'contact' });
  const [siteSettings, setSiteSettings] = useState({
    contactDetails: {
      email: 'bondhugosthi2010@gmail.com',
      phone: '+91 6295221588',
      address: 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454',
      mapLink: 'https://www.google.com/maps?q=721454',
      mapEmbedLink: ''
    },
    businessHours: [],
    brochureUrl: '',
    brochureLabel: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    settingsAPI.get()
      .then((response) => {
        if (!isMounted) {
          return;
        }
        const settings = response.data || {};
        setSiteSettings({
          contactDetails: {
            email: settings.contactDetails?.email || 'bondhugosthi2010@gmail.com',
            phone: settings.contactDetails?.phone || '+91 6295221588',
            address: settings.contactDetails?.address || 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454',
            mapLink: settings.contactDetails?.mapLink || 'https://www.google.com/maps?q=721454',
            mapEmbedLink: settings.contactDetails?.mapEmbedLink || ''
          },
          businessHours: settings.businessHours || [],
          brochureUrl: settings.brochureUrl || '',
          brochureLabel: settings.brochureLabel || ''
        });
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await contactAPI.create(formData);
      toast.success(t('contact.toastSuccess'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || t('contact.toastError'));
    } finally {
      setLoading(false);
    }
  };

  const contactDetails = {
    email: siteSettings.contactDetails?.email || 'bondhugosthi2010@gmail.com',
    phoneDisplay: siteSettings.contactDetails?.phone || '+91 6295221588',
    phoneLink: `tel:${(siteSettings.contactDetails?.phone || '+916295221588').replace(/\s+/g, '')}`,
    location: siteSettings.contactDetails?.address || 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454',
    mapLink: siteSettings.contactDetails?.mapLink || 'https://www.google.com/maps?q=721454',
    mapEmbedLink: siteSettings.contactDetails?.mapEmbedLink || ''
  };

  const mapEmbedUrl = (() => {
    const normalizeHttps = (value) => (value ? value.replace(/^http:\/\//i, 'https://') : '');
    const embedLink = normalizeHttps(contactDetails.mapEmbedLink || '');
    if (embedLink) {
      return embedLink;
    }

    const link = normalizeHttps(contactDetails.mapLink || '');
    if (link.includes('google.com/maps/embed')) {
      return link;
    }
    if (link.includes('google.com/maps')) {
      if (link.includes('output=embed')) {
        return link;
      }
      return link.includes('?') ? `${link}&output=embed` : `${link}?output=embed`;
    }

    const query = encodeURIComponent(contactDetails.location || 'Dulalpur, Egra, West Bengal 721454');
    return `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  })();

  const businessHours = Array.isArray(siteSettings.businessHours)
    ? siteSettings.businessHours
    : [];

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: t('contact.contactInfo.email'),
      value: contactDetails.email,
      link: `mailto:${contactDetails.email}`
    },
    {
      icon: <FaPhone />,
      title: t('contact.contactInfo.phone'),
      value: contactDetails.phoneDisplay,
      link: contactDetails.phoneLink
    },
    {
      icon: <FaMapMarkerAlt />,
      title: t('contact.contactInfo.location'),
      value: contactDetails.location,
      link: contactDetails.mapLink
    }
  ];

  const socialLinks = [
    {
      icon: <FaFacebook />,
      name: 'Facebook',
      link: 'https://www.facebook.com/people/Bondhu-Gosthi/61582556837398/?rdid=E4gdSHsB06Cqk1qW&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1ScUAv9WJ2%2F'
    },
    { icon: <FaInstagram />, name: 'Instagram', link: 'https://www.instagram.com/bondhu.gosthi/' },
    { icon: <FaYoutube />, name: 'YouTube', link: 'https://www.youtube.com/@BondhuGosthi' }
  ];

  return (
    <div className="contact-page">
      <PageHeader
      title={t('contact.pageTitle')}
      subtitle={t('contact.pageSubtitle')}
      breadcrumbs={[t('nav.home'), t('nav.contact')]}
    />

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            {/* Contact Form */}
            <motion.div
              className="contact-form-section"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="form-card">
                <h2 className="form-title">{t('contact.sendMessageTitle')}</h2>
                <p className="form-subtitle">
                  {t('contact.sendMessageSubtitle')}
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">{t('contact.fullName')}</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.namePlaceholder')}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">{t('contact.emailAddress')}</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder={t('contact.emailPlaceholder')}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">{t('contact.phoneNumber')}</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('contact.phonePlaceholder')}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category" className="form-label">{t('contact.category')}</label>
                      <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="general">{t('contact.categoryOptions.general')}</option>
                        <option value="event">{t('contact.categoryOptions.event')}</option>
                        <option value="membership">{t('contact.categoryOptions.membership')}</option>
                        <option value="complaint">{t('contact.categoryOptions.complaint')}</option>
                        <option value="suggestion">{t('contact.categoryOptions.suggestion')}</option>
                        <option value="other">{t('contact.categoryOptions.other')}</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">{t('contact.subject')}</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-input"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.subjectPlaceholder')}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">{t('contact.message')}</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder={t('contact.messagePlaceholder')}
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg btn-block"
                    disabled={loading}
                  >
                    {loading ? t('common.sending') : t('common.sendMessage')}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              className="contact-info-section"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Contact Cards */}
              <div className="info-cards">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={index}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="info-card"
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="info-icon">{info.icon}</div>
                    <div className="info-content">
                      <h3 className="info-title">{info.title}</h3>
                      <p className="info-value">{info.value}</p>
                    </div>
                  </motion.a>
                ))}
              </div>

              {/* Social Links */}
              <div className="social-section">
                <h3 className="social-title">{t('common.followUs')}</h3>
                <p className="social-subtitle">{t('common.stayConnected')}</p>
                <div className="social-links">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-link-large"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {social.icon}
                      <span>{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Business Hours */}
              {businessHours.length > 0 && (
                <div className="hours-section">
                  <h3 className="hours-title">Business Hours</h3>
                  <ul className="hours-list">
                    {businessHours.map((item) => (
                      <li key={item.day} className="hours-row">
                        <span className="hours-day">{item.day}</span>
                        <span className="hours-time">
                          {item.isClosed ? 'Closed' : `${item.open || '--:--'} - ${item.close || '--:--'}`}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {siteSettings.brochureUrl && (
                    <a
                      href={siteSettings.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline hours-brochure"
                    >
                      {siteSettings.brochureLabel || 'Download Brochure'}
                    </a>
                  )}
                </div>
              )}
            </motion.div>
          </div>

          {/* Map */}
          <motion.div
            className="map-section map-section-wide"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="map-header">
              <h3 className="map-title">{t('common.findUs')}</h3>
              <p className="map-subtitle">
                Visit our clubhouse in Purba Mednipur or use Google Maps to plan your route.
              </p>
            </div>
            <div className="map-card">
              <div className="map-container">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: 'var(--radius-lg)', height: '100%' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bondhu Gosthi Location"
                ></iframe>
              </div>
              <div className="map-image-card">
                <span className="map-badge">Google Map</span>
                <img
                  src="/images/Gmap.png"
                  alt="Bondhu Gosthi location map"
                  loading="lazy"
                  decoding="async"
                />
                <p className="map-caption">
                  Scan the QR code to open directions on your phone.
                </p>
              </div>
            </div>
            <div className="map-actions">
              <a
                href={contactDetails.mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Get Directions
              </a>
              <a href={contactDetails.phoneLink} className="btn btn-outline">
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
