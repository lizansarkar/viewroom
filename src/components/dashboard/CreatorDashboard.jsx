import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBuilding,
  faCube,
  faEye,
  faPlus,
  faExternalLinkAlt,
  faCompass,
  faArrowRight,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";
import HotspotEditorModal from "./HotspotEditorModal";
import AnalyticsDashboard from "./AnalyticsDashboard";
import {
  apiGetOwnerStats,
  apiGetOwnerTours,
  apiCreateOwnerTour,
  apiAddOwnerScene,
  apiAddOwnerHotspot,
} from "../../services/api";

export default function CreatorDashboard({ user }) {
  const navigate = useNavigate();
  const [activeSubTab, setActiveSubTab] = useState("overview");
  const [stats, setStats] = useState({
    totalTours: 1,
    totalProducts: 1,
    totalViews: 2310,
    aiConversations: 124,
    engagementRate: "94.2%",
  });
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tour Builder Form State
  const [newTourTitle, setNewTourTitle] = useState("");
  const [newTourCategory, setNewTourCategory] = useState("Commercial Real Estate");
  const [newTourPrice, setNewTourPrice] = useState("Free");
  const [newTourDesc, setNewTourDesc] = useState("");

  // Hotspot Modal State
  const [editingScene, setEditingScene] = useState(null);
  const [editingTour, setEditingTour] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [fetchedStats, fetchedTours] = await Promise.all([
        apiGetOwnerStats(),
        apiGetOwnerTours(),
      ]);

      if (fetchedStats) setStats(fetchedStats);
      if (fetchedTours) {
        setTours(fetchedTours);
      } else {
        setTours([
          {
            id: "tour_skyline_headquarters",
            title: "Skyline Innovation Campus 360°",
            category: "Commercial Real Estate",
            price: "Free",
            coverImage: "/panoramas/panorama_aerial.jpg",
            viewsCount: 1420,
            scenes: [
              {
                id: "aerial_view",
                name: "AERIAL VIEW",
                floorLevel: "Campus Aerial",
                thumbnailUrl: "/panoramas/panorama_aerial.jpg",
                panoramaUrl: "/panoramas/panorama_aerial.jpg",
                hotspots: [{ id: "hp1", title: "Main Entrance" }],
              },
              {
                id: "entrance",
                name: "ENTRANCE",
                floorLevel: "Main Building",
                thumbnailUrl: "/panoramas/panorama_entrance.jpg",
                panoramaUrl: "/panoramas/panorama_entrance.jpg",
                hotspots: [],
              },
            ],
          },
        ]);
      }
    } catch (err) {
      console.warn("Creator dashboard data error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    if (!newTourTitle) return;

    const tourData = {
      title: newTourTitle,
      category: newTourCategory,
      price: newTourPrice,
      description: newTourDesc,
      coverImage: "/panoramas/panorama_aerial.jpg",
    };

    const res = await apiCreateOwnerTour(tourData);
    if (res.success || res.data) {
      const created = res.data || tourData;
      setTours((prev) => [created, ...prev]);
      setNewTourTitle("");
      setNewTourDesc("");
      setActiveSubTab("tours");
    }
  };

  const handleAddSceneToTour = async (tourId) => {
    const sceneName = prompt("Enter Scene / Room Name (e.g. 2ND FLOOR LAB):", "2ND FLOOR LAB");
    if (!sceneName) return;

    const sceneData = {
      name: sceneName,
      floorLevel: "2nd Floor",
      panoramaUrl: "/panoramas/panorama_floor1.jpg",
      thumbnailUrl: "/panoramas/panorama_floor1.jpg",
    };

    const res = await apiAddOwnerScene(tourId, sceneData);
    if (res.success || res.data) {
      setTours((prev) =>
        prev.map((t) =>
          t.id === tourId
            ? { ...t, scenes: [...(t.scenes || []), res.data || sceneData] }
            : t
        )
      );
    }
  };

  const handleSaveHotspot = async (hotspotData) => {
    if (!editingTour || !editingScene) return;
    const res = await apiAddOwnerHotspot(editingTour.id, editingScene.id, hotspotData);
    if (res.success || res.data) {
      setTours((prev) =>
        prev.map((t) => {
          if (t.id !== editingTour.id) return t;
          return {
            ...t,
            scenes: t.scenes.map((s) => {
              if (s.id !== editingScene.id) return s;
              return {
                ...s,
                hotspots: [...(s.hotspots || []), res.data || hotspotData],
              };
            }),
          };
        })
      );
    }
    setEditingScene(null);
    setEditingTour(null);
  };

  return (
    <div className="space-y-8 text-[var(--app-text-primary)]">
      
      {/* Top Creator Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-base-200/50 border border-[var(--app-border)]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-cyan-500 block mb-1">
            CREATOR & PROPERTY OWNER CONTROL PANEL
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight">
            WELCOME BACK, {user?.name?.toUpperCase() || "CREATOR"}
          </h2>
          <p className="text-xs text-[var(--app-text-secondary)] mt-1">
            Publish 360° virtual property tours, attach pitch/yaw spherical hotspots, and manage 3D product spins.
          </p>
        </div>

        <button
          onClick={() => setActiveSubTab("uploader")}
          className="px-6 py-3 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity whitespace-nowrap"
        >
          <FontAwesomeIcon icon={faPlus} />
          <span>Build New 360 Tour</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1">
              Active 360 Tours
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black">{stats.totalTours}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center text-base">
            <FontAwesomeIcon icon={faBuilding} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1">
              3D Product Spins
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black">{stats.totalProducts}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center text-base">
            <FontAwesomeIcon icon={faCube} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1">
              Panoramic Views
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black">{stats.totalViews}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base">
            <FontAwesomeIcon icon={faEye} />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1">
              Engagement Rate
            </span>
            <span className="font-heading text-2xl sm:text-3xl font-black">{stats.engagementRate}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-base">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex items-center gap-2 border-b border-[var(--app-border)]/20 pb-3 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === "overview"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSubTab("tours")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === "tours"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          My 360° Tours
        </button>
        <button
          onClick={() => setActiveSubTab("uploader")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === "uploader"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          Scene Uploader & Builder
        </button>
        <button
          onClick={() => setActiveSubTab("analytics")}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === "analytics"
              ? "bg-base-content text-base-100 shadow-sm"
              : "bg-base-200 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
          }`}
        >
          Spatial Analytics
        </button>
      </div>

      {/* SUBTAB ANALYTICS */}
      {activeSubTab === "analytics" && <AnalyticsDashboard />}

      {/* SUBTAB 1: OVERVIEW & TOURS */}
      {activeSubTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="p-4 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex flex-col justify-between shadow-sm hover:border-[var(--app-border)]/60 transition-all"
            >
              <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-neutral-900">
                <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-[10px] font-extrabold uppercase">
                  {tour.scenes?.length || 0} ROOM SCENES
                </div>
              </div>

              <h4 className="font-heading font-bold text-sm uppercase text-[var(--app-text-primary)] mb-1">
                {tour.title}
              </h4>
              <span className="text-xs text-[var(--app-text-secondary)] mb-4 block">
                {tour.category} • {tour.price}
              </span>

              <div className="flex items-center gap-2">
                <Link
                  to="/360-virtual-tour"
                  className="flex-1 py-2 rounded-full bg-base-content text-base-100 text-[11px] font-bold uppercase tracking-wider text-center"
                >
                  View 360°
                </Link>
                <button
                  onClick={() => handleAddSceneToTour(tour.id)}
                  className="p-2 rounded-full border border-[var(--app-border)]/40 text-xs hover:bg-base-200"
                  title="Add Room Scene"
                >
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: TOURS LIST WITH HOTSPOT MODAL TRIGGER */}
      {activeSubTab === "tours" && (
        <div className="space-y-4">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <img src={tour.coverImage} alt={tour.title} className="w-20 h-16 rounded-xl object-cover" />
                <div>
                  <h4 className="font-heading font-bold text-base uppercase">{tour.title}</h4>
                  <p className="text-xs text-[var(--app-text-secondary)]">
                    {tour.category} • {tour.scenes?.length || 0} Scenes • {tour.viewsCount || 0} Views
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                {tour.scenes?.[0] && (
                  <button
                    onClick={() => {
                      setEditingTour(tour);
                      setEditingScene(tour.scenes[0]);
                    }}
                    className="px-3.5 py-1.5 rounded-full border border-cyan-500/40 text-cyan-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-cyan-500/10"
                  >
                    <FontAwesomeIcon icon={faCompass} />
                    Add Pitch/Yaw Hotspot
                  </button>
                )}
                <button
                  onClick={() => handleAddSceneToTour(tour.id)}
                  className="px-3.5 py-1.5 rounded-full border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider hover:bg-base-200"
                >
                  + Add Scene
                </button>
                <Link to="/360-virtual-tour" className="p-2 rounded-full bg-base-content text-base-100 text-xs">
                  <FontAwesomeIcon icon={faExternalLinkAlt} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 3: SCENE UPLOADER & BUILDER FORM */}
      {activeSubTab === "uploader" && (
        <div className="p-6 sm:p-8 rounded-3xl bg-base-200/50 border border-[var(--app-border)]/20 space-y-6 max-w-2xl">
          <h3 className="font-heading font-black text-xl uppercase tracking-tight">
            CREATE NEW 360° TOUR & SCENE
          </h3>
          <form onSubmit={handleCreateTour} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1">
                Property / Tour Title*
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Horizon Waterfront Villa 360°"
                value={newTourTitle}
                onChange={(e) => setNewTourTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold focus:outline-none focus:border-[var(--app-text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1">
                  Category
                </label>
                <select
                  value={newTourCategory}
                  onChange={(e) => setNewTourCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold focus:outline-none focus:border-[var(--app-text-primary)]"
                >
                  <option>Commercial Real Estate</option>
                  <option>Residential Villa</option>
                  <option>Modern Architecture</option>
                  <option>Boutique Hotel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1">
                  Price Tag
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free or $2,500,000"
                  value={newTourPrice}
                  onChange={(e) => setNewTourPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold focus:outline-none focus:border-[var(--app-text-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90"
            >
              Save & Publish 360° Space
            </button>
          </form>
        </div>
      )}

      {/* Hotspot Modal Overlay */}
      {editingScene && (
        <HotspotEditorModal
          scene={editingScene}
          tour={editingTour}
          onClose={() => {
            setEditingScene(null);
            setEditingTour(null);
          }}
          onSave={handleSaveHotspot}
        />
      )}
    </div>
  );
}
