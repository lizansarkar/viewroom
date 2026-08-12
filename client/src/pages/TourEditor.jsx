import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VirtualTourViewer from "../components/viewer/VirtualTourViewer";
import { getPropertyById } from "../data/mockProperties";
import { getTourForProperty, saveTour, genId } from "../data/tourStore";

export default function TourEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(slug);

  const [tour, setTour] = useState(
    () => getTourForProperty(property.id) || null,
  );
  const [currentSceneId, setCurrentSceneId] = useState(
    tour?.startSceneId || property.defaultSceneId || property.scenes[0]?.id,
  );

  useEffect(() => {
    setTour(getTourForProperty(property.id));
  }, [property.id]);

  const handleAddHotspotRequest = (sphericalPos, sceneId) => {
    // Open a small prompt-style modal to capture label + target
    const label = window.prompt('Hotspot label (e.g. "Living Room")');
    if (!label) return;

    // Choose target from property's scenes
    const targetOptions = property.scenes.map((s) => s.id).join(", ");
    const target = window.prompt(
      `Target scene id (choose from: ${targetOptions})`,
      property.scenes[0]?.id || "",
    );
    if (!target) return;

    const newHotspot = {
      id: genId("hotspot"),
      label,
      targetSceneId: target,
      position: { yaw: sphericalPos.yaw, pitch: sphericalPos.pitch },
    };

    // Persist into tour object
    const t = getTourForProperty(property.id) || {
      propertyId: property.id,
      version: 1,
      startSceneId: property.defaultSceneId || property.scenes[0]?.id,
      scenes: property.scenes.map((s) => ({
        id: s.id,
        title: s.name,
        panorama: s.panoramaUrl || s.panorama,
        hotspots: s.hotspots || [],
      })),
    };

    const scene =
      t.scenes.find((s) => s.id === (sceneId || currentSceneId)) || t.scenes[0];
    scene.hotspots = scene.hotspots || [];
    scene.hotspots.push(newHotspot);

    saveTour(property.id, t);
    setTour(t);
    window.alert("Hotspot saved");
  };

  if (!property) return <div>Property not found</div>;

  const currentScene =
    (tour ? tour.scenes.find((s) => s.id === currentSceneId) : null) ||
    property.scenes.find((s) => s.id === currentSceneId) ||
    property.scenes[0];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden">
      <VirtualTourViewer
        propertyId={property.id}
        title={property.title}
        sceneName={currentScene.title || currentScene.name}
        scenes={[]}
        currentSceneId={currentScene.id}
        panoramaUrl={currentScene.panorama || currentScene.panoramaUrl}
        hotspots={currentScene.hotspots || []}
        onSelectScene={(sceneId) => setCurrentSceneId(sceneId)}
        onBack={() => navigate(`/explore`)}
        onAddHotspotRequest={handleAddHotspotRequest}
        className="w-full h-full"
      />
    </div>
  );
}
