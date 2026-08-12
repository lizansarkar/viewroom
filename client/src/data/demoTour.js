// Structured, data-driven tour definition for the demo house.
// Every scene is an equirectangular panorama with spatially anchored hotspots.
// Positions are stored as human-friendly yaw/pitch (degrees).
// The owner can reposition any hotspot visually from the Tour Editor
// (/admin/property/demo-house/tour-editor) without touching coordinates.
export const SEED_TOURS = {
  "demo-house": {
    propertyId: "demo-house",
    version: 1,
    startSceneId: "entrance",
    scenes: [
      {
        id: "entrance",
        title: "Entrance",
        panorama: "/panoramas/img1.jpeg",
        hotspots: [
          {
            id: "entrance-living-room",
            label: "Living Room",
            targetSceneId: "living-room",
            position: { yaw: 180, pitch: 0 },
          },
        ],
      },
      {
        id: "living-room",
        title: "Living Room",
        panorama: "/panoramas/img2.jpeg",
        hotspots: [
          {
            id: "living-room-kitchen",
            label: "Kitchen",
            targetSceneId: "kitchen",
            position: { yaw: 135, pitch: 0 },
          },
          {
            id: "living-room-bedroom",
            label: "Bedroom",
            targetSceneId: "bedroom",
            position: { yaw: 225, pitch: 0 },
          },
          {
            id: "living-room-entrance",
            label: "Back to Entrance",
            targetSceneId: "entrance",
            position: { yaw: 45, pitch: 0 },
          },
        ],
      },
      {
        id: "kitchen",
        title: "Kitchen",
        panorama: "/panoramas/img3.jpeg",
        hotspots: [
          {
            id: "kitchen-bedroom",
            label: "Bedroom",
            targetSceneId: "bedroom",
            position: { yaw: 180, pitch: 0 },
          },
          {
            id: "kitchen-living-room",
            label: "Living Room",
            targetSceneId: "living-room",
            position: { yaw: 0, pitch: 0 },
          },
        ],
      },
      {
        id: "bedroom",
        title: "Bedroom",
        panorama: "/panoramas/img4.jpeg",
        hotspots: [
          {
            id: "bedroom-bathroom",
            label: "Bathroom",
            targetSceneId: "bathroom",
            position: { yaw: 180, pitch: 0 },
          },
          {
            id: "bedroom-kitchen",
            label: "Kitchen",
            targetSceneId: "kitchen",
            position: { yaw: 45, pitch: 0 },
          },
        ],
      },
      {
        id: "bathroom",
        title: "Bathroom",
        panorama: "/panoramas/img5.jpeg",
        hotspots: [
          {
            id: "bathroom-bedroom",
            label: "Back to Bedroom",
            targetSceneId: "bedroom",
            position: { yaw: 180, pitch: 0 },
          },
        ],
      },
    ],
  },
};
