import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaReply, FaTrash, FaSearch } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { contactAPI } from '../utils/api';
import './AdminContact.css';

Modal.setAppElement('#root');

const AdminContact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  useEffect(() => {
    fetchMessages();
  }, [filterStatus, filterCategory]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterCategory !== 'all') params.category = filterCategory;
      const response = await contactAPI.getAll(params);
      setMessages(response.data);
    } catch (error) {
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const openMessage = async (message) => {
    try {
      const response = await contactAPI.getById(message._id);
      setSelectedMessage(response.data);
      setReplyText(response.data.reply?.message || '');
      setModalOpen(true);
    } catch (error) {
      toast.error('Failed to load message');
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedMessage(null);
    setReplyText('');
  };

  const handleReply = async () => {
    if (!selectedMessage) return;
    if (!replyText.trim()) {
      toast.error('Reply message is required');
      return;
    }

    try {
      await contactAPI.reply(selectedMessage._id, replyText);
      toast.success('Reply sent successfully');
      closeModal();
      fetchMessages();
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await contactAPI.updateStatus(id, status);
      toast.success('Status updated');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await contactAPI.delete(id);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((message) => {
    const query = searchTerm.toLowerCase();
    return (
      message.name.toLowerCase().includes(query) ||
      message.email.toLowerCase().includes(query) ||
      message.subject.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-contact-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Contact Messages</h1>
          <p className="page-subtitle">Manage inquiries and replies</p>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search messages..."
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
            <option value="new">New</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
            <option value="archived">Archived</option>
          </select>
          <select
            className="filter-select"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="general">General</option>
            <option value="event">Event</option>
            <option value="membership">Membership</option>
            <option value="complaint">Complaint</option>
            <option value="suggestion">Suggestion</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading messages...</p>
          </div>
        ) : filteredMessages.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Status</th>
                <th>Received</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((message, index) => (
                <motion.tr
                  key={message._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{message.name}</div>
                    <div className="event-desc">{message.email}</div>
                  </td>
                  <td>{message.subject}</td>
                  <td>
                    <span className="badge badge-blue">{message.category}</span>
                  </td>
                  <td>
                    <span className={`badge badge-${message.status}`}>{message.status}</span>
                  </td>
                  <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openMessage(message)}
                        title="View & Reply"
                      >
                        <FaReply />
                      </button>
                      <button
                        className="btn-icon btn-secondary"
                        onClick={() => handleStatusUpdate(message._id, 'archived')}
                        title="Archive"
                      >
                        <FaEnvelope />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(message._id)}
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
              <FaEnvelope />
            </div>
            <h3>No Messages Found</h3>
            <p>Incoming messages will appear here.</p>
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
          <h2>Message Details</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        {selectedMessage && (
          <div className="modal-form">
            <div className="message-details">
              <div>
                <strong>Name:</strong> {selectedMessage.name}
              </div>
              <div>
                <strong>Email:</strong> {selectedMessage.email}
              </div>
              <div>
                <strong>Phone:</strong> {selectedMessage.phone || 'N/A'}
              </div>
              <div>
                <strong>Category:</strong> {selectedMessage.category}
              </div>
              <div>
                <strong>Subject:</strong> {selectedMessage.subject}
              </div>
              <div className="message-body">
                <strong>Message:</strong>
                <p>{selectedMessage.message}</p>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Reply</label>
              <textarea
                className="form-textarea"
                rows="4"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleReply}>
                Send Reply
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminContact;
