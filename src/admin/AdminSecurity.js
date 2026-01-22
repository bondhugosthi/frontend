import React, { useEffect, useState } from 'react';
import { FaShieldAlt, FaLock, FaServer, FaUserShield } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { dashboardAPI } from '../utils/api';
import './AdminSecurity.css';

const AdminSecurity = () => {
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const response = await dashboardAPI.getHealth();
      setHealth(response.data);
    } catch (error) {
      toast.error('Failed to load system health');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner"></div>
        <p>Loading security status...</p>
      </div>
    );
  }

  return (
    <div className="admin-security-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Security & Validation</h1>
          <p className="page-subtitle">Monitor protection layers and system health</p>
        </div>
      </div>

      <div className="security-grid">
        <div className="security-card">
          <FaShieldAlt />
          <h3>CSRF Protection</h3>
          <p>Enabled in backend middleware</p>
        </div>
        <div className="security-card">
          <FaLock />
          <h3>Rate Limiting</h3>
          <p>Login and form endpoints protected</p>
        </div>
        <div className="security-card">
          <FaUserShield />
          <h3>Role-based Access</h3>
          <p>Admin permissions enforced by role</p>
        </div>
        <div className="security-card">
          <FaServer />
          <h3>System Health</h3>
          <p>Status: {health?.status || 'unknown'}</p>
          <p>Database: {health?.database || 'unknown'}</p>
          <p>Uptime: {health?.uptime || 0}s</p>
        </div>
      </div>

      <div className="security-details">
        <h2>Validation Rules</h2>
        <ul>
          <li>Required fields enforced for critical forms.</li>
          <li>Image uploads restricted by file size and type.</li>
          <li>Auto-logout on session expiration.</li>
          <li>Activity logs recorded for all admin actions.</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSecurity;
