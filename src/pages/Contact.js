import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { contactAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'general',
    message: ''
  });
  const [loading, setLoading] = useState(false);

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
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: 'general',
        message: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email',
      value: 'bondhugosthi2010@gmail.com',
      link: 'mailto:bondhugosthi2010@gmail.com'
    },
    {
      icon: <FaPhone />,
      title: 'Phone',
      value: '+91 6295221588',
      link: 'tel:+916295221588'
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Location',
      value: 'Dulal Pur & Fazel Pur, Purba Mednipur, West Bengal, India, 721454',
      link: 'https://www.google.com/maps?q=721454'
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
        title="Get In Touch"
        subtitle="We'd love to hear from you. Send us a message and we'll respond as soon as possible."
        breadcrumbs={['Home', 'Contact']}
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
                <h2 className="form-title">Send Us a Message</h2>
                <p className="form-subtitle">
                  Fill out the form below and we'll get back to you as soon as possible.
                </p>

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name" className="form-label">Full Name *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email" className="form-label">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="form-input"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="category" className="form-label">Category *</label>
                      <select
                        id="category"
                        name="category"
                        className="form-select"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="general">General Inquiry</option>
                        <option value="event">Event Related</option>
                        <option value="membership">Membership</option>
                        <option value="complaint">Complaint</option>
                        <option value="suggestion">Suggestion</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject" className="form-label">Subject *</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      className="form-input"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      placeholder="What is this regarding?"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message *</label>
                    <textarea
                      id="message"
                      name="message"
                      className="form-textarea"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Write your message here..."
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg btn-block"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Message'}
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
                <h3 className="social-title">Follow Us</h3>
                <p className="social-subtitle">Stay connected on social media</p>
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

              {/* Map */}
              <div className="map-section">
                <h3 className="map-title">Find Us</h3>
                <div className="map-container">
                  <iframe
                    src="https://www.google.com/maps?q=721454&output=embed"
                    width="100%"
                    height="300"
                    style={{ border: 0, borderRadius: 'var(--radius-lg)' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Bondhu Gosthi Location"
                  ></iframe>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
