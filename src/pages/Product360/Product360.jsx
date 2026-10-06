import React from "react";
import Product360Hero from "./Product360Hero";
import Product360Features from "./Product360Features";
import Product360Grid from "./Product360Grid";
import SEOHead from "../../components/seo/SEOHead";
import ErrorBoundary from "../../components/reuseable/ErrorBoundary";

function Product360() {
  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <SEOHead
        title="360° Interactive Product Showcase & 3D GLB Customizer"
        description="Experience 360-degree product spins and interactive 3D GLB model customization for watches, tech, and apparel."
        canonicalUrl="https://viewroom.com/360-product"
      />
      <Product360Hero />
      <Product360Features />
      <ErrorBoundary>
        <Product360Grid />
      </ErrorBoundary>
    </main>
  );
}

export default Product360;