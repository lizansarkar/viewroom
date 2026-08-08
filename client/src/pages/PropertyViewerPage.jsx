import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import VirtualTourViewer from '../components/viewer/VirtualTourViewer';
import { getPropertyById } from '../data/mockProperties';

export default function PropertyViewerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  const [currentSceneId, setCurrentSceneId] = useState(
    property.defaultSceneId || (property.scenes[0] && property.scenes[0].id) || 'living-room'
  );

  const currentScene = property.scenes.find((s) => s.id === currentSceneId) || property.scenes[0] || {
    id: 'living-room',
    name: 'Living Room',
    panoramaUrl: '/panoramas/living_room_360.jpg',
  };

  useEffect(() => {
    // Reset to default scene when property ID changes
    if (property) {
      setCurrentSceneId(property.defaultSceneId || property.scenes[0]?.id || 'living-room');
    }
  }, [id, property]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 w-screen h-screen overflow-hidden">
      <VirtualTourViewer
        title={property.title}
        sceneName={currentScene.name}
        scenes={property.scenes}
        currentSceneId={currentScene.id}
        panoramaUrl={currentScene.panoramaUrl}
        onSelectScene={(sceneId) => setCurrentSceneId(sceneId)}
        onBack={() => navigate(`/property/${property.id}`)}
        className="w-full h-full"
      />
    </div>
  );
}
