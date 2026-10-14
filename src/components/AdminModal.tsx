import React, { useState } from 'react';
import {
  X,
  Shield,
  CheckCircle2,
  XCircle,
  Trash2,
  Star,
  Edit2,
  Lock,
  Unlock,
  Filter,
  Search,
  RefreshCw,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { PhotoItem, ModerationMode } from '../types';
import { siteConfig } from '../config';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PhotoItem[];
  moderationMode: ModerationMode;
  onUpdateModerationMode: (mode: ModerationMode) => void;
  onUpdatePhotoStatus: (photoId: string, status: 'approved' | 'rejected' | 'pending') => void;
  onToggleFeatured: (photoId: string) => void;
  onDeletePhoto: (photoId: string) => void;
  onEditCaption: (photoId: string, newCaption: string) => void;
  onResetToDefaults: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  photos,
  moderationMode,
  onUpdateModerationMode,
  onUpdatePhotoStatus,
  onToggleFeatured,
  onDeletePhoto,
  onEditCaption,
  onResetToDefaults,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'featured'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Edit Caption Inline state
  const [editingPhotoId, setEditingPhotoId] = useState<string | null>(null);
  const [editCaptionText, setEditCaptionText] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === siteConfig.adminPasscode) {
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError(`Incorrect passcode. (Default demo passcode: ${siteConfig.adminPasscode})`);
    }
  };

  const handleStartEdit = (photo: PhotoItem) => {
    setEditingPhotoId(photo.id);
    setEditCaptionText(photo.caption || '');
  };

  const handleSaveEdit = (photoId: string) => {
    onEditCaption(photoId, editCaptionText);
    setEditingPhotoId(null);
  };

  // Filter photos
  const filtered = photos.filter((photo) => {
    // Status Tab check
    if (activeTab === 'pending' && photo.status !== 'pending') return false;
    if (activeTab === 'featured' && !photo.featured) return false;

    // Category check
    if (categoryFilter !== 'All' && photo.category !== categoryFilter) return false;

    // Search check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = photo.uploaderName.toLowerCase().includes(q);
      const matchCap = photo.caption ? photo.caption.toLowerCase().includes(q) : false;
      const matchCat = photo.category.toLowerCase().includes(q);
      return matchName || matchCap || matchCat;
    }

    return true;
  });

  const pendingCount = photos.filter((p) => p.status === 'pending').length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="bg-[#18080a] border border-amber-900/60 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/40 bg-[#1e0a0d]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="font-display text-lg font-bold text-white">
              Puja Moments Admin Panel
            </h3>
            {isAuthenticated && (
              <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
                Authenticated
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        {!isAuthenticated ? (
          /* Passcode Protected Form */
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/70 border border-amber-800/50 flex items-center justify-center text-amber-400 mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>
            <h4 className="text-xl font-bold text-white mb-2 font-display">
              Admin Access Required
            </h4>
            <p className="text-xs text-amber-200/70 mb-6">
              Enter your admin passcode to moderate community photos, toggle featured items, or change publication mode.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode (e.g. puja2027)"
                  className="w-full px-4 py-2.5 bg-[#120507] border border-amber-900/60 rounded-xl text-center text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {authError && (
                <p className="text-xs text-red-400 font-medium">{authError}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Unlock Admin Dashboard
              </button>
            </form>

            <p className="text-[11px] text-stone-500 mt-4">
              Demo access code is: <code className="text-amber-300/80">{siteConfig.adminPasscode}</code>
            </p>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            
            {/* Moderation Mode & Actions Banner */}
            <div className="p-4 bg-[#140608] border-b border-amber-900/30 flex flex-wrap items-center justify-between gap-4">
              
              {/* Mode A vs Mode B configuration toggle */}
              <div className="flex items-center gap-3">
                <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-amber-100 uppercase tracking-wider block">
                    Upload Publishing Mode:
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => onUpdateModerationMode('immediate')}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                        moderationMode === 'immediate'
                          ? 'bg-amber-400 text-stone-950 font-semibold'
                          : 'bg-stone-900 text-stone-300 hover:text-white'
                      }`}
                    >
                      Mode A: Immediate
                    </button>
                    <button
                      onClick={() => onUpdateModerationMode('moderated')}
                      className={`px-3 py-1 text-xs rounded-md font-medium transition-colors cursor-pointer ${
                        moderationMode === 'moderated'
                          ? 'bg-amber-400 text-stone-950 font-semibold'
                          : 'bg-stone-900 text-stone-300 hover:text-white'
                      }`}
                    >
                      Mode B: Moderation Required
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset to initial seeds button */}
              <button
                onClick={onResetToDefaults}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-200/80 hover:text-white text-xs border border-amber-900/40 transition-colors"
                title="Restore default sample photos"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Demo Photos</span>
              </button>
            </div>

            {/* Filter & Search Bar */}
            <div className="p-4 border-b border-amber-900/30 bg-[#160608] flex flex-wrap items-center justify-between gap-3">
              {/* Tabs */}
              <div className="flex items-center gap-1 bg-[#120507] p-1 rounded-lg border border-amber-900/40">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    activeTab === 'all'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  All ({photos.length})
                </button>
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'pending'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span>Pending</span>
                  {pendingCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                      {pendingCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('featured')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    activeTab === 'featured'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Featured ({photos.filter((p) => p.featured).length})
                </button>
              </div>

              {/* Category & Search inputs */}
              <div className="flex items-center gap-2 flex-1 max-w-md justify-end">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-[#120507] border border-amber-900/50 rounded-lg text-xs text-amber-100"
                >
                  {siteConfig.categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Filter name or caption..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-1.5 bg-[#120507] border border-amber-900/50 rounded-lg text-xs text-amber-100 placeholder-stone-500 w-44"
                />
              </div>
            </div>

            {/* Photos Table / List View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-stone-400 text-sm">
                  No photos match your filter.
                </div>
              ) : (
                filtered.map((photo) => (
                  <div
                    key={photo.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3.5 bg-[#130507] border border-amber-900/35 rounded-xl hover:border-amber-700/50 transition-colors"
                  >
                    {/* Thumbnail & Basic Info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={photo.imageUrl}
                        alt="Puja thumbnail"
                        className="w-16 h-14 object-cover rounded-lg bg-stone-900 shrink-0 border border-amber-900/40"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white text-sm truncate">
                            {photo.uploaderName}
                          </span>
                          <span className="text-[10px] text-amber-300/80 bg-stone-900 px-2 py-0.5 rounded border border-amber-900/40">
                            {photo.category}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-semibold ${
                              photo.status === 'approved'
                                ? 'bg-emerald-950 text-emerald-300'
                                : photo.status === 'pending'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-red-950 text-red-300'
                            }`}
                          >
                            {photo.status}
                          </span>
                        </div>

                        {/* Inline Caption Editor */}
                        {editingPhotoId === photo.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={editCaptionText}
                              onChange={(e) => setEditCaptionText(e.target.value)}
                              className="px-2 py-1 text-xs bg-stone-900 border border-amber-500 rounded text-white w-64"
                            />
                            <button
                              onClick={() => handleSaveEdit(photo.id)}
                              className="text-xs bg-amber-400 text-stone-950 px-2 py-1 rounded font-medium"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPhotoId(null)}
                              className="text-xs text-stone-400 hover:text-white"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-stone-300 truncate max-w-sm mt-0.5">
                            {photo.caption || <span className="italic text-stone-500">No caption</span>}
                          </p>
                        )}
                        <span className="text-[11px] text-stone-500">
                          {new Date(photo.createdAt).toLocaleDateString()} · {photo.likes || 0} ❤️
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      {/* Edit Caption */}
                      <button
                        onClick={() => handleStartEdit(photo)}
                        className="p-1.5 rounded-lg bg-stone-900 text-stone-300 hover:text-white border border-amber-900/30"
                        title="Edit caption"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Featured toggle */}
                      <button
                        onClick={() => onToggleFeatured(photo.id)}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          photo.featured
                            ? 'bg-amber-400 text-stone-950 border-amber-400'
                            : 'bg-stone-900 text-stone-400 hover:text-amber-300 border-amber-900/30'
                        }`}
                        title={photo.featured ? 'Unmark featured' : 'Mark as featured'}
                      >
                        <Star className="w-3.5 h-3.5" />
                      </button>

                      {/* Status changes: Approve / Reject */}
                      {photo.status !== 'approved' && (
                        <button
                          onClick={() => onUpdatePhotoStatus(photo.id, 'approved')}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-500/30"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      )}

                      {photo.status === 'approved' && (
                        <button
                          onClick={() => onUpdatePhotoStatus(photo.id, 'rejected')}
                          className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-900 text-stone-400 hover:text-amber-300 border border-amber-900/30"
                          title="Hide from public gallery"
                        >
                          <span>Hide</span>
                        </button>
                      )}

                      {/* Delete */}
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete photo uploaded by ${photo.uploaderName}?`)) {
                            onDeletePhoto(photo.id);
                          }
                        }}
                        className="p-1.5 rounded-lg bg-stone-900 text-stone-400 hover:text-red-400 hover:bg-red-950 border border-amber-900/30 transition-colors"
                        title="Delete photo permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
