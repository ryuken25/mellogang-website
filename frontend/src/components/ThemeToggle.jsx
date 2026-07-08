import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

export default function ThemeToggle({ compact = false }) {
  const { theme, toggleTheme } = useTheme()
  return <button type="button" onClick={toggleTheme} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-cream transition hover:border-gold/50 hover:bg-gold/10 light:border-black/10 light:bg-black/5 light:text-charcoal">
    {theme === 'dark' ? <Moon size={16}/> : <Sun size={16}/>}
    {!compact && <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>}
  </button>
}
