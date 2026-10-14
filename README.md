# Puja Moments (আমাদের পুজো) · Durga Puja Photo Sharing

A festive, mobile-first web application for community Durga Puja photo sharing, celebrating the spirit of pandals, pratimas, dhak beats, sindoor khela, and cultural memories.

## 🌸 Features

- **Festive Bengali Aesthetics**: Traditional deep red, warm cream, gold shimmer, alpana patterns, and animated glowing diyas.
- **Hero & Cultural Branding**:
  - Main Heading: *"Capture the Spirit of Durga Puja"*
  - Bengali Subtitle: *"আমাদের পুজো · শারদীয়ার আনন্দ ভাগ করে নিন"*
  - Dynamic Community Statistics: Photos Shared, People Joined, Memories Created.
- **Procedural Dhaak Audio Synthesizer**:
  - Authentic Bengali Dhaak rhythm, Kanshi chime, and auspicious conch (Shankha) tone generated via the Web Audio API.
  - Zero external MP3 dependency needed — works 100% offline and cross-browser without broken links.
  - User-controlled toggle (`🔊 Play Dhak / 🔇 Mute`) with animated sound visualizer bars.
- **Festival Countdown Timer**:
  - Live Days, Hours, Minutes, and Seconds countdown to Durga Puja (`siteConfig.pujaStartDate`).
  - Celebratory state: *"শুভ দুর্গাপূজা! ❤️"* with animated celebratory effects.
- **Easy Photo Upload (No Login Required)**:
  - Drag-and-drop or file selector for JPG, JPEG, PNG, WEBP (validated $\le 5$ MB).
  - Client-side auto-compression and canvas scaling for lightning-fast loads.
  - Tag by category: *Pandal, Pratima, Dhak, Cultural Program, Sindoor Khela, Anjali, Food, Friends & Family, Other*.
  - Upload progress bar, friendly error feedback, and success confirmation.
- **Curated & Community Gallery**:
  - Responsive masonry grid (4 columns desktop, 3 tablet, 2 mobile).
  - Search photos by uploader name, caption, or category.
  - Category filter tabs with active states.
  - Instant Love (❤️) reaction counter on every photo.
  - "Featured Moments" showcase section highlighting editor-picked highlights.
- **Fullscreen Lightbox Viewer**:
  - Large photo display with uploader name, date, category, and caption.
  - Previous / Next buttons, keyboard navigation (`ArrowLeft`, `ArrowRight`, `Esc`), and mobile swipe gestures.
  - One-click share utility.
- **Protected Admin Dashboard**:
  - Passcode protected (default: `puja2027` in `siteConfig.adminPasscode`).
  - Toggle between **Mode A** (photos appear immediately) and **Mode B** (photos require approval).
  - Approve, reject, feature, edit caption, or delete photos.
  - Filter by pending status, featured, or category.
- **Firebase Ready**:
  - Includes production-ready Firestore rules in `firebase/firestore.rules`.
  - Easy deployment to Vercel, Netlify, Render, or Firebase Hosting.

## ⚙️ Configuration (`src/config.ts`)

You can easily customize all site details in `src/config.ts`:

```typescript
export const siteConfig = {
  siteName: "Puja Moments",
  bengaliTitle: "আমাদের পুজো",
  tagline: "শারদীয়ার আনন্দ ভাগ করে নিন",
  heroHeading: "Capture the Spirit of Durga Puja",
  heroSubheading: "Share your favourite Puja moments with everyone.",
  pujaStartDate: "2027-10-08T00:00:00",
  developerName: "Raj Dutta",
  developerInstagram: "https://instagram.com/your_username",
  maxUploadSizeMB: 5,
  adminPasscode: "puja2027",
  defaultModerationMode: "immediate" // 'immediate' or 'moderated'
};
```

## 🛠️ Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Lucide Icons**
- **Web Audio API** (Procedural Dhak synthesizer)
- **HTML5 Canvas** (Client-side image compression)

---

Designed & Developed by **Raj Dutta**
*(Instagram: @your_username)*
