// Shared Tour & Scene Repository for Express Backend
import fs from "fs";
import path from "path";

export let toursStore = [
  {
    id: "tour_skyline_headquarters",
    title: "Skyline Innovation Campus 360°",
    description: "Explore our futuristic multi-story campus featuring state-of-the-art labs, open workspaces, and panoramic aerial views.",
    category: "Commercial Real Estate",
    price: "Free",
    viewsCount: 2450,
    createdAt: "2026-09-01T10:00:00Z",
    coverImage: "/panoramas/panorama_aerial.jpg",
    isPublished: true,
    scenes: [
      {
        id: "aerial_view",
        name: "AERIAL VIEW",
        floorLevel: "Campus Aerial",
        category: "Campus Aerial",
        thumbnailUrl: "/panoramas/panorama_aerial.jpg",
        panoramaUrl: "/panoramas/panorama_aerial.jpg",
        thumbnail: "/panoramas/panorama_aerial.jpg",
        panorama: "/panoramas/panorama_aerial.jpg",
        hotspots: [
          { id: "hp1", yaw: "0deg", pitch: "-15deg", title: "Main Entrance", targetId: "entrance", type: "arrow" },
        ],
      },
      {
        id: "entrance",
        name: "ENTRANCE LOBBY",
        floorLevel: "Main Building",
        category: "Main Building",
        thumbnailUrl: "/panoramas/panorama_entrance.jpg",
        panoramaUrl: "/panoramas/panorama_entrance.jpg",
        thumbnail: "/panoramas/panorama_entrance.jpg",
        panorama: "/panoramas/panorama_entrance.jpg",
        hotspots: [
          { id: "hp2", yaw: "30deg", pitch: "-5deg", title: "1ST FLOOR LOBBY", targetId: "floor_1", type: "arrow" },
        ],
      },
      {
        id: "floor_1",
        name: "1ST FLOOR LOBBY",
        floorLevel: "Reception Lobby",
        category: "Reception Lobby",
        thumbnailUrl: "/panoramas/panorama_floor1.jpg",
        panoramaUrl: "/panoramas/panorama_floor1.jpg",
        thumbnail: "/panoramas/panorama_floor1.jpg",
        panorama: "/panoramas/panorama_floor1.jpg",
        hotspots: [],
      },
    ],
  },
];

export const addTour = (tour) => {
  toursStore.unshift(tour);
  return tour;
};

export const getTourById = (tourId) => {
  return toursStore.find((t) => t.id === tourId);
};

export const deleteTour = (tourId) => {
  const idx = toursStore.findIndex((t) => t.id === tourId);
  if (idx !== -1) {
    toursStore.splice(idx, 1);
    return true;
  }
  return false;
};
