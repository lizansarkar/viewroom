import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/universal/Navbar'
import Footer from './components/universal/Footer'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
