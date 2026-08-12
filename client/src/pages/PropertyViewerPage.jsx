import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VirtualTourViewer from "../components/viewer/VirtualTourViewer";
import DemoTourViewer from "../components/viewer/DemoTourViewer";
import { getPropertyById } from "../data/mockProperties";
import { getTourForProperty } from "../data/tourStore";

export default function PropertyViewerPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(slug);

  // Load a structured tour if available (demo data). Fall back to property scenes.
  const tour = getTourForProperty(property.id);

  const initialSceneId =
    tour?.startSceneId ||
    property.defaultSceneId ||
    (property.scenes[0] && property.scenes[0].id) ||
    "living-room";

  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId);

  useEffect(() => {
    // Reset to default scene when property slug or tour changes
    if (tour)
      setCurrentSceneId(
        tour.startSceneId || tour.scenes[0]?.id || initialSceneId,
      );
    else if (property)
      setCurrentSceneId(
        property.defaultSceneId || property.scenes[0]?.id || initialSceneId,
      );
  }, [slug, property?.id, tour]);

  // Derive current scene data from tour (preferred) or property scenes
  const currentScene = (tour
    ? tour.scenes.find((s) => s.id === currentSceneId)
    : null) ||
    property.scenes.find((s) => s.id === currentSceneId) ||
    (tour ? tour.scenes[0] : property.scenes[0]) || {
      id: "living-room",
      title: "Living Room",
      panorama: "/panoramas/living_room_360.svg",
      panoramaUrl: "/panoramas/living_room_360.svg",
    };

  const panoramaUrl =
    currentScene.panorama ||
    currentScene.panoramaUrl ||
    currentScene.panoramaUrl;

  // Hotspots list (from tour scene if available)
  const hotspots = (currentScene.hotspots && currentScene.hotspots) || [];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden">
      {property.id === "demo-house" ? (
        <DemoTourViewer
          propertyId={property.id}
          onBack={() => navigate(`/explore`)}
        />
      ) : (
        <VirtualTourViewer
          propertyId={property.id}
          title={property.title}
          sceneName={currentScene.name || currentScene.title || "Living Room"}
          // Pass empty scenes to keep viewer chrome minimal (no scene list visible)
          scenes={[]}
          currentSceneId={currentScene.id}
          panoramaUrl={panoramaUrl}
          hotspots={hotspots}
          onSelectScene={(sceneId) => setCurrentSceneId(sceneId)}
          onBack={() => navigate(`/explore`)}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
