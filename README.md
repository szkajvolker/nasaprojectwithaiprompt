# The Artemis Archive — Powered by NASA

Build a cinematic, space-themed Next.js website called **"The Artemis Archive"** with two full sections. It should look like a sci-fi mission control interface. Use **Next.js (App Router)**, **TypeScript**, **Tailwind CSS v4**, and **Framer Motion**. Additional dependencies: `lucide-react`, `@vercel/analytics`.

---

## GLOBAL DESIGN SYSTEM

- **Fonts:** `Inter` (sans, body text) + `Roboto Mono` (monospace, HUD/labels) — both from Google Fonts via `next/font/google`. Set as CSS variables `--font-inter` and `--font-roboto-mono`.
- **Background color:** `#020617` (call it `deep-space`), used everywhere as body/page bg.
- **Text color:** white at varying opacities (white/40, white/50, white/60, white/70, white/80).
- **Accent:** indigo palette (indigo-300, indigo-400, indigo-500) at low opacities.
- **Scrollbar:** globally hidden (`scrollbar-width: none`).
- **Glass panel effect:** a reusable `.glass-panel` class — `background: rgba(0,0,0,0.7)`, `backdrop-filter: blur(24px)`, subtle `border: 1px solid rgba(255,255,255,0.08)`, box-shadow with faint indigo glow + inset black shadow.
- **Neon glow class** `.neon-green`: color `#4ade80` with layered green text-shadow.

---

## SECTION 1: SpaceScrollHero (Scroll-driven frame animation)

A full-screen, sticky scroll-driven animation that plays 151 Moon rotation frames on a `<canvas>`. Container height is `500vh`, viewport is `sticky top-0 h-screen`.

### Frame Sequence
- 151 JPEG frames at `/frames/ezgif-frame-001.jpg` through `ezgif-frame-151.jpg`.
- Preload all frames into `Image()` objects on mount. Show a loading spinner (spinning indigo ring + "Loading Lunar Sequence" text) until all frames load.
- Map scroll progress `[0, 0.8]` → frame index `[0, 150]`. Use `useScroll` + `useSpring` (stiffness: 80, damping: 30) for smooth interpolation.
- Draw frames on a canvas covering the full viewport, scaled with `object-cover` logic (Math.max scale ratio, centered).

### Dark Overlay
- A black div over the canvas. Opacity maps `[0, 0.15]` scroll → `[0.8, 0]` (starts dark, reveals the Moon).

### Mouse Parallax
- A custom `useMouseParallax(strength)` hook: tracks mouse position, calculates offset from viewport center, returns spring-animated `contentX`/`contentY` MotionValues. All floating text and HUD elements use these for subtle parallax.

### Floating Text Panels (5 panels, glassmorphic)
Each panel fades in/out at specific scroll ranges with unique entrance animations:

1. **"Voyage To The Lunar Surface"** (0%–15% scroll) — Centered, scales from 0.85→1→1.1. Glass panel with `rounded-2xl px-10 py-8`. Title: `text-4xl md:text-6xl font-bold tracking-tight`. Subtitle: `text-xs font-mono tracking-[0.3em] text-indigo-300/80 uppercase`. Divider: 16px wide indigo gradient line. Bottom text: `text-sm tracking-widest text-white/50 uppercase font-mono` "Unveiling The Dark Side".

2. **"Lunar Mechanics"** (15%–45%) — Positioned `top-1/2 right-8 md:right-16 -translate-y-1/2`. Slides in from x:80. Glass panel `rounded-xl px-8 py-6 max-w-xs`. Title: `text-2xl md:text-3xl`. Subtitle: `text-indigo-400`.

3. **"Silence of the Vacuum"** (35%–70%) — Positioned `top-1/2 left-8 md:left-16 -translate-y-1/2`. Slides in from x:-80. Same glass style. Subtitle: "151 Frames of Lunar Rotation" `text-indigo-400/70`.

4. **"Tracking Lunar Phases"** (55%–70%) — Positioned `bottom-24 right-8 md:right-16`. Slides up from y:60. Subtitle: "Beyond the Exosphere" `text-indigo-300/60`.

5. **"The Scale of the Void"** (72%–86%) — Centered paragraph panel `max-w-2xl`. Slides up from y:60, then exits translating to y:-200. Contains a factual paragraph about Earth-Moon distance (384,400 km, 1.28 light-seconds, Alpha Centauri comparison). `text-sm md:text-base leading-relaxed text-white/70`.

