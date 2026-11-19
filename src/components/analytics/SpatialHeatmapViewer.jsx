import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faBullseye,
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

export default function SpatialHeatmapViewer({ _tourId }) {
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

  const COLORS = ["#2563eb", "#38bdf8", "#0284c7", "#64748b", "#0ea5e9", "#475569"];

  return (
    <div className="space-y-6 text-base-content max-w-7xl mx-auto w-full">
      {/* Header Card */}
      <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-wider uppercase text-base-content/60 block mb-1">
            Spatial Telemetry & Engagement
          </span>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-base-content flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-sm bg-primary/10 text-primary flex items-center justify-center text-sm shrink-0">
              <FontAwesomeIcon icon={faFire} />
            </span>
            Gaze Heatmaps
          </h2>
          <p className="text-xs text-base-content/60 mt-1">
            Visual attention density and directional dwell time across 360° scenes.
          </p>
        </div>

        {/* Room Selector Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedRoomId}
            onChange={(e) => setSelectedRoomId(e.target.value)}
            className="px-3.5 py-2 rounded-sm bg-base-200/60 border border-base-content/15 text-xs font-semibold text-base-content focus:outline-none focus:border-primary transition-all cursor-pointer"
          >
            {Object.keys(GAZE_HEATMAP_DATA).map((key) => (
              <option key={key} value={key}>
                {GAZE_HEATMAP_DATA[key].title}
              </option>
            ))}
          </select>

          <Button variant="secondary" onClick={() => window.print()} className="!py-2 !px-3.5 !text-xs !rounded-sm">
            <FontAwesomeIcon icon={faDownload} className="mr-1.5" /> Export Report
          </Button>
        </div>
      </div>

      {/* Main Heatmap Equirectangular Preview Container */}
      <div className="relative w-full rounded-sm overflow-hidden border border-base-content/10 bg-black/90 shadow-xs group">
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
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2.5 p-2.5 px-3 rounded-sm bg-base-100/90 backdrop-blur-md border border-base-content/10 text-base-content text-xs font-semibold shadow-xs">
          <FontAwesomeIcon icon={faCompass} className="text-primary" />
          <span>{activeData.title}</span>
          <span className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary text-[10px] font-bold uppercase">
            {activeData.heatspots.length} Focus Points
          </span>
        </div>

        {/* Heatmap Customization Sliders */}
        <div className="absolute bottom-4 right-4 z-10 p-3.5 rounded-sm bg-base-100/90 backdrop-blur-md border border-base-content/10 text-base-content text-xs space-y-2.5 w-60 shadow-lg">
          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-base-content/80 text-[11px]">
              <FontAwesomeIcon icon={faSliders} className="text-base-content/60" /> Radius
            </span>
            <span className="font-semibold text-xs">{heatRadius}px</span>
          </div>
          <input
            type="range"
            min="20"
            max="90"
            value={heatRadius}
            onChange={(e) => setHeatRadius(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5 bg-base-300 rounded-sm"
          />

          <div className="flex items-center justify-between font-medium pt-0.5">
            <span className="text-base-content/80 text-[11px]">Intensity</span>
            <span className="font-semibold text-xs">{Math.round(heatOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.2"
            max="1"
            step="0.05"
            value={heatOpacity}
            onChange={(e) => setHeatOpacity(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer h-1.5 bg-base-300 rounded-sm"
          />
        </div>
      </div>

      {/* RECHARTS VISUALIZATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recharts Radar Chart: Directional Gaze Density */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs">
          <div className="mb-4">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <span className="w-6 h-6 rounded-sm bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                <FontAwesomeIcon icon={faChartPie} />
              </span>
              Directional Gaze Distribution
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Visitor orientation across 360° pitch and yaw compass directions.
            </p>
          </div>

          <div className="h-68 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={activeData.gazeRadar}>
                <PolarGrid stroke="var(--color-base-content, #64748b)" strokeOpacity={0.12} />
                <PolarAngleAxis
                  dataKey="direction"
                  tick={{ fill: "currentColor", fontSize: 10, fontWeight: "600", opacity: 0.8 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} strokeOpacity={0.12} />
                <Radar
                  name="Gaze Density"
                  dataKey="gaze"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.25}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--color-base-100, #ffffff)",
                    borderColor: "var(--app-border, rgba(163, 163, 163, 0.2))",
                    borderRadius: "6px",
                    color: "var(--color-base-content, #0f172a)",
                    fontSize: "12px",
                    fontWeight: "600",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  itemStyle={{ color: "var(--color-base-content, #0f172a)" }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recharts Bar Chart: Zone Dwell Time Breakdown */}
        <div className="p-6 rounded-sm bg-base-100 border border-base-content/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="mb-4">
              <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                <span className="w-6 h-6 rounded-sm bg-sky-500/10 text-sky-600 flex items-center justify-center text-xs shrink-0">
                  <FontAwesomeIcon icon={faBullseye} />
                </span>
                Zone Dwell Duration (Seconds)
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Average duration visitors engaged with specific zones in this scene.
              </p>
            </div>

            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeData.gazeRadar} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <XAxis
                    dataKey="direction"
                    tick={{ fill: "currentColor", fontSize: 10, fontWeight: "500", opacity: 0.8 }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fill: "currentColor", fontSize: 10, opacity: 0.8 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-base-100, #ffffff)",
                      borderColor: "var(--app-border, rgba(163, 163, 163, 0.2))",
                      borderRadius: "6px",
                      color: "var(--color-base-content, #0f172a)",
                      fontSize: "12px",
                      fontWeight: "600",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                    }}
                    itemStyle={{ color: "var(--color-base-content, #0f172a)" }}
                  />
                  <Bar dataKey="dwellSec" radius={[3, 3, 0, 0]}>
                    {activeData.gazeRadar.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 p-3.5 rounded-sm bg-base-200/40 border border-base-content/10 text-xs flex items-center justify-between">
            <span className="font-medium text-base-content/70">Peak Visitor Interest Zone</span>
            <span className="px-2.5 py-1 rounded-sm bg-primary/10 text-primary font-semibold text-[11px]">
              {activeData.focalPoints[0]?.zone || "Main Entrance"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
