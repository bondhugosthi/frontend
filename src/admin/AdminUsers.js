import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaKey, FaSearch, FaUserShield } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { adminsAPI } from '../utils/api';
import './AdminUsers.css';

Modal.setAppElement('#root');

const defaultForm = {
  email: '',
  password: '',
  role: 'super_admin',
  isActive: true
};

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    fetchAdmins();
  }, [filterRole]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminsAPI.getAll();
      setAdmins(response.data);
    } catch (error) {
      toast.error('Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (admin = null) => {
    setEditingAdmin(admin);
    setFormData(
      admin
        ? {
            email: admin.email || '',
            password: '',
            role: admin.role || 'super_admin',
            isActive: admin.isActive !== false
          }
        : defaultForm
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingAdmin(null);
    setFormData(defaultForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    try {
      if (editingAdmin) {
        await adminsAPI.update(editingAdmin._id, {
          email: formData.email,
          role: formData.role,
          isActive: formData.isActive
        });

        if (formData.password) {
          await adminsAPI.resetPassword(editingAdmin._id, formData.password);
        }

        toast.success('Admin updated successfully');
      } else {
        if (!formData.password) {
          toast.error('Password is required for new admin');
          return;
        }
        await adminsAPI.create({
          email: formData.email,
          password: formData.password,
          role: formData.role,
          isActive: formData.isActive
        });
        toast.success('Admin created successfully');
      }
      closeModal();
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save admin');
    }
  };

  const filteredAdmins = admins.filter((admin) => {
    const query = searchTerm.toLowerCase();
    const matchesRole = filterRole === 'all' || admin.role === filterRole;
    return admin.email.toLowerCase().includes(query) && matchesRole;
  });

  return (
    <div className="admin-users-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Access & Roles</h1>
          <p className="page-subtitle">Create admins and assign permissions</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Admin
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search admins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="super_admin">Super Admin</option>
            <option value="content_manager">Content Manager</option>
            <option value="event_manager">Event Manager</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading admins...</p>
          </div>
        ) : filteredAdmins.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin, index) => (
                <motion.tr
                  key={admin._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="event-title">{admin.email}</div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{(admin.role || 'super_admin').replace('_', ' ')}</span>
                  </td>
                  <td>
                    <span className={`badge ${admin.isActive ? 'badge-success' : 'badge-error'}`}>
                      {admin.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>{admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(admin)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-secondary"
                        onClick={() => openModal(admin)}
                        title="Reset Password"
                      >
                        <FaKey />
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
              <FaUserShield />
            </div>
            <h3>No Admins Found</h3>
            <p>Create admin accounts to manage the portal.</p>
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
          <h2>{editingAdmin ? 'Edit Admin' : 'Add Admin'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Email *</label>
            <input
              type="email"
              name="email"
              className="form-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">
              {editingAdmin ? 'Reset Password (optional)' : 'Password *'}
            </label>
            <input
              type="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder={editingAdmin ? 'Leave blank to keep current' : ''}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="super_admin">Super Admin</option>
                <option value="content_manager">Content Manager</option>
                <option value="event_manager">Event Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label checkbox-row">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active account
              </label>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingAdmin ? 'Update Admin' : 'Create Admin'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminUsers;
