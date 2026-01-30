import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserTie } from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { membersAPI, uploadAPI } from '../utils/api';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './AdminMembers.css';

Modal.setAppElement('#root');

const defaultForm = {
  name: '',
  role: 'member',
  email: '',
  phone: '',
  joinDate: '',
  bio: '',
  achievements: '',
  facebook: '',
  instagram: '',
  twitter: '',
  photo: '',
  isActive: true,
  priority: 0,
  committeeYear: '',
  committeePosition: ''
};

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState(defaultForm);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterStatus !== 'all') params.isActive = filterStatus === 'active';
      const response = await membersAPI.getAll(params);
      setMembers(response.data);
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  }, [filterRole, filterStatus]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const openModal = (member = null) => {
    setEditingMember(member);
    setFormData(
      member
        ? {
            name: member.name || '',
            role: member.role || 'member',
            email: member.email || '',
            phone: member.phone || '',
            joinDate: member.joinDate ? member.joinDate.split('T')[0] : '',
            bio: member.bio || '',
            achievements: member.achievements?.join(', ') || '',
            facebook: member.socialMedia?.facebook || '',
            instagram: member.socialMedia?.instagram || '',
            twitter: member.socialMedia?.twitter || '',
            photo: member.photo || '',
            isActive: member.isActive !== false,
            priority: member.priority || 0,
            committeeYear: member.committee?.year || '',
            committeePosition: member.committee?.position || ''
          }
        : defaultForm
    );
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingMember(null);
    setFormData(defaultForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo size should be less than 5MB');
      return;
    }

    try {
      const response = await uploadAPI.uploadImage(file);
      setFormData((prev) => ({
        ...prev,
        photo: response.data.url
      }));
      toast.success('Photo uploaded');
    } catch (error) {
      toast.error('Failed to upload photo');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Member name is required');
      return;
    }

    const payload = {
      name: formData.name,
      role: formData.role,
      email: formData.email || undefined,
      phone: formData.phone || undefined,
      joinDate: formData.joinDate || undefined,
      bio: formData.bio || undefined,
      achievements: formData.achievements
        ? formData.achievements.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
      socialMedia: {
        facebook: formData.facebook || undefined,
        instagram: formData.instagram || undefined,
        twitter: formData.twitter || undefined
      },
      photo: formData.photo || undefined,
      isActive: formData.isActive,
      priority: Number(formData.priority) || 0,
      committee: formData.committeeYear || formData.committeePosition
        ? {
            year: formData.committeeYear || undefined,
            position: formData.committeePosition || undefined
          }
        : undefined
    };

    try {
      if (editingMember) {
        await membersAPI.update(editingMember._id, payload);
        toast.success('Member updated successfully');
      } else {
        await membersAPI.create(payload);
        toast.success('Member created successfully');
      }
      closeModal();
      fetchMembers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save member');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this member?')) return;
    try {
      await membersAPI.delete(id);
      toast.success('Member deleted successfully');
      fetchMembers();
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const filteredMembers = members.filter((member) => {
    const query = searchTerm.toLowerCase();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-members-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Members & Committee</h1>
          <p className="page-subtitle">Manage member profiles and committee roles</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FaPlus /> Add Member
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search members..."
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
            <option value="president">President</option>
            <option value="vice_president">Vice President</option>
            <option value="secretary">Secretary</option>
            <option value="treasurer">Treasurer</option>
            <option value="sports_head">Sports Head</option>
            <option value="cultural_head">Cultural Head</option>
            <option value="volunteer">Volunteer</option>
            <option value="member">Member</option>
          </select>
          <select
            className="filter-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading members...</p>
          </div>
        ) : filteredMembers.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Role</th>
                <th>Committee</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member, index) => (
                <motion.tr
                  key={member._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <div className="member-row">
                      {member.photo ? (
                        <img src={resolveMediaUrl(member.photo)} alt={member.name} className="member-thumb" />
                      ) : (
                        <div className="member-thumb fallback">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <div className="event-title">{member.name}</div>
                        <div className="event-desc">{member.email || 'No email'}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-blue">{(member.role || 'member').replace('_', ' ')}</span>
                  </td>
                  <td>
                    {member.committee?.year ? (
                      <span className="committee-pill">
                        <FaUserTie /> {member.committee.year}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    <span className={`badge ${member.isActive ? 'badge-success' : 'badge-error'}`}>
                      {member.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon btn-edit"
                        onClick={() => openModal(member)}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => handleDelete(member._id)}
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
              <FaUserTie />
            </div>
            <h3>No Members Found</h3>
            <p>Add your committee and volunteers to get started.</p>
            <button className="btn btn-primary" onClick={() => openModal()}>
              <FaPlus /> Add Member
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
          <h2>{editingMember ? 'Edit Member' : 'Add Member'}</h2>
          <button className="modal-close" onClick={closeModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Role *</label>
              <select
                name="role"
                className="form-select"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="president">President</option>
                <option value="vice_president">Vice President</option>
                <option value="secretary">Secretary</option>
                <option value="treasurer">Treasurer</option>
                <option value="sports_head">Sports Head</option>
                <option value="cultural_head">Cultural Head</option>
                <option value="volunteer">Volunteer</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Join Date</label>
              <input
                type="date"
                name="joinDate"
                className="form-input"
                value={formData.joinDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <input
                type="number"
                name="priority"
                className="form-input"
                value={formData.priority}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Bio</label>
            <textarea
              name="bio"
              className="form-textarea"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Achievements (comma separated)</label>
            <input
              type="text"
              name="achievements"
              className="form-input"
              value={formData.achievements}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Committee Year</label>
              <input
                type="number"
                name="committeeYear"
                className="form-input"
                value={formData.committeeYear}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Committee Position</label>
              <input
                type="text"
                name="committeePosition"
                className="form-input"
                value={formData.committeePosition}
                onChange={handleChange}
              />
            </div>
          </div>
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
          <div className="form-group">
            <label className="form-label">Profile Photo</label>
            <input type="file" accept="image/*" className="form-input" onChange={handlePhotoUpload} />
            {formData.photo && (
              <div className="image-preview">
                <img src={resolveMediaUrl(formData.photo)} alt="Profile Preview" />
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
              Active member
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingMember ? 'Update Member' : 'Create Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminMembers;
