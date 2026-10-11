import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

const THEMES = {
  dark: 'viewroom-dark',
  light: 'viewroom-light',
}

function getInitialTheme() {
  const saved = localStorage.getItem('viewroom-theme')
  if (saved && THEMES[saved]) return saved
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', THEMES[theme])
    localStorage.setItem('viewroom-theme', theme)

    // Dynamically update favicon in browser tab to match theme
    const faviconHref = theme === 'dark' ? '/favicon-dark.svg?v=5' : '/favicon-light.svg?v=5'
    const faviconLinks = document.querySelectorAll("link[rel*='icon']")
    if (faviconLinks.length > 0) {
      faviconLinks.forEach(link => {
        link.href = faviconHref
      })
    } else {
      const newFavicon = document.createElement('link')
      newFavicon.rel = 'icon'
      newFavicon.type = 'image/svg+xml'
      newFavicon.href = faviconHref
      document.head.appendChild(newFavicon)
    }
  }, [theme])

  const toggleTheme = () => setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext)
}
