import React, { useState, useEffect } from 'react';
import { Camera, Volume2, VolumeX, Menu, X, Shield, Sparkles } from 'lucide-react';
import { siteConfig } from '../config';
import { dhakAudio } from '../utils/audioEngine';

interface NavbarProps {
  onOpenUpload: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenUpload, onOpenAdmin }) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dhakAudio.setListener((playing) => {
      setIsPlayingAudio(playing);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      dhakAudio.stop();
    };
  }, []);

  const handleToggleAudio = () => {
    dhakAudio.toggle();
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Moments', href: '#gallery' },
    { label: 'Countdown', href: '#countdown' },
    { label: 'About Puja', href: '#about' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#150608]/95 backdrop-blur-md border-b border-amber-900/40 shadow-lg shadow-black/40 py-3'
          : 'bg-gradient-to-b from-[#0c0506]/90 via-[#0c0506]/60 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (Nav Links) — Zone 3 (Actions) */}
        <div className="flex items-center justify-between gap-8">
          {/* Zone 1: Brand wordmark */}
          <a href="#home" className="flex items-center gap-2.5 whitespace-nowrap shrink-0 group">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-red-700 flex items-center justify-center shadow-md shadow-amber-950/50 text-amber-100 font-bold text-sm">
              ॐ
            </span>
            <div className="flex flex-col">
              <span className="font-bengali text-lg sm:text-xl font-bold text-amber-200 tracking-wide leading-none group-hover:text-amber-100 transition-colors">
                {siteConfig.bengaliTitle}
              </span>
              <span className="text-[11px] font-medium tracking-wider text-amber-300/70 uppercase">
                {siteConfig.siteName}
              </span>
            </div>
          </a>

          {/* Zone 2: Single-line clean text nav links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-amber-100/80">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors hover:underline underline-offset-4 decoration-amber-500/60"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={onOpenAdmin}
              className="whitespace-nowrap shrink-0 flex items-center gap-1.5 text-xs text-amber-300/70 hover:text-amber-200 transition-colors"
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Zone 3: Audio Dhaak toggle + 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Festival Sound toggle */}
            <button
              onClick={handleToggleAudio}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap shrink-0 border ${
                isPlayingAudio
                  ? 'bg-amber-500/20 text-amber-200 border-amber-500/50 shadow-sm shadow-amber-500/20'
                  : 'bg-stone-900/70 text-amber-100/70 border-amber-900/30 hover:text-amber-100 hover:border-amber-700/50'
              }`}
              title={isPlayingAudio ? 'Mute Dhak Beats' : 'Play Authentic Bengali Dhak Beats'}
              aria-label="Toggle Dhak Music"
            >
              {isPlayingAudio ? (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  <span className="hidden sm:inline">Dhaak Beats</span>
                  <span className="flex gap-0.5 items-end h-3">
                    <span className="w-0.5 bg-amber-400 h-2 animate-bounce"></span>
                    <span className="w-0.5 bg-amber-400 h-3 animate-bounce [animation-delay:0.15s]"></span>
                    <span className="w-0.5 bg-amber-400 h-1.5 animate-bounce [animation-delay:0.3s]"></span>
                  </span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-amber-300/60" />
                  <span className="hidden sm:inline">Play Dhak</span>
                </>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 rounded-lg hover:from-amber-300 hover:to-yellow-400 transition-all shadow-md shadow-amber-600/30 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-stone-900" />
              <span>Share Photo</span>
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-amber-200 hover:text-white"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 pt-3 border-t border-amber-900/30 flex flex-col gap-3 pb-2 text-sm text-amber-100 bg-[#160608]/95 p-4 rounded-xl">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="py-1.5 hover:text-amber-300 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2 border-t border-amber-900/30 flex items-center justify-between">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="flex items-center gap-2 text-amber-300 text-xs py-1"
              >
                <Shield className="w-4 h-4 text-amber-400" />
                <span>Admin Moderation</span>
              </button>
              <span className="text-[11px] text-amber-400/60 font-bengali">
                {siteConfig.tagline}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
