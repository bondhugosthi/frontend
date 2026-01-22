import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTrophy,
  FaRunning,
  FaUsers,
  FaLock
} from 'react-icons/fa';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import { sportsAPI } from '../utils/api';
import './AdminSports.css';

Modal.setAppElement('#root');

const defaultSportForm = {
  name: '',
  category: 'cricket',
  description: '',
  isActive: true
};

const defaultTournamentForm = {
  name: '',
  sport: '',
  startDate: '',
  endDate: '',
  venue: '',
  format: 'team',
  status: 'upcoming',
  isLocked: false,
  winners: {
    first: '',
    second: '',
    third: ''
  }
};

const AdminSports = () => {
  const [activeTab, setActiveTab] = useState('sports');
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sportSearch, setSportSearch] = useState('');
  const [tournamentSearch, setTournamentSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSport, setFilterSport] = useState('all');
  const [sportModalOpen, setSportModalOpen] = useState(false);
  const [tournamentModalOpen, setTournamentModalOpen] = useState(false);
  const [editingSport, setEditingSport] = useState(null);
  const [editingTournament, setEditingTournament] = useState(null);
  const [sportForm, setSportForm] = useState(defaultSportForm);
  const [tournamentForm, setTournamentForm] = useState(defaultTournamentForm);

  const fetchSportsData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterSport !== 'all') params.sportId = filterSport;

      const [sportsRes, tournamentsRes] = await Promise.all([
        sportsAPI.getAll(),
        sportsAPI.getTournaments(params)
      ]);

      setSports(sportsRes.data);
      setTournaments(tournamentsRes.data);
    } catch (error) {
      toast.error('Failed to load sports data');
    } finally {
      setLoading(false);
    }
  }, [filterSport, filterStatus]);

  useEffect(() => {
    fetchSportsData();
  }, [fetchSportsData]);

  const openSportModal = (sport = null) => {
    setEditingSport(sport);
    setSportForm(
      sport
        ? {
            name: sport.name || '',
            category: sport.category || 'cricket',
            description: sport.description || '',
            isActive: sport.isActive !== false
          }
        : defaultSportForm
    );
    setSportModalOpen(true);
  };

  const openTournamentModal = (tournament = null) => {
    setEditingTournament(tournament);
    setTournamentForm(
      tournament
        ? {
            name: tournament.name || '',
            sport: tournament.sport?._id || tournament.sport || '',
            startDate: tournament.startDate ? tournament.startDate.split('T')[0] : '',
            endDate: tournament.endDate ? tournament.endDate.split('T')[0] : '',
            venue: tournament.venue || '',
            format: tournament.format || 'team',
            status: tournament.status || 'upcoming',
            isLocked: Boolean(tournament.isLocked),
            winners: {
              first: tournament.winners?.first || '',
              second: tournament.winners?.second || '',
              third: tournament.winners?.third || ''
            }
          }
        : defaultTournamentForm
    );
    setTournamentModalOpen(true);
  };

  const closeSportModal = () => {
    setSportModalOpen(false);
    setEditingSport(null);
    setSportForm(defaultSportForm);
  };

  const closeTournamentModal = () => {
    setTournamentModalOpen(false);
    setEditingTournament(null);
    setTournamentForm(defaultTournamentForm);
  };

  const handleSportChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSportForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleTournamentChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('winner.')) {
      const key = name.split('.')[1];
      setTournamentForm((prev) => ({
        ...prev,
        winners: {
          ...prev.winners,
          [key]: value
        }
      }));
      return;
    }

    setTournamentForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSportSubmit = async (e) => {
    e.preventDefault();
    if (!sportForm.name.trim()) {
      toast.error('Sport name is required');
      return;
    }

    try {
      if (editingSport) {
        await sportsAPI.update(editingSport._id, sportForm);
        toast.success('Sport updated successfully');
      } else {
        await sportsAPI.create(sportForm);
        toast.success('Sport created successfully');
      }
      closeSportModal();
      fetchSportsData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save sport');
    }
  };

  const handleTournamentSubmit = async (e) => {
    e.preventDefault();

    if (!tournamentForm.name.trim() || !tournamentForm.sport || !tournamentForm.startDate) {
      toast.error('Name, sport, and start date are required');
      return;
    }

    const payload = {
      name: tournamentForm.name,
      sport: tournamentForm.sport,
      startDate: tournamentForm.startDate,
      endDate: tournamentForm.endDate || undefined,
      venue: tournamentForm.venue || undefined,
      format: tournamentForm.format,
      status: tournamentForm.status,
      isLocked: tournamentForm.isLocked,
      winners: {
        first: tournamentForm.winners.first || undefined,
        second: tournamentForm.winners.second || undefined,
        third: tournamentForm.winners.third || undefined
      }
    };

    try {
      if (editingTournament) {
        await sportsAPI.updateTournament(editingTournament._id, payload);
        toast.success('Tournament updated successfully');
      } else {
        await sportsAPI.createTournament(payload);
        toast.success('Tournament created successfully');
      }
      closeTournamentModal();
      fetchSportsData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save tournament');
    }
  };

  const handleSportDelete = async (id) => {
    if (!window.confirm('Delete this sport?')) return;
    try {
      await sportsAPI.delete(id);
      toast.success('Sport deleted successfully');
      fetchSportsData();
    } catch (error) {
      toast.error('Failed to delete sport');
    }
  };

  const handleTournamentDelete = async (id) => {
    if (!window.confirm('Delete this tournament?')) return;
    try {
      await sportsAPI.deleteTournament(id);
      toast.success('Tournament deleted successfully');
      fetchSportsData();
    } catch (error) {
      toast.error('Failed to delete tournament');
    }
  };

  const filteredSports = sports.filter((sport) => {
    const query = sportSearch.toLowerCase();
    return (
      sport.name.toLowerCase().includes(query) ||
      sport.category.toLowerCase().includes(query)
    );
  });

  const filteredTournaments = tournaments.filter((tournament) => {
    const query = tournamentSearch.toLowerCase();
    return (
      tournament.name.toLowerCase().includes(query) ||
      (tournament.sport?.name || '').toLowerCase().includes(query)
    );
  });

  const isTournamentLocked = editingTournament?.isLocked && tournamentForm.isLocked;

  const getTournamentStatusBadge = (status) => {
    const badges = {
      upcoming: 'badge-primary',
      ongoing: 'badge-success',
      completed: 'badge-secondary'
    };
    return badges[status] || 'badge-secondary';
  };

  return (
    <div className="admin-sports-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Sports & Tournaments</h1>
          <p className="page-subtitle">Manage sports categories and tournaments</p>
        </div>
      </div>

      <div className="admin-tab-bar">
        <button
          className={`admin-tab ${activeTab === 'sports' ? 'active' : ''}`}
          onClick={() => setActiveTab('sports')}
        >
          <FaRunning /> Sports
        </button>
        <button
          className={`admin-tab ${activeTab === 'tournaments' ? 'active' : ''}`}
          onClick={() => setActiveTab('tournaments')}
        >
          <FaTrophy /> Tournaments
        </button>
      </div>

      {activeTab === 'sports' && (
        <>
          <div className="filters-bar">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search sports..."
                value={sportSearch}
                onChange={(e) => setSportSearch(e.target.value)}
              />
            </div>
            <button className="btn btn-primary" onClick={() => openSportModal()}>
              <FaPlus /> Add Sport
            </button>
          </div>

          <div className="data-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading sports...</p>
              </div>
            ) : filteredSports.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Sport</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSports.map((sport, index) => (
                    <motion.tr
                      key={sport._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td>
                        <div className="event-title">{sport.name}</div>
                        {sport.description && (
                          <div className="event-desc">{sport.description}</div>
                        )}
                      </td>
                      <td>
                        <span className="badge badge-blue">{sport.category}</span>
                      </td>
                      <td>
                        <span className={`badge ${sport.isActive ? 'badge-success' : 'badge-error'}`}>
                          {sport.isActive ? 'active' : 'inactive'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => openSportModal(sport)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleSportDelete(sport._id)}
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
                  <FaRunning />
                </div>
                <h3>No Sports Found</h3>
                <p>Add a sport category to get started.</p>
                <button className="btn btn-primary" onClick={() => openSportModal()}>
                  <FaPlus /> Add Sport
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'tournaments' && (
        <>
          <div className="filters-bar">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={tournamentSearch}
                onChange={(e) => setTournamentSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={filterSport}
                onChange={(e) => setFilterSport(e.target.value)}
              >
                <option value="all">All Sports</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
              <select
                className="filter-select"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={() => openTournamentModal()}>
              <FaPlus /> Add Tournament
            </button>
          </div>

          <div className="data-table-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading tournaments...</p>
              </div>
            ) : filteredTournaments.length > 0 ? (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Tournament</th>
                    <th>Sport</th>
                    <th>Status</th>
                    <th>Format</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTournaments.map((tournament, index) => (
                    <motion.tr
                      key={tournament._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td>
                        <div className="event-title">{tournament.name}</div>
                        <div className="event-desc">
                          {tournament.startDate
                            ? new Date(tournament.startDate).toLocaleDateString()
                            : 'Date TBD'}
                        </div>
                      </td>
                      <td>{tournament.sport?.name || 'N/A'}</td>
                      <td>
                        <span className={`badge ${getTournamentStatusBadge(tournament.status)}`}>
                          {tournament.status}
                        </span>
                      </td>
                      <td>
                        <span className="format-pill">
                          {tournament.format === 'team' ? <FaUsers /> : <FaTrophy />}
                          {tournament.format}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => openTournamentModal(tournament)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleTournamentDelete(tournament._id)}
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
                  <FaTrophy />
                </div>
                <h3>No Tournaments Found</h3>
                <p>Create a tournament to display it here.</p>
                <button className="btn btn-primary" onClick={() => openTournamentModal()}>
                  <FaPlus /> Add Tournament
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Modal
        isOpen={sportModalOpen}
        onRequestClose={closeSportModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{editingSport ? 'Edit Sport' : 'Add Sport'}</h2>
          <button className="modal-close" onClick={closeSportModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleSportSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Sport Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={sportForm.name}
                onChange={handleSportChange}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                name="category"
                className="form-select"
                value={sportForm.category}
                onChange={handleSportChange}
                required
              >
                <option value="cricket">Cricket</option>
                <option value="football">Football</option>
                <option value="volleyball">Volleyball</option>
                <option value="badminton">Badminton</option>
                <option value="athletics">Athletics</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-textarea"
              value={sportForm.description}
              onChange={handleSportChange}
              rows="4"
            />
          </div>
          <div className="form-row">
            <label className="form-label checkbox-row">
              <input
                type="checkbox"
                name="isActive"
                checked={sportForm.isActive}
                onChange={handleSportChange}
              />
              Active
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeSportModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingSport ? 'Update Sport' : 'Create Sport'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={tournamentModalOpen}
        onRequestClose={closeTournamentModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="modal-header">
          <h2>{editingTournament ? 'Edit Tournament' : 'Add Tournament'}</h2>
          <button className="modal-close" onClick={closeTournamentModal} aria-label="Close">
            x
          </button>
        </div>
        <form onSubmit={handleTournamentSubmit} className="modal-form">
          {isTournamentLocked && (
            <div className="locked-alert">
              <FaLock /> This tournament is locked. Unlock to edit details.
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Tournament Name *</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={tournamentForm.name}
                onChange={handleTournamentChange}
                required
                disabled={isTournamentLocked}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Sport *</label>
              <select
                name="sport"
                className="form-select"
                value={tournamentForm.sport}
                onChange={handleTournamentChange}
                required
                disabled={isTournamentLocked}
              >
                <option value="">Select Sport</option>
                {sports.map((sport) => (
                  <option key={sport._id} value={sport._id}>
                    {sport.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Date *</label>
              <input
                type="date"
                name="startDate"
                className="form-input"
                value={tournamentForm.startDate}
                onChange={handleTournamentChange}
                required
                disabled={isTournamentLocked}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                name="endDate"
                className="form-input"
                value={tournamentForm.endDate}
                onChange={handleTournamentChange}
                disabled={isTournamentLocked}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Venue</label>
              <input
                type="text"
                name="venue"
                className="form-input"
                value={tournamentForm.venue}
                onChange={handleTournamentChange}
                disabled={isTournamentLocked}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Format</label>
              <select
                name="format"
                className="form-select"
                value={tournamentForm.format}
                onChange={handleTournamentChange}
                disabled={isTournamentLocked}
              >
                <option value="team">Team</option>
                <option value="individual">Individual</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={tournamentForm.status}
                onChange={handleTournamentChange}
              >
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">First Place</label>
              <input
                type="text"
                name="winner.first"
                className="form-input"
                value={tournamentForm.winners.first}
                onChange={handleTournamentChange}
                disabled={isTournamentLocked}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Second Place</label>
              <input
                type="text"
                name="winner.second"
                className="form-input"
                value={tournamentForm.winners.second}
                onChange={handleTournamentChange}
                disabled={isTournamentLocked}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Third Place</label>
              <input
                type="text"
                name="winner.third"
                className="form-input"
                value={tournamentForm.winners.third}
                onChange={handleTournamentChange}
                disabled={isTournamentLocked}
              />
            </div>
          </div>
          <div className="form-row">
            <label className="form-label checkbox-row">
              <input
                type="checkbox"
                name="isLocked"
                checked={tournamentForm.isLocked}
                onChange={handleTournamentChange}
              />
              Lock tournament results
            </label>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={closeTournamentModal}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {editingTournament ? 'Update Tournament' : 'Create Tournament'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminSports;
