import { ArrowUpRight } from 'lucide-react'
import { profile, projectDisclosure, type Project } from '../data/profile'
import { Dialog } from './Dialog'
import { ProjectArtwork } from './ProjectArtwork'

export function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  return (
    <Dialog title={project.title} eyebrow={`${project.category} / ${project.number}`} onClose={onClose} className="project-dialog">
      <p className="dialog-intro">{project.summary}</p>
      <div className="project-dialog-art">
        <ProjectArtwork kind={project.kind} theme={document.body.dataset.theme === 'cyber' ? 'dark' : 'light'} />
        <div><strong>{project.metric.value}</strong><span>{project.metric.label}</span></div>
      </div>
      <div className="case-metadata">
        <span><small>CLIENT ENVIRONMENT</small>{project.client} <span className="muted">via {project.company}</span></span>
        <span><small>PERIOD</small>{project.period}</span>
      </div>
      <section className="case-section"><h3>The challenge</h3><p>{project.challenge}</p></section>
      <section className="case-section"><h3>The approach</h3><ol>{project.approach.map((item) => <li key={item}>{item}</li>)}</ol></section>
      <section className="case-section"><h3>The impact</h3><ul>{project.outcomes.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <div className="shared-tags">{project.stack.map((tag) => <span key={tag}>{tag}</span>)}</div>
      <p className="case-disclosure">{projectDisclosure}</p>
      <a className="shared-button primary" href={`mailto:${profile.email}?subject=${encodeURIComponent(`Let's talk about ${project.title}`)}`}>Let's talk about this work <ArrowUpRight size={16} /></a>
    </Dialog>
  )
}
