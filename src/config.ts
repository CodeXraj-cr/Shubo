/**
 * Site Configuration for Durga Puja Photo Sharing
 * You can edit all site titles, dates, limits, and developer credits here.
 */
export const siteConfig = {
  siteName: "Puja Moments",
  bengaliTitle: "আমাদের পুজো",
  tagline: "শারদীয়ার আনন্দ ভাগ করে নিন",
  heroHeading: "Capture the Spirit of Durga Puja",
  heroSubheading: "Share your favourite Puja moments with everyone.",
  
  // Festival countdown target date (ISO format)
  pujaStartDate: "2027-10-08T00:00:00",

  // Developer credit
  developerName: "Raj Dutta",
  developerInstagram: "https://instagram.com/your_username",

  // Social handles
  instagramUrl: "https://instagram.com",
  facebookUrl: "https://facebook.com",

  // Upload constraints
  maxUploadSizeMB: 5,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],

  // Admin access passcode
  adminPasscode: "puja2027",

  // Categories available for tagging photos
  categories: [
    "All",
    "Pandal",
    "Pratima",
    "Dhak",
    "Cultural Program",
    "Sindoor Khela",
    "Anjali",
    "Food",
    "Friends & Family",
    "Other"
  ] as const,

  // Initial moderation mode:
  // 'immediate': New uploads are automatically approved and displayed publicly
  // 'moderated': New uploads are saved with status 'pending' and await admin approval
  defaultModerationMode: "immediate" as "immediate" | "moderated"
};

export type PhotoCategory = typeof siteConfig.categories[number];
