# ViewRoom - Project Summary

**Tagline:** *"Step inside. Before you step in."*

ViewRoom is a **frontend React single-page application** serving as a marketing/showcase website for an immersive 360-degree virtual tour platform. It allows users to explore homes, hotels, and spaces through 360-degree panoramic experiences.

> **Note:** This is currently a **frontend prototype/marketing site**. There is no backend, no database, no API layer, and no authentication system.

---

## Tech Stack

| Category | Technology | Version |
|----------|-----------|---------|
| Framework | React | ^19.2.8 |
| Routing | React Router DOM | ^7.18.2 |
| Build Tool | Vite | ^8.2.1 |
| Styling | Tailwind CSS | ^4.3.3 |
| UI Components | DaisyUI | ^5.7.17 |
| 3D Rendering | Three.js + @react-three/fiber + drei | ^0.185.1 |
| Animation | GSAP (installed, not used) | ^3.15.0 |
| Linting | ESLint | ^9.17.0 |
| Fonts | Raleway (headings) + Inter (body) | Google Fonts |

---

## Project Structure

```
viewroom/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── three/             # Three.js 3D components (empty stubs)
│   │   ├── reuseable/         # Reusable UI (Button, ThemeToggle, etc.)
│   │   └── universal/         # Layout (Navbar, Footer)
│   ├── context/
│   │   └── ThemeContext.jsx    # Dark/light theme state
│   ├── hooks/                 # Custom hooks (empty stubs)
│   ├── pages/
│   │   ├── Home/              # Homepage (8 sections)
│   │   ├── VirtualTour/       # 360 virtual tour page
│   │   ├── Product360/        # Product 360 photography page
│   │   ├── Video360/          # 360 video production page
│   │   ├── Matterport/        # Matterport 3D scanning page
│   │   ├── Photography/       # Photography services page
│   │   ├── About/             # About page
│   │   └── Contact/           # Contact form page
│   ├── router/
│   │   └── AppRouter.jsx      # Route definitions
│   ├── App.jsx                # Root component
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles + DaisyUI themes
├── dist/                      # Production build output
├── package.json
├── vite.config.js
└── eslint.config.js
```

---

## Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Home | Landing page with 3D black hole hero |
| `/360-virtual-tour` | VirtualTour360 | Virtual tour service with 3D panorama viewer |
| `/360-product` | Product360 | Product 360 photography service |
| `/360-video` | Video360 | 360 video production service |
| `/matterport` | Matterport | Matterport 3D scanning service |
| `/photography` | Photography | Professional photography service |
| `/about` | About | About page |
| `/contact` | Contact | Contact form page |

---

## Application Flow

```
index.html
  → src/main.jsx (ReactDOM.createRoot + BrowserRouter)
    → src/App.jsx (ThemeProvider → Navbar → AppRouter → Footer)
      → src/router/AppRouter.jsx (Route definitions)
        → Page components
```

---

## Key Components

### Layout
- **Navbar** (`src/components/universal/Navbar.jsx`) - Sticky nav with desktop links, theme toggle, mobile hamburger menu
- **Footer** (`src/components/universal/Footer.jsx`) - 6-column footer with social links

### Reusable
- **Button** (`src/components/reuseable/Button.jsx`) - 3D-styled pill button with press animation
- **ThemeToggle** (`src/components/reuseable/ThemeToggle.jsx`) - Dark/light theme toggle

### 3D
- **Hero** (`src/pages/Home/Hero.jsx`) - Procedurally generated black hole with accretion disk using Three.js
- **Panorama Viewer** (`src/pages/VirtualTour/VirtualTour360.jsx`) - 360-degree sphere viewer

---

## Homepage Sections (in order)

1. **Hero** - 3D black hole animation with headline and CTAs
2. **Explore** - 4-column feature grid (Homes, Hotels, Rooms, Kitchens)
3. **Featured** - Spotlight on a featured tour with badges
4. **HowItWorks** - 3-step explanation with images
5. **Hotspots** - Explains hotspot navigation in virtual tours
6. **Discover** - Contact information (email, phone, office)
7. **Properties** - 3x2 grid of property cards
8. **Cta** - Final call-to-action section

---

## Theming System

Two custom DaisyUI themes defined in `src/index.css`:
- **viewroom-light** (default) - Dark backgrounds (#0a0a0a) with light text
- **viewroom-dark** - Light backgrounds (#f5f5f0) with dark text

Theme persists to `localStorage` and detects system preference via `prefers-color-scheme: dark`.

---

## Build & Run

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

---

## Incomplete / Stub Files

The following files exist but are empty or contain only placeholder text:
- `src/components/three/Camera.jsx`
- `src/components/three/Experience.jsx`
- `src/components/three/Lights.jsx`
- `src/components/three/Scene.jsx`
- `src/components/reuseable/Logo.jsx`
- `src/components/reuseable/Loading.jsx`
- `src/components/reuseable/SectionTitle.jsx`
- `src/hooks/useTheme.js`
- `src/hooks/useMediaQuery.js`
- `src/pages/Home/PropertyShowcase.jsx`
- `src/pages/Home/ImmersiveScroll.jsx`
- `src/pages/Home/ParalaxMask.jsx`
- `src/pages/Home/UniqeLayout.jsx`

---

## Known Issues

1. **GSAP** is installed but never imported or used in any source file
2. **Theme names are semantically inverted** - "light" theme has dark colors and vice versa
3. **Router.jsx** in `src/routes/` is defined but never imported (unused)
4. **Contact form** is client-side only - no backend submission
5. **All data is hardcoded** - no API calls or external data sources
6. **All images** are loaded from Unsplash URLs (no local assets)
7. **No testing** - no test files, no testing libraries, no test scripts
8. **No deployment config** - no Dockerfile, CI/CD, or hosting platform config

---

## Data

- All property/tour/product data is hardcoded as JavaScript arrays within each page component
- All images are loaded from Unsplash URLs
- No API calls, no data fetching, no external data sources
