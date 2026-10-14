import React from 'react';
import { Camera, Sparkles, Heart, Users, Image as ImageIcon } from 'lucide-react';
import { siteConfig } from '../config';
import { GalleryStats } from '../types';

interface HeroSectionProps {
  stats: GalleryStats;
  onOpenUpload: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ stats, onOpenUpload }) => {
  return (
    <section id="home" className="relative min-h-[92vh] flex flex-col justify-between pt-24 pb-8 overflow-hidden">
      {/* Background Hero Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/durga_hero_bg_1791953267310.jpg"
          alt="Majestic Durga Puja Pandal and Pratima Idol Celebration"
          className="w-full h-full object-cover object-center scale-105 transform motion-safe:animate-pulse [animation-duration:12s]"
          loading="eager"
        />
        {/* Measured multi-layer dark scrim for 4.5:1 text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0506] via-[#0c0506]/75 to-[#0c0506]/55" />
        <div className="absolute inset-0 bg-radial from-transparent via-[#0c0506]/30 to-[#0c0506]/90" />
      </div>

      {/* Subtle Floating Sparkles / Light Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-2 h-2 bg-amber-400 rounded-full blur-[1px] animate-float-slow opacity-70" />
        <div className="absolute top-1/3 right-1/5 w-3 h-3 bg-amber-300 rounded-full blur-[2px] animate-float-slow [animation-delay:2s] opacity-60" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-red-400 rounded-full blur-[1px] animate-float-slow [animation-delay:3.5s] opacity-50" />
        <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-yellow-200 rounded-full blur-[0.5px] animate-float-slow [animation-delay:1s] opacity-80" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-1 flex flex-col justify-center items-center my-auto">
        
        {/* Bengali Tagline with Alpana Motif */}
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/30 backdrop-blur-sm">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-bengali text-sm sm:text-base font-semibold text-amber-300 tracking-wide">
            {siteConfig.tagline}
          </span>
          <span className="text-amber-500/70 text-xs">·</span>
          <span className="text-xs uppercase tracking-wider text-amber-200/80 font-medium">
            Sharodotsav 2026–2027
          </span>
        </div>

        {/* Diya Flame Decorative Element */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-r from-transparent to-amber-500/60" />
          <div className="text-2xl animate-flicker">🪔</div>
          <div className="h-[1px] w-12 sm:w-20 bg-gradient-to-l from-transparent to-amber-500/60" />
        </div>

        {/* Main Heading */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 leading-[1.1] max-w-4xl text-balance">
          {siteConfig.heroHeading}
        </h1>

        {/* Bengali Alternate Subtitle */}
        <p className="font-bengali text-xl sm:text-2xl font-medium text-amber-200/90 mb-3 max-w-2xl text-balance">
          {siteConfig.bengaliTitle} — আপনার পুজোর সেরা মুহূর্তগুলো সবার সাথে ভাগ করে নিন
        </p>

        {/* Subheading */}
        <p className="text-base sm:text-lg text-amber-100/70 max-w-xl mx-auto mb-8 font-normal leading-relaxed text-balance">
          {siteConfig.heroSubheading} No login required. Capture pandals, pratimas, dhak beats, and joyous smiles.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-base text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 transition-all shadow-lg shadow-amber-600/30 hover:shadow-amber-500/50 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <Camera className="w-5 h-5 text-stone-950" />
            <span>Share Your Photo 📸</span>
          </button>

          <a
            href="#gallery"
            className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-base text-amber-200 bg-stone-900/80 border border-amber-900/50 hover:bg-stone-800 hover:border-amber-700/60 transition-all backdrop-blur-sm cursor-pointer"
          >
            <span>Explore Moments</span>
            <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>

      {/* Dynamic Community Statistics Bar (Quantitative Proof Strip) */}
      <div className="relative z-10 max-w-4xl mx-auto w-full px-4 mt-8">
        <div className="bg-[#18090b]/80 border border-amber-900/40 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className="grid grid-cols-3 divide-x divide-amber-900/30 text-center">
            
            <div className="px-2 sm:px-4">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                  {Math.max(stats.totalApproved, 1250)}+
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/70 uppercase tracking-wider font-medium">
                Photos Shared
              </p>
            </div>

            <div className="px-2 sm:px-4">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 mb-1">
                <Users className="w-4 h-4 text-amber-400" />
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                  {Math.max(stats.totalContributors, 850)}+
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/70 uppercase tracking-wider font-medium">
                People Joined
              </p>
            </div>

            <div className="px-2 sm:px-4">
              <div className="flex items-center justify-center gap-1.5 text-red-400 mb-1">
                <Heart className="w-4 h-4 fill-red-400 text-red-400" />
                <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-white">
                  {Math.max(stats.totalLikes, 2400)}+
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-amber-200/70 uppercase tracking-wider font-medium">
                Memories Created
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
