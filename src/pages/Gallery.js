import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaImages, FaCalendarAlt, FaEye } from 'react-icons/fa';
import { galleryAPI } from '../utils/api';
import PageHeader from '../components/PageHeader';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './Gallery.css';

const Gallery = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const placeholderImage = '/images/gallery-placeholder.svg';

  const getAlbumCoverSrc = (album) => {
    const candidate =
      album?.coverImage ||
      album?.media?.[0]?.thumbnail ||
      album?.media?.[0]?.url ||
      placeholderImage;
    return resolveMediaUrl(candidate) || placeholderImage;
  };

  const fetchGalleries = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const response = await galleryAPI.getAll(params);
      setGalleries(response.data);
    } catch (error) {
      console.error('Error fetching galleries:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const categories = [
    { id: 'all', label: 'All Albums' },
    { id: 'events', label: 'Events' },
    { id: 'sports', label: 'Sports' },
    { id: 'social_work', label: 'Social Work' },
    { id: 'december_moments', label: 'December Moments' },
    { id: 'puja', label: 'Puja' }
  ];

  if (loading) {
    return <LoadingSpinner text="Loading gallery..." />;
  }

  return (
    <div className="gallery-page">
      <PageHeader
        title="Gallery"
        subtitle="Relive the beautiful moments and memories we've created together"
        breadcrumbs={['Home', 'Gallery']}
      />

      <section className="section">
        <div className="container">
          {/* Category Filter */}
          <div className="gallery-filters">
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`gallery-filter-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Gallery Grid */}
          {galleries.length > 0 ? (
            <div className="gallery-grid">
              {galleries.map((album, index) => (
                <motion.div
                  key={album._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link to={`/gallery/${album._id}`} className="gallery-album-card">
                    <div className="album-image-container">
                      <img 
                        src={getAlbumCoverSrc(album)} 
                        alt={album.albumName} 
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="album-overlay">
                        <div className="album-info">
                          <h3 className="album-name">{album.albumName}</h3>
                          {album.description && (
                            <p className="album-description">{album.description}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="album-meta">
                      <div className="meta-item">
                        <FaImages />
                        <span>{album.media?.length || 0} Photos</span>
                      </div>
                      {album.date && (
                        <div className="meta-item">
                          <FaCalendarAlt />
                          <span>{new Date(album.date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="meta-item">
                        <FaEye />
                        <span>{album.views || 0} Views</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-albums">
              <div className="no-albums-icon">
                <FaImages />
              </div>
              <h3>No Albums Found</h3>
              <p>Try selecting a different category to see more albums.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Gallery;
