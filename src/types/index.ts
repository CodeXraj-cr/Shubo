export interface PhotoItem {
  id: string;
  imageUrl: string;
  storagePath?: string;
  uploaderName: string;
  caption?: string;
  category: string;
  status: 'approved' | 'pending' | 'rejected';
  featured: boolean;
  createdAt: string;
  likes: number;
  width?: number;
  height?: number;
}

export type ModerationMode = 'immediate' | 'moderated';

export interface GalleryStats {
  totalApproved: number;
  totalContributors: number;
  totalLikes: number;
}
