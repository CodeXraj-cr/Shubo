import { PhotoItem, ModerationMode, GalleryStats } from '../types';
import { siteConfig } from '../config';

const STORAGE_KEY = 'puja_moments_photos_v1';
const MODERATION_MODE_KEY = 'puja_moderation_mode_v1';
const LIKES_KEY = 'puja_user_likes_v1';

// Initial curated seed photos using generated festival assets
export const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 'seed-1',
    imageUrl: '/src/assets/images/durga_pratima_idol_1791953268188.jpg',
    uploaderName: 'Raj Dutta',
    caption: 'Divine grace of Maa Durga at Bagbazar Sarbojanin pandal. Subho Mahalaya to everyone!',
    category: 'Pratima',
    status: 'approved',
    featured: true,
    createdAt: '2026-10-12T18:30:00.000Z',
    likes: 142
  },
  {
    id: 'seed-2',
    imageUrl: '/src/assets/images/durga_dhak_drums_1791953269218.jpg',
    uploaderName: 'Sourav Ganguly',
    caption: 'The unforgettable resonance of Dhak and Kash flowers. Sharod shubhechha!',
    category: 'Dhak',
    status: 'approved',
    featured: true,
    createdAt: '2026-10-12T19:45:00.000Z',
    likes: 98
  },
  {
    id: 'seed-3',
    imageUrl: '/src/assets/images/durga_sindoor_khela_1791953269915.jpg',
    uploaderName: 'Ananya Mukherjee',
    caption: 'Joyous Sindoor Khela on Bijoya Dashami with mom and sisters. Asche bochhor abar hobe!',
    category: 'Sindoor Khela',
    status: 'approved',
    featured: true,
    createdAt: '2026-10-13T10:15:00.000Z',
    likes: 187
  },
  {
    id: 'seed-4',
    imageUrl: '/src/assets/images/durga_pandal_night_1791953269758.jpg',
    uploaderName: 'Subhasish Roy',
    caption: 'Mesmerizing night illumination and reflection at the grand temple-themed pandal.',
    category: 'Pandal',
    status: 'approved',
    featured: true,
    createdAt: '2026-10-13T14:20:00.000Z',
    likes: 215
  }
];

export function getStoredPhotos(): PhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS));
      return INITIAL_PHOTOS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_PHOTOS));
      return INITIAL_PHOTOS;
    }
    return parsed;
  } catch {
    return INITIAL_PHOTOS;
  }
}

export function saveStoredPhotos(photos: PhotoItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
  } catch (err) {
    console.error('Failed to save photos to storage:', err);
  }
}

export function getModerationMode(): ModerationMode {
  try {
    const mode = localStorage.getItem(MODERATION_MODE_KEY);
    if (mode === 'immediate' || mode === 'moderated') {
      return mode;
    }
  } catch {
    // fallback
  }
  return siteConfig.defaultModerationMode;
}

export function setModerationMode(mode: ModerationMode): void {
  try {
    localStorage.setItem(MODERATION_MODE_KEY, mode);
  } catch (err) {
    console.error('Failed to save moderation mode:', err);
  }
}

export function getUserLikes(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function toggleUserLike(photoId: string): { hasLiked: boolean; newLikes: number } {
  const currentLikes = getUserLikes();
  const photos = getStoredPhotos();
  const photo = photos.find(p => p.id === photoId);
  const isLiked = !!currentLikes[photoId];

  if (!photo) {
    return { hasLiked: false, newLikes: 0 };
  }

  if (isLiked) {
    delete currentLikes[photoId];
    photo.likes = Math.max(0, (photo.likes || 1) - 1);
  } else {
    currentLikes[photoId] = true;
    photo.likes = (photo.likes || 0) + 1;
  }

  localStorage.setItem(LIKES_KEY, JSON.stringify(currentLikes));
  saveStoredPhotos(photos);

  return { hasLiked: !isLiked, newLikes: photo.likes };
}

export function computeStats(photos: PhotoItem[]): GalleryStats {
  const approved = photos.filter(p => p.status === 'approved');
  const uniqueNames = new Set(approved.map(p => p.uploaderName.trim().toLowerCase()));
  const totalLikes = approved.reduce((acc, p) => acc + (p.likes || 0), 0);

  return {
    totalApproved: approved.length,
    totalContributors: uniqueNames.size,
    totalLikes
  };
}

/**
 * Resizes and compresses an image in-browser before upload.
 * Keeps aspect ratio with max dimension 1600px and JPEG/WEBP quality 0.85.
 */
export async function compressImage(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to process image'));
      img.onload = () => {
        const maxDimension = 1600;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return reject(new Error('Canvas context could not be created'));
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Prefer webp if supported, otherwise jpeg
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', 0.85);
          if (dataUrl.indexOf('data:image/webp') !== 0) {
            dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        }

        resolve({ dataUrl, width, height });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
