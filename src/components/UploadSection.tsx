import React, { useState, useRef, DragEvent } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle2, AlertCircle, Sparkles, Loader2, Heart } from 'lucide-react';
import { siteConfig } from '../config';
import { PhotoItem, ModerationMode } from '../types';
import { compressImage } from '../utils/storage';

interface UploadSectionProps {
  moderationMode: ModerationMode;
  onPhotoUploaded: (photo: PhotoItem) => void;
  onViewGallery: () => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  moderationMode,
  onPhotoUploaded,
  onViewGallery,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploaderName, setUploaderName] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState<string>('Pandal');
  const [isDragging, setIsDragging] = useState(false);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [lastUploadedPhoto, setLastUploadedPhoto] = useState<PhotoItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = siteConfig.categories.filter((c) => c !== 'All');

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    setUploadSuccess(false);

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('Please upload a JPG, PNG, or WEBP image.');
      return;
    }

    // Validate size (max 5 MB)
    const maxBytes = siteConfig.maxUploadSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage(`Please choose an image smaller than ${siteConfig.maxUploadSizeMB} MB.`);
      return;
    }

    setSelectedFile(file);

    // Local object URL for quick preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleClearSelected = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedFile) {
      setErrorMessage('Please choose or drag-and-drop a photo first.');
      return;
    }

    const trimmedName = uploaderName.trim();
    if (!trimmedName) {
      setErrorMessage('Please enter your name.');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(20);

      // Simulate step progress & perform fast client-side image compression
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => (prev < 80 ? prev + 15 : prev));
      }, 100);

      const { dataUrl, width, height } = await compressImage(selectedFile);
      clearInterval(progressTimer);
      setUploadProgress(95);

      const isApproved = moderationMode === 'immediate';

      const newPhoto: PhotoItem = {
        id: `puja-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        imageUrl: dataUrl,
        storagePath: `puja-photos/${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
        uploaderName: trimmedName,
        caption: caption.trim() || undefined,
        category: category,
        status: isApproved ? 'approved' : 'pending',
        featured: false,
        createdAt: new Date().toISOString(),
        likes: 1, // Uploader's own love
        width,
        height,
      };

      setUploadProgress(100);
      onPhotoUploaded(newPhoto);
      setLastUploadedPhoto(newPhoto);
      setUploadSuccess(true);
      setIsUploading(false);

      // Reset file input
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setIsUploading(false);
      setErrorMessage('An unexpected error occurred while preparing your photo. Please try again.');
      console.error(err);
    }
  };

  return (
    <section id="upload" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/40 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bengali">আনন্দ ভাগ করে নিন</span>
          <span className="text-amber-500/50">·</span>
          <span>Community Upload</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-2">
          Share Your Puja Moment
        </h2>
        <p className="font-bengali text-amber-200/80 text-base max-w-lg mx-auto">
          আপনার তোলা ঠাকুর, মণ্ডপ, ঢাকের বাদ্য কিংবা সিঁদুর খেলার সেরা ছবি আমাদের গ্যালারিতে যোগ করুন
        </p>
      </div>

      <div className="bg-[#19080b]/90 border border-amber-900/50 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
        
        {/* Success Banner */}
        {uploadSuccess && (
          <div className="mb-8 p-5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0" />
              <div>
                <h3 className="font-semibold text-white text-base">
                  Your Puja moment has been added! ❤️
                </h3>
                <p className="text-xs text-emerald-300/80 font-bengali mt-0.5">
                  {lastUploadedPhoto?.status === 'approved'
                    ? 'আপনার ছবি সফলভাবে গ্যালারিতে প্রকাশিত হয়েছে।'
                    : 'আপনার ছবি জমা হয়েছে, অ্যাডমিন অনুমোদনের পর গ্যালারিতে দৃশ্যমান হবে।'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setUploadSuccess(false);
                onViewGallery();
              }}
              className="px-4 py-2 text-xs font-semibold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow"
            >
              View Gallery
            </button>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Photo Dropzone or Preview */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-2">
              Upload Photo <span className="text-red-400">*</span> (JPG, PNG, WEBP · Max 5MB)
            </label>

            {!previewUrl ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-amber-400 bg-amber-950/30 scale-[1.01]'
                    : 'border-amber-900/60 bg-[#120507]/60 hover:border-amber-600/60 hover:bg-[#120507]/90'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/jpg"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-300 shadow-inner">
                    <Upload className="w-7 h-7 text-amber-400" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-100">
                      Drag & Drop your photo here
                    </p>
                    <p className="text-xs text-amber-300/60 font-medium">or</p>
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Choose Photo
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-200/50 mt-1">
                    High resolution Durga Puja memories look best!
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative rounded-xl overflow-hidden border border-amber-700/50 bg-black/60 max-h-80 flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="Selected Puja Moment preview"
                  className="max-h-80 w-auto object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={handleClearSelected}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-stone-900/80 hover:bg-red-900/90 text-white transition-colors border border-amber-700/40"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-[11px] text-amber-200 font-mono">
                  {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                </div>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            {/* Uploader Name */}
            <div>
              <label className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-1.5">
                Your Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={60}
                value={uploaderName}
                onChange={(e) => setUploaderName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 bg-[#120507] border border-amber-900/60 rounded-xl text-amber-100 text-sm placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors"
              />
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#120507] border border-amber-900/60 rounded-xl text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#1a070a] text-amber-100">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Optional Caption */}
          <div>
            <label className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-1.5">
              Caption <span className="text-amber-400/50 lowercase font-normal">(optional)</span>
            </label>
            <textarea
              rows={3}
              maxLength={280}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something about this moment... e.g. pandal location, artist name, feeling"
              className="w-full px-4 py-2.5 bg-[#120507] border border-amber-900/60 rounded-xl text-amber-100 text-sm placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-colors resize-none"
            />
            <div className="flex justify-end mt-1 text-[11px] text-stone-500">
              {caption.length}/280
            </div>
          </div>

          {/* Upload Progress Bar if active */}
          {isUploading && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-amber-200 font-medium">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  Optimizing & uploading photo...
                </span>
                <span className="font-mono tabular-nums">{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-stone-900 rounded-full overflow-hidden border border-amber-900/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-red-500 transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-3.5 px-6 rounded-xl font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isUploading
                  ? 'bg-amber-600/40 text-amber-200/50 cursor-not-allowed'
                  : 'text-stone-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 shadow-amber-600/25 hover:shadow-amber-500/40 active:scale-[0.99]'
              }`}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-stone-950" />
                  <span>Adding to Puja Gallery...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-stone-950" />
                  <span>Upload to Puja Gallery</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-amber-200/50 mt-2.5">
              No account required. By uploading, you agree to share your photo with the Durga Puja community.
            </p>
          </div>

        </form>
      </div>
    </section>
  );
};
