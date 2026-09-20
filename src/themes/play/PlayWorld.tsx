import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from 'react'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronRight,
  CircleHelp,
  Download,
  Flag,
  Gamepad2,
  Gem,
  MousePointer2,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { profile, projects, type Project } from '../../data/profile'
import { useMotion } from '../../hooks/useMotion'
import {
  advanceGame,
  CHECKPOINTS,
  clamp,
  createGame,
  currentCheckpoint,
  pauseGame,
  PHYSICS,
  resumeGame,
  startGame,
  takeControl,
  TOKENS,
  WORLD,
  type CheckpointId,
  type GameInput,
  type GameMode,
  type GamePhase,
  type GameState,
} from './engine'
import { renderWorld } from './renderer'

export interface PlayWorldHandle {
  pause: () => void
}

interface PlayWorldProps {
  onProject: (project: Project) => void
  onContact: () => void
}

interface Snapshot {
  phase: GamePhase
  mode: GameMode
  collected: number
  discovered: CheckpointId[]
  checkpoint: CheckpointId
  progress: number
}

function snapshotOf(state: GameState): Snapshot {
  return {
    phase: state.phase,
    mode: state.mode,
    collected: state.collected.length,
    discovered: state.discovered,
    checkpoint: currentCheckpoint(state).id,
    progress: state.phase === 'complete'
      ? 100
      : Math.round(clamp((state.player.x - 112) / (WORLD.finish - PHYSICS.playerWidth - 112), 0, 1) * 100),
  }
}

const CONTROL_CODES = new Set(['ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyD', 'KeyW', 'Space'])
const INITIAL_PRESSED: GameInput = { left: false, right: false, jump: false }

