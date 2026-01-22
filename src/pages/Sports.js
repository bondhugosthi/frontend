import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaUsers, FaFutbol, FaVolleyballBall, FaTableTennis, FaRunning, FaBaseballBall } from 'react-icons/fa';
import { sportsAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import './Sports.css';

const Sports = () => {
  const [sports, setSports] = useState([]);
  const [tournaments, setTournaments] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSportsData();
  }, []);

  const fetchSportsData = async () => {
    try {
      const [sportsRes, tournamentsRes] = await Promise.all([
        sportsAPI.getAll(),
        sportsAPI.getTournaments({})
      ]);
      setSports(sportsRes.data);
      setTournaments(tournamentsRes.data);
    } catch (error) {
      console.error('Error fetching sports data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSportIcon = (category) => {
    const icons = {
      cricket: <FaBaseballBall />,
      football: <FaFutbol />,
      volleyball: <FaVolleyballBall />,
      badminton: <FaTableTennis />,
      athletics: <FaRunning />,
      other: <FaTrophy />
    };
    return icons[category] || icons.other;
  };

  const filteredTournaments = selectedSport
    ? tournaments.filter(t => t.sport && t.sport._id === selectedSport)
    : tournaments;

  if (loading) {
    return <LoadingSpinner text="Loading sports..." />;
  }

  return (
    <div className="sports-page">
      <PageHeader
        title="Sports & Tournaments"
        subtitle="Compete, celebrate, and showcase your sporting talent"
        breadcrumbs={['Home', 'Sports']}
      />

      {/* Sports Categories */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <h2 className="section-title">Our Sports</h2>
            <p className="section-subtitle">Select a sport to view related tournaments</p>
          </div>

          <div className="sports-grid">
            {sports.map((sport, index) => (
              <motion.div
                key={sport._id}
                className={`sport-card ${selectedSport === sport._id ? 'active' : ''}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                onClick={() => setSelectedSport(selectedSport === sport._id ? null : sport._id)}
              >
                <div className="sport-icon">{getSportIcon(sport.category)}</div>
                <h3 className="sport-name">{sport.name}</h3>
                {sport.description && (
                  <p className="sport-description">{sport.description}</p>
                )}
                <div className="sport-count">
                  {sport.tournaments?.length || 0} Tournaments
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <h2 className="section-title">
                {selectedSport ? 'Filtered Tournaments' : 'All Tournaments'}
              </h2>
              <p className="section-subtitle">
                {filteredTournaments.length} tournament(s) found
              </p>
            </div>
            {selectedSport && (
              <button
                className="btn btn-outline"
                onClick={() => setSelectedSport(null)}
              >
                Clear Filter
              </button>
            )}
          </div>

          {filteredTournaments.length > 0 ? (
            <div className="tournaments-grid">
              {filteredTournaments.map((tournament, index) => (
                <motion.div
                  key={tournament._id}
                  className="tournament-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="tournament-header">
                    <h3 className="tournament-name">{tournament.name}</h3>
                    <span className={`badge badge-${tournament.status}`}>
                      {tournament.status}
                    </span>
                  </div>

                  <div className="tournament-info">
                    <div className="info-row">
                      <strong>Sport:</strong>
                      <span>{tournament.sport?.name || 'Unknown'}</span>
                    </div>
                    <div className="info-row">
                      <strong>Format:</strong>
                      <span className="format-badge">
                        {tournament.format === 'team' ? <FaUsers /> : <FaMedal />}
                        {tournament.format}
                      </span>
                    </div>
                    <div className="info-row">
                      <strong>Date:</strong>
                      <span>
                        {new Date(tournament.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    {tournament.venue && (
                      <div className="info-row">
                        <strong>Venue:</strong>
                        <span>{tournament.venue}</span>
                      </div>
                    )}
                  </div>

                  {tournament.teams && tournament.teams.length > 0 && (
                    <div className="tournament-teams">
                      <strong>Teams:</strong> {tournament.teams.length}
                    </div>
                  )}

                  {tournament.winners && tournament.winners.first && (
                    <div className="tournament-winners">
                      <div className="winner-header">
                        <FaTrophy /> Winners
                      </div>
                      <div className="winner-list">
                        {tournament.winners.first && (
                          <div className="winner-item gold">
                            <span className="position">1st</span>
                            <span>{tournament.winners.first}</span>
                          </div>
                        )}
                        {tournament.winners.second && (
                          <div className="winner-item silver">
                            <span className="position">2nd</span>
                            <span>{tournament.winners.second}</span>
                          </div>
                        )}
                        {tournament.winners.third && (
                          <div className="winner-item bronze">
                            <span className="position">3rd</span>
                            <span>{tournament.winners.third}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-tournaments">
              <div className="no-tournaments-icon">
                <FaTrophy />
              </div>
              <h3>No Tournaments Found</h3>
              <p>Check back soon for upcoming tournaments!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sports;
