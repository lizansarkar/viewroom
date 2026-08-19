import React from 'react'
import Navbar from './components/universal/Navbar'
import Footer from './components/universal/Footer'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <AppRouter />
      </main>
      <Footer />
    </div>
  )
}

export default App
