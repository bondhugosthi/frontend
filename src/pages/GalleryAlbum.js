import React, { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaTimes, FaCalendarAlt, FaImages, FaEye, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { galleryAPI } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { resolveMediaUrl } from '../utils/mediaUrl';
import './GalleryAlbum.css';

const GalleryAlbum = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const mediaCount = album?.media?.length || 0;

  const fetchAlbum = useCallback(async () => {
    try {
      const response = await galleryAPI.getById(id);
      setAlbum(response.data);
    } catch (error) {
      console.error('Error fetching album:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  const nextImage = useCallback(() => {
    if (!mediaCount) return;
    setCurrentImage((prev) => (prev + 1) % mediaCount);
  }, [mediaCount]);

  const prevImage = useCallback(() => {
    if (!mediaCount) return;
    setCurrentImage((prev) => (prev - 1 + mediaCount) % mediaCount);
  }, [mediaCount]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };

  if (loading) {
    return <LoadingSpinner text="Loading album..." />;
  }

  if (!album) {
    return (
      <div className="container" style={{ marginTop: '150px', textAlign: 'center' }}>
        <h2>Album not found</h2>
        <Link to="/gallery" className="btn btn-primary">Back to Gallery</Link>
      </div>
    );
  }

  return (
    <div className="album-page">
      {/* Album Header */}
      <div className="album-header">
        <div className="container">
          <Link to="/gallery" className="back-link">
            <FaArrowLeft /> Back to Gallery
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="album-title">{album.albumName}</h1>
            {album.description && (
              <p className="album-description">{album.description}</p>
            )}
            <div className="album-info-row">
              {album.date && (
                <span className="album-meta-item">
                  <FaCalendarAlt /> {new Date(album.date).toLocaleDateString()}
                </span>
              )}
              <span className="album-meta-item">
                <FaImages /> {album.media?.length || 0} Photos
              </span>
              <span className="album-meta-item">
                <FaEye /> {album.views || 0} Views
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Photo Grid */}
      <section className="section">
        <div className="container">
          {album.media && album.media.length > 0 ? (
            <div className="photos-grid">
              {album.media.map((media, index) => (
                <motion.div
                  key={index}
                  className="photo-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => openLightbox(index)}
                >
                  <img 
                    src={resolveMediaUrl(media.thumbnail || media.url)} 
                    alt={media.caption || `Photo ${index + 1}`} 
                    loading="lazy"
                    decoding="async"
                  />
                  {media.caption && (
                    <div className="photo-caption">{media.caption}</div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="no-photos">
              <p>No photos in this album yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && album.media && album.media.length > 0 && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox} aria-label="Close">
            <FaTimes />
          </button>
          <button
            className="lightbox-prev"
            onClick={(e) => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>
          <button
            className="lightbox-next"
            onClick={(e) => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img 
              src={resolveMediaUrl(album.media[currentImage].url)} 
              alt={album.media[currentImage].caption || `Photo ${currentImage + 1}`} 
              loading="lazy"
              decoding="async"
            />
            {album.media[currentImage].caption && (
              <div className="lightbox-caption">
                {album.media[currentImage].caption}
              </div>
            )}
            <div className="lightbox-counter">
              {currentImage + 1} / {album.media.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryAlbum;
