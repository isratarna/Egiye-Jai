# 🌿 EgiyeJai — Volunteer Website

A warm, nature-inspired volunteering website built with **React + Vite + Tailwind CSS + Framer Motion**.

---

## 🗂 Project Structure

```
EgiyeJai/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── main.jsx              ← App entry point
    ├── App.jsx               ← Assembles all sections
    ├── index.css             ← Tailwind + global styles
    ├── data/
    │   └── content.js        ← All text, images & data (edit here!)
    ├── hooks/
    │   └── useParallax.js    ← useParallax() + useAnimatedCounter()
    └── components/
        ├── OpportunitiesSection.jsx
        ├── StatsSection.jsx
        ├── RecognitionSection.jsx
        ├── FeaturedOnSection.jsx
        ├── AboutSection.jsx
        ├── DonateSection.jsx
        ├── ContactSection.jsx
        └── Footer.jsx
```

---

## 🚀 Setup Instructions

### Step 1 — Prerequisites

Make sure you have **Node.js v18+** installed.

```bash
node -v    # should print v18.x.x or higher
npm -v     # should print 9.x.x or higher
```

If not installed → Download from https://nodejs.org

---

### Step 2 — Create a Vite + React project (skip if using this folder)

If you're starting from scratch:

```bash
npm create vite@latest EgiyeJai -- --template react
cd EgiyeJai
```

Or simply drop the provided files into any folder and proceed to Step 3.

---

### Step 3 — Install dependencies

```bash
npm install
```

This installs:
| Package | Purpose |
|---|---|
| `react`, `react-dom` | React 18 |
| `framer-motion` | Smooth animations & parallax |
| `react-intersection-observer` | Trigger animations on scroll |
| `tailwindcss` | Utility-first CSS |
| `autoprefixer`, `postcss` | CSS processing |
| `@vitejs/plugin-react` | Vite React plugin |

---

### Step 4 — Start development server

```bash
npm run dev
```

Open your browser at → **http://localhost:5173**

Hot-reloading is enabled — changes appear instantly.

---

### Step 5 — Build for production

```bash
npm run build
```

Output goes to the `dist/` folder. Preview the build locally:

```bash
npm run preview
```

---

## 🎨 Customisation Guide

### Change colors
Edit `tailwind.config.js` → `theme.extend.colors`

```js
teal: '#3d8b7a',    // primary brand color
green: '#5a8a4a',   // secondary green
earth: '#c8a97e',   // warm earth accent
cream: '#faf7f2',   // page background
```

### Change content / images
All data lives in one file: **`src/data/content.js`**

- `opportunities[]` → volunteering cards
- `stats[]` → animated counter numbers
- `volunteers[]` → recognition spotlight people
- `pressLogos[]` → "As Featured In" logos
- `aboutImages` → About section photos
- `donateBg` → Donate section background photo
- `donateImpact` → impact descriptions per dollar amount
- `footerLinks` → footer navigation links

### Swap images
Images use **Pexels** free stock photos. Replace any `img` URL with:
- Pexels: `https://images.pexels.com/photos/{ID}/...`
- Unsplash: `https://images.unsplash.com/photo-{ID}?w=700&q=80`
- Your own: drop files in `/public` and reference as `/my-image.jpg`

### Add the Navbar & Hero
In `src/App.jsx`, uncomment the placeholder and import your components:

```jsx
import Navbar      from './components/Navbar'
import HeroSection from './components/HeroSection'

export default function App() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <OpportunitiesSection />
      ...
    </main>
  )
}
```

---

## 🧩 Tech Stack

| Tool | Version | Why |
|---|---|---|
| Vite | 5.x | Lightning-fast dev server |
| React | 18.x | Component framework |
| Tailwind CSS | 3.x | Utility CSS, no stylesheet bloat |
| Framer Motion | 11.x | Buttery animations & scroll effects |
| react-intersection-observer | 9.x | Trigger animations in viewport |

---

## 🌐 Font Setup

Fonts are loaded via Google Fonts in `index.html`:
- **Lora** (serif) → headings, quotes, stats
- **DM Sans** (sans-serif) → body text, buttons, labels

No installation needed — works via CDN.

---

## 📋 Component Reference

| Component | Section | Key Features |
|---|---|---|
| `OpportunitiesSection` | Cards grid | Hover lift, image zoom, tag badges |
| `StatsSection` | Impact numbers | Animated counters, parallax bg |
| `RecognitionSection` | Volunteer spotlight | Auto-rotate, AnimatePresence transitions |
| `FeaturedOnSection` | Press logos | Grayscale → color hover |
| `AboutSection` | Our story | Image collage, parallax, value grid |
| `DonateSection` | Donate widget | Frequency toggle, preset amounts, impact text |
| `ContactSection` | Contact form | Validation, success state |
| `Footer` | Footer | Newsletter, links, social buttons |

---

## 💡 Tips

- The `useParallax(speed)` hook in `src/hooks/useParallax.js` can be reused on any element. Lower `speed` = subtler effect (0.1–0.35 is the sweet spot).
- All Framer Motion animations use `whileInView` with `once: true` so they fire once on scroll.
- The `pulse-btn` CSS class (in `index.css`) applies a ring-pulse to the Donate CTA.

---

Made with 💚 by EgiyeJai
