# 🌐 ViewRoom — Enterprise 360° Spatial Web & 3D Virtual Commerce Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-PostgreSQL-2D3748?logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon-Cloud_DB-00E599?logo=postgresql&logoColor=black)](https://neon.tech/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![ESLint](https://img.shields.io/badge/ESLint-0_Errors_Clean-4B32C3?logo=eslint&logoColor=white)](https://eslint.org/)

**ViewRoom** is a production-ready, full-stack spatial web application designed for real estate, luxury commercial properties, and interactive 3D e-commerce. Built with high performance, modular architecture, and modern security standards.

---

## ✨ Key Features & Technical Highlights

### 1. 🧭 360° Multi-Floor Spatial Virtual Tour
- **Equirectangular Panorama Engine**: Powered by `@photo-sphere-viewer/core` with smooth spherical panning, auto-rotation, and raycasted hotspot interaction.
- **Multi-Floor Connected Node Graph**: Walk through campus buildings, elevator portals, stairs, and drone aerial viewpoints with 0ms transition lag.
- **Cinematic GSAP Transitions**: Smooth opacity fades, zoom dollies, and interactive scene switches.

### 2. 🎙️ AI Voice Tour Guide & NLP Intent Engine
- **Web Speech API Integration**: Real-time microphone listening, continuous speech recognition, and acoustic echo cancellation.
- **Zero-Latency Client Intent Classifier**: Automatically extracts navigation targets, floor numbers, mute, and fullscreen commands with silence debouncing.
- **Cloud Gemini AI Fallback**: Natural language queries routed to Google Gemini 1.5 Flash for intelligent spatial concierge answers.

### 3. 🎵 Procedural Spatial Audio Engine (Web Audio API)
- **Zero-Asset Sound Synthesis**: Custom `UISoundEngine` synthesizes glass tap clicks, camera glide swooshes, and chord swells directly via Web Audio oscillators without external audio asset downloads.
- **Ambiance Multi-Track Synthesizer**: Generates customizable low-pass filtered binaural soundscapes (luxury piano, hotel lounge, ocean breeze).
- **Audio Lifecycle Management**: Context unlocked on initial user gesture with auto-pause via `IntersectionObserver` when out of viewport.

### 4. 🪑 3D PBR WebGL Product Customizer (Three.js)
- **Physically Based Rendering (PBR)**: Real-time 3D orbit controls, environment mapping, specular highlights, and mesh material swapping (metals, fabrics, dials).
- **36-Frame Smooth Spin Sequence**: High-definition interactive 360° product turntable for e-commerce cataloging.

### 5. 👥 Real-Time Co-Presence Guided Tours (WebSockets)
- Synchronized multi-user live walkthroughs via Socket.io.
- Real-time viewport camera pitch, yaw, zoom, and active room synchronization between host and clients.

### 6. 🔒 Enterprise Security & Role-Based Access Control (RBAC)
- **Token Hardening**: Unified JWT auth verification with bcrypt password hashing.
- **Granular RBAC**: Protected endpoints and dashboard views tailored for `ADMIN`, `CREATOR`, and `CLIENT`.
- **Database Unification**: Powered by Neon Cloud PostgreSQL with Prisma ORM schema (`User`, `VirtualTour`, `Scene`, `Hotspot`, `Product360`, `ProductVariant`, `ProductHotspot`).

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
│       ├── ownerRoutes.js         # Creator dashboard & stats routes
│       ├── productRoutes.js       # 360° 3D Products CRUD with Prisma
│       └── tourRoutes.js          # 360° Tours & Scenes CRUD
│
├── src/                           # React 19 Frontend (Vite)
│   ├── components/
│   │   ├── dashboard/             # Admin, Creator, Client & Visitor Dashboards
│   │   ├── recruiter/             # Interactive Recruiter Role-Preview Sandbox
│   │   ├── spatial/               # Live Guided Tour modals & heatmaps
│   │   └── tour/                  # TourActionMenu, TourShareModal, TourThumbnailCarousel
│   ├── context/
│   │   ├── AuthContext.jsx        # Global Auth State & Token Persistence
│   │   └── ThemeContext.jsx       # Dark / Spatial Theme Management
│   ├── hooks/
│   │   ├── useTourVoiceGuide.js   # Web Speech API & NLP Intent Hook
│   │   ├── useMediaQuery.js       # Responsive Breakpoint Hook
│   │   └── useTheme.js            # Theme Toggle Hook
│   ├── pages/
│   │   ├── VirtualTour/           # VirtualTourViewer & VirtualTour360 Pages
│   │   ├── Product360/            # Three.js 3D PBR WebGL Customizer
│   │   ├── Matterport/            # Digital Twin Presence Showcase
│   │   ├── NotFound/              # Spatial 404 Error Experience
│   │   └── ...                    # Explore, Auth, Contact, About Pages
│   ├── router/
│   │   └── AppRouter.jsx          # React.lazy Code-Splitting & Route Definitions
│   ├── services/
│   │   ├── api.js                 # Unified Fetch API Client
│   │   └── tourSocketService.js   # Real-time WebSocket Client
│   └── utils/
│       ├── tourSoundEngine.js     # Web Audio API Synthesizer Singletons
│       └── tourHotspots.js        # 3D Floor Puck & Drone HTML Builders
│
├── eslint.config.js               # Strict ESLint Flat Config (0 warnings)
└── vite.config.js                 # Rollup chunk optimization & dev proxy
```

---

## ⚡ Quickstart & Local Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/lizansarkar/viewroom.git
cd viewroom
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Setup Environment Variables
Create a `.env` file inside the `server/` folder (or copy from `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://username:password@ep-example-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
JWT_SECRET="viewroom_jwt_secret_key_super_secure_360_platform"
JWT_EXPIRES_IN="7d"
GEMINI_API_KEY="your_optional_gemini_api_key"
```

### 4. Run the Application
In terminal 1 (start backend API & WebSockets):
```bash
npm run server
```

In terminal 2 (start Vite client dev server):
```bash
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Reviewer Credentials

For technical recruiters, HR evaluators, and reviewers, predefined demo accounts are available to inspect role privileges:

| Role | Email | Password | Access Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@viewroom.com` | `Password123!` | System telemetry, user role assignment, platform-wide content deletion |
| **Creator** | Register or Promote | `Password123!` | 360° Tour creation, Scene hotspot mapping, 3D Product publishing |
| **Client** | `client@viewroom.com` | `Password123!` | Bookmark spaces, AI history, interactive 360° tours |

> **💡 Recruiter Sandbox**: You can also visit **`/recruiter-sandbox`** directly from the navigation to switch roles on the fly without logging in and out.

---

## 🧪 Quality & Verification

- **Code Hygiene**: Run `npm run lint` to verify **0 errors and 0 warnings** across the codebase.
- **Production Build**: Run `npm run build` to verify chunk code-splitting and asset bundling (~3s build time).
- **TypeScript & React 19 Compatibility**: Built with modern ES modules, strict lint rules, and clean React hooks lifecycle standards.

---

## 📄 License
This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
