# 🌐 ViewRoom — Enterprise 360° Spatial Web & 3D Virtual Commerce Platform

<div align="center">

[![Live Application](https://img.shields.io/badge/Live_App-viewroom--360.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://viewroom-360.vercel.app)
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

| Service | Platform | Live URL | Status | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Web App** | Vercel (Edge CDN) | [https://viewroom-360.vercel.app](https://viewroom-360.vercel.app) | 🟢 Live & Healthy | Vite SPA with client-side routing & WebGL canvas |
| **Backend API Engine** | Render (Web Service) | [https://viewroom-api.onrender.com](https://viewroom-api.onrender.com) | 🟢 Live & Healthy | Node.js Express REST API with JWT Auth & Multer |
| **Real-time WebSockets** | Render (Socket.io) | `wss://viewroom-api.onrender.com` | 🟢 Live & Healthy | Full-duplex co-presence camera sync & live tours |
| **Primary Database** | Neon (AWS Serverless) | Serverless PostgreSQL Instance | 🟢 Live & Healthy | Distributed ACID relational database managed with Prisma |

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

## 🛠️ Technology Stack

### Frontend Client
- **Framework & Runtime**: React 19.2 + Vite 8.2 (Fast HMR & Rollup chunking)
- **360° Sphere Rendering**: `@photo-sphere-viewer/core` + `@photo-sphere-viewer/markers-plugin`
- **3D Canvas & WebGL**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **Styling & UI Components**: Tailwind CSS v4, DaisyUI v5
- **Animation & Motion**: GSAP 3.15 (GreenSock Animation Platform)
- **Data Visualization**: Recharts 3.10 (telemetry, revenue, view distribution)
- **Interactive Carousels**: Swiper 14.2 & React Fast Marquee
- **Real-time Client**: `socket.io-client` v4.8
- **Authentication**: Firebase Authentication + Custom Backend JWT Sync
- **Code Quality**: ESLint 9.17 with zero errors and zero warnings

### Backend Server & APIs
- **Runtime Environment**: Node.js v18+ (ES Modules)
- **Web Framework**: Express.js 4.18
- **Database ORM**: Prisma ORM 5.10 / 5.22
- **Database Engine**: Neon Serverless PostgreSQL (AWS Cloud)
- **Real-time Engine**: Socket.io v4.8
- **AI Integration**: Google Generative AI (`@google/generative-ai` Gemini 1.5 Flash)
- **Security & Cryptography**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`
- **File Uploads & Media**: Multer + Cloudinary CDN
- **Network Optimization**: Gzip/Brotli `compression`, `cors` whitelist

---

## 🏗️ Architecture & Project Structure

```
viewroom/
├── server/                        # Express.js REST API & WebSocket Backend
│   ├── index.js                   # Server entrypoint & WebSocket handlers
│   ├── prismaClient.js            # Shared Prisma Client instance
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verifyToken & requireRole RBAC middleware
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL models (User, VirtualTour, Scene, Analytics)
│   │   └── seed.js                # Database seed script with sample tours & users
│   ├── routes/
│   │   ├── adminRoutes.js         # Telemetry, user role management & revenue metrics
│   │   ├── authRoutes.js          # Authentication (Register, Login, Google OAuth, /me)
│   │   ├── ownerRoutes.js         # Creator studio, tour creation & scene management
│   │   ├── productRoutes.js       # 360° 3D Products CRUD with Prisma
│   │   └── tourRoutes.js          # 360° Tours, Scenes & Hotspots CRUD
│   ├── scripts/
│   │   └── setRole.js             # CLI tool to promote user roles (ADMIN, CREATOR, CLIENT)
│   └── sockets/
│       └── tourSocket.js          # Real-time WebSocket room & camera synchronization
│
├── src/                           # React 19 Frontend (Vite)
│   ├── components/
│   │   ├── dashboard/             # Admin, Creator, Client & Visitor Dashboards
│   │   ├── recruiter/             # Interactive Recruiter Role-Preview Sandbox
│   │   ├── reuseable/             # Standalone Logo, ThemeToggle, Button components
│   │   ├── spatial/               # Live Guided Tour real-time modal
│   │   ├── tour/                  # TourActionMenu, TourShareModal, TourThumbnailCarousel
│   │   └── universal/             # Universal Navbar, Footer, and Navigation
│   ├── context/
│   │   ├── AuthContext.jsx        # Global Auth State & Token Persistence
│   │   └── ThemeContext.jsx       # Theme Management (Default Light Mode + Dark Toggle)
│   ├── hooks/
│   │   └── useTourVoiceGuide.js   # Web Speech API & Google Gemini AI Voice Hook
│   ├── pages/
│   │   ├── Home/                  # Landing page (Hero, Featured, Hotspots, HowItWorks, FAQ)
│   │   ├── VirtualTour/           # VirtualTourViewer (Director's Tour, Hotspots, PSV)
│   │   ├── Product360/            # Three.js 3D PBR WebGL Customizer
│   │   ├── Matterport/            # Digital Twin Presence Showcase
│   │   ├── Explore/               # Curated spatial tours directory with pagination
│   │   ├── Contact/               # Interactive Contact & Inquiry Form
│   │   └── NotFound/              # Custom Glassmorphic 404 Page
│   ├── router/
│   │   └── AppRouter.jsx          # React.lazy Code-Splitting & Route Definitions
│   ├── services/
│   │   ├── api.js                 # Central Fetch API Client (Auto-targets live Render backend)
│   │   └── tourSocketService.js   # Real-time WebSocket Client
│   └── utils/
│       ├── soundEngine.js         # Web Audio API Procedural Synthesizer
│       └── tourHotspots.js        # Floor puck & doorway SVG marker generators
│
├── public/                        # Static assets (favicon.svg, logo.png, manifest.json)
├── vercel.json                    # Vercel SPA rewrites, caching & security headers
├── vite.config.js                 # Vite bundling, manual code-splitting & optimizations
└── package.json                   # Root package definition & developer scripts
```

---

## ⚡ Local Setup & Quickstart

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **PostgreSQL Database** (e.g. [Neon.tech](https://neon.tech/) Serverless Cloud)

### 1. Clone the Repository
```bash
git clone https://github.com/lizansarkar/viewroom.git
cd viewroom
```

### 2. Install Dependencies
```bash
# Install frontend root packages
npm install

# Install backend server packages
cd server
npm install
cd ..
```

### 3. Setup Environment Variables
Inside `server/`, create a `.env` file (refer to `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@ep-example.neon.tech/neondb?sslmode=require"
JWT_SECRET="your_secure_jwt_secret_key"
CLIENT_URL="http://localhost:5173"
GEMINI_API_KEY="your_optional_gemini_api_key"
```

Inside the root directory, create a `.env` file (if configuring custom API targets):
```env
VITE_API_BASE_URL="http://localhost:5000"
```
*(If omitted in development, the frontend automatically falls back to `http://localhost:5000` locally and `https://viewroom-api.onrender.com` in production).*

---

### 4. Run the Dev Servers

The project includes pre-configured concurrent and standalone scripts in `package.json` to streamline development:

```bash
# 🚀 1. Run Full-Stack (Frontend + Backend Concurrently)
npm run dev

# 🎨 2. Run Vite Frontend Only (http://localhost:5173)
npm run dev:client

# ⚙️ 3. Run Express Backend Only (http://localhost:5000)
npm run dev:server
# or
npm run server

# 🗄️ 4. Launch Prisma Studio Database GUI (http://localhost:5555)
npm run studio

# 👑 5. Promote or Manage User Roles via Command-Line CLI
npm run set-role user@example.com ADMIN
npm run set-role creator@example.com CREATOR
npm run set-role client@example.com CLIENT

# 🏗️ 6. Compile Production Frontend Build
npm run build

# 🔍 7. Run ESLint Code Quality Inspection
npm run lint

# 🌐 8. Preview Built Production Frontend
npm run preview
```

#### Detailed Scripts Reference:

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `concurrently -k "npm run server" "vite"` | Boots Express API server and Vite frontend concurrently with color-coded log streams. |
| `npm run dev:client` | `vite` | Starts Vite HMR dev server at `http://localhost:5173`. |
| `npm run dev:server` | `node server/index.js` | Starts Express REST API and Socket.io server at `http://localhost:5000`. |
| `npm run studio` | `npm --prefix server run studio` | Opens Prisma Studio visual database browser at `http://localhost:5555` to view & edit Neon PostgreSQL records. |
| `npm run set-role <email> [ROLE]` | `node server/scripts/setRole.js` | Instant CLI command to promote any user account to `ADMIN`, `CREATOR`, or `CLIENT` without writing SQL. |
| `npm run build` | `vite build` | Compiles and optimizes assets into `/dist` with Rollup code-splitting chunks. |
| `npm run lint` | `eslint .` | Validates all React components and backend files with strict flat-config ESLint rules. |
| `npm run preview` | `vite preview` | Serves the `/dist` production build locally for pre-flight testing. |

---

## 👥 User Roles & Access Control (RBAC)

ViewRoom enforces role-based access control across all API routes and dashboard views:

| Role | Permissions & Capabilities | Assigned Dashboard |
| :--- | :--- | :--- |
| **`ADMIN`** | • Full system telemetry & active user monitor<br>• Monthly/yearly revenue analytics<br>• User role assignment & account moderation<br>• Platform-wide tour publishing approval | `/dashboard` (Admin View) |
| **`CREATOR`** | • 360° Studio Tour Editor with visual floor puck hotspot placement<br>• Multi-scene panorama linking (Doors, Arrows, Kitchen, Bedroom)<br>• Tour creation, image uploads & 3D customizer publishing | `/dashboard` (Creator View) |
| **`CLIENT`** | • Saved tour bookmarks & tour history<br>• Inquiries, contact requests & guided tour participation<br>• Profile details management | `/dashboard` (Client View) |

### 🔑 Demo Credentials for Evaluators & Recruiters:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@viewroom.com` | `Password123!` | System telemetry, user role assignment, platform revenue, tour moderation |
| **Creator** | `creator@viewroom.com` | `Password123!` | 360° Tour creator studio, hotspot editor, 3D product uploads |
| **Client** | `client@viewroom.com` | `Password123!` | Tour bookmarks, inquiry management, interactive walkthroughs |

> **💡 Recruiter Sandbox**: Reviewers can also visit **`/recruiter-sandbox`** directly from the top navigation to switch roles on the fly without having to log in and out.

---

## 🗄️ Database Architecture & Schema (Neon PostgreSQL)

The database schema is defined in [`server/prisma/schema.prisma`](server/prisma/schema.prisma) and deployed to **Neon Serverless PostgreSQL**:

- **`User`**: Account identity, hashed passwords, avatar, and system role (`ADMIN`, `CREATOR`, `CLIENT`).
- **`VirtualTour`**: 360° tour metadata, category, price, creator reference, and published status.
- **`Scene`**: Individual panoramic nodes containing equirectangular 360° image URLs, yaw/pitch defaults, and spatial soundscape settings.
- **`Hotspot`**: Directional links and interactive markers connecting scenes together with yaw, pitch, targetSceneId, and custom icons.
- **`Product360`**: Three.js 3D models (GLTF/GLB) with customizable materials, colors, and 36-frame spin sequences.
- **`Analytics`**: Engagement metrics, tour view counts, and duration telemetry.
- **`ContactMessage`**: Client inquiries and contact submissions stored securely.

---

## 🧪 Quality, Performance & Verification

- **ESLint Compliance**: Strict ESLint flat config with **0 errors and 0 warnings**.
- **Production Build**: Verified with Vite 8.2 + Rollup asset chunking (`npm run build` in ~4.1s).
- **CORS & WebSockets**: Server natively permits Vercel production domains, local development, and external client origins with credentials.
- **Edge Deployment**: Frontend served via Vercel Edge Network with gzip/brotli compression and immutable asset caching.
- **Resilient Fallback**: Central API client automatically switches between localhost in development and the live Render API in production.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
