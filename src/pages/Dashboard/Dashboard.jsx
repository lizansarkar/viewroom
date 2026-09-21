import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBuilding,
  faCube,
  faEye,
  faPlus,
  faBars,
  faTrash,
  faExternalLinkAlt,
  faCheckCircle,
  faRocket,
  faSliders,
  faPlusCircle,
  faCompass,
  faArrowRight,
  faShieldHalved,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";
import { useAuth } from "../../context/AuthContext";
import DashboardSidebar from "../../components/dashboard/DashboardSidebar";
import HotspotEditorModal from "../../components/dashboard/HotspotEditorModal";
import {
  apiGetOwnerStats,
  apiGetOwnerTours,
  apiCreateOwnerTour,
  apiAddOwnerScene,
  apiAddOwnerHotspot,
  apiPromoteToCreator,
} from "../../services/api";

export default function Dashboard() {
  const { user, isLoggedIn, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
        // Default fallback mock tour
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
      console.warn("Dashboard data error:", err);
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
      setActiveTab("tours");
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

  const handleUpgradeToCreator = async () => {
    await apiPromoteToCreator();
    if (user) {
      login({ ...user, role: "CREATOR" });
    }
  };

  // If not logged in -> Redirect or prompt Sign In
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center p-8 rounded-2xl bg-base-200/60 border border-[var(--app-border)]/30 shadow-2xl">
          <FontAwesomeIcon icon={faShieldHalved} className="text-4xl text-cyan-500 mb-4" />
          <h2 className="text-2xl font-heading font-black uppercase mb-2">Access Control</h2>
          <p className="text-xs text-[var(--app-text-secondary)] mb-6">
            Please sign in to access the ViewRoom Owner & Creator Dashboard.
          </p>
          <Link to="/sign-in" className="inline-block w-full">
            <Button variant="primary" className="w-full">
              Sign In to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Role Guard: If user is CLIENT role -> Prompt 1-Click Upgrade to CREATOR
  const isOwnerOrAdmin = user?.role === "CREATOR" || user?.role === "ADMIN";

  if (!isOwnerOrAdmin) {
    return (
      <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center p-8 sm:p-10 rounded-3xl bg-base-200/60 border border-[var(--app-border)]/30 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center text-2xl mx-auto mb-5">
            <FontAwesomeIcon icon={faRocket} />
          </div>
          <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight mb-3">
            UPGRADE TO CREATOR ACCOUNT
          </h2>
          <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] mb-8 leading-relaxed">
            Your current account is set as a <strong>CLIENT</strong>. Upgrade to a <strong>CREATOR</strong> account to publish 360° virtual tours, upload 3D product spins, and access spatial analytics!
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleUpgradeToCreator}
              className="flex-1 py-3 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity shadow-md"
            >
              Upgrade Account Now (Free)
            </button>
            <Link to="/explore" className="flex-1">
              <button className="w-full py-3 rounded-full border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider hover:bg-base-200 transition-colors">
                Back to Explore
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] flex transition-colors duration-250">
      
      {/* Sidebar Navigation */}
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        user={user}
        logout={() => navigate("/sign-in")}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        
        {/* Top Navbar */}
        <header className="px-6 py-4 bg-base-200/40 border-b border-[var(--app-border)]/20 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-base-200 text-[var(--app-text-primary)]"
            >
              <FontAwesomeIcon icon={faBars} />
            </button>
            <h1 className="font-heading font-black text-lg uppercase tracking-tight">
              {activeTab === "overview" && "OVERVIEW DASHBOARD"}
              {activeTab === "tours" && "MY 360° VIRTUAL TOURS"}
              {activeTab === "products" && "MY 3D PRODUCT SPINS"}
              {activeTab === "uploader" && "SCENE & TOUR BUILDER"}
              {activeTab === "analytics" && "SPATIAL ANALYTICS"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("uploader")}
              className="px-4 py-2 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm hover:opacity-90 transition-opacity"
            >
              <FontAwesomeIcon icon={faPlus} className="text-[10px]" />
              New 360 Tour
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          
          {/* KPI Metrics Cards (Visible across tabs) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1">
                  Active 360 Tours
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-[var(--app-text-primary)]">
                  {stats.totalTours}
                </span>
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
                <span className="font-heading text-2xl sm:text-3xl font-black text-[var(--app-text-primary)]">
                  {stats.totalProducts}
                </span>
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
                <span className="font-heading text-2xl sm:text-3xl font-black text-[var(--app-text-primary)]">
                  {stats.totalViews}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faEye} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between shadow-sm">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block mb-1">
                  AI Interactions
                </span>
                <span className="font-heading text-2xl sm:text-3xl font-black text-[var(--app-text-primary)]">
                  {stats.aiConversations}
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
            </div>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div className="p-6 sm:p-8 rounded-3xl bg-base-200/40 border border-[var(--app-border)]/20 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-cyan-500 block mb-2">
                    WELCOME BACK, {user?.name?.toUpperCase() || "CREATOR"}
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-heading font-black uppercase tracking-tight mb-2">
                    MANAGE YOUR SPATIAL PORTFOLIO
                  </h2>
                  <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] max-w-xl">
                    Publish 360° virtual property tours, attach pitch/yaw spherical hotspots, and monitor spatial AI concierge interactions in real time.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("uploader")}
                  className="px-6 py-3 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 whitespace-nowrap"
                >
                  <span>Build New 360 Space</span>
                  <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
                </button>
              </div>

              {/* Recent Tours Grid */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading text-sm font-black uppercase tracking-wider text-[var(--app-text-primary)]">
                    RECENT 360° VIRTUAL TOURS
                  </h3>
                  <button
                    onClick={() => setActiveTab("tours")}
                    className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
                  >
                    View All →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tours.map((tour) => (
                    <div
                      key={tour.id}
                      className="p-4 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex flex-col justify-between shadow-sm hover:border-[var(--app-border)]/60 transition-all"
                    >
                      <div className="relative h-44 rounded-xl overflow-hidden mb-4 bg-neutral-900">
                        <img
                          src={tour.coverImage}
                          alt={tour.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-[10px] font-extrabold uppercase">
                          {tour.scenes?.length || 0} ROOM SCENES
                        </div>
                      </div>

                      <h4 className="font-heading font-bold text-sm uppercase tracking-tight text-[var(--app-text-primary)] mb-1">
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
              </div>
            </div>
          )}

          {/* TAB 2: MY 360° TOURS */}
          {activeTab === "tours" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-black uppercase tracking-wider">
                  PUBLISHED 360° PROPERTY TOURS ({tours.length})
                </h3>
                <button
                  onClick={() => setActiveTab("uploader")}
                  className="px-4 py-2 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  Add New Tour
                </button>
              </div>

              <div className="space-y-4">
                {tours.map((tour) => (
                  <div
                    key={tour.id}
                    className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={tour.coverImage}
                        alt={tour.title}
                        className="w-20 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-base uppercase text-[var(--app-text-primary)]">
                          {tour.title}
                        </h4>
                        <p className="text-xs text-[var(--app-text-secondary)]">
                          {tour.category} • {tour.scenes?.length || 0} Scenes • {tour.viewsCount || 0} Views
                        </p>
                      </div>
                    </div>

                    {/* Scene Hotspot Actions */}
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
                          Add Hotspot
                        </button>
                      )}
                      <button
                        onClick={() => handleAddSceneToTour(tour.id)}
                        className="px-3.5 py-1.5 rounded-full border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider hover:bg-base-200"
                      >
                        + Add Scene
                      </button>
                      <Link
                        to="/360-virtual-tour"
                        className="p-2 rounded-full bg-base-content text-base-100 text-xs"
                      >
                        <FontAwesomeIcon icon={faExternalLinkAlt} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: SCENE & TOUR BUILDER */}
          {activeTab === "uploader" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-base-200/50 border border-[var(--app-border)]/20 space-y-6">
              <div>
                <h3 className="font-heading font-black text-xl uppercase tracking-tight mb-1">
                  CREATE NEW 360° VIRTUAL TOUR
                </h3>
                <p className="text-xs text-[var(--app-text-secondary)]">
                  Enter property details and link equirectangular 360° panoramas.
                </p>
              </div>

              <form onSubmit={handleCreateTour} className="space-y-4 max-w-2xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1">
                    Tour / Property Title*
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Horizon Waterfront Villa 360°"
                    value={newTourTitle}
                    onChange={(e) => setNewTourTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
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
                      className="w-full px-4 py-3 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
                    >
                      <option>Commercial Real Estate</option>
                      <option>Residential Villa</option>
                      <option>Modern Architecture</option>
                      <option>Boutique Hotel</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1">
                      Price / Access Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Free or $2,500,000"
                      value={newTourPrice}
                      onChange={(e) => setNewTourPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-xs font-bold text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe the 360° space..."
                    value={newTourDesc}
                    onChange={(e) => setNewTourDesc(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-base-100 border border-[var(--app-border)]/40 text-xs font-medium text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)]"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity"
                >
                  Save & Publish 360° Tour
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: 3D PRODUCTS */}
          {activeTab === "products" && (
            <div className="space-y-6">
              <h3 className="font-heading text-sm font-black uppercase tracking-wider">
                360° INTERACTIVE PRODUCTS ({mockOwnerProducts.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockOwnerProducts.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={prod.coverFrame}
                        alt={prod.title}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-heading font-bold text-sm uppercase text-[var(--app-text-primary)]">
                          {prod.title}
                        </h4>
                        <p className="text-xs text-[var(--app-text-secondary)]">
                          {prod.category} • ${prod.price} • {prod.spinFramesCount} Spin Frames
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/360-product"
                      className="px-4 py-2 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider"
                    >
                      Spin 360°
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SPATIAL ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="p-8 rounded-3xl bg-base-200/50 border border-[var(--app-border)]/20 space-y-6">
              <h3 className="font-heading font-black text-xl uppercase">SPATIAL ENGAGEMENT METRICS</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-5 rounded-2xl bg-base-100 border border-[var(--app-border)]/30">
                  <span className="text-[10px] font-bold uppercase text-[var(--app-text-secondary)]">Avg. Tour Session</span>
                  <p className="font-heading text-2xl font-black text-[var(--app-text-primary)] mt-1">4m 18s</p>
                </div>
                <div className="p-5 rounded-2xl bg-base-100 border border-[var(--app-border)]/30">
                  <span className="text-[10px] font-bold uppercase text-[var(--app-text-secondary)]">Top Room Scene</span>
                  <p className="font-heading text-2xl font-black text-[var(--app-text-primary)] mt-1">1ST FLOOR LOBBY</p>
                </div>
                <div className="p-5 rounded-2xl bg-base-100 border border-[var(--app-border)]/30">
                  <span className="text-[10px] font-bold uppercase text-[var(--app-text-secondary)]">AI Concierge Rate</span>
                  <p className="font-heading text-2xl font-black text-[var(--app-text-primary)] mt-1">94.2% Satisfied</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Hotspot Editor Modal Overlay */}
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
