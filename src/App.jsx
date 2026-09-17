import React from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/universal/Navbar'
import Footer from './components/universal/Footer'
import AppRouter from './router/AppRouter'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <AppRouter />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
