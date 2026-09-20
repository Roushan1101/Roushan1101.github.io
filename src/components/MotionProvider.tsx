import { useEffect, useState, type ReactNode } from 'react'
import { MotionContext } from '../hooks/useMotion'

export function MotionProvider({ children }: { children: ReactNode }) {
  const [systemReduced, setSystemReduced] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const [manualPaused, setManualPaused] = useState<boolean | null>(null)
  const enabled = manualPaused === null ? !systemReduced : !manualPaused

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setSystemReduced(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.motion = enabled ? 'enabled' : 'paused'
  }, [enabled])

  return (
    <MotionContext.Provider value={{ enabled, toggle: () => setManualPaused(enabled) }}>
      {children}
    </MotionContext.Provider>
  )
}
