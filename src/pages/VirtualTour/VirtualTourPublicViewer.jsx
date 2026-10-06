import React from "react";
import { useParams, useSearchParams } from "react-router-dom";
import VirtualTourViewer from "./VirtualTourViewer";
import SEOHead from "../../components/seo/SEOHead";
import ErrorBoundary from "../../components/reuseable/ErrorBoundary";

export default function VirtualTourPublicViewer() {
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const activeTourId = tourId || searchParams.get("id");

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-black overflow-hidden select-none">
      <SEOHead
        title="360° Interactive Virtual Tour Experience | ViewRoom"
        description="Immersive 360° panoramic virtual tour showcase with voice AI guide, spatial ambient audio, and interactive room portals."
        canonicalUrl={`https://viewroom.com/virtual-tour/${activeTourId || ""}`}
      />
      <ErrorBoundary>
        <VirtualTourViewer fullScreenMode={true} overrideTourId={activeTourId} />
      </ErrorBoundary>
    </div>
  );
}
