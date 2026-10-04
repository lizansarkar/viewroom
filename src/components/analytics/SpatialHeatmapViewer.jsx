import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faEye,
  faBullseye,
  faLayerGroup,
  faSliders,
  faDownload,
  faChartPie,
  faCompass,
} from "@fortawesome/free-solid-svg-icons";
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import Button from "../reuseable/Button";

// Mock 360° Gaze Angle Density Datasets for Heatmap Canvas
const GAZE_HEATMAP_DATA = {
  aerial_view: {
    title: "Ground Floor Exterior & Aerial",
    panorama: "/panoramas/panorama_aerial.jpg",
    heatspots: [
      { x: 0.5, y: 0.55, intensity: 0.95, label: "Main Building Entrance" },
      { x: 0.28, y: 0.45, intensity: 0.8, label: "North Courtyard" },
      { x: 0.72, y: 0.62, intensity: 0.65, label: "Parking & Walkway" },
      { x: 0.85, y: 0.4, intensity: 0.4, label: "Skyline Horizon" },
    ],
    gazeRadar: [
      { direction: "North (Entrance)", gaze: 88, dwellSec: 42 },
      { direction: "East (Courtyard)", gaze: 64, dwellSec: 28 },
      { direction: "South (Parking)", gaze: 45, dwellSec: 19 },
      { direction: "West (Horizon)", gaze: 32, dwellSec: 12 },
      { direction: "Ceiling (Sky)", gaze: 18, dwellSec: 6 },
      { direction: "Floor (Ground)", gaze: 55, dwellSec: 24 },
    ],
    focalPoints: [
      { zone: "Main Entrance Portal", clicks: 342, dwell: "48s", heat: "Ultra High" },
      { zone: "Glass Atrium Roof", clicks: 188, dwell: "24s", heat: "High" },
      { zone: "Visitor Parking Bay", clicks: 94, dwell: "12s", heat: "Medium" },
    ],
  },
  entrance: {
    title: "Ground Floor Lobby",
    panorama: "/panoramas/panorama_entrance.jpg",
    heatspots: [
      { x: 0.48, y: 0.5, intensity: 0.9, label: "Reception Desk" },
      { x: 0.65, y: 0.58, intensity: 0.85, label: "Stairs to 1st Floor" },
      { x: 0.2, y: 0.42, intensity: 0.5, label: "Lounge Seating" },
    ],
    gazeRadar: [
      { direction: "North (Reception)", gaze: 92, dwellSec: 54 },
      { direction: "East (Staircase)", gaze: 81, dwellSec: 39 },
      { direction: "South (Lobby Door)", gaze: 38, dwellSec: 16 },
      { direction: "West (Sofa)", gaze: 42, dwellSec: 18 },
      { direction: "Ceiling (Chandelier)", gaze: 68, dwellSec: 29 },
      { direction: "Floor (Marble)", gaze: 25, dwellSec: 10 },
    ],
    focalPoints: [
      { zone: "Marble Reception Counter", clicks: 412, dwell: "58s", heat: "Ultra High" },
      { zone: "Staircase Handrail", clicks: 298, dwell: "39s", heat: "High" },
      { zone: "Luxury Chandelier", clicks: 156, dwell: "29s", heat: "Medium" },
    ],
  },
  floor_1: {
    title: "1st Floor Lobby",
    panorama: "/panoramas/panorama_floor1.jpg",
    heatspots: [
      { x: 0.52, y: 0.48, intensity: 0.88, label: "Workspace Door" },
      { x: 0.35, y: 0.6, intensity: 0.72, label: "Staircase Down" },
    ],
    gazeRadar: [
      { direction: "North (Workspace)", gaze: 75, dwellSec: 36 },
      { direction: "East (Elevator)", gaze: 62, dwellSec: 25 },
      { direction: "South (Stairs)", gaze: 58, dwellSec: 22 },
      { direction: "West (Window)", gaze: 44, dwellSec: 17 },
      { direction: "Ceiling (Lights)", gaze: 30, dwellSec: 11 },
      { direction: "Floor (Wood)", gaze: 22, dwellSec: 8 },
    ],
    focalPoints: [
      { zone: "Workspace Double Doors", clicks: 275, dwell: "36s", heat: "High" },
      { zone: "Panoramic Window View", clicks: 190, dwell: "25s", heat: "Medium" },
    ],
  },
};

