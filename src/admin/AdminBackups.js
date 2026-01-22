import React, { useState } from 'react';
import { FaDatabase, FaCloudUploadAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import './AdminBackups.css';

const AdminBackups = () => {
  const [schedule, setSchedule] = useState('weekly');
  const [retention, setRetention] = useState('30');

  const handleBackupNow = () => {
    toast.info('Backup initiation requires server configuration.');
  };

  const handleSaveSchedule = () => {
    toast.success('Backup schedule saved.');
  };

  return (
    <div className="admin-backups-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Backup & Recovery</h1>
          <p className="page-subtitle">Protect data with scheduled backups</p>
        </div>
      </div>

      <div className="backup-grid">
        <div className="backup-card">
          <FaDatabase />
          <h3>Database Backup</h3>
          <p>Manual backup of MongoDB data and critical settings.</p>
          <button className="btn btn-primary" onClick={handleBackupNow}>
            <FaCloudUploadAlt /> Run Backup
          </button>
        </div>

        <div className="backup-card">
          <FaClock />
          <h3>Schedule</h3>
          <p>Set an automatic backup frequency.</p>
          <div className="form-group">
            <label className="form-label">Frequency</label>
            <select
              className="form-select"
              value={schedule}
              onChange={(e) => setSchedule(e.target.value)}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Retention (days)</label>
            <input
              type="number"
              className="form-input"
              value={retention}
              onChange={(e) => setRetention(e.target.value)}
              min="7"
            />
          </div>
          <button className="btn btn-secondary" onClick={handleSaveSchedule}>
            Save Schedule
          </button>
        </div>
      </div>

      <div className="backup-details">
        <h2>Recovery Notes</h2>
        <p>
          Backups include database records and uploaded media. Configure server-side
          storage paths and credentials to enable automated backups.
        </p>
      </div>
    </div>
  );
};

export default AdminBackups;
