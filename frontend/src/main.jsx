import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

try {
  const savedTheme = localStorage.getItem('mellogang_theme') || 'dark'
  document.documentElement.classList.toggle('dark', savedTheme !== 'light')
  document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark'
} catch { document.documentElement.classList.add('dark') }

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>)
