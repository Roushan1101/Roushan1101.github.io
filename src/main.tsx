import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/manrope'
import '@fontsource-variable/space-grotesk'
import '@fontsource/space-mono/latin-400.css'
import App from './App'
import './styles/global.css'
import './styles/mobile.css'

const experience = document.documentElement.dataset.experience
if (experience !== 'cyber' && experience !== 'studio' && experience !== 'play') {
  throw new Error(`Unknown portfolio experience: ${experience}`)
}

const root = document.getElementById('root')
if (!root) throw new Error('The portfolio root element was not found.')

createRoot(root).render(
  <StrictMode>
    <App experience={experience} />
  </StrictMode>,
)
