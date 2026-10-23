import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  faCloudArrowUp,
  faShareNodes,
  faCheck,
  faMusic,
  faArrowUp,
  faArrowDown,
  faPenToSquare,
  faSpinner,
  faGripVertical,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import StudioSceneEditor from "./StudioSceneEditor";
import AnalyticsDashboard from "./AnalyticsDashboard";
import TourSoundModal from "./TourSoundModal";
import {
  apiGetOwnerStats,
  apiGetOwnerTours,
  apiCreateOwnerTour,
  apiAddOwnerScene,
  apiUploadImage,
  apiSaveTourAudio,
  apiDeleteOwnerTour,
  apiGetOwnerProducts,
  apiCreateOwnerProduct,
  apiDeleteOwnerProduct,
} from "../../services/api";

const ROOM_NAME_PRESETS = [
  "Entrance / Hallway",
  "Living Room",
  "Dining Room",
  "Kitchen",
  "Master Bedroom",
  "Bedroom 2",
  "Bedroom 3",
  "Bathroom",
  "Balcony / Terrace",
  "Backyard / Garden",
  "Study / Office",
  "Basement",
  "Garage",
  "Swimming Pool",
  "Rooftop",
];

export default function CreatorDashboard({ user, activeTab, setActiveTab }) {
  const [stats, setStats] = useState({
    totalTours: 0,
    totalProducts: 0,
    totalViews: 0,
    aiConversations: 184,
    engagementRate: "96.4%",
  });

  const [tours, setTours] = useState([]);
  const [products, setProducts] = useState([]);

  const [toursSearch, setToursSearch] = useState("");
  const [productsSearch, setProductsSearch] = useState("");
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Tour Creator Form State (uploader)
  const [newTourTitle, setNewTourTitle] = useState("");
  const [newTourCategory, setNewTourCategory] = useState("Commercial Real Estate");
  const [newTourPrice, setNewTourPrice] = useState("Free");
  const [newTourDesc, setNewTourDesc] = useState("");
  const [isProcessingUploads, setIsProcessingUploads] = useState(false);

  // Studio Scene Editor Active Tour State
  const [studioEditingTour, setStudioEditingTour] = useState(null);
  const [studioInitialSceneIndex, setStudioInitialSceneIndex] = useState(0);

  // Multi-Scene Batch List
  const [newTourScenesList, setNewTourScenesList] = useState([
    {
      id: "scene_init_1",
      name: "Entrance / Hallway",
      floorLevel: "Ground Floor",
      panoramaUrl: "/panoramas/panorama_aerial.jpg",
      thumbnailUrl: "/panoramas/panorama_aerial.jpg",
      defaultYaw: "0deg",
      defaultPitch: "0deg",
      isCover: true,
      hotspots: [],
    },
  ]);

  // Product Form State
  const [newProdTitle, setNewProdTitle] = useState("");
  const [newProdCategory, setNewProdCategory] = useState("Modern Furniture");
  const [newProdPrice, setNewProdPrice] = useState("$500");

  // Settings State
  const [studioName, setStudioName] = useState("ViewRoom Spatial Studio");
  const [watermarkText, setWatermarkText] = useState("Powered by ViewRoom 360°");

  // Share Link State
  const [copiedTourId, setCopiedTourId] = useState(null);

  // Custom Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Tour Spatial Sound Modal State
  const [soundModalTour, setSoundModalTour] = useState(null);

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.id]);

  const handleCopyShareableLink = (tourId) => {
    const shareUrl = `${window.location.origin}/virtual-tour/${tourId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopiedTourId(tourId);
    setTimeout(() => setCopiedTourId(null), 2500);
  };

  const ensureTourScenes = (tourList) => {
    if (!Array.isArray(tourList)) return [];
    return tourList.map((t) => {
      const existingScenes = Array.isArray(t.scenes) ? t.scenes : [];
      if (existingScenes.length === 0) {
        const cover = t.coverImage || "/panoramas/panorama_aerial.jpg";
        return {
          ...t,
          scenes: [
            {
              id: `scene_${t.id}_main`,
              name: `${t.title || "Room"} - Main Scene`,
              floorLevel: "Ground Floor",
              panoramaUrl: cover,
              thumbnailUrl: cover,
              defaultYaw: "0deg",
              defaultPitch: "0deg",
              hotspots: [],
            },
          ],
        };
      }
      return t;
    });
  };

  const saveToursToStorage = (updatedTours) => {
    try {
      const userEmail = (user?.email || "").toLowerCase().trim();
      if (!userEmail) return;

      localStorage.setItem(`viewroom_tours_${userEmail}`, JSON.stringify(updatedTours));

      const allRaw = localStorage.getItem("viewroom_custom_tours");
      let allTours = [];
      if (allRaw) {
        try {
          const parsed = JSON.parse(allRaw);
          if (Array.isArray(parsed)) allTours = parsed;
        } catch (e) {}
      }

      const otherCreatorsTours = allTours.filter(
        (t) => t.authorEmail && t.authorEmail.toLowerCase().trim() !== userEmail
      );

      const stampedUserTours = updatedTours.map((t) => ({
        ...t,
        authorEmail: t.authorEmail || user?.email,
        authorId: t.authorId || user?.id,
      }));

      const merged = [...stampedUserTours, ...otherCreatorsTours];
      localStorage.setItem("viewroom_custom_tours", JSON.stringify(merged));
    } catch (err) {
      console.warn("Failed to save custom tours to localStorage:", err);
    }
  };

  const saveProductsToStorage = (updatedProducts) => {
    try {
      const userEmail = (user?.email || "").toLowerCase().trim();
      if (!userEmail) return;
      localStorage.setItem(`viewroom_products_${userEmail}`, JSON.stringify(updatedProducts));
    } catch (err) {
      console.warn("Failed to save custom products:", err);
    }
  };

  const loadDashboardData = async () => {
    try {
      const userEmail = (user?.email || "").toLowerCase().trim();
      const userId = user?.id || "";

      const [fetchedStats, fetchedToursRes, fetchedProdsRes] = await Promise.all([
        apiGetOwnerStats(),
        apiGetOwnerTours(),
        apiGetOwnerProducts(),
      ]);
      const fetchedTours = fetchedToursRes && (fetchedToursRes.data || fetchedToursRes);
      const fetchedProds = fetchedProdsRes && (fetchedProdsRes.data || fetchedProdsRes);

      if (fetchedStats) setStats((prev) => ({ ...prev, ...fetchedStats }));

      let myProducts = [];
      const userSpecificProds = localStorage.getItem(`viewroom_products_${userEmail}`);
      if (userSpecificProds) {
        try {
          const parsed = JSON.parse(userSpecificProds);
          if (Array.isArray(parsed)) myProducts = parsed;
        } catch (e) {}
      } else if (Array.isArray(fetchedProds)) {
        myProducts = fetchedProds.filter(
          (p) => p.authorEmail && p.authorEmail.toLowerCase().trim() === userEmail
        );
      }
      setProducts(myProducts);

      let myTours = [];
      const userSpecificTours = localStorage.getItem(`viewroom_tours_${userEmail}`);
      const savedLocalTours = localStorage.getItem("viewroom_custom_tours");

      if (userSpecificTours) {
        try {
          const parsed = JSON.parse(userSpecificTours);
          if (Array.isArray(parsed)) myTours = parsed;
        } catch (e) {}
      } else if (savedLocalTours) {
        try {
          const allTours = JSON.parse(savedLocalTours);
          if (Array.isArray(allTours)) {
            myTours = allTours.filter(
              (t) =>
                (t.authorEmail && t.authorEmail.toLowerCase().trim() === userEmail) ||
                (t.authorId && t.authorId === userId)
            );
          }
        } catch (e) {}
      } else if (Array.isArray(fetchedTours)) {
        myTours = fetchedTours.filter(
          (t) =>
            (t.authorEmail && t.authorEmail.toLowerCase().trim() === userEmail) ||
            (t.authorId && t.authorId === userId)
        );
      }

      const healedTours = ensureTourScenes(myTours);
      setTours(healedTours);
      if (userEmail && healedTours.length > 0) {
        saveToursToStorage(healedTours);
      }
    } catch (err) {
      console.warn("Creator dashboard data loading error:", err);
    }
  };

  const handleSaveSoundConfig = async (audioConfig) => {
    if (!soundModalTour) return;
    await apiSaveTourAudio(soundModalTour.id, audioConfig);
    setTours((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== soundModalTour.id) return t;
        return { ...t, audioConfig };
      });
      saveToursToStorage(updated);
      return updated;
    });
    setSoundModalTour(null);
  };

  // Batch 360 Panorama File Upload Handler
  const handleBatchPanoramaUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsProcessingUploads(true);
    const newScenes = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result);
        reader.readAsDataURL(file);
      });

      let finalUrl = base64Data;
      try {
        const uploadedUrl = await apiUploadImage(base64Data, file.name);
        if (uploadedUrl) finalUrl = uploadedUrl;
      } catch (err) {
        console.warn("Server upload fallback to base64:", err);
      }

      // Auto-detect clean name from file name (e.g., "living_room.jpg" -> "Living Room")
      let cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ").trim();
      if (!cleanName || cleanName.length < 3) {
        const presetIndex = (newTourScenesList.length + i) % ROOM_NAME_PRESETS.length;
        cleanName = ROOM_NAME_PRESETS[presetIndex];
      } else {
        cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
      }

      newScenes.push({
        id: `scene_${Date.now()}_${i}`,
        name: cleanName,
        floorLevel: "Ground Floor",
        panoramaUrl: finalUrl,
        thumbnailUrl: finalUrl,
        defaultYaw: "0deg",
        defaultPitch: "0deg",
        isCover: false,
        isCustomUploaded: true,
        hotspots: [],
      });
    }

    setNewTourScenesList((prev) => {
      const isPlaceholderOnly =
        prev.length === 1 && prev[0].id === "scene_init_1" && !prev[0].isCustomUploaded;
      if (isPlaceholderOnly) {
        if (newScenes.length > 0) newScenes[0].isCover = true;
        return newScenes;
      }
      return [...prev, ...newScenes];
    });

    setIsProcessingUploads(false);
  };

  // Move Room Scene Up / Down & Drag-and-Drop (MadeSnappy Image 4)
  const [draggedSceneIndex, setDraggedSceneIndex] = useState(null);

  const handleDragStart = (e, index) => {
    setDraggedSceneIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedSceneIndex === null || draggedSceneIndex === targetIndex) return;
    const list = [...newTourScenesList];
    const item = list.splice(draggedSceneIndex, 1)[0];
    list.splice(targetIndex, 0, item);
    setNewTourScenesList(list);
    setDraggedSceneIndex(null);
  };

  const handleMoveScene = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newTourScenesList.length) return;
    const list = [...newTourScenesList];
    const item = list.splice(index, 1)[0];
    list.splice(targetIndex, 0, item);
    setNewTourScenesList(list);
  };

  const handleAddBlankScene = () => {
    const presets = [
      "/panoramas/panorama_entrance.jpg",
      "/panoramas/panorama_floor1.jpg",
      "/panoramas/panorama_aerial.jpg",
    ];
    const nextIdx = newTourScenesList.length;
    const picked = presets[nextIdx % presets.length];
    const namePreset = ROOM_NAME_PRESETS[nextIdx % ROOM_NAME_PRESETS.length];

    setNewTourScenesList((prev) => [
      ...prev,
      {
        id: `scene_${Date.now()}_${nextIdx}`,
        name: namePreset,
        floorLevel: "Ground Floor",
        panoramaUrl: picked,
        thumbnailUrl: picked,
        defaultYaw: "0deg",
        defaultPitch: "0deg",
        isCover: false,
        hotspots: [],
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

  // Publish / Create Tour
  const handleCreateTour = async (openStudioAfter = false) => {
    if (!newTourTitle) {
      alert("Please enter a property or tour title.");
      return;
    }

    const coverScene = newTourScenesList.find((s) => s.isCover) || newTourScenesList[0];

    const formattedScenes = newTourScenesList.map((s, idx) => ({
      id: s.id || `scene_${Date.now()}_${idx}`,
      name: s.name || `Room ${idx + 1}`,
      floorLevel: s.floorLevel || "Ground Floor",
      thumbnailUrl: s.thumbnailUrl || s.panoramaUrl,
      panoramaUrl: s.panoramaUrl,
      defaultYaw: s.defaultYaw || "0deg",
      defaultPitch: s.defaultPitch || "0deg",
      hotspots: s.hotspots || [],
    }));

    const tourData = {
      id: `tour_${Date.now()}`,
      title: newTourTitle,
      category: newTourCategory,
      price: newTourPrice,
      description: newTourDesc,
      coverImage: coverScene
        ? coverScene.thumbnailUrl || coverScene.panoramaUrl
        : "/panoramas/panorama_aerial.jpg",
      viewsCount: 0,
      scenes: formattedScenes,
      authorId: user?.id,
      authorEmail: user?.email,
      authorName: user?.name,
      createdAt: new Date().toISOString(),
    };

    let created = tourData;
    try {
      const res = await apiCreateOwnerTour(tourData);
      if (res && res.data) created = res.data;
    } catch (err) {
      console.warn("apiCreateOwnerTour failed, saved locally:", err);
    }

    setTours((prev) => {
      const updated = ensureTourScenes([created, ...prev]);
      saveToursToStorage(updated);
      return updated;
    });

    // Reset Form
    setNewTourTitle("");
    setNewTourDesc("");
    setNewTourScenesList([
      {
        id: "scene_init_1",
        name: "Entrance / Hallway",
        floorLevel: "Ground Floor",
        panoramaUrl: "/panoramas/panorama_aerial.jpg",
        thumbnailUrl: "/panoramas/panorama_aerial.jpg",
        defaultYaw: "0deg",
        defaultPitch: "0deg",
        isCover: true,
        hotspots: [],
      },
    ]);

    if (openStudioAfter) {
      setStudioEditingTour(created);
      setStudioInitialSceneIndex(0);
    } else if (setActiveTab) {
      setActiveTab("tours");
    }
  };

  const handleUpdateTourFromStudio = (updatedTour) => {
    setTours((prev) => {
      const updated = prev.map((t) => (t.id === updatedTour.id ? updatedTour : t));
      saveToursToStorage(updated);
      return updated;
    });
  };

  const handleDeleteTour = (tourId) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete 360° Virtual Tour",
      message: "Are you sure you want to delete this 360° tour? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await apiDeleteOwnerTour(tourId);
        } catch (err) {
          console.warn("Failed to delete tour:", err);
        }
        setTours((prev) => {
          const updated = prev.filter((t) => t.id !== tourId);
          saveToursToStorage(updated);
          return updated;
        });
        setDeleteConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const handleDeleteAllTours = () => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete All Virtual Tours",
      message: "Are you sure you want to delete ALL your 360° virtual tours? This action cannot be undone.",
      onConfirm: async () => {
        try {
          for (const t of tours) {
            if (t.id) await apiDeleteOwnerTour(t.id).catch(() => {});
          }
        } catch (err) {}
        const userEmail = (user?.email || "").toLowerCase().trim();
        if (userEmail) {
          localStorage.removeItem(`viewroom_tours_${userEmail}`);
        }
        setTours([]);
        setDeleteConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  // Product Handlers
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdTitle) return;

    const productObj = {
      id: `prod_${Date.now()}`,
      title: newProdTitle,
      category: newProdCategory,
      price: newProdPrice,
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
      modelFormat: "GLTF / GLB",
      authorEmail: user?.email,
      authorId: user?.id,
      viewsCount: 0,
    };

    try {
      await apiCreateOwnerProduct(productObj);
    } catch (err) {}

    setProducts((prev) => {
      const updated = [productObj, ...prev];
      saveProductsToStorage(updated);
      return updated;
    });

    setNewProdTitle("");
    setShowAddProductModal(false);
  };

  const handleDeleteProduct = (productId) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete 3D Product",
      message: "Are you sure you want to delete this 3D product?",
      onConfirm: async () => {
        try {
          await apiDeleteOwnerProduct(productId);
        } catch (err) {}
        setProducts((prev) => {
          const updated = prev.filter((p) => p.id !== productId);
          saveProductsToStorage(updated);
          return updated;
        });
        setDeleteConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const currentRoute = activeTab || "creator_overview";

  const filteredTours = tours.filter(
    (t) =>
      t.title.toLowerCase().includes(toursSearch.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(toursSearch.toLowerCase()))
  );

  const filteredProducts = products.filter(
    (p) =>
      p.title.toLowerCase().includes(productsSearch.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(productsSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full select-none">
      
      {/* 1. OVERVIEW & TOURS ROUTE (MadeSnappy Image 3 Enterprise Property Table) */}
      {(currentRoute === "creator_overview" || currentRoute === "overview" || currentRoute === "tours") && (
        <div className="space-y-6">
          {/* Top Welcome / Header Banner */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div>
              <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block mb-1">
                360° Real Estate Studio & Agency Dashboard
              </span>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                Welcome back, {user?.name || "360° Creator"}
              </h2>
              <p className="text-xs text-base-content/70 mt-1 max-w-xl">
                Batch upload equirectangular panoramas, configure opening camera views, and link rooms with interactive floor pucks.
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => setActiveTab && setActiveTab("uploader")}
              className="whitespace-nowrap cursor-pointer !rounded-2xl"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>+ Upload New 360° Tour</span>
            </Button>
          </div>

          {/* Quick KPI Stats */}
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
                  Total Room Scenes
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold text-base-content">
                  {tours.reduce((acc, t) => acc + (t.scenes?.length || 0), 0)}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faCompass} />
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

          {/* PROPERTIES TABLE (MadeSnappy Image 3 Style) */}
          <div className="p-5 sm:p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
                  Virtual Properties & 360° Tours ({tours.length})
                </h3>
                <p className="text-xs text-base-content/60 mt-0.5">
                  Commercial property listings, multi-room panorama sequences, and live links
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-56">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={toursSearch}
                    onChange={(e) => setToursSearch(e.target.value)}
                    className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                  />
                  <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
                </div>
                {tours.length > 0 && (
                  <button
                    onClick={handleDeleteAllTours}
                    className="px-3 py-2 rounded-xl bg-error/10 hover:bg-error hover:text-white text-error text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-error/20 whitespace-nowrap"
                    title="Delete all tours permanently"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>

            {filteredTours.length === 0 ? (
              <div className="py-12 px-4 rounded-2xl bg-base-200/40 border border-dashed border-base-content/15 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-base-200 text-base-content/60 flex items-center justify-center mx-auto text-lg">
                  <FontAwesomeIcon icon={faCloudArrowUp} />
                </div>
                <h4 className="font-bold text-sm text-base-content">No 360° Properties Found</h4>
                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                  Upload multiple 360° equirectangular panoramas to build your first interactive virtual tour.
                </p>
                <Button
                  variant="primary"
                  onClick={() => setActiveTab && setActiveTab("uploader")}
                  className="!text-xs !py-2 !px-4 !rounded-xl cursor-pointer"
                >
                  <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                  + Batch Upload Panoramas
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-base-content/10 text-base-content/50 uppercase tracking-wider text-[10px] font-extrabold">
                      <th className="py-3 px-4">Property</th>
                      <th className="py-3 px-4">Panoramas</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Views</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-content/5">
                    {filteredTours.map((tour) => (
                      <tr key={tour.id} className="hover:bg-base-200/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={tour.coverImage || "/panoramas/panorama_aerial.jpg"}
                              alt={tour.title}
                              className="w-14 h-10 rounded-xl object-cover bg-base-200 border border-base-content/10 shrink-0 shadow-xs"
                            />
                            <div className="min-w-0">
                              <span className="font-bold text-sm text-base-content block truncate max-w-xs">
                                {tour.title}
                              </span>
                              <span className="text-[11px] text-base-content/60">
                                {tour.category || "Real Estate"} • {tour.price || "Free"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-base-200 font-bold text-base-content text-[11px] whitespace-nowrap">
                            {tour.scenes?.length || 1} Rooms
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Published
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono font-semibold text-base-content/70">
                          {tour.viewsCount || 0}
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Studio Editor (MadeSnappy Split View) */}
                            <button
                              type="button"
                              onClick={() => {
                                setStudioEditingTour(tour);
                                setStudioInitialSceneIndex(0);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-primary text-primary-content hover:opacity-90 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                              title="Open MadeSnappy 360 Studio Editor (Opening Views & Hotspots)"
                            >
                              <FontAwesomeIcon icon={faPenToSquare} />
                              <span className="hidden sm:inline">Studio Editor</span>
                            </button>

                            {/* View 360° */}
                            <Link to={`/virtual-tour/${tour.id}`} target="_blank">
                              <button
                                type="button"
                                className="px-2.5 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer border border-base-content/10"
                                title="Preview 360° Virtual Tour"
                              >
                                <FontAwesomeIcon icon={faEye} />
                                <span className="hidden sm:inline">View</span>
                              </button>
                            </Link>

                            {/* Sound Config */}
                            <button
                              type="button"
                              onClick={() => setSoundModalTour(tour)}
                              className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/75 hover:text-base-content text-xs cursor-pointer border border-base-content/10 transition-colors"
                              title={`Sound: ${tour.audioConfig?.enabled ?? true ? "ON" : "OFF"}`}
                            >
                              <FontAwesomeIcon icon={faMusic} />
                            </button>

                            {/* Share Link */}
                            <button
                              type="button"
                              onClick={() => handleCopyShareableLink(tour.id)}
                              className="p-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/75 hover:text-base-content text-xs cursor-pointer border border-base-content/10 transition-colors"
                              title="Copy Shareable Tour Link"
                            >
                              <FontAwesomeIcon
                                icon={copiedTourId === tour.id ? faCheck : faShareNodes}
                                className={copiedTourId === tour.id ? "text-success" : ""}
                              />
                            </button>

                            {/* Delete Tour */}
                            <button
                              type="button"
                              onClick={() => handleDeleteTour(tour.id)}
                              className="p-2 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content/50 text-xs cursor-pointer transition-colors"
                              title="Delete Tour"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. BATCH UPLOADER & REORDER STUDIO (MadeSnappy Image 1 & 4 Workflow) */}
      {currentRoute === "uploader" && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-base-100 border border-base-content/10 space-y-6 max-w-4xl mx-auto shadow-xs">
          
          {/* Workflow Pipeline Header (MadeSnappy Image 1) */}
          <div className="border-b border-base-content/10 pb-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold text-base-content/50 uppercase tracking-wider block mb-1">
                  MadeSnappy 360 Studio Pipeline
                </span>
                <h3 className="font-bold text-xl text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faCloudArrowUp} className="text-base-content/60" />
                  Create & Batch Upload 360° Property Tour
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab && setActiveTab("tours")}
                className="text-xs font-semibold text-base-content/60 hover:text-base-content cursor-pointer"
              >
                ← Back to Tours
              </button>
            </div>

            {/* Pipeline Visual Progression Bar */}
            <div className="grid grid-cols-4 gap-2 pt-2">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">
                  1. Info
                </span>
                <span className="text-[11px] font-bold text-base-content">Details</span>
              </div>
              <div className="p-2 rounded-xl bg-primary/10 border border-primary text-center">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary block">
                  2. Upload
                </span>
                <span className="text-[11px] font-bold text-base-content">Panoramas</span>
              </div>
              <div className="p-2 rounded-xl bg-base-200 text-center border border-base-content/10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/50 block">
                  3. Reorder
                </span>
                <span className="text-[11px] font-bold text-base-content/70">Label Rooms</span>
              </div>
              <div className="p-2 rounded-xl bg-base-200 text-center border border-base-content/10">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-base-content/50 block">
                  4. Studio
                </span>
                <span className="text-[11px] font-bold text-base-content/70">Opening & Links</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="space-y-5">
            {/* Property Title & Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-base-content/70 mb-1">
                  Property / Tour Title*
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Skyline Luxury Villa 360°"
                  value={newTourTitle}
                  onChange={(e) => setNewTourTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-base-content/70 mb-1">
                  Category
                </label>
                <select
                  value={newTourCategory}
                  onChange={(e) => setNewTourCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                >
                  <option>Commercial Real Estate</option>
                  <option>Residential Villa</option>
                  <option>Modern Architecture</option>
                  <option>Boutique Hotel & Resort</option>
                </select>
              </div>
            </div>

            {/* BATCH UPLOAD DROPZONE */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-base-content/20 hover:border-primary/50 transition-colors bg-base-200/40 text-center relative cursor-pointer">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleBatchPanoramaUpload}
                disabled={isProcessingUploads}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <div className="w-12 h-12 rounded-2xl bg-base-100 border border-base-content/10 text-primary flex items-center justify-center text-xl shadow-xs">
                  {isProcessingUploads ? (
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                  ) : (
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                  )}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-base-content">
                    {isProcessingUploads
                      ? "Processing & Uploading 360° Panoramas..."
                      : "Drop 360° Panorama Photos Here, or Click to Browse"}
                  </h4>
                  <p className="text-xs text-base-content/60 mt-0.5">
                    Select multiple equirectangular JPEG/PNG images at once. Rooms will be added automatically.
                  </p>
                </div>
                <div className="mt-1 px-3 py-1 rounded-full bg-base-100 border border-base-content/10 text-[10px] font-extrabold uppercase tracking-wider text-base-content/70">
                  ⚡ Multi-File Batch Upload Supported
                </div>
              </div>
            </div>

            {/* VISUAL ROOM REORDER STRIP (MadeSnappy Image 4) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-base-content flex items-center gap-2">
                    Room Sequence & Labels ({newTourScenesList.length})
                  </h4>
                  <p className="text-[11px] text-base-content/60">
                    Use arrows ▲/▼ to order room flow. Choose standard room name presets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBlankScene}
                  className="px-3 py-1.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold transition-all cursor-pointer border border-base-content/10 flex items-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faPlus} />
                  <span>Add Room</span>
                </button>
              </div>

              <div className="space-y-2">
                {newTourScenesList.map((sc, idx) => (
                  <div
                    key={sc.id || idx}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={() => setDraggedSceneIndex(null)}
                    className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                      draggedSceneIndex === idx
                        ? "opacity-50 scale-[0.99] border-dashed border-primary"
                        : sc.isCover
                        ? "bg-primary/5 border-primary/40 shadow-xs"
                        : "bg-base-100 border-base-content/10 hover:border-base-content/25"
                    }`}
                  >
                    {/* Left: Drag Grip + Index + Thumbnail + Name Preset Dropdown & Input */}
                    <div className="flex items-center gap-2.5 flex-1 w-full sm:w-auto">
                      {/* Drag Handle Grip */}
                      <div
                        className="cursor-grab active:cursor-grabbing text-base-content/30 hover:text-base-content/70 px-1 py-2"
                        title="Drag and drop to reorder"
                      >
                        <FontAwesomeIcon icon={faGripVertical} className="text-xs" />
                      </div>

                      {/* Step Number Badge */}
                      <span className="w-6 h-6 rounded-xl bg-base-200 text-base-content font-black text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>

                      {/* Thumbnail & Cover Indicator */}
                      <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-base-200 shrink-0 border border-base-content/10 shadow-xs">
                        <img
                          src={sc.thumbnailUrl || sc.panoramaUrl}
                          alt={sc.name}
                          className="w-full h-full object-cover"
                        />
                        {sc.isCover && (
                          <span className="absolute bottom-0 inset-x-0 bg-primary text-primary-content text-[8px] font-black uppercase text-center py-0.2 tracking-wider">
                            COVER
                          </span>
                        )}
                      </div>

                      {/* Name Preset Dropdown & Text Field */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1">
                        <select
                          value={ROOM_NAME_PRESETS.includes(sc.name) ? sc.name : "Custom"}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val !== "Custom") {
                              setNewTourScenesList((prev) =>
                                prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                              );
                            }
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none cursor-pointer"
                        >
                          <option value="Custom">Custom Room...</option>
                          {ROOM_NAME_PRESETS.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>

                        <input
                          type="text"
                          value={sc.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setNewTourScenesList((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, name: val } : item))
                            );
                          }}
                          placeholder="Room Name"
                          className="px-2.5 py-1.5 rounded-lg bg-base-200/80 border border-base-content/10 text-xs font-bold text-base-content focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Right: Up / Down Reorder + Cover + Delete */}
                    <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveScene(idx, -1)}
                        className="p-1.5 rounded-lg bg-base-200 hover:bg-base-300 disabled:opacity-20 text-base-content text-xs cursor-pointer transition-colors"
                        title="Move Room Up"
                      >
                        <FontAwesomeIcon icon={faArrowUp} />
                      </button>

                      <button
                        type="button"
                        disabled={idx === newTourScenesList.length - 1}
                        onClick={() => handleMoveScene(idx, 1)}
                        className="p-1.5 rounded-lg bg-base-200 hover:bg-base-300 disabled:opacity-20 text-base-content text-xs cursor-pointer transition-colors"
                        title="Move Room Down"
                      >
                        <FontAwesomeIcon icon={faArrowDown} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleSetCoverScene(sc.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all border ${
                          sc.isCover
                            ? "bg-primary text-primary-content border-primary"
                            : "bg-base-200 text-base-content/70 hover:text-base-content border-base-content/10"
                        }`}
                      >
                        {sc.isCover ? "★ Main Cover" : "Make Cover"}
                      </button>

                      {newTourScenesList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveBuilderScene(sc.id)}
                          className="p-1.5 rounded-lg bg-base-200 hover:bg-error hover:text-white text-base-content/50 text-xs cursor-pointer transition-colors"
                          title="Remove Room"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-base-content/10 flex flex-col sm:flex-row items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => handleCreateTour(false)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-bold transition-all cursor-pointer border border-base-content/10"
              >
                Save & Go to Tours List
              </button>

              <Button
                type="button"
                variant="primary"
                onClick={() => handleCreateTour(true)}
                className="w-full sm:w-auto !px-6 !py-2.5 !rounded-xl cursor-pointer"
              >
                <span>Save & Open 360° Studio Editor ▶</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 3D PRODUCT SPINS ROUTE VIEW (products) */}
      {currentRoute === "products" && (
        <div className="space-y-6">
          <div className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faCube} className="text-base-content/60" />
                3D Interactive Products ({products.length})
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Manage 3D GLTF product spins and AR models
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search 3D products..."
                value={productsSearch}
                onChange={(e) => setProductsSearch(e.target.value)}
                className="w-full sm:w-56 px-3.5 py-2 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <Button
                variant="primary"
                onClick={() => setShowAddProductModal(true)}
                className="whitespace-nowrap cursor-pointer !rounded-xl !text-xs !py-2"
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1.5" />
                Add Product
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-[24px] bg-base-100 border border-base-content/10 flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="w-16 h-16 rounded-2xl object-cover bg-base-200 border border-base-content/10 shrink-0"
                  />
                  <div className="min-w-0">
                    <h4 className="font-bold text-sm text-base-content truncate">{p.title}</h4>
                    <p className="text-xs text-base-content/60">{p.category} • {p.price}</p>
                    <span className="text-[10px] font-bold text-primary mt-1 block">
                      {p.modelFormat || "GLTF 3D"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-base-content/10">
                  <span className="text-xs text-base-content/60">{p.viewsCount || 0} views</span>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2 rounded-xl hover:bg-error hover:text-white text-base-content/50 text-xs cursor-pointer transition-colors"
                    title="Delete Product"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. SPATIAL ANALYTICS ROUTE VIEW (analytics) */}
      {currentRoute === "analytics" && <AnalyticsDashboard />}

      {/* 5. STUDIO SETTINGS (settings) */}
      {currentRoute === "settings" && (
        <div className="p-6 sm:p-8 rounded-[28px] bg-base-100 border border-base-content/10 space-y-6 max-w-2xl mx-auto shadow-xs">
          <h3 className="font-bold text-lg text-base-content flex items-center gap-2">
            <FontAwesomeIcon icon={faSliders} className="text-base-content/60" />
            360° Studio Brand Settings
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-base-content/70 mb-1">
                Agency / Studio Name
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
                Tour Viewer Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* MADESNAPPY 360 STUDIO SCENE EDITOR MODAL / SPLIT SCREEN */}
      {studioEditingTour && (
        <StudioSceneEditor
          tour={studioEditingTour}
          initialSceneIndex={studioInitialSceneIndex}
          onSaveTour={handleUpdateTourFromStudio}
          onClose={() => setStudioEditingTour(null)}
        />
      )}

      {/* SPATIAL SOUND CONFIGURATION MODAL */}
      {soundModalTour && (
        <TourSoundModal
          tour={soundModalTour}
          onClose={() => setSoundModalTour(null)}
          onSave={handleSaveSoundConfig}
        />
      )}

      {/* ADD 3D PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-base-content">Add 3D Product</h3>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Product Title"
                value={newProdTitle}
                onChange={(e) => setNewProdTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <input
                type="text"
                placeholder="Category"
                value={newProdCategory}
                onChange={(e) => setNewProdCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <input
                type="text"
                placeholder="Price"
                value={newProdPrice}
                onChange={(e) => setNewProdPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-4 py-2 rounded-xl bg-base-200 text-xs font-semibold text-base-content/70 cursor-pointer"
                >
                  Cancel
                </button>
                <Button type="submit" variant="primary" className="!text-xs !py-2 !px-4 !rounded-xl cursor-pointer">
                  Create Product
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRM DELETE MODAL */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-base-content">{deleteConfirmModal.title}</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">{deleteConfirmModal.message}</p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() =>
                  setDeleteConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null })
                }
                className="px-4 py-2 rounded-xl bg-base-200 text-xs font-semibold text-base-content/70 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteConfirmModal.onConfirm}
                className="px-4 py-2 rounded-xl bg-error text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
