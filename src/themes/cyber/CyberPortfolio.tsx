import { useEffect, useState } from 'react'
import {
  ArrowDown, ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Asterisk,
  Award, Braces, Check, Code2, Download, Layers3, MapPin, Menu, Plus, X,
} from 'lucide-react'
import { Dialog } from '../../components/Dialog'
import { ProjectArtwork } from '../../components/ProjectArtwork'
import { Reveal } from '../../components/Reveal'
import {
  awards, certifications, education, experiences, metrics, profile, projects,
  projectDisclosure, skillGroups, type ArtworkKind, type ProjectCategory,
} from '../../data/profile'
import type { PortfolioPageProps } from '../../types'
import DataCore, { type CoreMode } from './DataCore'
import './cyber.css'

const filters: ('All work' | ProjectCategory)[] = ['All work', 'Data engineering', 'Applied AI', 'Analytics']
const coreLabels = {
  data: { title: 'THE DATA CORE', caption: 'Complexity, given structure.', number: '01' },
  cloud: { title: 'THE CLOUD SPHERE', caption: 'Built to scale beyond boundaries.', number: '02' },
  ai: { title: 'THE INTELLIGENCE LOOP', caption: 'A more connected kind of thinking.', number: '03' },
}

type GalleryItem = { title: string; label: string; description: string; image?: string; kind?: ArtworkKind }
const gallery: GalleryItem[] = [
  { title: 'A different perspective.', label: '01 / PROFILE ARCHIVE', image: profile.casualPortrait, description: 'A more personal frame, from my supplied LinkedIn profile. The same person, a different perspective.' },
  { title: 'Connected thinking.', label: '02 / VISUAL EXPLORATION', kind: 'network', description: 'An original conceptual illustration of connected agents, tools, context, and data. A visual exploration, not a screenshot of a client system.' },
  { title: 'Built in layers.', label: '03 / VISUAL EXPLORATION', kind: 'warehouse', description: 'An original visual study of layered data architecture: structure that supports scale. No client data is represented.' },
]

