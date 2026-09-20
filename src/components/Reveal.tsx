import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { useMotion } from '../hooks/useMotion'

export function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const element = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const { enabled } = useMotion()

  useEffect(() => {
    if (!enabled || !('IntersectionObserver' in window)) {
      setVisible(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.08 },
    )
    if (element.current) observer.observe(element.current)
    return () => observer.disconnect()
  }, [enabled])

  return (
    <div
      ref={element}
      className={`reveal ${className}`}
      data-visible={visible || !enabled}
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}
