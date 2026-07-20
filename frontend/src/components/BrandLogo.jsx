import { brand } from '../data/brandData'
import { useTheme } from '../context/ThemeContext'
import { cn } from '../lib/utils'

/**
 * Official Mellogang monogram logo (transparent 1K PNG).
 * Optional wordmark text for header/footer.
 */
export default function BrandLogo({
  className = 'h-11 w-11',
  showWordmark = false,
  alt = 'Mellogang Visuals',
}) {
  const { theme, isHydrated } = useTheme()
  const isLight = !isHydrated || theme === 'light'

  return (
    <span className={cn('inline-flex items-center gap-3', showWordmark && 'pr-1')}>
      <img
        src={brand.logo}
        alt={alt}
        className={cn('object-contain select-none', className)}
        draggable={false}
      />
      {showWordmark ? (
        <span className="hidden leading-tight sm:block">
          <b
            className={cn(
              'block text-[15px] font-extrabold tracking-[0.08em]',
              isLight ? 'text-[#1a1e22]' : 'text-cream'
            )}
          >
            MELLOGANG
          </b>
          <small
            className={cn(
              'block text-[11px] font-medium tracking-[0.28em]',
              isLight ? 'text-black/50' : 'text-cream/50'
            )}
          >
            VISUALS
          </small>
        </span>
      ) : null}
    </span>
  )
}
