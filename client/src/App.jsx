import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Explore from './pages/Explore';
import PropertyDetails from './pages/PropertyDetails';
import PropertyViewerPage from './pages/PropertyViewerPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-[#0a0f1d] text-slate-100 selection:bg-emerald-500 selection:text-white">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/property/:id/view" element={<PropertyViewerPage />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
