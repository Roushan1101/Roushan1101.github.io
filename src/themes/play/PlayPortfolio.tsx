import { useRef } from 'react'
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Award,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Check,
  Cloud,
  Code2,
  Download,
  ExternalLink,
  FileUser,
  Heart,
  Mail,
  MapPin,
  Shapes,
  Sparkles,
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
  type Project,
} from '../../data/profile'
import { useMotion } from '../../hooks/useMotion'
import type { PortfolioPageProps } from '../../types'
import { PlayWorld, type PlayWorldHandle } from './PlayWorld'
import './play.css'

const skillIcons = [Cloud, Code2, Bot, ChartNoAxesCombined]

function BrickMark({ className = '' }: { className?: string }) {
  return (
    <svg className={`play-brick-mark ${className}`} viewBox="0 0 48 46" fill="none" aria-hidden="true" focusable="false">
      <rect x="7" y="15" width="35" height="26" rx="5" fill="#294d3b" />
      <rect x="3" y="11" width="35" height="26" rx="5" fill="#efbf51" stroke="#294d3b" strokeWidth="2" />
      <rect x="9" y="5" width="9" height="9" rx="2" fill="#ffe29a" stroke="#294d3b" strokeWidth="2" />
      <rect x="24" y="5" width="9" height="9" rx="2" fill="#ffe29a" stroke="#294d3b" strokeWidth="2" />
      <path d="M11 23h4m10 0h4M15 29c3 3 7 3 10 0" stroke="#294d3b" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function PipIllustration() {
  return (
    <svg className="play-pip-illustration" viewBox="0 0 180 204" fill="none" aria-hidden="true" focusable="false">
      <ellipse cx="88" cy="188" rx="57" ry="10" fill="#294d3b" opacity=".13" />
      <path d="M57 162v20H35v-12l6-8zm51 0v20h24v-12l-9-8z" fill="#64886a" stroke="#294d3b" strokeWidth="3" strokeLinejoin="round" />
      <rect x="30" y="103" width="27" height="49" rx="7" fill="#e89f74" stroke="#294d3b" strokeWidth="3" />
      <rect x="49" y="99" width="79" height="70" rx="12" fill="#99b77e" stroke="#294d3b" strokeWidth="3" />
      <rect x="70" y="115" width="34" height="30" rx="6" fill="#f3ce72" stroke="#294d3b" strokeWidth="2.5" />
      <path d="M87 122v16m-8-8h16" stroke="#294d3b" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M129 112l15-10 15-28 10 6-10 37-18 20" fill="#f3d7a0" stroke="#294d3b" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="164" cy="72" r="11" fill="#f6dda9" stroke="#294d3b" strokeWidth="3" />
      <path d="M164 44v-9m17 13 6-6m-39 6-6-6" stroke="#294d3b" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="41" y="39" width="96" height="68" rx="15" fill="#f9e2a5" stroke="#294d3b" strokeWidth="3" />
      <rect x="54" y="58" width="69" height="29" rx="10" fill="#31574a" stroke="#294d3b" strokeWidth="2" />
      <path d="M69 74c0-6 8-6 8 0m21 0c0-6 8-6 8 0" stroke="#fff8dc" strokeWidth="3" strokeLinecap="round" />
      <circle cx="51" cy="94" r="4" fill="#de9f77" />
      <path d="M88 39V24" stroke="#294d3b" strokeWidth="3" />
      <circle cx="88" cy="18" r="8" fill="#efbf51" stroke="#294d3b" strokeWidth="3" />
      <path d="m15 65 2-8 2 8 8 2-8 2-2 8-2-8-8-2zm127 94 2-8 2 8 8 2-8 2-2 8-2-8-8-2z" fill="#fff8dc" />
    </svg>
  )
}

export default function PlayPortfolio({ onContact, onProject, onRecruiter }: PortfolioPageProps) {
  const worldRef = useRef<PlayWorldHandle>(null)
  const { enabled } = useMotion()

  function contact() {
    worldRef.current?.pause()
    onContact()
  }

  function inspect(project: Project) {
    worldRef.current?.pause()
    onProject(project)
  }

  function recruiter() {
    worldRef.current?.pause()
    onRecruiter()
  }

  return (
    <main className="play-portfolio" id="main-content" data-motion={enabled ? 'enabled' : 'paused'}>
      <div className="play-page-grain" aria-hidden="true" />
      <div className="play-container">
        <header className="play-header">
          <a className="play-brand" href="#main-content" aria-label="Roushan Kumar, back to the playground">
            <BrickMark />
            <span>roushan<span className="play-brand-dot">.</span><small>A BUILDER AT HEART</small></span>
          </a>
          <nav className="play-navigation" aria-label="Play portfolio navigation">
            <a href="#play-work">The work</a>
            <a href="#play-journey">The journey</a>
            <a href="#play-toolkit">The toolkit</a>
          </nav>
          <button className="play-button play-header-contact" onClick={contact}>Let’s talk <ArrowUpRight size={15} aria-hidden="true" /></button>
        </header>

        <section className="play-intro" aria-labelledby="play-heading">
          <div className="play-intro-main">
            <div className="play-eyebrow"><span className="play-tiny-bricks" aria-hidden="true"><i /><i /><i /></span> WELCOME TO THE PLAYFUL SIDE</div>
            <h1 id="play-heading">Roushan’s <span>World<span className="play-title-period">.</span></span></h1>
            <p className="play-intro-subline"><span className="play-green-dot" /> Data engineer. Curious human. Builder of useful things.</p>
          </div>
          <div className="play-intro-note">
            <h2>Build. Jump. Discover.</h2>
            <p>Big ideas, little bricks. Take a tiny adventure through the things I build.</p>
            <a href="#play-portfolio" className="play-intro-skip">Skip game / View portfolio <ArrowDownRight size={17} aria-hidden="true" /></a>
          </div>
        </section>

        <PlayWorld ref={worldRef} onContact={contact} onProject={inspect} />

        <section id="play-portfolio" className="play-about-section play-section" aria-labelledby="play-about-title" tabIndex={-1}>
          <Reveal className="play-section-kicker"><span>01 / MEET THE BUILDER</span><span className="play-kicker-line" /><Shapes size={18} aria-hidden="true" /></Reveal>
          <div className="play-about-grid">
            <Reveal className="play-portrait-column">
              <div className="play-portrait-pin" aria-hidden="true" />
              <figure className="play-portrait-frame">
                <div className="play-portrait-image">
                  <img src={profile.portrait} alt={profile.name} width="420" height="450" loading="lazy" decoding="async" />
                  <span className="play-photo-label"><MapPin size={12} aria-hidden="true" /> {profile.location}</span>
                </div>
                <figcaption><strong>{profile.name}</strong><span>THE HUMAN BEHIND THE WORLD ↗</span></figcaption>
              </figure>
              <div className="play-portrait-sticker" aria-hidden="true"><Sparkles size={20} /><span>ALWAYS<br />BUILDING.</span></div>
            </Reveal>
            <Reveal className="play-about-copy" delay={80}>
              <span className="play-mini-label">HELLO AGAIN. THIS TIME, WITHOUT THE PIXELS.</span>
              <h2 id="play-about-title">A builder,<br />in every sense<span>.</span></h2>
              <p className="play-about-lead">{profile.summary}</p>
              <p>{profile.about}</p>
              <div className="play-current-role">
                <span className="play-role-icon"><BriefcaseBusiness size={18} aria-hidden="true" /></span>
                <div><strong>{profile.role}</strong><span>{profile.currentEmployer} · Client: {profile.currentClient}</span></div>
                <span className="play-current-tag">CURRENT QUEST</span>
              </div>
              <div className="play-about-actions">
                <a href={profile.resumeUrl} download className="play-button play-button-gold"><Download size={16} aria-hidden="true" /> Download résumé</a>
                <button className="play-button play-button-paper" onClick={recruiter}><FileUser size={16} aria-hidden="true" /> Recruiter quick view</button>
              </div>
            </Reveal>
          </div>
          <div className="play-metrics" aria-label="Selected résumé outcomes">
            {metrics.map((metric, index) => (
              <Reveal key={metric.label} className={`play-metric play-metric-${index}`} delay={index * 60}>
                <span className="play-metric-studs" aria-hidden="true"><i /><i /><i /></span>
                <div><strong>{metric.value}</strong><ArrowUpRight size={22} aria-hidden="true" /></div>
                <h3>{metric.label}</h3>
                <p>{metric.detail}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="play-section play-work-section" id="play-work" aria-labelledby="play-work-title">
          <Reveal className="play-section-kicker"><span>02 / THINGS I’VE BUILT</span><span className="play-kicker-line" /><Code2 size={18} aria-hidden="true" /></Reveal>
          <Reveal className="play-section-heading">
            <h2 id="play-work-title">Little blocks.<br />Real-world impact<span>.</span></h2>
            <p>Behind every useful system is a lot of thoughtful building. Here’s some of mine.</p>
          </Reveal>
          <div className="play-project-grid">
            {projects.map((project, index) => (
              <Reveal key={project.id} className={`play-project-card play-project-color-${index}`} delay={index % 2 * 80}>
                <article>
                  <div className="play-project-art">
                    <ProjectArtwork kind={project.kind} theme="play" />
                    <span className="play-project-number" aria-hidden="true">BUILD {project.number}</span>
                    <span className="play-project-client">{project.client}</span>
                  </div>
                  <div className="play-project-copy">
                    <div className="play-project-meta"><span>{project.category}</span><span>{project.period}</span></div>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                    <ul className="play-tags" aria-label={`${project.title} technologies`}>
                      {project.stack.map((skill) => <li key={skill}>{skill}</li>)}
                    </ul>
                    <div className="play-project-bottom">
                      <div className="play-project-result"><strong>{project.metric.value}</strong><span>{project.metric.label}</span></div>
                      <button className="play-project-open" onClick={() => inspect(project)} aria-label={`Explore ${project.title} case study`}>
                        <span>Explore the build</span><ArrowUpRight size={20} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
          <p className="play-project-disclosure"><BookOpen size={15} aria-hidden="true" />{projectDisclosure}</p>
        </section>

        <section className="play-section play-journey-section" id="play-journey" aria-labelledby="play-journey-title">
          <Reveal className="play-section-kicker"><span>03 / ONE BUILD AT A TIME</span><span className="play-kicker-line" /><BriefcaseBusiness size={18} aria-hidden="true" /></Reveal>
          <Reveal className="play-section-heading">
            <h2 id="play-journey-title">Every chapter.<br />Another building block<span>.</span></h2>
            <p>From business intelligence to enterprise Data &amp; AI. The tools evolve. The curiosity stays.</p>
          </Reveal>
          <div className="play-journey-topline"><span>THE JOURNEY SO FAR</span><span>2021 <ArrowRight size={14} aria-hidden="true" /> NOW</span></div>
          <ol className="play-experience-grid">
            {experiences.map((experience, index) => (
              <li key={experience.id}>
                <Reveal className={`play-experience-card${index === 0 ? ' play-experience-current' : ''}`} delay={index % 2 * 70}>
                  <div className="play-experience-top">
                    <span className="play-experience-block" aria-hidden="true">{String(experiences.length - index).padStart(2, '0')}</span>
                    <span>{experience.period}</span>
                    {index === 0 && <span className="play-now-pill"><span /> NOW</span>}
                  </div>
                  <h3>{experience.role}</h3>
                  <p className="play-experience-company">{experience.company}{experience.client && <span> · Client: {experience.client}</span>}</p>
                  <p className="play-experience-location"><MapPin size={12} aria-hidden="true" /> {experience.location}</p>
                  <p className="play-experience-summary">{experience.summary}</p>
                  <ul className="play-experience-highlights">
                    {experience.highlights.map((highlight) => <li key={highlight}><Check size={14} aria-hidden="true" /><span>{highlight}</span></li>)}
                  </ul>
                  <ul className="play-tags" aria-label={`${experience.role} skills`}>
                    {experience.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="play-section play-toolkit-section" id="play-toolkit" aria-labelledby="play-toolkit-title">
          <Reveal className="play-section-kicker"><span>04 / THE TOOLBOX</span><span className="play-kicker-line" /><Shapes size={18} aria-hidden="true" /></Reveal>
          <Reveal className="play-section-heading">
            <h2 id="play-toolkit-title">Good tools.<br />Better possibilities<span>.</span></h2>
            <p>A well-stocked toolbox, and the judgment to pick the right piece.</p>
          </Reveal>
          <div className="play-toolkit-grid">
            {skillGroups.map((group, index) => {
              const Icon = skillIcons[index % skillIcons.length]
              return (
                <Reveal key={group.title} className={`play-toolkit-card play-toolkit-color-${index}`} delay={index * 40}>
                  <span className="play-toolkit-icon"><Icon size={24} aria-hidden="true" /></span>
                  <h3>{group.title}</h3>
                  <ul>{group.skills.map((skill) => <li key={skill}><span aria-hidden="true" />{skill}</li>)}</ul>
                </Reveal>
              )
            })}
          </div>
          <div className="play-credentials-grid">
            <Reveal className="play-credential-panel">
              <div className="play-credential-heading"><Award size={19} aria-hidden="true" /><h3>A few stamps of approval.</h3></div>
              <ul className="play-certification-list">
                {certifications.map((certification) => (
                  <li key={certification.name}>
                    <span className="play-certificate-seal" aria-hidden="true"><Check size={17} /></span>
                    <div><strong>{certification.name}</strong><p>{certification.issuer} <span>· {certification.detail}</span></p></div>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal className="play-credential-panel play-education-panel" delay={60}>
              <div className="play-credential-heading"><BookOpen size={19} aria-hidden="true" /><h3>Where the foundation started.</h3></div>
              <span className="play-education-period">{education.period}</span>
              <h4>{education.degree}</h4>
              <p className="play-education-school">{education.institution}</p>
              <p>{education.detail}</p>
            </Reveal>
          </div>
          <Reveal className="play-recognition">
            <span className="play-mini-label"><Sparkles size={14} aria-hidden="true" /> A LITTLE RECOGNITION</span>
            <ul>{awards.map((award) => <li key={award.title}><strong>{award.title}</strong><span>{award.organization}{award.year && ` · ${award.year}`}</span></li>)}</ul>
          </Reveal>
        </section>

        <Reveal className="play-contact-section">
          <section id="play-contact" aria-labelledby="play-contact-title">
            <div className="play-contact-studs" aria-hidden="true">{[0, 1, 2, 3, 4, 5].map((stud) => <i key={stud} />)}</div>
            <div className="play-contact-content">
              <div className="play-contact-copy">
                <span className="play-contact-availability"><span /> {profile.availability}</span>
                <h2 id="play-contact-title">What shall we<br />build next<span>?</span></h2>
                <p>A thoughtful data platform. A useful AI workflow.<br />Or just a really good conversation.</p>
                <div className="play-contact-actions">
                  <button className="play-button play-button-ink" onClick={contact}>Let’s build something <ArrowUpRight size={17} aria-hidden="true" /></button>
                  <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" className="play-linkedin">Say hi on LinkedIn <ExternalLink size={13} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
                </div>
                <div className="play-email-row">
                  <a href={`mailto:${profile.email}`}><Mail size={14} aria-hidden="true" />{profile.email}</a>
                  <CopyEmailButton className="play-copy-email" />
                </div>
              </div>
              <div className="play-contact-pip">
                <div className="play-pip-speech">THE BEST BUILDS<br />START WITH “HELLO”.<Heart size={13} aria-hidden="true" /></div>
                <PipIllustration />
                <span>PIP IS ROOTING FOR US.</span>
              </div>
            </div>
          </section>
        </Reveal>

        <footer className="play-footer">
          <a href="#main-content" className="play-footer-brand"><BrickMark /><span>A little play.<br /><strong>A lot of purpose.</strong></span></a>
          <p>© {new Date().getFullYear()} {profile.name}<span>Built with care, code &amp; a curious mind.</span></p>
          <a href={profile.resumeUrl} download className="play-footer-resume">Take the résumé with you <ArrowDown size={15} aria-hidden="true" /></a>
        </footer>
      </div>
    </main>
  )
}
