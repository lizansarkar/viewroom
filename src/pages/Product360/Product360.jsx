import React from "react";
import Product360Hero from "./Product360Hero";
import Product360Features from "./Product360Features";
import Product360Grid from "./Product360Grid";
import Product360Workflow from "./Product360Workflow";
import Cta from "../Home/Cta";

function Product360() {
  return (
    <main className="w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <Product360Hero />
      <Product360Features />
      <Product360Grid />
      <Product360Workflow />
      <Cta />
    </main>
  );
}

export default Product360;