export default function SpatialHeatmapViewer({ tourId }) {
  const [selectedRoomId, setSelectedRoomId] = useState("aerial_view");
  const [heatRadius, setHeatRadius] = useState(45);
  const [heatOpacity, setHeatOpacity] = useState(0.75);
  const canvasRef = useRef(null);

  const activeData = GAZE_HEATMAP_DATA[selectedRoomId] || GAZE_HEATMAP_DATA.aerial_view;

  // Render Heatmap Overlay on 2D Equirectangular Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw Heat Spots Radial Gradients
    activeData.heatspots.forEach((spot) => {
      const cx = spot.x * width;
      const cy = spot.y * height;
      const radius = heatRadius * (spot.intensity || 0.8);

      const radGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      radGrad.addColorStop(0, `rgba(239, 68, 68, ${heatOpacity * spot.intensity})`);
      radGrad.addColorStop(0.4, `rgba(245, 158, 11, ${heatOpacity * 0.7 * spot.intensity})`);
      radGrad.addColorStop(0.7, `rgba(16, 185, 129, ${heatOpacity * 0.4 * spot.intensity})`);
      radGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.beginPath();
      ctx.fillStyle = radGrad;
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Focal Label Badge
      ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.lineWidth = 1;
      const text = `${spot.label} (${Math.round(spot.intensity * 100)}%)`;
      ctx.font = "bold 11px sans-serif";
      const textWidth = ctx.measureText(text).width;

      ctx.roundRect(cx - textWidth / 2 - 8, cy - radius - 24, textWidth + 16, 20, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.textAlign = "center";
      ctx.fillText(text, cx, cy - radius - 10);
    });
  }, [selectedRoomId, heatRadius, heatOpacity, activeData]);

  const COLORS = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider opacity-70 block mb-1">
            360° VISUAL ATTENTION TELEMETRY
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-3xl uppercase tracking-tight flex items-center gap-2">
            <FontAwesomeIcon icon={faFire} className="text-rose-500" />
            SPATIAL GAZE HEATMAP ANALYTICS
          </h2>
        </div>

        {/* Room Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="px-4 py-2.5 rounded-xl bg-base-200 border border-base-content/20 text-xs font-extrabold uppercase focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            {Object.keys(GAZE_HEATMAP_DATA).map((key) => (
              <option key={key} value={key}>
                {GAZE_HEATMAP_DATA[key].title}
              </option>
            ))}
          </select>

          <Button variant="secondary" onClick={() => window.print()} className="py-2.5 text-xs">
            <FontAwesomeIcon icon={faDownload} className="mr-1.5" /> Export Heatmap Report
          </Button>
        </div>
      </div>

      {/* Main Heatmap Equirectangular Preview Container */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-base-content/15 bg-black shadow-2xl group">
        <img
          src={activeData.panorama}
          alt={activeData.title}
          className="w-full h-80 sm:h-96 object-cover opacity-85"
        />

        {/* 2D Canvas Heatmap Overlay */}
        <canvas
          ref={canvasRef}
          width={1200}
          height={600}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {/* Floating Controls Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-3 p-3 rounded-2xl bg-black/75 backdrop-blur-md border border-white/20 text-white text-xs font-extrabold">
          <FontAwesomeIcon icon={faCompass} className="text-emerald-400" />
          <span>{activeData.title}</span>
          <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase">
            {activeData.heatspots.length} Active Hotspots
          </span>
        </div>

        {/* Heatmap Customization Sliders */}
        <div className="absolute bottom-4 right-4 z-10 p-3.5 rounded-2xl bg-black/80 backdrop-blur-md border border-white/20 text-white text-xs space-y-2 w-64">
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faSliders} /> Heat Radius
            </span>
            <span>{heatRadius}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            value={heatRadius}
            onChange={(e) => setHeatRadius(Number(e.target.value))}
            className="w-full accent-rose-500 cursor-pointer"
          />

          <div className="flex items-center justify-between font-bold pt-1">
            <span>Heat Intensity</span>
            <span>{Math.round(heatOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={heatOpacity}
            onChange={(e) => setHeatOpacity(Number(e.target.value))}
            className="w-full accent-amber-500 cursor-pointer"
          />
        </div>
      </div>

      {/* RECHARTS REVIEWS & ANALYTICS VISUALIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recharts Radar Chart: 360° Directional Gaze Angle Density */}
        <div className="p-6 rounded-2xl bg-base-200/80 border border-base-content/15 backdrop-blur-md shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-extrabold text-base uppercase tracking-tight flex items-center gap-2">
                <FontAwesomeIcon icon={faChartPie} className="text-primary" />
                360° GAZE DIRECTIONAL RADAR
              </h3>
              <p className="text-xs opacity-70">
                Visitor orientation gaze density across 360° pitch/yaw compass directions.
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeData.gazeRadar}>
                <PolarGrid stroke="var(--color-base-content, #666)" strokeOpacity={0.2} />
                <PolarAngleAxis
                  dataKey="direction"
                  tick={{ fill: "currentColor", fontSize: 11, fontWeight: "bold" }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} strokeOpacity={0.2} />
                <Radar
                  name="Gaze Density"
                  dataKey="gaze"
                  stroke="#ef4444"
                  fill="#ef4444"
                  fillOpacity={0.5}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(15, 23, 42, 0.9)",
                    borderColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    color: "#ffffff",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Bar Chart: Zone Dwell Time Breakdown */}
        <div className="p-6 rounded-2xl bg-base-200/80 border border-base-content/15 backdrop-blur-md shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base uppercase tracking-tight flex items-center gap-2">
                  <FontAwesomeIcon icon={faBullseye} className="text-emerald-500" />
                  ZONE DWELL TIME DURATION (SECONDS)
                </h3>
                <p className="text-xs opacity-70">
                  Average time visitors spent looking at specific focal zones inside this room.
                </p>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData.gazeRadar} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="direction"
                    tick={{ fill: "currentColor", fontSize: 10, fontWeight: "bold" }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: "currentColor", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(15, 23, 42, 0.9)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      color: "#ffffff",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="dwellSec" radius={[8, 8, 0, 0]}>
                    {activeData.gazeRadar.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-base-100 border border-base-content/10 text-xs flex items-center justify-between">
            <span className="font-extrabold">Peak Visitor Interest Zone</span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 font-black uppercase text-[10px]">
              {activeData.focalPoints[0]?.zone || "Main Entrance"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
