import React from 'react';
import { Star, Heart, Sparkles, User, Calendar } from 'lucide-react';
import { PhotoItem } from '../types';

interface FeaturedSectionProps {
  photos: PhotoItem[];
  userLikes: Record<string, boolean>;
  onPhotoClick: (photo: PhotoItem) => void;
  onToggleLike: (photoId: string, e: React.MouseEvent) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  photos,
  userLikes,
  onPhotoClick,
  onToggleLike,
}) => {
  const featuredPhotos = photos.filter((p) => p.featured && p.status === 'approved');

  if (featuredPhotos.length === 0) {
    return null;
  }

  const formatDate = (isoString: string) => {
    try {
      return new Date(isoString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Puja 2026';
    }
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-amber-900/30">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bengali">সেরা মুহূর্ত</span>
            <span>· Handpicked Highlights</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Featured Moments
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-amber-200/70 max-w-md sm:text-right">
          Curated iconic pandals, sacred idols, and festive celebrations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {featuredPhotos.map((photo) => {
          const hasLiked = !!userLikes[photo.id];
          return (
            <div
              key={photo.id}
              onClick={() => onPhotoClick(photo)}
              className="group relative rounded-2xl overflow-hidden bg-[#160608] border border-amber-900/40 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-950/50 cursor-pointer flex flex-col"
            >
              {/* Image Frame with Aspect Ratio */}
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-900">
                <img
                  src={photo.imageUrl}
                  alt={photo.caption || `${photo.category} Durga Puja moment`}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />

                {/* Top badges: Category & Featured Star */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
                  <span className="text-[11px] font-medium tracking-wide text-amber-200 bg-stone-950/80 backdrop-blur-sm px-2.5 py-0.5 rounded-md border border-amber-900/40">
                    {photo.category}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-amber-400 text-stone-950 flex items-center justify-center shadow-md">
                    <Star className="w-3.5 h-3.5 fill-stone-950 text-stone-950" />
                  </span>
                </div>

                {/* Bottom Heart Reaction on Image */}
                <button
                  type="button"
                  onClick={(e) => onToggleLike(photo.id, e)}
                  className={`absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-md transition-transform active:scale-90 ${
                    hasLiked
                      ? 'bg-red-950/80 text-red-200 border border-red-500/50 shadow'
                      : 'bg-black/60 text-white/90 border border-white/20 hover:bg-black/80'
                  }`}
                  aria-label="Love photo"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${hasLiked ? 'fill-red-400 text-red-400' : 'text-white'}`}
                  />
                  <span className="font-mono tabular-nums text-[11px]">{photo.likes}</span>
                </button>
              </div>

              {/* Card Meta Content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  {photo.caption && (
                    <p className="text-sm text-stone-200 font-normal line-clamp-2 mb-2 leading-relaxed">
                      {photo.caption}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-amber-200/60 pt-2 border-t border-amber-900/20">
                  <div className="flex items-center gap-1.5 truncate max-w-[140px]">
                    <User className="w-3.5 h-3.5 text-amber-400/80 shrink-0" />
                    <span className="truncate text-amber-100 font-medium">{photo.uploaderName}</span>
                  </div>
                  <span className="shrink-0">{formatDate(photo.createdAt)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
