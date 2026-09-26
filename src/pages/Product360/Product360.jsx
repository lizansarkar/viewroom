import React from "react";
import Product360Hero from "./Product360Hero";
import Product360Features from "./Product360Features";
import Product360Grid from "./Product360Grid";

function Product360() {
  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <Product360Hero />
      <Product360Features />
      <Product360Grid />
    </main>
  );
}

export default Product360;