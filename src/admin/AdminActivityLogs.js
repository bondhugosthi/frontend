import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaChartBar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { activityLogsAPI } from '../utils/api';
import './AdminActivityLogs.css';

const AdminActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    module: 'all',
    action: 'all',
    search: ''
  });

  useEffect(() => {
    fetchLogs();
    fetchStats();
  }, [filters.module, filters.action]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.module !== 'all') params.module = filters.module;
      if (filters.action !== 'all') params.action = filters.action;
      const response = await activityLogsAPI.getAll(params);
      setLogs(response.data.logs || []);
    } catch (error) {
      toast.error('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await activityLogsAPI.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load log stats');
    }
  };

  const filteredLogs = logs.filter((log) => {
    const query = filters.search.toLowerCase();
    return (
      log.description?.toLowerCase().includes(query) ||
      log.admin?.email?.toLowerCase().includes(query) ||
      log.module?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-activity-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Activity Logs</h1>
          <p className="page-subtitle">Track admin actions and audit history</p>
        </div>
      </div>

      {stats && (
        <div className="activity-stats">
          <div className="stat-card">
            <div className="stat-label">Total Actions</div>
            <div className="stat-value">{logs.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Modules Tracked</div>
            <div className="stat-value">{stats.moduleStats?.length || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Action Types</div>
            <div className="stat-value">{stats.actionStats?.length || 0}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Admins Active</div>
            <div className="stat-value">{stats.adminStats?.length || 0}</div>
          </div>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search logs..."
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="filter-group">
          <select
            className="filter-select"
            value={filters.module}
            onChange={(e) => setFilters((prev) => ({ ...prev, module: e.target.value }))}
          >
            <option value="all">All Modules</option>
            <option value="events">Events</option>
            <option value="sports">Sports</option>
            <option value="social_work">Social Work</option>
            <option value="gallery">Gallery</option>
            <option value="slider_images">Slider Images</option>
            <option value="members">Members</option>
            <option value="news">News</option>
            <option value="contact">Contact</option>
            <option value="pages">Pages</option>
            <option value="settings">Settings</option>
            <option value="auth">Auth</option>
          </select>
          <select
            className="filter-select"
            value={filters.action}
            onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
          </select>
        </div>
      </div>

      <div className="data-table-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading logs...</p>
          </div>
        ) : filteredLogs.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Module</th>
                <th>Description</th>
                <th>Admin</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => (
                <motion.tr
                  key={log._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td>
                    <span className="badge badge-blue">{log.action}</span>
                  </td>
                  <td>{log.module}</td>
                  <td>{log.description}</td>
                  <td>{log.admin?.email || 'Unknown'}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FaChartBar />
            </div>
            <h3>No Logs Found</h3>
            <p>Admin actions will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLogs;
