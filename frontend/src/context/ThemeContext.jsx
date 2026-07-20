import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'mellogang_theme'

function applyTheme(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  root.style.colorScheme = theme
}

export function ThemeProvider({ children }) {
  // Default to light/cream cinematic style (current brand homepage).
  const [theme, setThemeState] = useState('light')
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(THEME_KEY) || 'light'
    const next = saved === 'dark' ? 'dark' : 'light'
    setThemeState(next)
    applyTheme(next)
    setIsHydrated(true)
  }, [])

  const setTheme = (next) => {
    const value = next === 'dark' ? 'dark' : 'light'
    setThemeState(value)
    localStorage.setItem(THEME_KEY, value)
    applyTheme(value)
  }

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark')
  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', isHydrated, setTheme, toggleTheme }),
    [theme, isHydrated]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