export const PlayWorld = forwardRef<PlayWorldHandle, PlayWorldProps>(function PlayWorld({ onProject, onContact }, ref) {
  const { enabled } = useMotion()
  const game = useRef(createGame())
  const worldElement = useRef<HTMLDivElement>(null)
  const canvasElement = useRef<HTMLCanvasElement>(null)
  const keys = useRef(new Set<string>())
  const pointerActions = useRef(new Map<number, keyof GameInput>())
  const pointerElements = useRef(new Map<number, HTMLButtonElement>())
  const buttonKeys = useRef(new Set<keyof GameInput>())
  const viewport = useRef(1100)
  const lastSnapshot = useRef(snapshotOf(game.current))
  const [snapshot, setSnapshot] = useState(lastSnapshot.current)
  const [pressed, setPressed] = useState<GameInput>(INITIAL_PRESSED)
  const [pauseReason, setPauseReason] = useState('Your progress is right here. Pick up where you left off.')
  const [renderError, setRenderError] = useState(false)

  const getInput = useCallback((): GameInput => {
    const touches = new Set(pointerActions.current.values())
    return {
      left: keys.current.has('ArrowLeft') || keys.current.has('KeyA') || touches.has('left') || buttonKeys.current.has('left'),
      right: keys.current.has('ArrowRight') || keys.current.has('KeyD') || touches.has('right') || buttonKeys.current.has('right'),
      jump: keys.current.has('Space') || keys.current.has('ArrowUp') || keys.current.has('KeyW') || touches.has('jump') || buttonKeys.current.has('jump'),
    }
  }, [])

  const clearInput = useCallback(() => {
    keys.current.clear()
    pointerActions.current.clear()
    buttonKeys.current.clear()
    pointerElements.current.forEach((element, pointerId) => {
      if (element.hasPointerCapture(pointerId)) element.releasePointerCapture(pointerId)
    })
    pointerElements.current.clear()
    setPressed(INITIAL_PRESSED)
  }, [])

  const commit = useCallback((next: GameState) => {
    game.current = next
    const nextSnapshot = snapshotOf(next)
    const previous = lastSnapshot.current
    if (
      nextSnapshot.phase !== previous.phase ||
      nextSnapshot.mode !== previous.mode ||
      nextSnapshot.collected !== previous.collected ||
      nextSnapshot.discovered.length !== previous.discovered.length ||
      nextSnapshot.checkpoint !== previous.checkpoint ||
      nextSnapshot.progress !== previous.progress
    ) {
      lastSnapshot.current = nextSnapshot
      setSnapshot(nextSnapshot)
    }
  }, [])

  const pause = useCallback((reason?: string) => {
    clearInput()
    if (game.current.phase !== 'playing') return
    setPauseReason(reason ?? 'Your progress is right here. Pick up where you left off.')
    commit(pauseGame(game.current))
  }, [clearInput, commit])

  useImperativeHandle(ref, () => ({ pause: () => pause() }), [pause])

  const focusWorld = useCallback(() => {
    const element = worldElement.current
    if (!element) return
    element.focus({ preventScroll: true })
    const bounds = element.getBoundingClientRect()
    if (bounds.bottom > window.innerHeight - 108) {
      window.scrollBy({ top: bounds.bottom - (window.innerHeight - 108), behavior: 'instant' })
    } else if (bounds.top < 12) {
      window.scrollBy({ top: bounds.top - 12, behavior: 'instant' })
    }
  }, [])

  function begin(mode: GameMode) {
    clearInput()
    commit(startGame(mode))
    focusWorld()
  }

  function resume() {
    clearInput()
    commit(resumeGame(game.current))
    focusWorld()
  }

  function manual() {
    clearInput()
    commit(resumeGame(takeControl(game.current)))
    focusWorld()
  }

  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pause('The tab was hidden, so the world took a little break.')
    }
    const onWindowBlur = () => pause('The window lost focus. Nothing was lost.')
    document.addEventListener('visibilitychange', onVisibility)
    window.addEventListener('blur', onWindowBlur)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('blur', onWindowBlur)
    }
  }, [pause])

  useEffect(() => {
    const canvas = canvasElement.current
    if (!canvas) return
    let context: CanvasRenderingContext2D | null = null
    try {
      context = canvas.getContext('2d', { alpha: false })
    } catch {
      context = null
    }
    if (!context) {
      setRenderError(true)
      return
    }

    let frameId = 0
    let previousTime: number | null = null
    let disposed = false
    const ctx = context
    const draw = () => renderWorld(ctx, game.current, viewport.current, enabled)
    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      if (bounds.width <= 0 || bounds.height <= 0) return
      viewport.current = Math.max(280, bounds.width * WORLD.height / bounds.height)
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(bounds.width * ratio)
      canvas.height = Math.round(bounds.height * ratio)
      ctx.setTransform(canvas.width / viewport.current, 0, 0, canvas.height / WORLD.height, 0, 0)
      game.current = {
        ...game.current,
        camera: clamp(game.current.camera, 0, Math.max(0, WORLD.width - viewport.current)),
      }
      draw()
    }
    const frame = (time: number) => {
      if (disposed || game.current.phase !== 'playing') return
      const delta = previousTime === null ? 0 : (time - previousTime) / 1000
      previousTime = time
      const next = advanceGame(game.current, getInput(), delta, viewport.current)
      commit(next)
      draw()
      if (next.phase === 'playing') {
        frameId = requestAnimationFrame(frame)
      } else {
        clearInput()
      }
    }

    resize()
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null
    observer?.observe(canvas)
    if (!observer) window.addEventListener('resize', resize)
    if (document.fonts) void document.fonts.ready.then(() => { if (!disposed) draw() })
    if (snapshot.phase === 'playing') frameId = requestAnimationFrame(frame)
    return () => {
      disposed = true
      cancelAnimationFrame(frameId)
      observer?.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [snapshot.phase, enabled, getInput, commit, clearInput])

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || game.current.phase !== 'playing' || event.metaKey || event.ctrlKey || event.altKey) return
    if (event.code === 'Escape' || event.code === 'KeyP') {
      event.preventDefault()
      if (!event.repeat) pause()
      return
    }
    if (!CONTROL_CODES.has(event.code)) return
    event.preventDefault()
    if (game.current.mode === 'tour') commit(takeControl(game.current))
    keys.current.add(event.code)
    setPressed(getInput())
  }

  function onKeyUp(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget || !CONTROL_CODES.has(event.code)) return
    if (game.current.phase === 'playing') event.preventDefault()
    keys.current.delete(event.code)
    setPressed(getInput())
  }

  function pressPointer(event: PointerEvent<HTMLButtonElement>, action: keyof GameInput) {
    if (event.button !== 0 || game.current.phase !== 'playing') return
    event.preventDefault()
    focusWorld()
    if (game.current.mode === 'tour') commit(takeControl(game.current))
    event.currentTarget.setPointerCapture(event.pointerId)
    pointerActions.current.set(event.pointerId, action)
    pointerElements.current.set(event.pointerId, event.currentTarget)
    setPressed(getInput())
  }

  function releasePointer(event: PointerEvent<HTMLButtonElement>) {
    pointerActions.current.delete(event.pointerId)
    pointerElements.current.delete(event.pointerId)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    setPressed(getInput())
  }

  function pressButtonKey(event: KeyboardEvent<HTMLButtonElement>, action: keyof GameInput) {
    if (game.current.phase !== 'playing' || (event.code !== 'Enter' && event.code !== 'Space')) return
    event.preventDefault()
    if (game.current.mode === 'tour') commit(takeControl(game.current))
    buttonKeys.current.add(action)
    setPressed(getInput())
  }

  function releaseButtonKey(event: KeyboardEvent<HTMLButtonElement>, action: keyof GameInput) {
    if (event.code !== 'Enter' && event.code !== 'Space') return
    event.preventDefault()
    buttonKeys.current.delete(action)
    setPressed(getInput())
  }

  function inspect(projectId: string) {
    const project = projects.find((item) => item.id === projectId)
    if (!project) return
    pause()
    onProject(project)
  }

  const controlsDisabled = snapshot.phase !== 'playing' || renderError
  const checkpoint = CHECKPOINTS.find((item) => item.id === snapshot.checkpoint) ?? CHECKPOINTS[0]
  const stateLabel = snapshot.phase === 'ready'
    ? 'Ready when you are'
    : snapshot.phase === 'complete'
      ? 'World explored!'
      : snapshot.phase === 'paused'
        ? 'Paused'
        : snapshot.mode === 'tour' ? 'Tour in progress' : 'Exploring'

  return (
    <section className="play-playground" aria-labelledby="play-world-title">
      <div
        className="play-world"
        ref={worldElement}
        tabIndex={0}
        role="group"
        aria-label="Playable data trail"
        aria-describedby="play-instructions play-state"
        data-testid="play-world"
        data-state={snapshot.phase}
        data-mode={snapshot.mode}
        onKeyDown={onKeyDown}
        onKeyUp={onKeyUp}
        onBlur={(event) => {
          clearInput()
          if (!event.currentTarget.contains(event.relatedTarget)) pause('You stepped out of the game. Resume whenever you’re ready.')
        }}
      >
        <div className="play-world-toolbar">
          <div className="play-world-name">
            <span className="play-world-icon"><Gamepad2 size={19} aria-hidden="true" /></span>
            <h2 id="play-world-title">The data trail</h2>
            <span className="play-world-edition">A TINY ADVENTURE</span>
          </div>
          <div className="play-world-hud">
            <span className="play-token-counter" data-testid="play-score" aria-label={`${snapshot.collected} of ${TOKENS.length} data tokens collected`}>
              <Gem size={17} aria-hidden="true" />
              <strong>{String(snapshot.collected).padStart(2, '0')}</strong>
              <span>/ {TOKENS.length}</span>
            </span>
            <span className="play-checkpoint-count" aria-label={`${snapshot.discovered.length} of ${CHECKPOINTS.length} checkpoints explored`}>
              <Flag size={15} aria-hidden="true" /> {snapshot.discovered.length}/{CHECKPOINTS.length}
            </span>
            <span className="play-toolbar-divider" aria-hidden="true" />
            <button
              className="play-tool-button"
              onClick={() => snapshot.phase === 'paused' ? resume() : pause()}
              disabled={snapshot.phase === 'ready' || snapshot.phase === 'complete' || renderError}
              aria-label={snapshot.phase === 'paused' ? 'Resume game' : 'Pause game'}
              data-testid="play-pause"
            >
              {snapshot.phase === 'paused' ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
              <span>{snapshot.phase === 'paused' ? 'Resume' : 'Pause'}</span>
            </button>
            <button className="play-tool-button play-restart" onClick={() => begin(snapshot.mode)} aria-label="Restart world" disabled={renderError} data-testid="play-restart">
              <RotateCcw size={15} aria-hidden="true" />
              <span>Restart</span>
            </button>
          </div>
        </div>

        <div className="play-scene">
          <canvas
            ref={canvasElement}
            data-testid="play-game-canvas"
            role="img"
            aria-label="Pip, a small yellow-and-green robot, explores a sunny brick world with platforms, data tokens, and four career landmarks. Use the controls below or read every case study without playing."
            onPointerDown={focusWorld}
          >
            Explore Roushan’s career using the four accessible checkpoint buttons below. Canvas graphics are optional.
          </canvas>
          {renderError ? (
            <div className="play-scene-card play-scene-card-error" role="alert">
              <CircleHelp size={25} aria-hidden="true" />
              <h3>The world couldn’t load.</h3>
              <p>Your browser couldn’t start the canvas. The full portfolio is still right here.</p>
              <a href="#play-portfolio" className="play-button play-button-gold">View portfolio <ArrowRight size={16} /></a>
            </div>
          ) : snapshot.phase === 'ready' ? (
            <div className="play-scene-card play-welcome-card">
              <span className="play-mini-label"><span /> PLAYER 01 · THAT’S YOU</span>
              <h3>A little curiosity.<br />A whole world to explore.</h3>
              <p>Meet Pip. Collect tokens. Discover what I build.</p>
              <div className="play-start-actions">
                <button className="play-button play-button-gold" onClick={() => begin('manual')} data-testid="play-start">
                  <Play size={16} fill="currentColor" aria-hidden="true" /> Let’s play
                </button>
                <button className="play-tour-button" onClick={() => begin('tour')} data-testid="play-tour">
                  Watch a tour <ArrowRight size={14} aria-hidden="true" />
                </button>
              </div>
              <span className="play-scene-note">No timers. No enemies. Just good things to find.</span>
            </div>
          ) : snapshot.phase === 'paused' ? (
            <div className="play-scene-card play-pause-card">
              <span className="play-mini-label"><Pause size={12} aria-hidden="true" /> WORLD ON PAUSE</span>
              <h3>Take a breather.</h3>
              <p>{pauseReason}</p>
              <button className="play-button play-button-gold" onClick={resume} data-testid="play-resume">
                <Play size={16} aria-hidden="true" /> Resume {snapshot.mode === 'tour' ? 'tour' : 'adventure'}
              </button>
              {snapshot.mode === 'tour' && <button className="play-text-button" onClick={manual}>I’ll take the controls <ArrowRight size={14} /></button>}
            </div>
          ) : snapshot.phase === 'complete' ? (
            <div className="play-scene-card play-completion-card" data-testid="play-completion">
              <span className="play-completion-icon"><Flag size={24} aria-hidden="true" /></span>
              <span className="play-mini-label">CURIOSITY LOOKS GOOD ON YOU</span>
              <h3>World explored!</h3>
              <p><strong>{snapshot.collected}/{TOKENS.length} tokens</strong> collected. <strong>4/4 ideas</strong> discovered.<br />The next great thing? We could build it together.</p>
              <div className="play-completion-actions">
                <button className="play-button play-button-gold" onClick={() => { pause(); onContact() }}>Let’s build something <ArrowRight size={15} /></button>
                <a href={profile.resumeUrl} download className="play-button play-button-paper"><Download size={15} /> Get the résumé</a>
              </div>
              <button className="play-text-button" onClick={() => begin('manual')}><RotateCcw size={13} /> One more adventure</button>
            </div>
          ) : (
            <div className="play-scene-location" aria-hidden="true">
              <span className="play-location-dot" />
              {snapshot.mode === 'tour' ? 'PIP IS SHOWING YOU AROUND' : checkpoint.short.toUpperCase()}
            </div>
          )}
          <div className="play-scene-corner" aria-hidden="true">
            <span>ORIGINAL WORLD</span>
            <span>BUILT WITH CURIOSITY ↗</span>
          </div>
        </div>

        <div className="play-control-bar">
          <div className="play-controls-copy">
            <span className="play-control-label"><MousePointer2 size={13} aria-hidden="true" /> YOUR WAY TO PLAY</span>
            <p><kbd>←</kbd><kbd>→</kbd> or <kbd>A</kbd><kbd>D</kbd> move <span className="play-control-separator">·</span> <kbd>space</kbd> jump</p>
          </div>
          <div className="play-touch-controls" aria-label="On-screen game controls">
            {([
              { action: 'left', label: 'Move left', icon: <ArrowLeft size={21} aria-hidden="true" /> },
              { action: 'right', label: 'Move right', icon: <ArrowRight size={21} aria-hidden="true" /> },
              { action: 'jump', label: 'Jump', icon: <ArrowUp size={21} aria-hidden="true" /> },
            ] as const).map(({ action, label, icon }) => (
              <button
                key={action}
                className={`play-direction-button play-direction-${action}`}
                aria-label={label}
                disabled={controlsDisabled}
                data-active={pressed[action]}
                data-testid={`play-${action}`}
                onPointerDown={(event) => pressPointer(event, action)}
                onPointerUp={releasePointer}
                onPointerCancel={releasePointer}
                onLostPointerCapture={releasePointer}
                onKeyDown={(event) => pressButtonKey(event, action)}
                onKeyUp={(event) => releaseButtonKey(event, action)}
                onContextMenu={(event) => event.preventDefault()}
              >
                {icon}{action === 'jump' && <span>Jump</span>}
              </button>
            ))}
          </div>
          <div className="play-tour-controls">
            {snapshot.mode === 'tour' && (snapshot.phase === 'playing' || snapshot.phase === 'paused') ? (
              <button className="play-text-button" onClick={manual} data-testid="play-take-control"><Gamepad2 size={16} /> Take the controls</button>
            ) : (
              <button className="play-text-button" onClick={() => begin('tour')} disabled={renderError}>
                <Play size={14} /> {snapshot.phase === 'ready' ? 'Sit back & watch' : 'Restart as a tour'}
              </button>
            )}
          </div>
        </div>
        <div className="play-world-progress">
          <progress value={snapshot.progress} max={100} aria-label="World exploration progress" data-testid="play-progress" />
        </div>
      </div>

      <div className="play-below-world">
        <p id="play-state" className="play-state" role="status" aria-live="polite" aria-atomic="true" data-testid="play-status">
          <span className={`play-state-dot play-state-${snapshot.phase}`} aria-hidden="true" />
          <strong>{stateLabel}</strong>
          <span> · {snapshot.collected}/{TOKENS.length} tokens · {snapshot.discovered.length}/4 checkpoints</span>
        </p>
        <a href="#play-portfolio" className="play-skip-game" onClick={() => pause()}>Just here for the work? <span>Skip the game <ArrowRight size={13} /></span></a>
      </div>
      <p id="play-instructions" className="play-instructions">
        <CircleHelp size={14} aria-hidden="true" />
        Focus the world to use arrow keys or A/D. Jump with Space, ↑ or W. Pause with P or Esc.
        Collect glowing tokens and visit the flags. No score is needed to see the work.
      </p>
      <div className="play-route-header">
        <span className="play-mini-label"><Sparkles size={13} aria-hidden="true" /> FOUR STOPS. ONE CURIOUS MIND.</span>
        <span>Every case study is open. Pick a stop.</span>
      </div>
      <div className="play-checkpoint-route" aria-label="Career checkpoints, all available without playing">
        {CHECKPOINTS.map((item, index) => {
          const found = snapshot.discovered.includes(item.id)
          return (
            <button
              key={item.id}
              className={`play-route-stop${found ? ' play-route-discovered' : ''}`}
              onClick={() => inspect(item.projectId)}
              aria-label={`View ${item.title} case study${found ? ', checkpoint discovered' : ''}`}
              data-testid={`play-checkpoint-${item.id}`}
            >
              <span className={`play-route-number play-route-color-${index}`} aria-hidden="true">{found ? <Check size={17} /> : `0${index + 1}`}</span>
              <span><small>{found ? 'DISCOVERED' : 'OPEN TO EXPLORE'}</small><strong>{item.title}</strong></span>
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          )
        })}
      </div>
    </section>
  )
})
