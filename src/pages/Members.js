import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaEnvelope, FaPhone, FaUsers } from 'react-icons/fa';
import { membersAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import './Members.css';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { isActive: true };
      if (selectedRole !== 'all') params.role = selectedRole;
      if (selectedYear !== 'all') params.year = selectedYear;

      const response = await membersAPI.getAll(params);
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedRole, selectedYear]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const roles = [
    { id: 'all', label: 'All Members' },
    { id: 'president', label: 'President' },
    { id: 'vice_president', label: 'Vice President' },
    { id: 'secretary', label: 'Secretary' },
    { id: 'treasurer', label: 'Treasurer' },
    { id: 'sports_head', label: 'Sports Head' },
    { id: 'cultural_head', label: 'Cultural Head' },
    { id: 'volunteer', label: 'Volunteers' }
  ];

  const currentYear = new Date().getFullYear();
  const years = ['all', currentYear, currentYear - 1, currentYear - 2, currentYear - 3];

  const getRoleBadgeColor = (role) => {
    const colors = {
      president: 'role-president',
      vice_president: 'role-vice-president',
      secretary: 'role-secretary',
      treasurer: 'role-treasurer',
      sports_head: 'role-sports',
      cultural_head: 'role-cultural',
      volunteer: 'role-volunteer',
      member: 'role-member'
    };
    return colors[role] || 'role-member';
  };

  if (loading) {
    return <LoadingSpinner text="Loading members..." />;
  }

  return (
    <div className="members-page">
      <PageHeader
        title="Our Team"
        subtitle="Meet the dedicated individuals who make Bondhu Gosthi a family"
        breadcrumbs={['Home', 'Members']}
      />

      <section className="section">
        <div className="container">
          {/* Role Filter */}
          <div className="role-filters">
            {roles.map((role) => (
              <button
                key={role.id}
                className={`role-filter-btn ${selectedRole === role.id ? 'active' : ''}`}
                onClick={() => setSelectedRole(role.id)}
              >
                {role.label}
              </button>
            ))}
          </div>

          {/* Year Filter */}
          <div className="year-filters">
            {years.map((year) => (
              <button
                key={year}
                className={`year-filter-btn ${selectedYear === year ? 'active' : ''}`}
                onClick={() => setSelectedYear(year)}
              >
                {year === 'all' ? 'All Years' : year}
              </button>
            ))}
          </div>

          {/* Members Grid */}
          {members.length > 0 ? (
            <div className="members-grid">
              {members.map((member, index) => (
                <motion.div
                  key={member._id}
                  className="member-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className="member-image-container">
                    {member.photo ? (
                      <img src={member.photo} alt={member.name} />
                    ) : (
                      <div className="member-avatar">
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className={`role-badge ${getRoleBadgeColor(member.role)}`}>
                      {(member.role || 'member').replace('_', ' ')}
                    </span>
                  </div>

                  <div className="member-content">
                    <h3 className="member-name">{member.name}</h3>
                    
                    {member.committee && member.committee.position && (
                      <p className="member-position">{member.committee.position}</p>
                    )}

                    {member.bio && (
                      <p className="member-bio">{member.bio}</p>
                    )}

                    {member.achievements && member.achievements.length > 0 && (
                      <div className="member-achievements">
                        <strong>Achievements:</strong>
                        <ul>
                          {member.achievements.slice(0, 2).map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Contact & Social */}
                    <div className="member-contact">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="contact-link" title="Email">
                          <FaEnvelope />
                        </a>
                      )}
                      {member.phone && (
                        <a href={`tel:${member.phone}`} className="contact-link" title="Phone">
                          <FaPhone />
                        </a>
                      )}
                      {member.socialMedia?.facebook && (
                        <a 
                          href={member.socialMedia.facebook} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="contact-link"
                          title="Facebook"
                        >
                          <FaFacebook />
                        </a>
                      )}
                      {member.socialMedia?.instagram && (
                        <a 
                          href={member.socialMedia.instagram} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="contact-link"
                          title="Instagram"
                        >
                          <FaInstagram />
                        </a>
                      )}
                      {member.socialMedia?.twitter && (
                        <a 
                          href={member.socialMedia.twitter} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="contact-link"
                          title="Twitter"
                        >
                          <FaTwitter />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-members">
              <div className="no-members-icon">
                <FaUsers />
              </div>
              <h3>No Members Found</h3>
              <p>Try selecting a different role to see more members.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Members;
