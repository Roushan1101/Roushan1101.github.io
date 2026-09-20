import { Gamepad2, LayoutTemplate, Pause, Play, Terminal } from 'lucide-react'
import { useMotion } from '../hooks/useMotion'
import { siteUrl } from '../lib/urls'
import type { ExperienceId } from '../types'

const worlds = [
  { id: 'cyber', name: 'Cyber', href: siteUrl('cyber/'), icon: Terminal },
  { id: 'studio', name: 'Studio', href: siteUrl('studio/'), icon: LayoutTemplate },
  { id: 'play', name: 'Play', href: siteUrl(), icon: Gamepad2 },
] as const

export function ExperienceSwitcher({ current }: { current: ExperienceId }) {
  const { enabled, toggle } = useMotion()

  return (
    <aside className="experience-dock" aria-label="Experience controls">
      <span className="dock-label">SAME HUMAN.<br />THREE WORLDS.</span>
      <nav aria-label="Portfolio styles">
        {worlds.map(({ id, name, href, icon: Icon }) => (
          <a key={id} href={href} aria-current={current === id ? 'page' : undefined} title={`Explore the ${name} portfolio`}>
            <Icon size={15} /><span>{name}</span>
          </a>
        ))}
      </nav>
      <button className="motion-toggle" onClick={toggle} aria-label={enabled ? 'Pause animations' : 'Enable animations'} aria-pressed={!enabled} title={enabled ? 'Pause decorative motion' : 'Enable decorative motion'}>
        {enabled ? <Pause size={15} /> : <Play size={15} />}
      </button>
    </aside>
  )
}