### Permanent HUD (z-20, pointer-events-none)
Opacity: starts at 0.65, reaches 1, then fades out at 93%–95% scroll. Four corner elements with `bg-deep-space rounded-full p-2`:

- **Top-left:** "REF: NASA-API-V2.04" — `text-xs font-mono text-white/70 tracking-widest`.
- **Top-right:** "SIGNAL STRENGTH: NOMINAL" + 5 ascending signal bars (3 static white bars at increasing heights + 2 pulsing bars that animate opacity [1, 0.25, 1] infinitely).
- **Bottom-left:** "TELEMETRY STREAM:" + status text that changes with scroll: OFFLINE (orange #fb923c, 0–5%), SYNCING (yellow #facc15, 5–15%), ACTIVE (green #4ade80, 15%+). Each has matching neon text-shadow glow. Animated SVG circle dot (8×8) pulses beside it.
- **Bottom-right:** "COORD:" + live coordinates that update on mouse move — convert mouse position to degree/minute/second format with E/W N/S directions.

**Mobile responsive HUD:** On mobile (`md:hidden`), top-left and top-right stack vertically in a column at `top-4 left-4`. Bottom-left and bottom-right stack vertically at `bottom-4 left-4`. Desktop uses absolute corner positioning with `hidden md:block`.

---

## SECTION 2: HeroSection (NASA APOD viewer)

Full-screen section below the scroll hero. Background: `radial-gradient(ellipse_at_center, #0c1445_0%, #020617_60%, #000000_100%)` + SVG noise filter overlay at 3% opacity. Content has mouse parallax (strength: 15).

### Header
- "Mission Data Feed" — `text-xs font-mono tracking-[0.4em] text-indigo-400/70 uppercase`.
- "Cosmic View" — `text-4xl md:text-6xl font-bold text-white tracking-tight`.
- "Astronomy Picture of the Day" — `text-lg text-white/40 font-light`.
- Divider: 24px wide indigo gradient line.
- Animates in with `whileInView` (opacity 0→1, y 30→0, duration 0.8, once).

### APOD Card (ApodCard component)
Floats with a gentle `y: [-10, 10, -10]` animation (6s infinite). On hover, shows a blurred indigo/purple glow behind (`-inset-4, blur-2xl`).

Card structure (`bg-deep-space/60 backdrop-blur-2xl rounded-2xl border border-white/8`):
- **Left (lg:w-1/2):** Image via `next/image` (fill, object-cover) with a loading skeleton (pulsing dark bg + spinning ring). For videos, embeds an iframe. Desktop: gradient overlay fading to deep-space on the right edge.
- **Right (lg:w-1/2):** Date badge (indigo pill), optional VIDEO badge (purple pill), title (`text-xl md:text-2xl font-bold`), scrollable description (`text-sm text-white/60`), copyright line.

### Data Fetching
- On mount, client-side fetch to `/api/apod` (no cache). Displays "No data received from NASA API" if null.
- **API Route** (`/api/apod`): Server-side route handler. Uses `process.env.NASA_API_KEY`. Without `?random=true` → fetches today's APOD. With `?random=true` → picks random date between 1995-06-16 and today. Revalidates every 3600s.

### Action Buttons
Two glass-panel buttons centered below the card:
1. **"Randomize Coordinates"** — indigo border, RefreshCw icon (spins when loading), fetches random APOD with AnimatePresence swap.
2. **"Return to Orbit"** — white border, ArrowUp icon, smooth scrolls to top.
Both have `whileHover: scale 1.03`, `whileTap: scale 0.97`. Text: `text-sm font-mono tracking-wider uppercase`.

---
Background resources:

Moon image created with Leonardo.AI
After that I made 5s long animation in Canva
and finally I used Ezgif to make image frames for better results.


## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## ENV & DEPLOY
- `.env.local`: `NASA_API_KEY=your_key` (get free from [api.nasa.gov](https://api.nasa.gov)).
- Deploy on Vercel. Set `NASA_API_KEY` in Vercel environment variables. Do NOT use `NEXT_PUBLIC_` prefix. Include `@vercel/analytics` with `<Analytics />` in body.
