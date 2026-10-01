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
  faMagnifyingGlass,
  faTrash,
  faCheckCircle,
  faSliders,
  faQuestionCircle,
  faLayerGroup,
  faCloudArrowUp,
  faWrench,
  faShareNodes,
  faCopy,
  faCheck,
  faLink,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import HotspotEditorModal from "./HotspotEditorModal";
import AnalyticsDashboard from "./AnalyticsDashboard";
import {
  apiGetOwnerStats,
  apiGetOwnerTours,
  apiCreateOwnerTour,
  apiAddOwnerScene,
  apiAddOwnerHotspot,
} from "../../services/api";

export default function CreatorDashboard({ user, activeTab, setActiveTab }) {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTours: 2,
    totalProducts: 3,
    totalViews: 4850,
    aiConversations: 184,
    engagementRate: "96.4%",
  });

  const [tours, setTours] = useState([
    {
      id: "tour_skyline_headquarters",
      title: "Skyline Innovation Campus 360°",
      category: "Commercial Real Estate",
      price: "Free",
      coverImage: "/panoramas/panorama_aerial.jpg",
      viewsCount: 2450,
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
          name: "ENTRANCE LOBBY",
          floorLevel: "Main Building",
          thumbnailUrl: "/panoramas/panorama_entrance.jpg",
          panoramaUrl: "/panoramas/panorama_entrance.jpg",
          hotspots: [],
        },
      ],
    },
    {
      id: "tour_penthouse",
      title: "Glass Pavilion Penthouse 360°",
      category: "Luxury Residential",
      price: "$3,200,000",
      coverImage: "/panoramas/panorama_entrance.jpg",
      viewsCount: 1820,
      scenes: [
        {
          id: "main_hall",
          name: "MAIN HALL",
          floorLevel: "Penthouse Level 1",
          thumbnailUrl: "/panoramas/panorama_entrance.jpg",
          panoramaUrl: "/panoramas/panorama_entrance.jpg",
          hotspots: [],
        },
      ],
    },
  ]);

  const [products, setProducts] = useState([
    {
      id: "prod_chair_1",
      title: "Ergonomic Spatial Chair X1",
      category: "Modern Furniture",
      price: "$850",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
      modelFormat: "GLTF / GLB",
      viewsCount: 940,
    },
    {
      id: "prod_desk_1",
      title: "Executive Minimalist Desk",
      category: "Office Furniture",
      price: "$1,400",
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
      modelFormat: "GLTF / GLB",
      viewsCount: 610,
    },
    {
      id: "prod_headset_1",
      title: "ViewRoom VR Spatial Lens",
      category: "Hardware",
      price: "$1,200",
      image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=800",
      modelFormat: "USDZ / GLB",
      viewsCount: 1250,
    },
  ]);

  const [toursSearch, setToursSearch] = useState("");
  const [productsSearch, setProductsSearch] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Tour Builder Form State
  const [newTourTitle, setNewTourTitle] = useState("");
  const [newTourCategory, setNewTourCategory] = useState("Commercial Real Estate");
  const [newTourPrice, setNewTourPrice] = useState("Free");
  const [newTourDesc, setNewTourDesc] = useState("");

  // Product Form State
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Modern Furniture");
  const [newProdPrice, setNewProdPrice] = useState("$500");

  // Settings State
  const [studioName, setStudioName] = useState("ViewRoom Spatial Studio");
  const [watermarkText, setWatermarkText] = useState("Powered by ViewRoom 360°");
  const [enableAiConcierge, setEnableAiConcierge] = useState(true);

  // Hotspot Modal State
  const [editingScene, setEditingScene] = useState(null);
  const [editingTour, setEditingTour] = useState(null);

  // Share Link State
  const [copiedTourId, setCopiedTourId] = useState(null);

  // Multi-Scene Builder State
  const [newTourScenesList, setNewTourScenesList] = useState([
    {
      id: `scene_init_1`,
      name: "ENTRANCE LOBBY",
      floorLevel: "Ground Floor",
      panoramaUrl: "/panoramas/panorama_aerial.jpg",
      thumbnailUrl: "/panoramas/panorama_aerial.jpg",
      isCover: true,
    },
  ]);

  const handleCopyShareableLink = (tourId) => {
    const shareUrl = `${window.location.origin}/360-virtual-tour?id=${tourId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopiedTourId(tourId);
    setTimeout(() => setCopiedTourId(null), 2500);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [fetchedStats, fetchedTours] = await Promise.all([
        apiGetOwnerStats(),
        apiGetOwnerTours(),
      ]);
      if (fetchedStats) setStats((prev) => ({ ...prev, ...fetchedStats }));
      if (fetchedTours && fetchedTours.length > 0) setTours(fetchedTours);
    } catch (err) {
      console.warn("Creator dashboard data loading error:", err);
    }
  };

  const handleAddBuilderScene = () => {
    const sceneNum = newTourScenesList.length + 1;
    const presets = [
      "/panoramas/panorama_entrance.jpg",
      "/panoramas/panorama_floor1.jpg",
      "/panoramas/panorama_aerial.jpg",
    ];
    const pickedPanorama = presets[sceneNum % presets.length];

    setNewTourScenesList((prev) => [
      ...prev,
      {
        id: `scene_${Date.now()}_${sceneNum}`,
        name: `ROOM SCENE ${sceneNum}`,
        floorLevel: `${sceneNum}st Floor`,
        panoramaUrl: pickedPanorama,
        thumbnailUrl: pickedPanorama,
        isCover: false,
      },
    ]);
  };

  const handleRemoveBuilderScene = (sceneId) => {
    if (newTourScenesList.length <= 1) return;
    setNewTourScenesList((prev) => prev.filter((s) => s.id !== sceneId));
  };

  const handleSetCoverScene = (sceneId) => {
    setNewTourScenesList((prev) =>
      prev.map((s) => ({ ...s, isCover: s.id === sceneId }))
    );
  };

  const handleCreateTour = async (e) => {
    e.preventDefault();
    if (!newTourTitle) return;

    const coverScene = newTourScenesList.find((s) => s.isCover) || newTourScenesList[0];

    const formattedScenes = newTourScenesList.map((s) => ({
      id: s.id,
      name: s.name,
      floorLevel: s.floorLevel,
      thumbnailUrl: s.thumbnailUrl || s.panoramaUrl,
      panoramaUrl: s.panoramaUrl,
      hotspots: [],
    }));

    const tourData = {
      id: `tour_${Date.now()}`,
      title: newTourTitle,
      category: newTourCategory,
      price: newTourPrice,
      description: newTourDesc,
      coverImage: coverScene ? (coverScene.thumbnailUrl || coverScene.panoramaUrl) : "/panoramas/panorama_aerial.jpg",
      viewsCount: 0,
      scenes: formattedScenes,
    };

    const res = await apiCreateOwnerTour(tourData);
    const created = (res && res.data) || tourData;
    setTours((prev) => [created, ...prev]);
    setNewTourTitle("");
    setNewTourDesc("");
    setNewTourScenesList([
      {
        id: `scene_init_1`,
        name: "ENTRANCE LOBBY",
        floorLevel: "Ground Floor",
        panoramaUrl: "/panoramas/panorama_aerial.jpg",
        thumbnailUrl: "/panoramas/panorama_aerial.jpg",
        isCover: true,
      },
    ]);
    if (setActiveTab) setActiveTab("tours");
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdTitle) return;

    const newProd = {
      id: `prod_${Date.now()}`,
      title: newProdTitle,
      category: newProdCategory,
      price: newProdPrice,
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
      modelFormat: "GLTF / GLB",
      viewsCount: 0,
    };

    setProducts((prev) => [newProd, ...prev]);
    setNewProdTitle("");
    setShowAddProductModal(false);
  };

  const handleAddSceneToTour = async (tourId) => {
    const sceneName = prompt("Enter Scene / Room Name (e.g. 2ND FLOOR EXECUTIVE SUITE):", "2ND FLOOR ROOM");
    if (!sceneName) return;

    const sceneData = {
      id: `scene_${Date.now()}`,
      name: sceneName,
      floorLevel: "2nd Floor",
      panoramaUrl: "/panoramas/panorama_floor1.jpg",
      thumbnailUrl: "/panoramas/panorama_floor1.jpg",
      hotspots: [],
    };

    const res = await apiAddOwnerScene(tourId, sceneData);
    setTours((prev) =>
      prev.map((t) =>
        t.id === tourId
          ? { ...t, scenes: [...(t.scenes || []), (res && res.data) || sceneData] }
          : t
      )
    );
  };

  const handleDeleteTour = (tourId) => {
    if (!window.confirm("Are you sure you want to delete this 360° tour?")) return;
    setTours((prev) => prev.filter((t) => t.id !== tourId));
  };

  const handleSaveHotspot = async (hotspotData) => {
    if (!editingTour || !editingScene) return;
    const res = await apiAddOwnerHotspot(editingTour.id, editingScene.id, hotspotData);
    setTours((prev) =>
      prev.map((t) => {
        if (t.id !== editingTour.id) return t;
        return {
          ...t,
          scenes: t.scenes.map((s) => {
            if (s.id !== editingScene.id) return s;
            return {
              ...s,
              hotspots: [...(s.hotspots || []), (res && res.data) || hotspotData],
            };
          }),
        };
      })
    );
    setEditingScene(null);
    setEditingTour(null);
  };

  const currentRoute = activeTab || "creator_overview";

  const filteredTours = tours.filter(
    (t) =>
      t.title.toLowerCase().includes(toursSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(toursSearch.toLowerCase())
  );

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productsSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productsSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      {/* 1. OVERVIEW ROUTE VIEW (creator_overview) */}
      {(currentRoute === "creator_overview" || currentRoute === "overview") && (
        <div className="space-y-6">
          {/* Top Welcome Banner */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block mb-1">
                Creator & Property Owner Control Panel
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                Welcome back, {user?.name || "360° Creator"}
              </h2>
              <p className="text-xs text-base-content/70 mt-1 max-w-xl">
                Publish 360° virtual property tours, attach pitch/yaw spherical hotspots, and manage interactive 3D product spins.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setActiveTab && setActiveTab("uploader")}
              className="whitespace-nowrap cursor-pointer !rounded-2xl"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Build New 360° Tour</span>
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  Active 360° Tours
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-base-content">{tours.length}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  3D Product Spins
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-base-content">{products.length}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faCube} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  Panoramic Views
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.totalViews}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faEye} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  Engagement Rate
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-base-content">{stats.engagementRate}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
            </div>
          </div>

          {/* Published Tours Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
                Published 360° Virtual Tours ({tours.length})
              </h3>
              <button
                onClick={() => setActiveTab && setActiveTab("tours")}
                className="text-xs font-semibold text-base-content/70 hover:text-base-content cursor-pointer"
              >
                Manage All Tours →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tours.map((tour) => (
                <div
                  key={tour.id}
                  className="p-4 rounded-[24px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all"
                >
                  <div>
                    <div className="relative h-44 rounded-2xl overflow-hidden mb-4 bg-base-200">
                      <img src={tour.coverImage} alt={tour.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                        {tour.scenes?.length || 0} Room Scenes
                      </div>
                    </div>

                    <h4 className="font-bold text-sm text-base-content mb-1">{tour.title}</h4>
                    <span className="text-xs text-base-content/60 mb-4 block">
                      {tour.category} • {tour.price}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link to={`/360-virtual-tour?id=${tour.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full text-center !rounded-xl !text-xs !py-1.5">
                        <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                        View 360°
                      </Button>
                    </Link>
                    <button
                      onClick={() => handleCopyShareableLink(tour.id)}
                      className="px-2.5 py-1.5 rounded-xl border border-base-content/20 bg-base-200 hover:bg-base-300 text-xs text-base-content font-bold cursor-pointer transition-colors flex items-center gap-1"
                      title="Copy Shareable 360° Link"
                    >
                      <FontAwesomeIcon icon={copiedTourId === tour.id ? faCheck : faShareNodes} className={copiedTourId === tour.id ? "text-success" : ""} />
                      <span className="hidden sm:inline">{copiedTourId === tour.id ? "Copied" : "Share"}</span>
                    </button>
                    <button
                      onClick={() => handleAddSceneToTour(tour.id)}
                      className="p-2 rounded-xl border border-base-content/20 bg-base-200 hover:bg-base-300 text-xs text-base-content font-bold cursor-pointer transition-colors"
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

      {/* 2. MY 360 TOURS ROUTE VIEW (tours) */}
      {currentRoute === "tours" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
                My 360° Virtual Property Tours Studio ({tours.length})
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Manage room scenes, place interactive pitch/yaw hotspot links, and review tour analytics
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search tours..."
                  value={toursSearch}
                  onChange={(e) => setToursSearch(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
              </div>
              <Button
                variant="primary"
                onClick={() => setActiveTab && setActiveTab("uploader")}
                className="whitespace-nowrap cursor-pointer !rounded-xl !text-xs !py-2"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                New Tour
              </Button>
            </div>
          </div>

          {/* Tours List */}
          <div className="space-y-4">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs hover:border-base-content/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img src={tour.coverImage} alt={tour.title} className="w-24 h-18 rounded-2xl object-cover bg-base-200 border border-base-content/10" />
                  <div>
                    <h4 className="font-bold text-base text-base-content">{tour.title}</h4>
                    <p className="text-xs text-base-content/60 mt-0.5">
                      {tour.category} • {tour.scenes?.length || 0} Scenes • {tour.viewsCount || 0} Views
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                  {tour.scenes?.[0] && (
                    <button
                      onClick={() => {
                        setEditingTour(tour);
                        setEditingScene(tour.scenes[0]);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faCompass} />
                      Add Pitch/Yaw Hotspot
                    </button>
                  )}
                  <button
                    onClick={() => handleCopyShareableLink(tour.id)}
                    className="px-3 py-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-base-content/10"
                    title="Copy Shareable 360° Link"
                  >
                    <FontAwesomeIcon icon={copiedTourId === tour.id ? faCheck : faShareNodes} className={copiedTourId === tour.id ? "text-success" : ""} />
                    <span>{copiedTourId === tour.id ? "Copied Link!" : "Copy Share Link"}</span>
                  </button>
                  <button
                    onClick={() => handleAddSceneToTour(tour.id)}
                    className="px-3.5 py-2 rounded-xl border border-base-content/20 text-base-content text-xs font-semibold hover:bg-base-200 transition-all cursor-pointer"
                  >
                    + Add Scene
                  </button>
                  <Link to={`/360-virtual-tour?id=${tour.id}`}>
                    <Button variant="secondary" className="!text-xs !py-1.5 !px-3.5 !rounded-xl">
                      <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-1.5" />
                      View 360°
                    </Button>
                  </Link>
                  <button
                    onClick={() => handleDeleteTour(tour.id)}
                    className="p-2.5 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content/70 transition-colors cursor-pointer text-xs"
                    title="Delete Tour"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. 3D PRODUCT SPINS ROUTE VIEW (products) */}
      {currentRoute === "products" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faCube} className="text-base-content/60" />
                3D Interactive Product Spins Studio ({products.length})
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Upload 3D GLTF/GLB models for interactive 360° object rotation and material preview
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productsSearch}
                  onChange={(e) => setProductsSearch(e.target.value)}
                  className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                />
                <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
              </div>
              <Button
                variant="primary"
                onClick={() => setShowAddProductModal(!showAddProductModal)}
                className="whitespace-nowrap cursor-pointer !rounded-xl !text-xs !py-2"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                Add 3D Product
              </Button>
            </div>
          </div>

          {/* Add 3D Product Collapsible Form */}
          {showAddProductModal && (
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-base-content">Upload New 3D Product Spin Model</h4>
              <form onSubmit={handleCreateProduct} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-base-content/70 mb-1">Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Modern Ergonomic Chair"
                    value={newProdTitle}
                    onChange={(e) => setNewProdTitle(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-base-content/70 mb-1">Category</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                  >
                    <option>Modern Furniture</option>
                    <option>Office Furniture</option>
                    <option>Hardware & Electronics</option>
                    <option>Architectural Fixture</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-base-content/70 mb-1">Price Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. $850"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-3 flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    className="px-4 py-2 rounded-xl bg-base-200 text-xs font-semibold hover:bg-base-300 text-base-content cursor-pointer"
                  >
                    Cancel
                  </button>
                  <Button type="submit" variant="primary" className="!rounded-xl !text-xs !py-2">
                    Save 3D Product Spin
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* 3D Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all"
              >
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-base-200">
                    <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                      {p.modelFormat}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-base-content mb-1">{p.title}</h4>
                  <span className="text-xs text-base-content/60 block mb-4">
                    {p.category} • {p.price}
                  </span>
                </div>

                <Link to="/360-product" className="w-full">
                  <Button variant="primary" className="w-full text-center !rounded-xl !text-xs">
                    <FontAwesomeIcon icon={faCube} className="mr-2" />
                    Launch 3D Product Spin
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SCENE & TOUR BUILDER ROUTE VIEW (uploader) */}
      {currentRoute === "uploader" && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-base-100 border border-base-content/10 space-y-6 max-w-3xl mx-auto shadow-xs">
          <div className="border-b border-base-content/10 pb-4">
            <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block mb-1">
              Studio Builder
            </span>
            <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faCloudArrowUp} className="text-base-content/60" />
              Create & Publish New 360° Virtual Tour
            </h3>
            <p className="text-xs text-base-content/60 mt-1">
              Fill out your 360° space metadata, choose equirectangular panoramic scenes, and publish instantly
            </p>
          </div>

          <form onSubmit={handleCreateTour} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-base-content/70 mb-1">
                Property / Tour Title*
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Horizon Waterfront Villa 360°"
                value={newTourTitle}
                onChange={(e) => setNewTourTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">
                  Category
                </label>
                <select
                  value={newTourCategory}
                  onChange={(e) => setNewTourCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option>Commercial Real Estate</option>
                  <option>Residential Villa</option>
                  <option>Modern Architecture</option>
                  <option>Boutique Hotel</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">
                  Price Tag / Status
                </label>
                <input
                  type="text"
                  placeholder="e.g. Free or $2,500,000"
                  value={newTourPrice}
                  onChange={(e) => setNewTourPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-base-content/70 mb-1">
                Description & Spatial Features
              </label>
              <textarea
                rows={3}
                placeholder="Detail key architectural highlights, lighting, floor plan notes..."
                value={newTourDesc}
                onChange={(e) => setNewTourDesc(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none resize-none"
              />
            </div>

            {/* Multi-Scene Room Scenes Manager */}
            <div className="pt-2 space-y-4 border-t border-base-content/10">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-base-content flex items-center gap-2">
                    <FontAwesomeIcon icon={faLayerGroup} className="text-base-content/60" />
                    360° Property Scenes ({newTourScenesList.length})
                  </h4>
                  <p className="text-[11px] text-base-content/60">
                    Add room scenes, assign floor levels, and choose which scene acts as the cover thumbnail
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBuilderScene}
                  className="px-3.5 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold transition-all cursor-pointer border border-base-content/10 flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Room Scene</span>
                </button>
              </div>

              <div className="space-y-3">
                {newTourScenesList.map((sc, idx) => (
                  <div
                    key={sc.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col gap-3 ${
                      sc.isCover
                        ? "bg-base-200/70 border-base-content/30 shadow-xs"
                        : "bg-base-100 border-base-content/10"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 w-full sm:w-auto flex-1">
                        {/* Interactive Thumbnail & Cover Badge */}
                        <div className="relative w-20 h-14 rounded-xl overflow-hidden bg-base-200 shrink-0 border border-base-content/15 shadow-xs">
                          <img src={sc.panoramaUrl} alt={sc.name} className="w-full h-full object-cover" />
                          {sc.isCover ? (
                            <span className="absolute bottom-0 left-0 right-0 bg-base-content text-base-100 text-[8px] font-extrabold uppercase text-center py-0.5 tracking-wider">
                              ★ COVER
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetCoverScene(sc.id)}
                              className="absolute inset-0 bg-black/40 hover:bg-black/20 text-white text-[9px] font-bold opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-center px-1"
                            >
                              Make Cover
                            </button>
                          )}
                        </div>

                        {/* Title & Floor Level Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/50 mb-0.5">
                              Room Scene Title
                            </label>
                            <input
                              type="text"
                              value={sc.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewTourScenesList((prev) =>
                                  prev.map((item) => (item.id === sc.id ? { ...item, name: val } : item))
                                );
                              }}
                              placeholder="Scene Title (e.g. Living Room)"
                              className="w-full px-3 py-1.5 rounded-lg bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-base-content/50 mb-0.5">
                              Floor Level
                            </label>
                            <input
                              type="text"
                              value={sc.floorLevel}
                              onChange={(e) => {
                                const val = e.target.value;
                                setNewTourScenesList((prev) =>
                                  prev.map((item) => (item.id === sc.id ? { ...item, floorLevel: val } : item))
                                );
                              }}
                              placeholder="Floor Level (e.g. Ground Floor)"
                              className="w-full px-3 py-1.5 rounded-lg bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Scene Action Buttons: Upload 360 File & Set Cover & Delete */}
                      <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
                        {/* Hidden File Input */}
                        <input
                          type="file"
                          accept="image/*"
                          id={`file_input_${sc.id}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const imageUrl = URL.createObjectURL(file);
                              setNewTourScenesList((prev) =>
                                prev.map((item) =>
                                  item.id === sc.id
                                    ? { ...item, panoramaUrl: imageUrl, thumbnailUrl: imageUrl }
                                    : item
                                )
                              );
                            }
                          }}
                        />

                        <label
                          htmlFor={`file_input_${sc.id}`}
                          className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 border border-base-content/10 text-xs font-semibold text-base-content flex items-center gap-1.5 cursor-pointer transition-colors"
                          title="Upload 360° Panorama Image file from your device"
                        >
                          <FontAwesomeIcon icon={faCloudArrowUp} className="text-base-content/70" />
                          <span>Upload 360 Image</span>
                        </label>

                        <button
                          type="button"
                          onClick={() => handleSetCoverScene(sc.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                            sc.isCover
                              ? "bg-base-content text-base-100 border-base-content"
                              : "bg-base-200 text-base-content/70 hover:text-base-content border-base-content/10"
                          }`}
                        >
                          {sc.isCover ? "★ Main Cover" : "Set Cover"}
                        </button>

                        {newTourScenesList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBuilderScene(sc.id)}
                            className="p-2 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content/70 text-xs cursor-pointer transition-colors"
                            title="Remove Room Scene"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-base-content/10 flex items-center justify-end">
              <Button type="submit" variant="primary" className="!px-8 !py-3 !rounded-2xl cursor-pointer">
                Save & Publish 360° Space
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 5. SPATIAL ANALYTICS ROUTE VIEW (analytics) */}
      {currentRoute === "analytics" && <AnalyticsDashboard />}

      {/* 6. CREATOR STUDIO SETTINGS ROUTE VIEW (settings) */}
      {currentRoute === "settings" && (
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 shadow-xs">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faSliders} className="text-base-content/60" />
              Creator Studio & Branding Settings
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Customize 360° viewer branding, watermark overlays, and Spatial AI Concierge defaults
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-[28px] bg-base-100 border border-base-content/10 max-w-2xl space-y-5 shadow-xs">
            <div>
              <label className="block text-xs font-semibold text-base-content/70 mb-1">
                Studio / Brand Name
              </label>
              <input
                type="text"
                value={studioName}
                onChange={(e) => setStudioName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-base-content/70 mb-1">
                360° Viewer Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-bold text-xs text-base-content">Enable Spatial AI Auto-Concierge</p>
                <p className="text-[10px] text-base-content/60">Allow Gemini AI to answer visitor questions on your 360° tours</p>
              </div>
              <input
                type="checkbox"
                checked={enableAiConcierge}
                onChange={(e) => setEnableAiConcierge(e.target.checked)}
                className="toggle toggle-sm"
              />
            </div>

            <div className="pt-2">
              <Button variant="primary" className="!rounded-xl !text-xs !py-2.5">
                Save Studio Settings
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. CREATOR HELP ROUTE VIEW (help) */}
      {currentRoute === "help" && (
        <div className="space-y-6">
          <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 shadow-xs">
            <h3 className="font-bold text-base text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-base-content/60" />
              Creator Guide & 360° Hotspot Documentation
            </h3>
            <p className="text-xs text-base-content/60 mt-0.5">
              Comprehensive guide to creating equirectangular panoramas and placing interactive pitch/yaw hotspots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                1. 360° Panorama Image Requirements
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• <strong>Aspect Ratio:</strong> Equirectangular format requires exact 2:1 aspect ratio (e.g. 4096x2048 or 8192x4096).</p>
                <p>• <strong>Format:</strong> JPEG or PNG files recommended.</p>
                <p>• <strong>HDR Lighting:</strong> Balanced exposure across all 360 degrees for smooth sphere rendering.</p>
              </div>
            </div>

            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <h4 className="font-bold text-sm text-base-content border-b border-base-content/10 pb-2">
                2. Placing Pitch & Yaw Hotspots
              </h4>
              <div className="space-y-2 text-xs text-base-content/80">
                <p>• Click <strong>"Add Pitch/Yaw Hotspot"</strong> on any tour scene in your 360° tours list.</p>
                <p>• In the interactive sphere viewport, click anywhere on the floor or doorway to automatically set Pitch & Yaw coordinates.</p>
                <p>• Select a target room scene to connect two rooms seamlessly.</p>
              </div>
            </div>
          </div>
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