export default function CyberPortfolio({ onContact, onProject, onRecruiter }: PortfolioPageProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [filter, setFilter] = useState<(typeof filters)[number]>('All work')
  const [expandedExperience, setExpandedExperience] = useState<string | null>(experiences[0].id)
  const [coreMode, setCoreMode] = useState<CoreMode>('data')
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null)
  const visibleProjects = projects.filter((project) => filter === 'All work' || project.category === filter)
  const selectedImage = galleryIndex === null ? null : gallery[galleryIndex]

  useEffect(() => {
    if (!menuOpen) return
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [menuOpen])

  useEffect(() => {
    if (galleryIndex === null) return
    const navigate = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault()
        const delta = event.key === 'ArrowRight' ? 1 : -1
        setGalleryIndex((index) => index === null ? null : (index + delta + gallery.length) % gallery.length)
      }
    }
    window.addEventListener('keydown', navigate)
    return () => window.removeEventListener('keydown', navigate)
  }, [galleryIndex])

  return (
    <div className="cyber-portfolio" id="cyber-top">
      <header className="cyber-header">
        <a href="#cyber-top" className="cyber-brand" aria-label="Roushan Kumar, back to top">
          <span className="cyber-brand-mark">r<span>k</span><i /></span>
          <span>ROUSHAN KUMAR<small>DATA & AI ENGINEER</small></span>
        </a>
        <nav id="cyber-navigation" aria-label="Main navigation" className={menuOpen ? 'is-open' : ''}>
          <a href="#cyber-work" onClick={() => setMenuOpen(false)}>Work <span>01</span></a>
          <a href="#cyber-about" onClick={() => setMenuOpen(false)}>About <span>02</span></a>
          <a href="#cyber-experience" onClick={() => setMenuOpen(false)}>Journey <span>03</span></a>
          <a href="#cyber-gallery" onClick={() => setMenuOpen(false)}>Gallery <span>04</span></a>
        </nav>
        <div className="cyber-header-actions">
          <button className="cyber-talk" onClick={onContact} aria-label="Let's talk"><span>Let's talk</span><ArrowUpRight size={16} /></button>
          <button className="cyber-menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} aria-controls="cyber-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </header>

      <main id="main-content">
        <section className="cyber-hero" aria-labelledby="cyber-title">
          <div className="cyber-hero-index"><span><i /> OPEN TO THE RIGHT OPPORTUNITY</span><span>HYDERABAD, IN <span className="index-slash">/</span> PORTFOLIO 2026</span></div>
          <div className="cyber-hero-layout">
            <div className="cyber-hero-copy">
              <p className="cyber-eyebrow"><span className="code-slash">//</span> HELLO WORLD. I'M ROUSHAN.</p>
              <h1 id="cyber-title">Data.<br />Intelligence.<br /><em>Possibility.</em></h1>
              <p className="cyber-hero-description">I build the systems behind the insight.<br />Turning complex data into something that<br className="desktop-break" /> moves the world forward.</p>
              <div className="cyber-hero-actions">
                <a className="cyber-button primary" href="#cyber-work">Explore my work <ArrowDownRight size={19} /></a>
                <a className="cyber-resume-link" href={profile.resumeUrl} download><Download size={15} /> Get my résumé</a>
              </div>
            </div>
            <div className="cyber-hero-art">
              <div className="core-top-label"><span><Asterisk size={15} />{coreLabels[coreMode].title}</span><span>FIG. {coreLabels[coreMode].number}</span></div>
              <DataCore mode={coreMode} />
              <span className="core-side-label">STRUCTURE. SCALE. INTELLIGENCE.</span>
              <div className="core-floating-label"><span className="core-label-icon"><Braces size={18} /></span><div>ENGINEERED FOR IMPACT<small>Not just another pipeline.</small></div></div>
              <div className="core-bottom-label">
                <p aria-live="polite">{coreLabels[coreMode].caption}</p>
                <div className="core-mode-controls" role="group" aria-label="Data core visualization">
                  {(['data', 'cloud', 'ai'] as const).map((mode) => <button key={mode} aria-pressed={coreMode === mode} onClick={() => setCoreMode(mode)}>{mode}</button>)}
                </div>
              </div>
            </div>
          </div>
          <div className="cyber-hero-bottom"><a href="#cyber-impact"><span className="scroll-capsule"><ArrowDown size={13} /></span> SCROLL TO DISCOVER</a><span>LEAD DATA ENGINEER <i /> CLOUD NATIVE <i /> HUMAN FIRST</span><span className="hero-coordinate">[ 01 — 04 ]</span></div>
        </section>

        <section className="cyber-clients cyber-container" aria-label="Client environments">
          <p>GOOD WORK.<br /><span>GREAT ENVIRONMENTS.</span></p>
          <div className="cyber-client-names"><span className="client-microsoft">Microsoft</span><span className="client-tmobile">T-Mobile</span><span className="client-ccc">CCC</span></div>
          <span className="client-disclaimer">Client work through<br />MAQ Software & Insight Global</span>
        </section>

        <section id="cyber-impact" className="cyber-impact cyber-container" aria-labelledby="impact-heading">
          <Reveal><p className="cyber-eyebrow" id="impact-heading">LESS BUZZWORD. MORE IMPACT.</p></Reveal>
          <div className="cyber-stats">
            {metrics.map((metric, index) => (
              <Reveal key={metric.value} delay={index * 80}>
                <button onClick={() => onProject(projects[index === 1 ? 1 : 3])} className="cyber-stat" aria-label={`${metric.value} ${metric.label}: explore the case study`}>
                  <span className="stat-number">{metric.value}<ArrowUpRight size={22} /></span><strong>{metric.label}</strong><span className="stat-source">{metric.detail}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        <section id="cyber-work" className="cyber-work cyber-container cyber-section" aria-labelledby="work-heading">
          <Reveal className="cyber-section-heading">
            <div><p className="cyber-eyebrow"><span>01 /</span> SELECTED WORK</p><h2 id="work-heading">Complex challenges.<br /><span>Clear outcomes.</span></h2></div>
            <p>A glimpse into the systems I've helped build.<br />Real problems. Thoughtful engineering.<br />Outcomes that mean something.</p>
          </Reveal>
          <div className="cyber-work-filter">
            <div role="group" aria-label="Filter projects">{filters.map((item) => <button key={item} onClick={() => setFilter(item)} aria-pressed={filter === item}>{item}{item === 'All work' && <span>04</span>}</button>)}</div>
            <span className="work-result-count" role="status">{String(visibleProjects.length).padStart(2, '0')} SYSTEMS / SELECTED</span>
          </div>
          <div className="cyber-project-grid">
            {visibleProjects.map((project, index) => (
              <Reveal key={project.id} delay={index % 2 * 100}>
                <button className={`cyber-project cyber-project--${project.kind}`} onClick={() => onProject(project)} aria-label={`Explore ${project.title}`}>
                  <div className="cyber-project-image"><ProjectArtwork kind={project.kind} /><span className="project-image-index">{project.number} / {project.category.toUpperCase()}</span><span className="project-open"><ArrowUpRight size={22} /></span><span className="project-image-metric">{project.metric.value}<small>{project.metric.label}</small></span></div>
                  <div className="cyber-project-info"><div><p>{project.client}<span> / {project.period}</span></p><h3>{project.title}</h3><span className="project-summary">{project.summary}</span></div><ArrowUpRight size={20} /></div>
                  <div className="cyber-project-tags">{project.stack.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
                </button>
              </Reveal>
            ))}
          </div>
          <p className="cyber-work-note"><Code2 size={14} />Experience-based case studies. Original visuals. No private client data.</p>
        </section>

        <div className="cyber-marquee" aria-hidden="true"><div>BUILD WITH INTENT <Asterisk /> THINK IN SYSTEMS <Asterisk /> STAY CURIOUS <Asterisk /> BUILD WITH INTENT <Asterisk /> THINK IN SYSTEMS <Asterisk /> STAY CURIOUS <Asterisk /></div></div>

        <section id="cyber-about" className="cyber-about cyber-container cyber-section" aria-labelledby="about-heading">
          <Reveal className="cyber-portrait-wrap">
            <figure className="cyber-portrait"><img src={profile.portrait} alt="Roushan Kumar, Lead Data Engineer" width="600" height="600" loading="lazy" /><div className="portrait-cross cross-top">+</div><div className="portrait-cross cross-bottom">+</div><figcaption><span>THE HUMAN BEHIND THE CODE</span><span>RK / 2026</span></figcaption></figure>
            <div className="cyber-portrait-tag"><i /><span>Engineer by trade.<br /><strong>Builder by nature.</strong></span><Asterisk size={28} /></div>
          </Reveal>
          <Reveal className="cyber-about-copy" delay={100}>
            <p className="cyber-eyebrow"><span>02 /</span> MORE THAN A JOB TITLE</p>
            <h2 id="about-heading">Behind every system,<br />there's <em>a human.</em></h2>
            <p>{profile.about}</p>
            <p>From the first line of SQL to the bigger architectural picture, my focus is the same: build things people can trust, understand, and actually use.</p>
            <div className="cyber-about-location"><MapPin size={15} /><span>{profile.location}</span><span className="about-location-divider" /> <span>Working across data & AI</span></div>
            <button className="cyber-text-link" onClick={onRecruiter}>Short on time? Here's the 30-second version. <ArrowUpRight size={17} /></button>
          </Reveal>
        </section>

        <section className="cyber-stack cyber-container" aria-labelledby="stack-heading">
          <div className="cyber-stack-title"><h3 id="stack-heading">The tools change.<br /><span>The curiosity doesn't.</span></h3><p>MY EVERYDAY BUILDING BLOCKS <ArrowDownRight size={18} /></p></div>
          <div className="cyber-skill-grid">{skillGroups.map((group, index) => <Reveal key={group.title} delay={index * 60}><div className="cyber-skill-group"><span className="skill-group-number">0{index + 1}</span><h4>{group.title}</h4><div>{group.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></div></Reveal>)}</div>
        </section>

        <section id="cyber-experience" className="cyber-experience cyber-container cyber-section" aria-labelledby="experience-heading">
          <Reveal className="cyber-journey-heading"><p className="cyber-eyebrow"><span>03 /</span> THE JOURNEY SO FAR</p><h2 id="experience-heading">Always learning.<br /><span>Always building.</span></h2><p>Different domains. Increasing scale.<br />One continuous thread of curiosity.</p><a href={profile.resumeUrl} download className="cyber-text-link">Download full résumé <Download size={16} /></a></Reveal>
          <div className="cyber-timeline">
            {experiences.map((experience, index) => {
              const expanded = expandedExperience === experience.id
              return (
                <Reveal key={experience.id} delay={index * 50}>
                  <article className={`cyber-career ${expanded ? 'is-expanded' : ''}`}>
                    <button className="cyber-career-toggle" aria-expanded={expanded} aria-controls={`career-${experience.id}`} onClick={() => setExpandedExperience(expanded ? null : experience.id)}>
                      <span className="career-marker" /><span><span className="career-period">{experience.period}{index === 0 && <b>CURRENT</b>}</span><span className="career-role">{experience.role}</span><span className="career-company">{experience.company}{experience.client && <span> / {experience.client}</span>}</span></span><Plus size={19} className="career-plus" />
                    </button>
                    <div id={`career-${experience.id}`} className="cyber-career-content" hidden={!expanded}>
                      <p>{experience.summary}</p><ul>{experience.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul><div className="cyber-project-tags">{experience.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        </section>

        <section className="cyber-credentials cyber-container" aria-label="Education, certifications, and recognition">
          <Reveal><div className="cyber-credential-heading"><Layers3 size={20} /><h3>Built on solid foundations.</h3></div><p className="credential-kicker">EDUCATION</p><h4>{education.degree}</h4><p>{education.institution}<span> / {education.period}</span></p><p className="credential-detail">{education.detail}</p></Reveal>
          <Reveal delay={70}><div className="cyber-credential-heading"><Check size={20} /><h3>Curiosity, certified.</h3></div>{certifications.map((certificate) => <div key={certificate.name} className="cyber-certificate"><h4>{certificate.name}</h4><p>{certificate.issuer}<span> / {certificate.detail}</span></p></div>)}</Reveal>
          <Reveal delay={140}><div className="cyber-credential-heading"><Award size={20} /><h3>A little recognition.</h3></div>{awards.slice(0, 2).map((award) => <div key={award.title} className="cyber-certificate"><h4>{award.title}</h4><p>{award.organization}<span> / {award.year}</span></p></div>)}</Reveal>
        </section>

        <section id="cyber-gallery" className="cyber-gallery cyber-container cyber-section" aria-labelledby="gallery-heading">
          <Reveal className="cyber-section-heading"><div><p className="cyber-eyebrow"><span>04 /</span> A FEW DIFFERENT FRAMES</p><h2 id="gallery-heading">Beyond <span>the terminal.</span></h2></div><p>A personal perspective.<br />Two original visual explorations.<br />A little more of the world behind the work.</p></Reveal>
          <div className="cyber-gallery-grid">{gallery.map((item, index) => <Reveal key={item.title} className={`gallery-item gallery-item--${index + 1}`} delay={index * 60}><button onClick={() => setGalleryIndex(index)} aria-label={`Open gallery: ${item.title}`}><div className="gallery-image">{item.image ? <img src={item.image} alt={item.title} loading="lazy" width="600" height="600" /> : item.kind && <ProjectArtwork kind={item.kind} />}</div><div className="gallery-item-label"><span>{item.label}</span><ArrowUpRight size={16} /></div></button></Reveal>)}</div>
        </section>

        <section id="cyber-contact" className="cyber-contact cyber-container" aria-labelledby="contact-heading">
          <Reveal><div className="cyber-contact-panel"><div className="contact-panel-top"><p className="cyber-eyebrow"><i /> THE NEXT CHAPTER STARTS HERE</p><span>LET'S MAKE IT COUNT.</span></div><div className="contact-panel-main"><h2 id="contact-heading">Good data.<br />Better possibilities.</h2><button className="cyber-contact-arrow" aria-label="Start a conversation" onClick={onContact}><ArrowUpRight strokeWidth={1} /></button></div><div className="contact-panel-bottom"><p>Have something interesting in mind?<br />I'd love to help build it.</p><button onClick={onContact}>Let's talk about it <ArrowUpRight size={20} /></button></div></div></Reveal>
        </section>
      </main>

      <footer className="cyber-footer cyber-container">
        <div className="cyber-footer-top"><a className="cyber-footer-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={19} /></a><div><a href={profile.linkedIn} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={13} /></a><a href={profile.resumeUrl} download>Résumé <Download size={13} /></a><a href="#cyber-top">Back to top <ArrowUpRight size={13} /></a></div></div>
        <div className="cyber-footer-bottom"><span>© {new Date().getFullYear()} ROUSHAN KUMAR</span><span>BUILT WITH INTENT. ALWAYS EVOLVING.</span><span><i /> THANKS FOR STOPPING BY.</span></div>
      </footer>

      {selectedImage && galleryIndex !== null && <Dialog title={selectedImage.title} eyebrow={selectedImage.label} onClose={() => setGalleryIndex(null)} className="cyber-gallery-dialog"><div className="gallery-lightbox-image">{selectedImage.image ? <img src={selectedImage.image} alt={selectedImage.title} /> : selectedImage.kind && <ProjectArtwork kind={selectedImage.kind} />}</div><p className="gallery-lightbox-description" aria-live="polite">{selectedImage.description}</p><div className="gallery-lightbox-controls"><button aria-label="Previous gallery image" onClick={() => setGalleryIndex((galleryIndex + gallery.length - 1) % gallery.length)}><ArrowLeft size={18} />Previous</button><span>{String(galleryIndex + 1).padStart(2, '0')} / {String(gallery.length).padStart(2, '0')}</span><button aria-label="Next gallery image" onClick={() => setGalleryIndex((galleryIndex + 1) % gallery.length)}>Next<ArrowRight size={18} /></button></div><p className="sr-only">{projectDisclosure}</p></Dialog>}
    </div>
  )
}
