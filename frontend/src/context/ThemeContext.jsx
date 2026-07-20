import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)
const THEME_KEY = 'mellogang_theme'

function applyTheme(theme) {
  const root = document.documentElement
  // Keep class "dark" only for true dark mode. Cream/light uses data-theme=light.
  root.classList.toggle('dark', theme === 'dark')
  root.dataset.theme = theme
  root.style.colorScheme = theme
  // Keep browser chrome in sync with page theme (auth + home).
  const meta = document.querySelector('meta[name="theme-color"]:not([media])') || document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#101417' : '#fff8f0')
}

export function ThemeProvider({ children }) {
  // Default cream/light brand homepage style (with fixed contrast tokens).
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
