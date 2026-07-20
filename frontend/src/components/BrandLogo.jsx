import { brand } from '../data/brandData'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../lib/utils'

/**
 * Theme-aware Mellogang logo:
 * - cream/light => gold monogram + gold wordmark
 * - dark => white square monogram + cream wordmark (readable on dark bg)
 */
export default function BrandLogo({
  className = 'h-10 w-auto',
  alt = 'Mellogang Visuals',
}) {
  const { theme, isHydrated } = useTheme()
  const isLight = !isHydrated || theme === 'light'
  const src = isLight ? brand.logoLight : brand.logoDarkOnDark

  return (
    <img
      src={src}
      alt={alt}
      className={cn('object-contain select-none', className)}
      draggable={false}
    />
  )
}
