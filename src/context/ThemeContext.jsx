import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const THEMES = {
  dark: 'viewroom-dark',
  light: 'viewroom-light',
}

function getInitialTheme() {
  const saved = localStorage.getItem('viewroom-theme')
  if (saved && THEMES[saved]) return saved
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark'
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES[theme])
    localStorage.setItem('viewroom-theme', theme)
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
