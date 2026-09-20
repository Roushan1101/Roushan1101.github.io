import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Asterisk,
  Award,
  Download,
  GraduationCap,
  Menu,
  Plus,
  X,
} from 'lucide-react'
import { CopyEmailButton } from '../../components/CopyEmailButton'
import { ProjectArtwork } from '../../components/ProjectArtwork'
import { Reveal } from '../../components/Reveal'
import {
  awards,
  certifications,
  education,
  experiences,
  metrics,
  profile,
  projectDisclosure,
  projects,
  skillGroups,
} from '../../data/profile'
import { useMotion } from '../../hooks/useMotion'
import type { PortfolioPageProps } from '../../types'
import './studio.css'

const navigation = [
  { label: 'About', id: 'studio-about' },
  { label: 'Work', id: 'studio-work' },
  { label: 'Résumé', id: 'studio-resume' },
  { label: 'Contact', id: 'studio-contact' },
]

function Tactile({
  children,
  className = '',
  depth = 2,
}: {
  children: ReactNode
  className?: string
  depth?: number
}) {
  const { enabled } = useMotion()
  const element = useRef<HTMLDivElement>(null)
  const frame = useRef<number | null>(null)

  function reset() {
    if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    frame.current = null
    element.current?.style.removeProperty('--studio-tilt-x')
    element.current?.style.removeProperty('--studio-tilt-y')
    element.current?.style.removeProperty('--studio-light-x')
    element.current?.style.removeProperty('--studio-light-y')
  }

  useEffect(() => {
    const surface = element.current
    return () => {
      if (frame.current !== null) window.cancelAnimationFrame(frame.current)
      frame.current = null
      surface?.style.removeProperty('--studio-tilt-x')
      surface?.style.removeProperty('--studio-tilt-y')
      surface?.style.removeProperty('--studio-light-x')
      surface?.style.removeProperty('--studio-light-y')
    }
  }, [enabled])

  function move(event: PointerEvent<HTMLDivElement>) {
    if (!enabled || event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const surface = event.currentTarget
    const { clientX, clientY } = event
    if (frame.current !== null) window.cancelAnimationFrame(frame.current)
    frame.current = window.requestAnimationFrame(() => {
      frame.current = null
      const bounds = surface.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      const x = Math.max(0, Math.min(1, (clientX - bounds.left) / bounds.width))
      const y = Math.max(0, Math.min(1, (clientY - bounds.top) / bounds.height))
      surface.style.setProperty('--studio-tilt-x', `${(0.5 - y) * depth * 2}deg`)
      surface.style.setProperty('--studio-tilt-y', `${(x - 0.5) * depth * 2}deg`)
      surface.style.setProperty('--studio-light-x', `${x * 100}%`)
      surface.style.setProperty('--studio-light-y', `${y * 100}%`)
    })
  }

  return (
    <div
      ref={element}
      className={`studio-tactile ${className}`}
      onPointerMove={enabled ? move : undefined}
      onPointerLeave={reset}
      onPointerCancel={reset}
    >
      {children}
    </div>
  )
}

export default function StudioPortfolio({ onContact, onProject, onRecruiter }: PortfolioPageProps) {
  const { enabled } = useMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const header = useRef<HTMLElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const progress = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!enabled) return
    let frame = 0
    const update = () => {
      frame = 0
      const distance = document.documentElement.scrollHeight - window.innerHeight
      const amount = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0
      if (progress.current) progress.current.style.transform = `scaleX(${amount})`
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    const observer = 'ResizeObserver' in window ? new ResizeObserver(schedule) : null
    observer?.observe(document.documentElement)
    return () => {
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
      observer?.disconnect()
      window.cancelAnimationFrame(frame)
    }
  }, [enabled])

  useEffect(() => {
    if (!menuOpen) return
    const escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    const outside = (event: globalThis.PointerEvent) => {
      if (event.target instanceof Node && !header.current?.contains(event.target)) setMenuOpen(false)
    }
    const desktop = window.matchMedia('(min-width: 801px)')
    const resize = () => {
      if (desktop.matches) setMenuOpen(false)
    }
    document.addEventListener('keydown', escape)
    document.addEventListener('pointerdown', outside)
    desktop.addEventListener('change', resize)
    return () => {
      document.removeEventListener('keydown', escape)
      document.removeEventListener('pointerdown', outside)
      desktop.removeEventListener('change', resize)
    }
  }, [menuOpen])

  function navigateFromMenu(id: string) {
    setMenuOpen(false)
    document.getElementById(id)?.focus({ preventScroll: true })
  }

  return (
    <div className="studio-portfolio" data-motion={enabled ? 'enabled' : 'paused'}>
      <header className="studio-header" ref={header}>
        <div className="studio-header-inner studio-shell">
          <a
            className="studio-brand"
            href="#studio-about"
            aria-label="Roushan Kumar, back to introduction"
            onClick={() => setMenuOpen(false)}
          >
            <span className="studio-brand-dot" aria-hidden="true" />
            <span className="studio-brand-name">{profile.name}</span>
            <span className="studio-brand-role">Data & AI engineer</span>
          </a>
          <nav className="studio-desktop-nav" aria-label="Studio navigation">
            {navigation.map(({ label, id }) => (
              <a key={id} href={`#${id}`}>
                {label}
                {id === 'studio-contact' && <ArrowUpRight size={15} aria-hidden="true" />}
              </a>
            ))}
          </nav>
          <button
            className="studio-menu-toggle"
            type="button"
            ref={menuButton}
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="studio-mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>{menuOpen ? 'Close' : 'Menu'}</span>
            {menuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
        <nav
          className="studio-mobile-nav"
          id="studio-mobile-navigation"
          aria-label="Studio mobile navigation"
          hidden={!menuOpen}
        >
          {navigation.map(({ label, id }, index) => (
            <a key={id} href={`#${id}`} onClick={() => navigateFromMenu(id)}>
              <span className="studio-mobile-number" aria-hidden="true">0{index + 1}</span>
              <span>{label}</span>
              <ArrowUpRight size={21} aria-hidden="true" />
            </a>
          ))}
          <p>{profile.location} · {profile.role}</p>
        </nav>
        <div className="studio-reading-progress" ref={progress} aria-hidden="true" />
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="studio-hero studio-shell" id="studio-about" aria-labelledby="studio-hello" tabIndex={-1}>
          <div className="studio-hero-topline">
            <span className="studio-eyebrow"><Asterisk size={15} aria-hidden="true" /> A portfolio, with purpose.</span>
            <span className="studio-eyebrow studio-hero-location">{profile.location} <span aria-hidden="true">↗</span></span>
          </div>
          <div className="studio-hero-grid">
            <div className="studio-hero-visual">
              <Tactile className="studio-portrait-composition" depth={3}>
                <div className="studio-portrait-halo" aria-hidden="true" />
                <div className="studio-portrait-frame">
                  <img
                    className="studio-formal-portrait"
                    src={profile.portrait}
                    alt="Roushan Kumar, smiling in a navy suit"
                    width={600}
                    height={600}
                    fetchPriority="high"
                    decoding="async"
                  />
                </div>
                <span className="studio-portrait-star" aria-hidden="true"><Asterisk strokeWidth={1.1} /></span>
                <span className="studio-portrait-seal" aria-hidden="true">
                  <span>Thoughtful</span>
                  <Asterisk size={22} strokeWidth={1.25} />
                  <span>by design.</span>
                </span>
              </Tactile>
              <p className="studio-portrait-caption">
                <span>Engineer. Problem solver. Human.</span>
                <span aria-hidden="true">— RK</span>
              </p>
            </div>
            <div className="studio-hero-copy">
              <h1 className="studio-hello" id="studio-hello">Hello<span>.</span></h1>
              <div className="studio-intro">
                <h2>A bit about me</h2>
                <p><strong>I’m Roushan.</strong> {profile.summary}</p>
              </div>
              <nav className="studio-circle-links" aria-label="Introduction shortcuts">
                <Tactile className="studio-circle-wrap" depth={5}>
                  <a className="studio-circle studio-circle-resume" href="#studio-resume" aria-label="Explore résumé">
                    <span>Résumé</span><ArrowUpRight size={23} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </Tactile>
                <Tactile className="studio-circle-wrap" depth={5}>
                  <a className="studio-circle studio-circle-work" href="#studio-work" aria-label="Explore projects">
                    <span>Projects</span><ArrowUpRight size={23} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </Tactile>
                <Tactile className="studio-circle-wrap" depth={5}>
                  <a className="studio-circle studio-circle-contact" href="#studio-contact" aria-label="Contact Roushan">
                    <span>Contact</span><ArrowUpRight size={23} strokeWidth={1.5} aria-hidden="true" />
                  </a>
                </Tactile>
              </nav>
              <p className="studio-current-role">
                <span className="studio-status-dot" aria-hidden="true" />
                <span>Currently, <strong>{profile.role}</strong><br /><span>at {profile.currentEmployer} · for {profile.currentClient}</span></span>
              </p>
            </div>
          </div>
          <div className="studio-hero-bottom">
            <p>Good engineering starts with a better question.</p>
            <a className="studio-scroll-link" href="#studio-work">A little of what I do <ArrowDown size={16} aria-hidden="true" /></a>
          </div>
        </section>

        <section className="studio-work studio-shell studio-section" id="studio-work" aria-labelledby="studio-work-title" tabIndex={-1}>
          <Reveal className="studio-section-heading">
            <div>
              <p className="studio-eyebrow">01 / Selected work</p>
              <h2 id="studio-work-title">Complex challenges.<br /><span className="studio-serif">Clear outcomes.</span></h2>
            </div>
            <div className="studio-section-aside">
              <p>Enterprise data, applied AI, and the useful space in between. A selection of the systems I’ve helped shape.</p>
              <span className="studio-small-label">Four studies in making things work.</span>
            </div>
          </Reveal>

          <div className="studio-project-grid">
            {projects.map((project, index) => (
              <Reveal className="studio-project-entry" key={project.id} delay={(index % 2) * 90}>
                <Tactile className="studio-project-tilt" depth={1.3}>
                  <article className={`studio-project-card studio-project--${project.kind}`}>
                    <div className="studio-project-visual">
                      <div className="studio-art-label" aria-hidden="true">
                        <span>STUDY {project.number}</span><Asterisk size={17} strokeWidth={1.4} />
                      </div>
                      <ProjectArtwork kind={project.kind} theme="light" className="studio-project-art" />
                      <div className="studio-project-result">
                        <strong>{project.metric.value}</strong>
                        <span>{project.metric.label}</span>
                      </div>
                    </div>
                    <div className="studio-project-meta">
                      <span>{project.category}</span>
                      <span>{project.period}</span>
                    </div>
                    <h3>
                      <button
                        type="button"
                        className="studio-project-button"
                        onClick={() => onProject(project)}
                        aria-label={`Read case study: ${project.title}`}
                      >
                        <span>{project.title}</span>
                        <span className="studio-project-open" aria-hidden="true"><ArrowUpRight size={23} strokeWidth={1.5} /></span>
                      </button>
                    </h3>
                    <p className="studio-project-summary">{project.summary}</p>
                    <div className="studio-project-caption">
                      <span>{project.company} <span aria-hidden="true">/</span> {project.client}</span>
                      <span className="studio-project-read">Read the story <ArrowRight size={15} aria-hidden="true" /></span>
                    </div>
                  </article>
                </Tactile>
              </Reveal>
            ))}
          </div>
          <p className="studio-disclosure"><span aria-hidden="true">*</span>{projectDisclosure}</p>
        </section>

        <div className="studio-impact-band">
          <div className="studio-shell">
            <Reveal>
              <p className="studio-eyebrow">The difference is in the details.</p>
              <dl className="studio-impact-grid">
                {metrics.map((metric) => (
                  <div key={metric.value} className="studio-impact">
                    <dt>{metric.label}</dt>
                    <dd className="studio-impact-value">{metric.value}</dd>
                    <dd className="studio-impact-detail">{metric.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        <section className="studio-resume studio-shell studio-section" id="studio-resume" aria-labelledby="studio-resume-title" tabIndex={-1}>
          <div className="studio-resume-layout">
            <div className="studio-resume-intro">
              <Reveal>
                <p className="studio-eyebrow">02 / The path so far</p>
                <h2 id="studio-resume-title">Always<br /><span className="studio-serif">building.</span></h2>
                <p className="studio-resume-description">A software engineering foundation. A focus on data. An evolving curiosity for what comes next.</p>
                <a className="studio-text-link" href={profile.resumeUrl} download>
                  Download résumé <Download size={17} aria-hidden="true" />
                </a>
                <button className="studio-recruiter-link" type="button" onClick={onRecruiter}>
                  Recruiter quick view <ArrowUpRight size={16} aria-hidden="true" />
                </button>
                <p className="studio-resume-hint">The highlights below.<br />The full picture in the PDF.</p>
              </Reveal>
            </div>
            <div className="studio-timeline">
              {experiences.map((experience, index) => (
                <Reveal key={experience.id} delay={index * 35}>
                  <details className="studio-role" open={index === 0}>
                    <summary>
                      <span className={`studio-role-marker${index === 0 ? ' studio-role-marker-current' : ''}`} aria-hidden="true" />
                      <span className="studio-role-overview">
                        <span className="studio-role-period">
                          {experience.period}
                          {experience.end === null && <span className="studio-current-label">Current</span>}
                        </span>
                        <span className="studio-role-title">{experience.role}</span>
                        <span className="studio-role-company">
                          {experience.company}
                          {experience.client && <><span aria-hidden="true"> / </span><span>Client: {experience.client}</span></>}
                        </span>
                      </span>
                      <span className="studio-role-toggle" aria-hidden="true"><Plus size={19} strokeWidth={1.5} /></span>
                    </summary>
                    <div className="studio-role-content">
                      <p className="studio-role-summary">{experience.summary}</p>
                      <ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                      <div className="shared-tags studio-role-tags">
                        {experience.tags.map((tag) => <span key={tag}>{tag}</span>)}
                      </div>
                      <p className="studio-role-location">{experience.location}</p>
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="studio-skills">
            <Reveal className="studio-skills-heading">
              <h3>The toolkit.</h3>
              <p>Different tools. One intention: make complex things useful.</p>
            </Reveal>
            <div className="studio-skills-grid">
              {skillGroups.map((group, index) => (
                <Reveal className="studio-skill-group" key={group.title} delay={index * 45}>
                  <span className="studio-small-label" aria-hidden="true">0{index + 1}</span>
                  <h4>{group.title}</h4>
                  <ul>{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="studio-credentials">
            <Reveal className="studio-credential-column">
              <h3><GraduationCap size={21} strokeWidth={1.4} aria-hidden="true" /> Education</h3>
              <div className="studio-credential-item">
                <span className="studio-small-label">{education.period}</span>
                <h4>{education.degree}</h4>
                <p>{education.institution}</p>
                <p className="studio-credential-detail">{education.detail}</p>
              </div>
            </Reveal>
            <Reveal className="studio-credential-column" delay={60}>
              <h3><Award size={20} strokeWidth={1.4} aria-hidden="true" /> Certifications</h3>
              {certifications.map((certification) => (
                <div className="studio-credential-item" key={certification.name}>
                  <span className="studio-small-label">{certification.issuer}</span>
                  <h4>{certification.name}</h4>
                  <p className="studio-credential-detail">{certification.detail}</p>
                </div>
              ))}
            </Reveal>
            <Reveal className="studio-credential-column" delay={120}>
              <h3><Asterisk size={21} strokeWidth={1.4} aria-hidden="true" /> Along the way</h3>
              <ul className="studio-awards">
                {awards.map((award) => (
                  <li key={award.title}>
                    <h4>{award.title}</h4>
                    <p>{award.organization}{award.year && ` · ${award.year}`}</p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="studio-perspective" id="studio-perspective" aria-labelledby="studio-perspective-title">
          <div className="studio-shell studio-perspective-layout">
            <Reveal className="studio-perspective-copy">
              <p className="studio-eyebrow">03 / Beyond the job title</p>
              <h2 id="studio-perspective-title">Thoughtful systems.<br /><span className="studio-serif">Human perspective.</span></h2>
              <p className="studio-about-text">{profile.about}</p>
              <p className="studio-pullquote"><span>Make complex things</span><br />useful<span className="studio-quote-dot">.</span></p>
              <a className="studio-text-link" href="#studio-contact">Let’s find some common ground <ArrowUpRight size={18} aria-hidden="true" /></a>
            </Reveal>
            <Reveal className="studio-personal-photo" delay={100}>
              <figure>
                <Tactile className="studio-photo-print" depth={2.5}>
                  <span className="studio-photo-tape" aria-hidden="true" />
                  <img
                    src={profile.casualPortrait}
                    alt="Roushan Kumar outdoors, with snowy scenery behind him"
                    width={400}
                    height={400}
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="studio-photo-inscription" aria-hidden="true">A little perspective.</div>
                </Tactile>
                <figcaption><span>Away from the screen.</span><Asterisk size={20} strokeWidth={1.25} aria-hidden="true" /></figcaption>
              </figure>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="studio-contact studio-shell" id="studio-contact" aria-labelledby="studio-contact-title" tabIndex={-1}>
        <Reveal>
          <div className="studio-contact-topline">
            <p className="studio-eyebrow">04 / The next conversation</p>
            <p className="studio-availability"><span className="studio-status-dot" aria-hidden="true" />{profile.availability}</p>
          </div>
          <div className="studio-contact-heading">
            <div>
              <h2 id="studio-contact-title">Let’s make<br />something <span className="studio-serif">useful.</span></h2>
              <p>A thoughtful idea. A tricky data challenge.<br />Or just a good introduction. I’m listening.</p>
            </div>
            <Tactile className="studio-contact-orbit" depth={4}>
              <button className="studio-conversation-button" type="button" onClick={onContact}>
                <ArrowUpRight size={44} strokeWidth={1.25} aria-hidden="true" />
                <span>Start a<span className="studio-conversation-second-line"> conversation</span></span>
              </button>
            </Tactile>
          </div>
        </Reveal>
        <div className="studio-contact-grid">
          <div className="studio-contact-email">
            <p className="studio-eyebrow">Straight to my inbox</p>
            <a className="studio-email-link" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={21} aria-hidden="true" /></a>
            <CopyEmailButton className="studio-copy-button" />
          </div>
          <div className="studio-contact-links">
            <p className="studio-eyebrow">Elsewhere & directly</p>
            <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer">
              LinkedIn <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
            </a>
            <a href={profile.phoneHref}>{profile.phone}<ArrowUpRight size={16} aria-hidden="true" /></a>
            <span className="studio-contact-location">{profile.location}</span>
          </div>
          <div className="studio-contact-links">
            <p className="studio-eyebrow">The short version</p>
            <a href={profile.resumeUrl} download>Download résumé <Download size={16} aria-hidden="true" /></a>
            <button type="button" onClick={onRecruiter}>Recruiter quick view <ArrowUpRight size={16} aria-hidden="true" /></button>
            <span className="studio-contact-location">A closer look, at your own pace.</span>
          </div>
        </div>
        <div className="studio-colophon">
          <p>© {new Date().getFullYear()} {profile.name}</p>
          <p className="studio-colophon-note">A human touch. An engineering mind.</p>
          <a href="#studio-about">Back to top <ArrowUp size={15} aria-hidden="true" /></a>
        </div>
      </footer>
    </div>
  )
}
