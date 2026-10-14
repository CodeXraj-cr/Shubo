import React from 'react';
import { Heart, Instagram, Facebook, ArrowUp, Shield } from 'lucide-react';
import { siteConfig } from '../config';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenUpload: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onOpenUpload }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#120507] border-t border-amber-900/40 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Top Tier: Brand, Description, Navigation, Social */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center text-amber-100 font-bold text-xs shadow">
                ॐ
              </span>
              <span className="font-bengali text-xl font-bold text-amber-200">
                {siteConfig.bengaliTitle}
              </span>
              <span className="text-xs text-amber-400/80 uppercase tracking-widest font-semibold">
                · {siteConfig.siteName}
              </span>
            </div>
            
            <p className="text-sm text-stone-300 max-w-md leading-relaxed">
              Celebrating culture, community and memories. A community photo platform dedicated to preserving the golden sights, sacred rituals, and joyous moments of Durga Puja.
            </p>

            <p className="font-bengali text-sm text-amber-300/80">
              {siteConfig.tagline} · আসছে বছর আবার হবে!
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-amber-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">
                  Puja Moments Gallery
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenUpload}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Upload Your Photo
                </button>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-300 transition-colors">
                  About Durga Puja
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="flex items-center gap-1.5 text-xs text-amber-400/80 hover:text-amber-200 transition-colors"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Panel</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Social & Connect */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-200">
              Connect With Us
            </h4>
            <div className="flex items-center gap-3">
              {siteConfig.instagramUrl && (
                <a
                  href={siteConfig.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-stone-900 border border-amber-900/40 flex items-center justify-center text-amber-300 hover:text-white hover:bg-stone-800 transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {siteConfig.facebookUrl && (
                <a
                  href={siteConfig.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-stone-900 border border-amber-900/40 flex items-center justify-center text-amber-300 hover:text-white hover:bg-stone-800 transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
            </div>
            <p className="text-xs text-stone-400">
              Share your moments with hashtag <span className="text-amber-300 font-mono">#আমাদেরপুজো #PujaMoments</span>
            </p>
          </div>

        </div>

        {/* Bottom Tier: Copyright, Developer Credit, Back to Top */}
        <div className="pt-8 border-t border-amber-900/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-stone-400">
            <span>© 2027 {siteConfig.siteName}. All rights reserved.</span>
            <span className="hidden sm:inline text-stone-600">·</span>
            <div className="flex items-center gap-1 text-amber-300/90 font-medium">
              <span>Designed &amp; Developed by</span>
              <a
                href={siteConfig.developerInstagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-100 underline decoration-amber-500/50 underline-offset-2 transition-colors font-semibold"
              >
                {siteConfig.developerName}
              </a>
            </div>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-amber-900/40 text-stone-300 hover:text-white hover:border-amber-700/60 transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Back to top</span>
          </button>

        </div>

      </div>
    </footer>
  );
};
