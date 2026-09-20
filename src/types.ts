import type { Project } from './data/profile'

export type ExperienceId = 'cyber' | 'studio' | 'play'

export interface PortfolioPageProps {
  onContact: () => void
  onProject: (project: Project) => void
  onRecruiter: () => void
}
