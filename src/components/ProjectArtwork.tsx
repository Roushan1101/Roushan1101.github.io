import { useId } from 'react'
import type { ArtworkKind } from '../data/profile'

export function ProjectArtwork({
  kind,
  theme = 'dark',
  className = '',
}: {
  kind: ArtworkKind
  theme?: 'dark' | 'light' | 'play'
  className?: string
}) {
  const id = useId()
  const colors =
    theme === 'dark'
      ? { background: '#101b1a', grid: '#243933', line: '#c5ff78', faint: '#416655', ink: '#dce9dc', panel: '#14251d' }
      : theme === 'light'
        ? { background: '#e6ebdd', grid: '#d0d9c8', line: '#41663d', faint: '#90a786', ink: '#243b29', panel: '#f5f7ef' }
        : { background: '#e9eedc', grid: '#cfdcbf', line: '#416239', faint: '#91a77e', ink: '#2b422b', panel: '#fffdf0' }

  return (
    <svg
      viewBox="0 0 640 360"
      className={`project-artwork ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <pattern id={`${id}-grid`} width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M 32 0 L 0 0 0 32" fill="none" stroke={colors.grid} strokeWidth="0.7" />
        </pattern>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor={colors.line} stopOpacity=".15" />
          <stop offset="1" stopColor={colors.background} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="640" height="360" fill={colors.background} />
      <rect width="640" height="360" fill={`url(#${id}-grid)`} />
      <ellipse cx="320" cy="185" rx="260" ry="170" fill={`url(#${id}-glow)`} />
      {kind === 'pipeline' && (
        <g>
          <path d="M130 180H510M320 88V272" stroke={colors.faint} strokeWidth="1.5" strokeDasharray="4 7" />
          {[120, 280, 440].map((x, index) => (
            <g key={x} transform={`translate(${x} 132)`}>
              <rect x="8" y="8" width="88" height="88" rx="14" fill="none" stroke={colors.faint} />
              <rect width="88" height="88" rx="14" fill={colors.panel} stroke={colors.line} strokeWidth="1.5" />
              <path d={index === 0 ? 'M25 30h38M25 44h38M25 58h25' : index === 1 ? 'M24 30l20-12 20 12v27L44 69 24 57zm0 0l20 12 20-12M44 42v27' : 'M25 43l13 13 26-27'} fill="none" stroke={colors.line} strokeWidth="2" />
              <text x="44" y="126" fill={colors.ink} fontSize="11" textAnchor="middle" fontFamily="monospace" letterSpacing="2">
                {['INGEST', 'MODEL', 'TRUST'][index]}
              </text>
            </g>
          ))}
          <circle cx="245" cy="176" r="4" fill={colors.line} />
          <circle cx="405" cy="176" r="4" fill={colors.line} />
          <text x="320" y="71" fill={colors.faint} fontSize="10" textAnchor="middle" fontFamily="monospace" letterSpacing="3">CANONICAL DATA LAYER</text>
        </g>
      )}
      {kind === 'network' && (
        <g>
          {[0, 1, 2, 3, 4, 5].map((index) => {
            const angle = (index * Math.PI) / 3
            const x = 320 + Math.cos(angle) * 170
            const y = 180 + Math.sin(angle) * 110
            return (
              <g key={index}>
                <line x1="320" y1="180" x2={x} y2={y} stroke={colors.faint} strokeWidth="1.5" />
                <circle cx={x} cy={y} r="28" fill={colors.panel} stroke={colors.line} />
                <circle cx={x} cy={y} r="8" fill="none" stroke={colors.line} />
                <text x={x} y={y + 48} fill={colors.ink} fontSize="9" textAnchor="middle" fontFamily="monospace" letterSpacing="1.5">
                  {['LLM', 'TOOLS', 'DATA', 'TRACE', 'MCP', 'CONTEXT'][index]}
                </text>
              </g>
            )
          })}
          <circle cx="320" cy="180" r="61" fill="none" stroke={colors.faint} strokeDasharray="3 5" />
          <circle cx="320" cy="180" r="47" fill={colors.panel} stroke={colors.line} strokeWidth="1.5" />
          <path d="M303 180h34m-17-17v34m-12-29l24 24m0-24l-24 24" stroke={colors.line} strokeWidth="2" />
        </g>
      )}
      {kind === 'warehouse' && (
        <g>
          {[0, 1, 2].map((index) => (
            <g key={index} transform={`translate(0 ${index * -43})`}>
              <path d="M215 203l105-57 105 57v38l-105 58-105-58z" fill={colors.panel} stroke={colors.faint} />
              <path d="M215 203l105 58 105-58M320 261v38" fill="none" stroke={colors.line} />
              <path d="M247 205l73-39 73 39-73 40z" fill={colors.line} opacity={index === 2 ? '.25' : '.07'} />
              <circle cx="235" cy="228" r="3" fill={colors.line} />
            </g>
          ))}
          <path d="M168 130H114v115h49M472 130h54v115h-49" fill="none" stroke={colors.faint} strokeDasharray="4 6" />
          <text x="320" y="48" fill={colors.ink} fontSize="10" textAnchor="middle" fontFamily="monospace" letterSpacing="3">LAYER / ORCHESTRATE / ANALYZE</text>
        </g>
      )}
      {kind === 'analytics' && (
        <g>
          <rect x="128" y="72" width="384" height="224" rx="12" fill={colors.panel} stroke={colors.faint} />
          <path d="M128 106h384" stroke={colors.faint} />
          {[146, 158, 170].map((x) => <circle key={x} cx={x} cy="89" r="3" fill={colors.faint} />)}
          <path d="M169 146H470M169 187H470M169 228H470M169 265H470" stroke={colors.grid} />
          {[35, 60, 47, 80, 105, 93, 130].map((height, index) => (
            <rect key={index} x={175 + index * 42} y={265 - height} width="24" height={height} rx="3" fill={colors.line} opacity={0.16 + index * 0.07} />
          ))}
          <path d="M187 235l42-28 42 10 42-38 42-33 42 13 42-48" fill="none" stroke={colors.line} strokeWidth="2" />
          <circle cx="439" cy="111" r="5" fill={colors.line} />
        </g>
      )}
      <text x="22" y="338" fill={colors.faint} fontFamily="monospace" fontSize="8" letterSpacing="1.8">ILLUSTRATIVE SYSTEM VIEW / RK</text>
      <path d="M601 22h17v17M22 22h17M22 22v17M601 338h17v-17" fill="none" stroke={colors.faint} />
    </svg>
  )
}
