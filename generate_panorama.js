import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure output directory exists
const panoramaDir = path.join(__dirname, 'client', 'public', 'panoramas');
if (!fs.existsSync(panoramaDir)) {
  fs.mkdirSync(panoramaDir, { recursive: true });
}

const width = 2048;
const height = 1024;

// Generate SVG equirectangular panorama with rich gradients, furniture shapes, windows, lights, and floor
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <!-- Ceiling to floor gradient -->
    <linearGradient id="wallGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="35%" stop-color="#1e293b" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="52%" stop-color="#475569" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>

    <!-- Wood floor pattern -->
    <linearGradient id="floorGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#78350f" />
      <stop offset="30%" stop-color="#451a03" />
      <stop offset="100%" stop-color="#1c1917" />
    </linearGradient>

    <!-- Window Light -->
    <linearGradient id="windowGlow" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0.3" />
    </linearGradient>

    <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fef08a" stop-opacity="1" />
      <stop offset="40%" stop-color="#f59e0b" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#f59e0b" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Sky & Upper Ceiling (Latitude +90 to 0) -->
  <rect x="0" y="0" width="${width}" height="${height * 0.5}" fill="#0f172a" />
  
  <!-- Floor (Latitude 0 to -90) -->
  <rect x="0" y="${height * 0.5}" width="${width}" height="${height * 0.5}" fill="url(#floorGradient)" />

  <!-- Walls (Middle Band) -->
  <rect x="0" y="${height * 0.25}" width="${width}" height="${height * 0.35}" fill="url(#wallGradient)" opacity="0.9" />

  <!-- Wall Accent Paneling (360 degrees, 4 main walls at x=0, x=512, x=1024, x=1536) -->

  <!-- Wall 1: North Wall (x: 0 to 512) - Panoramic Window to Sunset Terrace -->
  <rect x="50" y="${height * 0.2}" width="412" height="${height * 0.32}" fill="url(#windowGlow)" rx="12" stroke="#38bdf8" stroke-width="4"/>
  <text x="256" y="${height * 0.32}" fill="#ffffff" font-family="sans-serif" font-size="28" font-weight="bold" text-anchor="middle">PANORAMIC TERRACE VIEW</text>
  <text x="256" y="${height * 0.38}" fill="#e0f2fe" font-family="sans-serif" font-size="18" text-anchor="middle">NORTH WALL (0°)</text>

  <!-- Wall 2: East Wall (x: 512 to 1024) - Modern Living Sofa & Art -->
  <rect x="600" y="${height * 0.22}" width="320" height="${height * 0.15}" fill="#1e1b4b" rx="8" stroke="#6366f1" stroke-width="3"/>
  <text x="760" y="${height * 0.3}" fill="#a5b4fc" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">LUXURY GALLERY ART</text>
  
  <!-- Sofa Body -->
  <rect x="560" y="${height * 0.42}" width="400" height="${height * 0.18}" fill="#0284c7" rx="16" stroke="#38bdf8" stroke-width="3"/>
  <rect x="580" y="${height * 0.44}" width="170" height="${height * 0.12}" fill="#0369a1" rx="10"/>
  <rect x="770" y="${height * 0.44}" width="170" height="${height * 0.12}" fill="#0369a1" rx="10"/>
  <text x="760" y="${height * 0.55}" fill="#ffffff" font-family="sans-serif" font-size="18" font-weight="bold" text-anchor="middle">EAST WALL - LIVING AREA (90°)</text>

  <!-- Wall 3: South Wall (x: 1024 to 1536) - Modern Fireplace & Media Center -->
  <rect x="1100" y="${height * 0.28}" width="330" height="${height * 0.28}" fill="#1c1917" rx="12" stroke="#f59e0b" stroke-width="4"/>
  <rect x="1150" y="${height * 0.45}" width="230" height="${height * 0.09}" fill="#b45309" rx="6"/>
  <circle cx="1265" cy="${height * 0.495}" r="25" fill="#fef08a"/>
  <text x="1265" y="${height * 0.35}" fill="#fbbf24" font-family="sans-serif" font-size="24" font-weight="bold" text-anchor="middle">MODERN FIREPLACE</text>
  <text x="1265" y="${height * 0.40}" fill="#fde68a" font-family="sans-serif" font-size="18" text-anchor="middle">SOUTH WALL (180°)</text>

  <!-- Wall 4: West Wall (x: 1536 to 2048) - Open Kitchen & Dining -->
  <rect x="1600" y="${height * 0.38}" width="380" height="${height * 0.18}" fill="#0f766e" rx="12" stroke="#2dd4bf" stroke-width="3"/>
  <text x="1790" y="${height * 0.48}" fill="#ccfbf1" font-family="sans-serif" font-size="22" font-weight="bold" text-anchor="middle">KITCHEN ISLAND &amp; DINING</text>
  <text x="1790" y="${height * 0.53}" fill="#99f6e4" font-family="sans-serif" font-size="18" text-anchor="middle">WEST WALL (270°)</text>

  <!-- Overhead Chandeliers / Pendant Lights -->
  <circle cx="256" cy="${height * 0.12}" r="60" fill="url(#lampGlow)" />
  <circle cx="760" cy="${height * 0.12}" r="70" fill="url(#lampGlow)" />
  <circle cx="1265" cy="${height * 0.12}" r="65" fill="url(#lampGlow)" />
  <circle cx="1790" cy="${height * 0.12}" r="60" fill="url(#lampGlow)" />

  <!-- Equirectangular Grid Lines for Spatial Guidance -->
  <line x1="0" y1="${height * 0.5}" x2="${width}" y2="${height * 0.5}" stroke="#10b981" stroke-width="2" stroke-dasharray="8,8" opacity="0.6"/>
  <line x1="512" y1="0" x2="512" y2="${height}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.4"/>
  <line x1="1024" y1="0" x2="1024" y2="${height}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.4"/>
  <line x1="1536" y1="0" x2="1536" y2="${height}" stroke="#10b981" stroke-width="1.5" stroke-dasharray="6,6" opacity="0.4"/>

  <!-- Compass orientation markers -->
  <rect x="226" y="20" width="60" height="30" fill="#10b981" rx="6"/>
  <text x="256" y="41" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">N</text>

  <rect x="730" y="20" width="60" height="30" fill="#3b82f6" rx="6"/>
  <text x="760" y="41" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">E</text>

  <rect x="1235" y="20" width="60" height="30" fill="#f59e0b" rx="6"/>
  <text x="1265" y="41" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">S</text>

  <rect x="1760" y="20" width="60" height="30" fill="#14b8a6" rx="6"/>
  <text x="1790" y="41" fill="#ffffff" font-family="sans-serif" font-size="16" font-weight="bold" text-anchor="middle">W</text>

  <!-- Title Watermark -->
  <text x="${width / 2}" y="${height * 0.95}" fill="#94a3b8" font-family="sans-serif" font-size="20" font-weight="bold" text-anchor="middle" opacity="0.7">VIEWROOM 360° EQUIRECTANGULAR SPATIAL PANORAMA</text>
</svg>`;

const outputPath = path.join(panoramaDir, 'living_room_360.svg');
fs.writeFileSync(outputPath, svgContent);
console.log('Generated 360 panorama SVG asset at:', outputPath);
