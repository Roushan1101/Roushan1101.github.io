import { createContext, useContext } from 'react'

export const MotionContext = createContext<{ enabled: boolean; toggle: () => void } | null>(null)

export function useMotion() {
  const context = useContext(MotionContext)
  if (!context) throw new Error('useMotion must be used inside MotionProvider')
  return context
}
