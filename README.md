# 🌐 ViewRoom — Enterprise 360° Spatial Web & 3D Virtual Commerce Platform

<div align="center">

[![Live Application](https://img.shields.io/badge/Live_App-viewroom--neon.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://viewroom-neon.vercel.app)
[![Live Backend API](https://img.shields.io/badge/Live_API-viewroom--api.onrender.com-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://viewroom-api.onrender.com)
[![Database](https://img.shields.io/badge/Neon_PostgreSQL-Serverless_Cloud-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)

<br />

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-v4-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5.10-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-0_Errors_Clean-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

</div>

---

## 🔗 Live Deployments

| Service | Platform | Live URL | Status |
| :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel (Vite SPA) | [https://viewroom-neon.vercel.app](https://viewroom-neon.vercel.app) | 🟢 Healthy |
| **Backend API Engine** | Render (Node/Express) | [https://viewroom-api.onrender.com](https://viewroom-api.onrender.com) | 🟢 Healthy |
| **Real-time WebSockets** | Render (Socket.io) | `wss://viewroom-api.onrender.com` | 🟢 Healthy |
| **Primary Database** | Neon.tech (PostgreSQL) | Serverless Neon AWS Cloud | 🟢 Healthy |

---

## 📖 Overview

**ViewRoom** is an award-grade, production-ready spatial web platform engineered for luxury real estate, 3D e-commerce, digital property showcases, and spatial photography. Built with cutting-edge WebGL, procedural audio synthesis, and real-time WebSocket infrastructure, ViewRoom empowers users to explore, customize, and tour photorealistic environments with zero friction.

---

## ✨ Key Features & Technical Highlights

### 1. 🎬 Cinematic Auto-Pilot / "Director's Tour"
- **Hands-Free Drone Walkthrough**: Viewers can relax and watch smooth, cinematic 360° camera glides that seamlessly travel from room to room.
- **Architectural Highlight Banners**: Floating frosted-glass overlays present key highlights, dimensions, and architectural insights for each space.
- **Interactive Hand-Off**: Instantly pauses upon user touch, click, or mouse drag, granting immediate manual exploration controls.
- **Ultra-Clean Glassmorphic HUD**: High-performance frosted blur UI with integrated procedural audio playback.

### 2. 🧭 360° Equirectangular Multi-Node Virtual Tours
- **Photo Sphere Engine**: Powered by `@photo-sphere-viewer/core` with spherical yaw/pitch navigation, zoom, and spatial markers.
- **Custom Hotspots**: Clean, borderless blur hotspots for Doors, Arrows, Circles, Kitchen, and Bathrooms.
- **Multi-Room Connected Graph**: Seamless navigation between living spaces, balconies, master suites, and exterior terraces.
- **GSAP Smooth Transitions**: Cinematic fade-dollies when switching between panoramic nodes.

### 3. 🪑 3D WebGL PBR Product Customizer (Three.js)
- **Physically Based Rendering (PBR)**: Real-time 3D orbit controls, realistic environment lighting, reflections, and shadow projections.
- **Material & Color Swapping**: Swap finishes (fabrics, metals, luxury wood grains) live on 3D GLTF models.
- **36-Frame Smooth Spin Sequence**: High-definition interactive 360° product turntable for e-commerce cataloging.

### 4. 🎙️ AI Voice Tour Guide & NLP Intent Engine
- **Web Speech API**: Real-time voice commands ("take me to kitchen", "go to balcony", "show highlights").
- **Google Gemini AI Fallback**: Complex spatial questions answered by Google Gemini 1.5 Flash spatial concierge.

### 5. 🎵 Procedural Spatial Sound Engine (Web Audio API)
- **Zero-Asset Audio Synthesis**: `UISoundEngine` synthesizes glass tap clicks, camera glide swooshes, and audio swells directly via Web Audio oscillators without external MP3 asset downloads.
- **Ambiance Multi-Track Synthesizer**: Generates customizable low-pass filtered binaural soundscapes (luxury lounge, piano acoustics, ocean breeze).

### 6. 👥 Real-Time Co-Presence Guided Tours (Socket.io)
- Synchronized multi-user live walkthroughs where hosts can lead clients in real-time.
- Viewport camera pitch, yaw, zoom, and room changes synchronized instantaneously via WebSockets.

### 7. 🔒 Enterprise Security & Granular RBAC
- **Unified JWT Authentication**: Token persistence with bcrypt password hashing.
- **Role-Based Access Control**: Tailored dashboards for `ADMIN`, `CREATOR`, and `CLIENT`.
- **Integrated Recruiter Sandbox**: Switch between roles on the fly without repeatedly logging in and out.

---

## 🏗️ Architecture & Project Structure

```
viewroom/
├── server/                        # Express.js REST API & WebSocket Backend
│   ├── index.js                   # Server entrypoint & WebSocket handlers
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verifyToken & requireRole RBAC middleware
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL models (User, VirtualTour, Scene, Product360)
│   │   └── seed.js                # Initial database seed script
│   └── routes/
│       ├── adminRoutes.js         # Platform telemetry & user role management
│       ├── authRoutes.js          # Authentication (Register, Login, /me)
│       ├── ownerRoutes.js         # Creator dashboard & tour management
│       ├── productRoutes.js       # 360° 3D Products CRUD with Prisma
│       └── tourRoutes.js          # 360° Tours & Scenes CRUD
│
├── src/                           # React 19 Frontend (Vite)
│   ├── components/
│   │   ├── dashboard/             # Admin, Creator, Client & Visitor Dashboards
│   │   ├── recruiter/             # Interactive Recruiter Role-Preview Sandbox
│   │   ├── reuseable/             # Standalone Logo, ThemeToggle, Button components
│   │   ├── spatial/               # Live Guided Tour modals & heatmaps
│   │   └── tour/                  # TourActionMenu, TourShareModal, TourThumbnailCarousel
│   ├── context/
│   │   ├── AuthContext.jsx        # Global Auth State & Token Persistence
│   │   └── ThemeContext.jsx       # Theme Management (Default Light Mode + Dark Toggle)
│   ├── hooks/
│   │   ├── useTourVoiceGuide.js   # Web Speech API & NLP Intent Hook
│   │   └── useMediaQuery.js       # Responsive Breakpoint Hook
│   ├── pages/
│   │   ├── VirtualTour/           # VirtualTourViewer & VirtualTour360 Pages
│   │   ├── Product360/            # Three.js 3D PBR WebGL Customizer
│   │   ├── Matterport/            # Digital Twin Presence Showcase
│   │   └── Explore/               # Curated spatial tours directory
│   ├── router/
│   │   └── AppRouter.jsx          # React.lazy Code-Splitting & Route Definitions
│   └── services/
│       ├── api.js                 # Central Fetch API Client (Auto-targets live Render backend)
│       └── tourSocketService.js   # Real-time WebSocket Client
│
├── public/                        # Static assets (favicon.svg, logo.png, manifest.json)
├── vercel.json                    # Vercel SPA rewrites & Vite build config
└── vite.config.js                 # Vite bundling & code-splitting rules
```

---

## ⚡ Local Setup & Quickstart

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/lizansarkar/viewroom.git
cd viewroom
```

### 2. Install Dependencies
```bash
# Install frontend packages
npm install

# Install backend packages
cd server
npm install
cd ..
```

### 3. Setup Environment Variables
Inside `server/`, create a `.env` file (refer to `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="your_postgresql_neon_connection_string"
JWT_SECRET="your_jwt_secret_key"
CLIENT_URL="http://localhost:5173"
GEMINI_API_KEY="your_optional_gemini_api_key"
```

### 4. Run the Dev Servers
```bash
# Terminal 1: Backend Server (Port 5000)
cd server
npm start

# Terminal 2: Frontend Client (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🔑 Demo Reviewer Credentials

For technical recruiters and reviewers evaluating role permissions:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@viewroom.com` | `Password123!` | System telemetry, user role assignment, platform-wide tour moderation |
| **Creator** | `creator@viewroom.com` | `Password123!` | 360° Tour creator studio, hotspot editor, 3D product uploads |
| **Client** | `client@viewroom.com` | `Password123!` | Tour bookmarks, inquiry management, interactive walkthroughs |

> **💡 Recruiter Sandbox**: You can also visit **`/recruiter-sandbox`** directly from the top navigation to switch roles on the fly without logging in and out.

---

## 🧪 Quality & Verification

- **ESLint Compliance**: Strict ESLint flat config with **0 errors and 0 warnings**.
- **Production Build**: Verified with Vite 8.2 + Rollup asset chunking (`npm run build` in ~8.6s).
- **CORS & WebSockets**: Server natively permits Vercel production domains, local development, and external client origins.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
