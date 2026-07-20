import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

try {
  // Cream/light is the brand homepage default; contrast is fixed via CSS tokens.
  const savedTheme = localStorage.getItem('mellogang_theme') || 'light'
  const isDark = savedTheme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
} catch {
  document.documentElement.classList.remove('dark')
  document.documentElement.dataset.theme = 'light'
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
