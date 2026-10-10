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
  faQuestionCircle,
  faLayerGroup,
  faCloudArrowUp,
  faShareNodes,
  faCheck,
  faMusic,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import HotspotEditorModal from "./HotspotEditorModal";
import AnalyticsDashboard from "./AnalyticsDashboard";
import TourSoundModal from "./TourSoundModal";
import {
  apiGetOwnerStats,
  apiGetOwnerTours,
  apiCreateOwnerTour,
  apiAddOwnerScene,
  apiAddOwnerHotspot,
  apiUploadImage,
  apiSaveTourAudio,
  apiDeleteOwnerTour,
  apiGetOwnerProducts,
  apiCreateOwnerProduct,
  apiDeleteOwnerProduct,
} from "../../services/api";

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

  // Custom Delete Confirmation Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  // Tour Spatial Sound Modal State
  const [soundModalTour, setSoundModalTour] = useState(null);

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
    const shareUrl = `${window.location.origin}/virtual-tour/${tourId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopiedTourId(tourId);
    setTimeout(() => setCopiedTourId(null), 2500);
  };

  useEffect(() => {
    loadDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, user?.id]);

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

      // 1. Save user's own tours in isolated storage key
      localStorage.setItem(`viewroom_tours_${userEmail}`, JSON.stringify(updatedTours));

      // 2. Sync to global master list (preserving other users' tours)
      const allRaw = localStorage.getItem("viewroom_custom_tours");
      let allTours = [];
      if (allRaw) {
        try {
          const parsed = JSON.parse(allRaw);
          if (Array.isArray(parsed)) allTours = parsed;
        } catch (e) {}
      }

      // Preserve other creators' tours
      const otherCreatorsTours = allTours.filter(
        (t) => t.authorEmail && t.authorEmail.toLowerCase().trim() !== userEmail
      );

      // Stamped with current creator's email and id
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

      // Load products isolated for this creator
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

      // Load tours strictly isolated for this creator
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
            // Only load tours that belong to this specific email or ID!
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
      authorId: user?.id,
      authorEmail: user?.email,
      authorName: user?.name,
      createdAt: new Date().toISOString(),
    };

    const res = await apiCreateOwnerTour(tourData);
    let created = (res && res.data) || tourData;

    created = {
      ...created,
      authorEmail: created.authorEmail || user?.email,
      authorId: created.authorId || user?.id,
      authorName: created.authorName || user?.name,
    };

    if (!created.scenes || created.scenes.length === 0) {
      created = {
        ...created,
        scenes: formattedScenes.length > 0 ? formattedScenes : [
          {
            id: `scene_${created.id}_main`,
            name: `${created.title} - Main Scene`,
            floorLevel: "Ground Floor",
            panoramaUrl: created.coverImage,
            thumbnailUrl: created.coverImage,
            hotspots: [],
          },
        ],
      };
    }
    
    setTours((prev) => {
      const updated = ensureTourScenes([created, ...prev]);
      saveToursToStorage(updated);
      return updated;
    });

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

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProdTitle) return;

    try {
      const res = await apiCreateOwnerProduct({
        title: newProdTitle,
        category: newProdCategory,
        price: newProdPrice,
        image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
        modelFormat: "GLTF / GLB",
        authorEmail: user?.email,
        authorId: user?.id,
      });
      const created = (res && res.data) || res;
      const productObj = {
        ...(created || {}),
        id: created?.id || `prod_${Date.now()}`,
        title: newProdTitle,
        category: newProdCategory,
        price: newProdPrice,
        image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
        modelFormat: "GLTF / GLB",
        authorEmail: user?.email,
        authorId: user?.id,
        viewsCount: 0,
      };
      setProducts((prev) => {
        const updated = [productObj, ...prev];
        saveProductsToStorage(updated);
        return updated;
      });
    } catch (err) {
      console.warn("Failed to create product in DB:", err);
      const fallbackProd = {
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
      setProducts((prev) => {
        const updated = [fallbackProd, ...prev];
        saveProductsToStorage(updated);
        return updated;
      });
    }

    setNewProdTitle("");
    setShowAddProductModal(false);
  };

  const handleDeleteProduct = (productId) => {
    setDeleteConfirmModal({
      isOpen: true,
      title: "Delete 3D Product",
      message: "Are you sure you want to delete this 3D product? This action cannot be undone.",
      onConfirm: async () => {
        try {
          await apiDeleteOwnerProduct(productId);
        } catch (err) {
          console.warn("Failed to delete product from database:", err);
        }
        setProducts((prev) => {
          const updated = prev.filter((p) => p.id !== productId);
          saveProductsToStorage(updated);
          return updated;
        });
        setDeleteConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const handleAddSceneToTour = async (tourId) => {
    const targetTour = tours.find((t) => t.id === tourId);
    const sceneName = prompt("Enter Scene / Room Name (e.g. 2ND FLOOR EXECUTIVE SUITE):", "2ND FLOOR ROOM");
    if (!sceneName) return;

    const defaultImg = targetTour?.coverImage || "/panoramas/panorama_entrance.jpg";
    const sceneData = {
      id: `scene_${Date.now()}`,
      name: sceneName,
      floorLevel: `${(targetTour?.scenes?.length || 1) + 1}st Floor`,
      panoramaUrl: defaultImg,
      thumbnailUrl: defaultImg,
      hotspots: [],
    };

    const res = await apiAddOwnerScene(tourId, sceneData);
    setTours((prev) => {
      const updated = prev.map((t) =>
        t.id === tourId
          ? { ...t, scenes: [...(t.scenes || []), (res && res.data) || sceneData] }
          : t
      );
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
          console.warn("Failed to delete tour from backend:", err);
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
      message: "Are you sure you want to delete ALL your 360° virtual tours? This will permanently remove all your tours.",
      onConfirm: async () => {
        try {
          for (const t of tours) {
            if (t.id) {
              await apiDeleteOwnerTour(t.id).catch(() => {});
            }
          }
        } catch (err) {
          console.warn("Failed to delete tours from backend:", err);
        }
        const userEmail = (user?.email || "").toLowerCase().trim();
        if (userEmail) {
          localStorage.removeItem(`viewroom_tours_${userEmail}`);
          try {
            const allRaw = localStorage.getItem("viewroom_custom_tours");
            const allTours = allRaw ? JSON.parse(allRaw) : [];
            const otherTours = allTours.filter(
              (t) => t.authorEmail && t.authorEmail.toLowerCase().trim() !== userEmail
            );
            localStorage.setItem("viewroom_custom_tours", JSON.stringify(otherTours));
          } catch (e) {}
        }
        setTours([]);
        setDeleteConfirmModal({ isOpen: false, title: "", message: "", onConfirm: null });
      },
    });
  };

  const handleAddNewSceneFromModal = async (sceneData) => {
    if (!editingTour) return null;
    const res = await apiAddOwnerScene(editingTour.id, sceneData);
    const createdScene = (res && res.data) || sceneData;

    let updatedTourObj = null;
    setTours((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== editingTour.id) return t;
        const newScenes = [...(t.scenes || []), createdScene];
        updatedTourObj = { ...t, scenes: newScenes };
        return updatedTourObj;
      });
      saveToursToStorage(updated);
      return updated;
    });

    if (updatedTourObj) {
      setEditingTour(updatedTourObj);
    }
    return createdScene;
  };

  const handleSaveHotspot = async (hotspotData) => {
    if (!editingTour || !editingScene) return;
    const currentTourId = editingTour.id;
    const currentSceneId = editingScene.id;

    let res = null;
    try {
      res = await apiAddOwnerHotspot(currentTourId, currentSceneId, hotspotData);
    } catch (err) {
      console.warn("apiAddOwnerHotspot error, falling back locally:", err);
    }

    const incoming = (res && res.data) || {};
    const savedHotspot = {
      ...hotspotData,
      ...incoming,
      type: hotspotData.type || incoming.type || "arrow",
      iconType: hotspotData.iconType || hotspotData.type || incoming.iconType || incoming.type || "arrow",
    };

    setTours((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== currentTourId) return t;
        const updatedScenes = t.scenes.map((s) => {
          if (s.id !== currentSceneId) return s;
          return {
            ...s,
            hotspots: [...(s.hotspots || []), savedHotspot],
          };
        });
        return { ...t, scenes: updatedScenes };
      });
      saveToursToStorage(updated);
      return updated;
    });

    // Close the hotspot editor modal immediately
    setEditingScene(null);
    setEditingTour(null);
  };

  const handleDeleteHotspot = async (hotspotId) => {
    if (!editingTour || !editingScene) return;
    const currentTourId = editingTour.id;
    const currentSceneId = editingScene.id;

    setTours((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== currentTourId) return t;
        const updatedScenes = t.scenes.map((s) => {
          if (s.id !== currentSceneId) return s;
          return {
            ...s,
            hotspots: (s.hotspots || []).filter((h) => h.id !== hotspotId),
          };
        });
        return { ...t, scenes: updatedScenes };
      });
      saveToursToStorage(updated);
      return updated;
    });
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
              <div className="flex items-center gap-3">
                {tours.length > 0 && (
                  <button
                    onClick={handleDeleteAllTours}
                    className="px-2.5 py-1 rounded-xl bg-error/10 hover:bg-error hover:text-white text-error text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-error/20"
                    title="Delete all test tours permanently"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                    <span>Clear All Tours</span>
                  </button>
                )}
                <button
                  onClick={() => setActiveTab && setActiveTab("tours")}
                  className="text-xs font-semibold text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  Manage All Tours →
                </button>
              </div>
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
                    <Link to={`/virtual-tour/${tour.id}`} className="flex-1">
                      <Button variant="secondary" className="w-full text-center !rounded-xl !text-xs !py-1.5">
                        <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                        View 360°
                      </Button>
                    </Link>

                    <button
                      onClick={() => handleAddSceneToTour(tour.id)}
                      className="p-2 rounded-xl border border-base-content/20 bg-base-200 hover:bg-base-300 text-xs text-base-content font-bold cursor-pointer transition-colors"
                      title="Add Room Scene"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <button
                      onClick={() => handleDeleteTour(tour.id)}
                      className="p-2 rounded-xl border border-base-content/20 bg-base-200 hover:bg-error hover:text-white text-xs text-base-content/70 font-bold cursor-pointer transition-colors"
                      title="Delete Tour"
                    >
                      <FontAwesomeIcon icon={faTrash} />
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
          <div className="space-y-6">
            {filteredTours.map((tour) => (
              <div
                key={tour.id}
                className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col gap-5 shadow-xs hover:border-base-content/20 transition-all"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-base-content/10 pb-4">
                  <div className="flex items-center gap-4">
                    <img src={tour.coverImage} alt={tour.title} className="w-24 h-18 rounded-2xl object-cover bg-base-200 border border-base-content/10 shrink-0" />
                    <div>
                      <h4 className="font-extrabold text-base text-base-content">{tour.title}</h4>
                      <p className="text-xs text-base-content/60 mt-0.5">
                        {tour.category} • {tour.scenes?.length || 0} Room Scenes • {tour.viewsCount || 0} Views
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-end">
                    <button
                      onClick={() => handleAddSceneToTour(tour.id)}
                      className="px-3.5 py-2 rounded-xl bg-primary text-primary-content text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                      <span>+ Add Room Scene</span>
                    </button>
                    <button
                      onClick={() => setSoundModalTour(tour)}
                      className="px-3 py-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-base-content/10"
                      title="Configure Background Sound & Spatial Ambient Track"
                    >
                      <FontAwesomeIcon icon={faMusic} className="text-base-content/80 text-xs" />
                      <span>Sound ({tour.audioConfig?.enabled ?? true ? "ON" : "OFF"})</span>
                    </button>
                    <button
                      onClick={() => handleCopyShareableLink(tour.id)}
                      className="px-3 py-2 rounded-xl bg-base-200 hover:bg-base-300 text-base-content text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border border-base-content/10"
                      title="Copy Shareable 360° Link"
                    >
                      <FontAwesomeIcon icon={copiedTourId === tour.id ? faCheck : faShareNodes} className={copiedTourId === tour.id ? "text-success" : ""} />
                      <span>{copiedTourId === tour.id ? "Copied Link!" : "Copy Share Link"}</span>
                    </button>
                    <Link to={`/virtual-tour/${tour.id}`}>
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

                {/* Property Scenes List & Hotspot Manager for this Tour */}
                <div className="space-y-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-base-content/60 block">
                    Property Room Scenes & Hotspot Links ({tour.scenes?.length || 0})
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {tour.scenes?.map((sc) => (
                      <div
                        key={sc.id}
                        className="p-3.5 rounded-2xl bg-base-200/50 border border-base-content/10 flex flex-col justify-between gap-3 hover:border-base-content/25 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={sc.panoramaUrl || sc.thumbnailUrl || "/panoramas/panorama_aerial.jpg"}
                            alt={sc.name}
                            className="w-16 h-12 rounded-xl object-cover bg-base-300 shrink-0 border border-base-content/10"
                          />
                          <div className="min-w-0 flex-1">
                            <h5 className="font-extrabold text-xs text-base-content truncate">{sc.name}</h5>
                            <p className="text-[10px] text-base-content/60">
                              {sc.hotspots?.length || 0} Hotspots Attached
                            </p>
                          </div>
                        </div>

                        {/* Connected Hotspot Destination Badges */}
                        {sc.hotspots && sc.hotspots.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {sc.hotspots.map((hp) => {
                              const destScene = tour.scenes.find((dest) => dest.id === hp.targetId);
                              return (
                                <span
                                  key={hp.id}
                                  className="px-2 py-0.5 rounded-md bg-base-100 border border-base-content/15 text-[9px] font-bold text-base-content/80 truncate max-w-full"
                                >
                                  ➔ {hp.title} {destScene ? `(${destScene.name})` : ""}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex items-center gap-1.5 pt-1 border-t border-base-content/10">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingTour(tour);
                              setEditingScene(sc);
                            }}
                            className="flex-1 py-1.5 px-2.5 rounded-xl bg-base-100 hover:bg-base-200 border border-base-content/15 text-base-content text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer"
                          >
                            <FontAwesomeIcon icon={faCompass} className="text-xs" />
                            <span>Add Hotspots</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
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

                <div className="flex items-center gap-2 w-full">
                  <Link to="/360-product" className="flex-1">
                    <Button variant="primary" className="w-full text-center !rounded-xl !text-xs">
                      <FontAwesomeIcon icon={faCube} className="mr-2" />
                      Launch 3D Product Spin
                    </Button>
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-2.5 rounded-xl bg-base-200 hover:bg-error hover:text-white text-base-content border border-base-content/10 transition-all cursor-pointer"
                    title="Delete 3D Product"
                  >
                    <FontAwesomeIcon icon={faTrash} className="text-xs" />
                  </button>
                </div>
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
                {newTourScenesList.map((sc) => (
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
                      <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-1 sm:pt-0">
                        <input
                          type="file"
                          accept="image/*"
                          id={`file_input_${sc.id}`}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = async (event) => {
                                const base64Data = event.target?.result;
                                if (base64Data) {
                                  // Attempt backend upload to get static URL
                                  const uploadedUrl = await apiUploadImage(base64Data, file.name);
                                  const finalUrl = uploadedUrl || base64Data;
                                  setNewTourScenesList((prev) =>
                                    prev.map((item) =>
                                      item.id === sc.id
                                        ? {
                                            ...item,
                                            panoramaUrl: finalUrl,
                                            thumbnailUrl: finalUrl,
                                            fileName: file.name,
                                            isCustomUploaded: true,
                                          }
                                        : item
                                    )
                                  );
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />

                        <label
                          htmlFor={`file_input_${sc.id}`}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                            sc.isCustomUploaded
                              ? "bg-success/15 text-success border-success/30 font-bold"
                              : "bg-base-200 hover:bg-base-300 border-base-content/10 text-base-content"
                          }`}
                          title="Upload 360° Panorama Image file from your device"
                        >
                          <FontAwesomeIcon icon={sc.isCustomUploaded ? faCheckCircle : faCloudArrowUp} />
                          <span>{sc.isCustomUploaded ? "360 Image Uploaded ✓" : "Upload 360 Image"}</span>
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
          onDeleteHotspot={handleDeleteHotspot}
          onAddNewScene={handleAddNewSceneFromModal}
          onSwitchEditingScene={(sc) => setEditingScene(sc)}
        />
      )}

      {/* Tour Sound Studio Modal Overlay */}
      {soundModalTour && (
        <TourSoundModal
          tour={soundModalTour}
          onClose={() => setSoundModalTour(null)}
          onSave={handleSaveSoundConfig}
        />
      )}

      {/* Sleek Glassmorphic Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div
            style={{
              backgroundColor: "rgba(18, 18, 24, 0.9)",
              backdropFilter: "blur(24px)",
            }}
            className="w-full max-w-md p-6 sm:p-7 rounded-3xl border border-white/20 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center animate-in zoom-in-95 duration-200"
          >
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 text-xl shadow-[0_0_20px_rgba(239,68,68,0.3)]">
              <FontAwesomeIcon icon={faTrash} />
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
              {deleteConfirmModal.title}
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mb-6 leading-relaxed">
              {deleteConfirmModal.message}
            </p>
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                onClick={() =>
                  setDeleteConfirmModal({
                    isOpen: false,
                    title: "",
                    message: "",
                    onConfirm: null,
                  })
                }
                className="!text-xs !py-2.5 !px-5 !rounded-xl"
              >
                Cancel
              </Button>
              <button
                type="button"
                onClick={deleteConfirmModal.onConfirm}
                className="cursor-pointer transition-all duration-150 select-none inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-[0_4px_15px_rgba(220,38,38,0.4)] active:scale-95"
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
