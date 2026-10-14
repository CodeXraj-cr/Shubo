import React, { useState, useMemo } from 'react';
import { Search, Heart, User, Filter, Image as ImageIcon, Camera, Sparkles } from 'lucide-react';
import { PhotoItem } from '../types';
import { siteConfig, PhotoCategory } from '../config';

interface GallerySectionProps {
  photos: PhotoItem[];
  userLikes: Record<string, boolean>;
  onPhotoClick: (photo: PhotoItem) => void;
  onToggleLike: (photoId: string, e: React.MouseEvent) => void;
  onOpenUpload: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({
  photos,
  userLikes,
  onPhotoClick,
  onToggleLike,
  onOpenUpload,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter approved photos matching search & category
  const filteredPhotos = useMemo(() => {
    return photos.filter((photo) => {
      // Must be approved for public gallery
      if (photo.status !== 'approved') return false;

      // Category check
      if (selectedCategory !== 'All' && photo.category !== selectedCategory) {
        return false;
      }

      // Search query check (by name, caption, category)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = photo.uploaderName.toLowerCase().includes(query);
        const matchesCaption = photo.caption ? photo.caption.toLowerCase().includes(query) : false;
        const matchesCat = photo.category.toLowerCase().includes(query);
        return matchesName || matchesCaption || matchesCat;
      }

      return true;
    });
  }, [photos, selectedCategory, searchQuery]);

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <section id="gallery" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20">
      
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bengali">স্মৃতির আলোকচিত্র</span>
            <span>· Community Gallery</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Puja Moments
          </h2>
          <p className="font-bengali text-amber-200/70 text-sm sm:text-base mt-1">
            সর্বজনীন দুর্গাপূজার নানা রঙের উৎসবের মুহূর্ত
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80 relative">
          <Search className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search photos..."
            className="w-full pl-10 pr-4 py-2 bg-[#17070a] border border-amber-900/50 rounded-xl text-sm text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs (Single-line interactive segmented scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none no-scrollbar">
        {siteConfig.categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer border ${
                isActive
                  ? 'bg-amber-400 text-stone-950 border-amber-300 font-semibold shadow-md shadow-amber-500/20'
                  : 'bg-[#18080a] text-amber-200/80 border-amber-900/40 hover:bg-[#250c10] hover:text-amber-100'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Gallery Content */}
      {filteredPhotos.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-dashed border-amber-900/50 bg-[#160608]/60 p-12 text-center max-w-xl mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-amber-950/60 border border-amber-800/40 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <ImageIcon className="w-8 h-8" />
          </div>
          <h3 className="font-display text-2xl font-bold text-white mb-2">
            No Puja moments yet...
          </h3>
          <p className="text-amber-200/70 text-sm mb-6 font-bengali">
            {searchQuery || selectedCategory !== 'All'
              ? 'আপনার অনুসন্ধানের সাথে মিল পাওয়া যায়নি। অন্য কিছু খুঁজুন।'
              : 'Be the first person to share one! 📸'}
          </p>
          <button
            onClick={onOpenUpload}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-stone-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Upload First Photo</span>
          </button>
        </div>
      ) : (
        /* Responsive Masonry / Column Layout (4 cols desktop, 3 tablet, 2 mobile) */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
          {filteredPhotos.map((photo) => {
            const hasLiked = !!userLikes[photo.id];
            return (
              <article
                key={photo.id}
                onClick={() => onPhotoClick(photo)}
                className="group relative rounded-xl overflow-hidden bg-[#160608] border border-amber-900/35 hover:border-amber-500/40 transition-all duration-300 shadow-md hover:shadow-xl hover:shadow-amber-950/40 cursor-pointer flex flex-col"
              >
                {/* Photo Image Frame */}
                <div className="relative aspect-[4/3] sm:aspect-[3/2] overflow-hidden bg-stone-950">
                  <img
                    src={photo.imageUrl}
                    alt={photo.caption || `${photo.category} photo uploaded by ${photo.uploaderName}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 opacity-60 group-hover:opacity-90 transition-opacity" />

                  {/* Category Pill Tag */}
                  <div className="absolute top-2.5 left-2.5 pointer-events-none">
                    <span className="text-[10px] sm:text-xs font-medium text-amber-200 bg-stone-950/80 backdrop-blur-md px-2 py-0.5 rounded border border-amber-900/40">
                      {photo.category}
                    </span>
                  </div>

                  {/* Like Button */}
                  <button
                    type="button"
                    onClick={(e) => onToggleLike(photo.id, e)}
                    className={`absolute bottom-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-medium backdrop-blur-md transition-all active:scale-90 ${
                      hasLiked
                        ? 'bg-red-950/90 text-red-200 border border-red-500/50'
                        : 'bg-black/60 text-white/90 border border-white/20 hover:bg-black/90'
                    }`}
                    aria-label="Love photo"
                  >
                    <Heart
                      className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${
                        hasLiked ? 'fill-red-400 text-red-400' : 'text-white'
                      }`}
                    />
                    <span className="font-mono tabular-nums text-[10px] sm:text-xs">
                      {photo.likes || 0}
                    </span>
                  </button>
                </div>

                {/* Card Content Area */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {photo.caption && (
                      <p className="text-xs sm:text-sm text-stone-200 font-normal line-clamp-2 mb-2 leading-relaxed">
                        {photo.caption}
                      </p>
                    )}
                  </div>

                  {/* Clean unboxed metadata with subtle separator */}
                  <div className="flex items-center justify-between text-[11px] sm:text-xs text-amber-200/60 pt-2 border-t border-amber-900/20">
                    <div className="flex items-center gap-1.5 truncate max-w-[120px] sm:max-w-[150px]">
                      <User className="w-3 h-3 text-amber-400/80 shrink-0" />
                      <span className="truncate text-amber-100 font-medium">
                        {photo.uploaderName}
                      </span>
                    </div>
                    <span className="shrink-0">{formatDate(photo.createdAt)}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
