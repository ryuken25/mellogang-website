import { useEffect, useMemo, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Mobile/Android motion profile:
 * - keep animations elegant
 * - avoid expensive blur/filter/parallax on low-power devices
 * - prefer transform/opacity only
 */
export function useMotionProfile() {
  const reduceMotion = useReducedMotion()
  const [isCoarse, setIsCoarse] = useState(false)
  const [isNarrow, setIsNarrow] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const mqCoarse = window.matchMedia('(pointer: coarse)')
    const mqNarrow = window.matchMedia('(max-width: 1023px)')
    const ua = navigator.userAgent || ''
    setIsAndroid(/Android/i.test(ua))
    setIsCoarse(mqCoarse.matches)
    setIsNarrow(mqNarrow.matches)

    const onCoarse = (e) => setIsCoarse(e.matches)
    const onNarrow = (e) => setIsNarrow(e.matches)
    mqCoarse.addEventListener?.('change', onCoarse)
    mqNarrow.addEventListener?.('change', onNarrow)
    return () => {
      mqCoarse.removeEventListener?.('change', onCoarse)
      mqNarrow.removeEventListener?.('change', onNarrow)
    }
  }, [])

  return useMemo(() => {
    const mobileLike = isCoarse || isNarrow || isAndroid
    const lite = Boolean(reduceMotion) || mobileLike
    return {
      reduceMotion: Boolean(reduceMotion),
      isAndroid,
      isCoarse,
      isNarrow,
      mobileLike,
      // use lighter effects on Android/mobile
      lite,
      // reveal
      revealY: lite ? 14 : 22,
      revealDuration: lite ? 0.45 : 0.75,
      // cards
      hoverY: lite ? 0 : -6,
      hoverScale: lite ? 1.01 : 1.015,
      // scroll stories
      parallax: !lite,
      chapterFade: true,
      // GSAP pin only desktop fine pointer
      enableGsapPin: !lite && !reduceMotion,
      ease: [0.22, 1, 0.36, 1],
    }
  }, [reduceMotion, isAndroid, isCoarse, isNarrow])
}

export const motionSafeTransition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1],
  duration: 0.45,
}
