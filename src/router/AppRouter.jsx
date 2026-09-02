import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import About from '../pages/About/About'
import Contact from '../pages/Contact/Contact'
import VirtualTour360 from '../pages/VirtualTour/VirtualTour360'
import Product360 from '../pages/Product360/Product360'
import Video360 from '../pages/Video360/Video360'
import Matterport from '../pages/Matterport/Matterport'
import Photography from '../pages/Photography/Photography'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/360-virtual-tour" element={<VirtualTour360 />} />
      <Route path="/360-product" element={<Product360 />} />
      <Route path="/360-video" element={<Video360 />} />
      <Route path="/matterport" element={<Matterport />} />
      <Route path="/photography" element={<Photography />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  )
}

export default AppRouter
