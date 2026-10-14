/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CountdownSection } from './components/CountdownSection';
import { FeaturedSection } from './components/FeaturedSection';
import { UploadSection } from './components/UploadSection';
import { GallerySection } from './components/GallerySection';
import { LightboxModal } from './components/LightboxModal';
import { AboutSection } from './components/AboutSection';
import { AdminModal } from './components/AdminModal';
import { Footer } from './components/Footer';

import { PhotoItem, ModerationMode, GalleryStats } from './types';
import {
  getStoredPhotos,
  saveStoredPhotos,
  getModerationMode,
  setModerationMode,
  getUserLikes,
  toggleUserLike,
  computeStats,
  INITIAL_PHOTOS,
} from './utils/storage';

export default function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [moderationMode, setModMode] = useState<ModerationMode>('immediate');
  const [stats, setStats] = useState<GalleryStats>({
    totalApproved: 0,
    totalContributors: 0,
    totalLikes: 0,
  });

  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Load stored data on mount
  useEffect(() => {
    const loadedPhotos = getStoredPhotos();
    setPhotos(loadedPhotos);
    setUserLikes(getUserLikes());
    setModMode(getModerationMode());
    setStats(computeStats(loadedPhotos));
  }, []);

  // Update photo uploaded
  const handlePhotoUploaded = (newPhoto: PhotoItem) => {
    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    saveStoredPhotos(updated);
    setStats(computeStats(updated));
  };

  // Toggle Like Reaction
  const handleToggleLike = (photoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const result = toggleUserLike(photoId);

    setUserLikes((prev) => {
      const copy = { ...prev };
      if (result.hasLiked) {
        copy[photoId] = true;
      } else {
        delete copy[photoId];
      }
      return copy;
    });

    setPhotos((prev) => {
      const updated = prev.map((p) =>
        p.id === photoId ? { ...p, likes: result.newLikes } : p
      );
      setStats(computeStats(updated));
      return updated;
    });

    // Also update current lightbox photo if open
    if (lightboxPhoto && lightboxPhoto.id === photoId) {
      setLightboxPhoto((prev) => (prev ? { ...prev, likes: result.newLikes } : null));
    }
  };

  // Admin moderation handlers
  const handleUpdateModerationMode = (mode: ModerationMode) => {
    setModMode(mode);
    setModerationMode(mode);
  };

  const handleUpdatePhotoStatus = (photoId: string, status: 'approved' | 'rejected' | 'pending') => {
    const updated = photos.map((p) => (p.id === photoId ? { ...p, status } : p));
    setPhotos(updated);
    saveStoredPhotos(updated);
    setStats(computeStats(updated));
  };

  const handleToggleFeatured = (photoId: string) => {
    const updated = photos.map((p) => (p.id === photoId ? { ...p, featured: !p.featured } : p));
    setPhotos(updated);
    saveStoredPhotos(updated);
  };

  const handleDeletePhoto = (photoId: string) => {
    const updated = photos.filter((p) => p.id !== photoId);
    setPhotos(updated);
    saveStoredPhotos(updated);
    setStats(computeStats(updated));
  };

  const handleEditCaption = (photoId: string, newCaption: string) => {
    const updated = photos.map((p) => (p.id === photoId ? { ...p, caption: newCaption } : p));
    setPhotos(updated);
    saveStoredPhotos(updated);
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Reset all photos back to initial festival samples?')) {
      setPhotos(INITIAL_PHOTOS);
      saveStoredPhotos(INITIAL_PHOTOS);
      setStats(computeStats(INITIAL_PHOTOS));
    }
  };

  // Smooth scroll navigation
  const scrollToUpload = () => {
    const el = document.getElementById('upload');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToGallery = () => {
    const el = document.getElementById('gallery');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0506] text-[#f7ede2] flex flex-col selection:bg-red-800 selection:text-white">
      {/* Navigation Top Bar */}
      <Navbar
        onOpenUpload={scrollToUpload}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Festive Hero Section */}
        <HeroSection
          stats={stats}
          onOpenUpload={scrollToUpload}
        />

        {/* Festival Countdown Section */}
        <CountdownSection />

        {/* Featured Moments Section */}
        <FeaturedSection
          photos={photos}
          userLikes={userLikes}
          onPhotoClick={(photo) => setLightboxPhoto(photo)}
          onToggleLike={handleToggleLike}
        />

        {/* Photo Upload Section */}
        <UploadSection
          moderationMode={moderationMode}
          onPhotoUploaded={handlePhotoUploaded}
          onViewGallery={scrollToGallery}
        />

        {/* Community Gallery Section with Masonry & Search */}
        <GallerySection
          photos={photos}
          userLikes={userLikes}
          onPhotoClick={(photo) => setLightboxPhoto(photo)}
          onToggleLike={handleToggleLike}
          onOpenUpload={scrollToUpload}
        />

        {/* Cultural Heritage & About Puja Section */}
        <AboutSection />
      </main>

      {/* Lightbox / Fullscreen Image Viewer */}
      <LightboxModal
        currentPhoto={lightboxPhoto}
        allPhotos={photos}
        userLikes={userLikes}
        onClose={() => setLightboxPhoto(null)}
        onNavigate={(photo) => setLightboxPhoto(photo)}
        onToggleLike={handleToggleLike}
      />

      {/* Protected Admin Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        photos={photos}
        moderationMode={moderationMode}
        onUpdateModerationMode={handleUpdateModerationMode}
        onUpdatePhotoStatus={handleUpdatePhotoStatus}
        onToggleFeatured={handleToggleFeatured}
        onDeletePhoto={handleDeletePhoto}
        onEditCaption={handleEditCaption}
        onResetToDefaults={handleResetToDefaults}
      />

      {/* Festive Footer */}
      <Footer
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenUpload={scrollToUpload}
      />
    </div>
  );
}
