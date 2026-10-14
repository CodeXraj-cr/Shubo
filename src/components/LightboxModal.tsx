import React, { useEffect, useState, TouchEvent } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Share2, Calendar, User, Check } from 'lucide-react';
import { PhotoItem } from '../types';

interface LightboxModalProps {
  currentPhoto: PhotoItem | null;
  allPhotos: PhotoItem[];
  userLikes: Record<string, boolean>;
  onClose: () => void;
  onNavigate: (photo: PhotoItem) => void;
  onToggleLike: (photoId: string, e: React.MouseEvent) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  currentPhoto,
  allPhotos,
  userLikes,
  onClose,
  onNavigate,
  onToggleLike,
}) => {
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Find index in approved photos
  const approvedPhotos = allPhotos.filter((p) => p.status === 'approved');
  const currentIndex = approvedPhotos.findIndex((p) => p.id === currentPhoto?.id);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < approvedPhotos.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onNavigate(approvedPhotos[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(approvedPhotos[currentIndex + 1]);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, approvedPhotos]);

  // Touch swipe support
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      // Swiped left -> Next
      handleNext();
    } else if (diff < -50) {
      // Swiped right -> Prev
      handlePrev();
    }
    setTouchStartX(null);
  };

  if (!currentPhoto) return null;

  const hasLiked = !!userLikes[currentPhoto.id];

  const handleShare = async () => {
    const shareData = {
      title: `${currentPhoto.category} - Durga Puja Moments`,
      text: `${currentPhoto.uploaderName}'s Puja Moment: ${currentPhoto.caption || 'Shared on Puja Moments'}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch {
        // user aborted
      }
    } else {
      // Fallback copy url
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const formattedDate = new Date(currentPhoto.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Bar with counter, category, and close */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-b from-black/80 to-transparent z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-amber-200/80 bg-stone-900/80 px-2.5 py-1 rounded-md border border-amber-900/40">
            {currentIndex + 1} / {approvedPhotos.length}
          </span>
          <span className="text-xs text-amber-300 font-medium bg-amber-950/60 px-2.5 py-1 rounded-md border border-amber-800/50">
            {currentPhoto.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Share button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-amber-200 border border-amber-900/40 transition-colors"
            title="Share this moment"
          >
            {copiedLink ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
          </button>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-stone-900/80 hover:bg-red-950 text-white border border-amber-900/40 transition-colors"
            title="Close viewer (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Viewport with Previous & Next */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-amber-100 hover:text-amber-300 border border-amber-900/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}

        {/* High-Res Image Display */}
        <div className="relative max-w-5xl max-h-[72vh] flex items-center justify-center select-none">
          <img
            src={currentPhoto.imageUrl}
            alt={currentPhoto.caption || `${currentPhoto.category} Puja photo`}
            className="max-w-full max-h-[72vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
          />
        </div>

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-6 z-20 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-black/90 text-amber-100 hover:text-amber-300 border border-amber-900/40 backdrop-blur-md transition-all active:scale-95 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
          </button>
        )}
      </div>

      {/* Bottom Photo Metadata & Love Bar */}
      <div className="bg-[#120507]/95 border-t border-amber-900/40 px-4 sm:px-8 py-4 z-10">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-amber-300">
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold text-white text-sm">
                {currentPhoto.uploaderName}
              </span>
              <span className="text-amber-500/50">·</span>
              <span className="text-amber-200/60 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
            </div>

            {currentPhoto.caption && (
              <p className="text-sm text-stone-200 font-normal leading-relaxed max-w-2xl">
                {currentPhoto.caption}
              </p>
            )}
          </div>

          {/* Love Reaction Button */}
          <button
            onClick={(e) => onToggleLike(currentPhoto.id, e)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              hasLiked
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                : 'bg-stone-900 text-stone-200 hover:bg-stone-800 border border-amber-900/50 hover:text-red-400'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-white' : ''}`} />
            <span>{hasLiked ? 'Loved' : 'Love'}</span>
            <span className="font-mono tabular-nums bg-black/30 px-2 py-0.5 rounded text-xs">
              {currentPhoto.likes || 0}
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};
