import { Component, lazy, Suspense, useEffect, useState, type ErrorInfo, type ReactNode } from 'react'
import { ContactDialog } from './components/ContactDialog'
import { ExperienceSwitcher } from './components/ExperienceSwitcher'
import { MotionProvider } from './components/MotionProvider'
import { ProjectDialog } from './components/ProjectDialog'
import { RecruiterDialog } from './components/RecruiterDialog'
import type { Project } from './data/profile'
import type { ExperienceId } from './types'

const CyberPortfolio = lazy(() => import('./themes/cyber/CyberPortfolio'))
const StudioPortfolio = lazy(() => import('./themes/studio/StudioPortfolio'))
const PlayPortfolio = lazy(() => import('./themes/play/PlayPortfolio'))

type Modal = { kind: 'contact' } | { kind: 'recruiter' } | { kind: 'project'; project: Project } | null

function InitialSectionScroll() {
  useEffect(() => {
    const section = window.location.hash.slice(1)
    if (!section) return
    let disposed = false
    let frame = 0

    // Native fragment scrolling can finish before the lazy-loaded section exists.
    void document.fonts.ready.then(() => {
      if (disposed) return
      frame = window.requestAnimationFrame(() => {
        if (window.location.hash.slice(1) !== section) return
        document.getElementById(section)?.scrollIntoView({ behavior: 'instant', block: 'start' })
      })
    })

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
    }
  }, [])

  return null
}

class PortfolioErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('The portfolio could not render:', error, info.componentStack)
  }

  render() {
    if (this.state.failed) {
      return (
        <main id="main-content" className="load-error">
          <h1>This world couldn't load.</h1>
          <p>Please refresh to try again, or select another portfolio style below.</p>
          <button className="shared-button primary" onClick={() => window.location.reload()}>Refresh this view</button>
        </main>
      )
    }
    return this.props.children
  }
}

export default function App({ experience }: { experience: ExperienceId }) {
  const [modal, setModal] = useState<Modal>(null)
  const Page = experience === 'studio' ? StudioPortfolio : experience === 'play' ? PlayPortfolio : CyberPortfolio

  return (
    <MotionProvider>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <PortfolioErrorBoundary>
        <Suspense fallback={<div className="world-loading" role="status"><span>RK.</span>Opening a new perspective...</div>}>
          <Page onContact={() => setModal({ kind: 'contact' })} onRecruiter={() => setModal({ kind: 'recruiter' })} onProject={(project) => setModal({ kind: 'project', project })} />
          <InitialSectionScroll />
        </Suspense>
        {modal?.kind === 'contact' && <ContactDialog onClose={() => setModal(null)} />}
        {modal?.kind === 'recruiter' && <RecruiterDialog onClose={() => setModal(null)} />}
        {modal?.kind === 'project' && <ProjectDialog project={modal.project} onClose={() => setModal(null)} />}
      </PortfolioErrorBoundary>
      <ExperienceSwitcher current={experience} />
    </MotionProvider>
  )
}
