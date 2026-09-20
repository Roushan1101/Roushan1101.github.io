export const WORLD = {
  width: 4240,
  height: 420,
  ground: 342,
  finish: 4020,
} as const

export const PHYSICS = {
  playerWidth: 30,
  playerHeight: 42,
  speed: 230,
  tourSpeed: 188,
  acceleration: 1900,
  gravity: 1580,
  jumpSpeed: 570,
  maxDelta: 1 / 30,
  coyoteTime: 0.1,
  jumpBuffer: 0.12,
} as const

export interface Platform {
  x: number
  y: number
  width: number
  color: 'gold' | 'coral' | 'sage'
}

export const PLATFORMS: readonly Platform[] = [
  { x: 390, y: 278, width: 144, color: 'gold' },
  { x: 1050, y: 306, width: 92, color: 'sage' },
  { x: 1390, y: 278, width: 144, color: 'coral' },
  { x: 2010, y: 306, width: 92, color: 'gold' },
  { x: 2350, y: 278, width: 144, color: 'sage' },
  { x: 2980, y: 306, width: 92, color: 'coral' },
  { x: 3320, y: 278, width: 144, color: 'gold' },
]

export interface DataToken {
  id: number
  x: number
  y: number
}

export const TOKENS: readonly DataToken[] = [
  { id: 0, x: 230, y: 317 },
  { id: 1, x: 470, y: 252 },
  { id: 2, x: 655, y: 317 },
  { id: 3, x: 865, y: 317 },
  { id: 4, x: 1220, y: 317 },
  { id: 5, x: 1470, y: 252 },
  { id: 6, x: 1670, y: 317 },
  { id: 7, x: 1840, y: 317 },
  { id: 8, x: 2180, y: 317 },
  { id: 9, x: 2430, y: 252 },
  { id: 10, x: 2630, y: 317 },
  { id: 11, x: 2830, y: 317 },
  { id: 12, x: 3150, y: 317 },
  { id: 13, x: 3400, y: 252 },
  { id: 14, x: 3600, y: 317 },
  { id: 15, x: 3830, y: 317 },
]

export const CHECKPOINTS = [
  { id: 'foundations', x: 745, title: 'BI foundations', short: 'BI workshop', projectId: 'business-intelligence', color: '#efb94c' },
  { id: 'cloud', x: 1760, title: 'Cloud connections', short: 'Cloud lookout', projectId: 'telecom', color: '#99c9cd' },
  { id: 'agents', x: 2730, title: 'Agentic thinking', short: 'Idea observatory', projectId: 'agents', color: '#bdafd1' },
  { id: 'healthcare', x: 3690, title: 'Healthcare, connected', short: 'Care greenhouse', projectId: 'healthcare', color: '#a9c879' },
] as const

export type CheckpointId = (typeof CHECKPOINTS)[number]['id']
export type GamePhase = 'ready' | 'playing' | 'paused' | 'complete'
export type GameMode = 'manual' | 'tour'

export interface GameInput {
  left: boolean
  right: boolean
  jump: boolean
}

export const EMPTY_INPUT: Readonly<GameInput> = { left: false, right: false, jump: false }

export interface Player {
  x: number
  y: number
  vx: number
  vy: number
  grounded: boolean
  facing: -1 | 1
  coyote: number
  jumpBuffer: number
  jumpHeld: boolean
}

export interface GameState {
  phase: GamePhase
  mode: GameMode
  player: Player
  camera: number
  elapsed: number
  collected: number[]
  discovered: CheckpointId[]
  tourWait: number
  sparkles: { x: number; y: number; born: number }[]
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function createGame(): GameState {
  return {
    phase: 'ready',
    mode: 'manual',
    player: {
      x: 112,
      y: WORLD.ground - PHYSICS.playerHeight,
      vx: 0,
      vy: 0,
      grounded: true,
      facing: 1,
      coyote: PHYSICS.coyoteTime,
      jumpBuffer: 0,
      jumpHeld: false,
    },
    camera: 0,
    elapsed: 0,
    collected: [],
    discovered: [],
    tourWait: 0,
    sparkles: [],
  }
}

export function startGame(mode: GameMode = 'manual'): GameState {
  return { ...createGame(), phase: 'playing', mode }
}

export function pauseGame(state: GameState): GameState {
  if (state.phase !== 'playing') return state
  return {
    ...state,
    phase: 'paused',
    player: { ...state.player, vx: 0, jumpHeld: false, jumpBuffer: 0 },
  }
}

export function resumeGame(state: GameState): GameState {
  return state.phase === 'paused' ? { ...state, phase: 'playing' } : state
}

export function takeControl(state: GameState): GameState {
  return {
    ...state,
    mode: 'manual',
    tourWait: 0,
    player: { ...state.player, vx: 0, jumpHeld: false, jumpBuffer: 0 },
  }
}

export function currentCheckpoint(state: GameState) {
  for (let index = CHECKPOINTS.length - 1; index >= 0; index -= 1) {
    if (state.player.x + PHYSICS.playerWidth / 2 >= CHECKPOINTS[index].x - 190) return CHECKPOINTS[index]
  }
  return CHECKPOINTS[0]
}

export function cameraTarget(playerX: number, viewportWidth: number) {
  const width = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : 1100
  return clamp(playerX - width * 0.32, 0, Math.max(0, WORLD.width - width))
}

function tourInput(state: GameState): GameInput {
  if (state.tourWait > 0) return { ...EMPTY_INPUT }
  const feet = state.player.y + PHYSICS.playerHeight
  const nose = state.player.x + PHYSICS.playerWidth
  const upcoming = PLATFORMS.find((platform) =>
    platform.x > nose && platform.x - nose <= 60 && platform.y < feet && feet - platform.y <= 100,
  )
  return { left: false, right: true, jump: state.player.grounded && Boolean(upcoming) }
}

function approach(value: number, target: number, amount: number) {
  return value < target ? Math.min(target, value + amount) : Math.max(target, value - amount)
}

export function advanceGame(
  state: GameState,
  input: Readonly<GameInput>,
  delta: number,
  viewportWidth = 1100,
): GameState {
  if (state.phase !== 'playing' || !Number.isFinite(delta) || delta <= 0) return state
  const dt = Math.min(delta, PHYSICS.maxDelta)
  const viewWidth = Number.isFinite(viewportWidth) && viewportWidth > 0 ? viewportWidth : 1100
  const controls = state.mode === 'tour' ? tourInput(state) : input
  const player = { ...state.player }
  const direction = Number(controls.right) - Number(controls.left)
  const speed = state.mode === 'tour' ? PHYSICS.tourSpeed : PHYSICS.speed
  const elapsed = state.elapsed + dt

  player.coyote = player.grounded ? PHYSICS.coyoteTime : Math.max(0, player.coyote - dt)
  player.jumpBuffer = controls.jump && !player.jumpHeld
    ? PHYSICS.jumpBuffer
    : Math.max(0, player.jumpBuffer - dt)
  player.jumpHeld = controls.jump
  player.vx = approach(player.vx, direction * speed, PHYSICS.acceleration * dt)
  if (direction !== 0) player.facing = direction as -1 | 1

  if (player.jumpBuffer > 0 && player.coyote > 0) {
    player.vy = -PHYSICS.jumpSpeed
    player.grounded = false
    player.coyote = 0
    player.jumpBuffer = 0
  }

  const previousBottom = player.y + PHYSICS.playerHeight
  player.x = clamp(player.x + player.vx * dt, 0, WORLD.width - PHYSICS.playerWidth)
  if (player.x === 0 || player.x === WORLD.width - PHYSICS.playerWidth) player.vx = 0
  player.vy += PHYSICS.gravity * dt
  player.y += player.vy * dt
  player.grounded = false

  // Swept top-only collisions let the explorer jump through a brick from below.
  if (player.vy >= 0) {
    let landing: number = WORLD.ground
    for (const platform of PLATFORMS) {
      if (
        player.x + PHYSICS.playerWidth > platform.x &&
        player.x < platform.x + platform.width &&
        previousBottom <= platform.y + 0.5 &&
        player.y + PHYSICS.playerHeight >= platform.y
      ) {
        landing = Math.min(landing, platform.y)
      }
    }
    if (player.y + PHYSICS.playerHeight >= landing) {
      player.y = landing - PHYSICS.playerHeight
      player.vy = 0
      player.grounded = true
    }
  }

  const collected = [...state.collected]
  const sparkles = state.sparkles.filter((sparkle) => elapsed - sparkle.born < 0.65)
  for (const token of TOKENS) {
    if (collected.includes(token.id)) continue
    const nearestX = clamp(token.x, player.x, player.x + PHYSICS.playerWidth)
    const nearestY = clamp(token.y, player.y, player.y + PHYSICS.playerHeight)
    if (Math.hypot(token.x - nearestX, token.y - nearestY) <= 13) {
      collected.push(token.id)
      sparkles.push({ x: token.x, y: token.y, born: elapsed })
    }
  }

  const discovered = [...state.discovered]
  let tourWait = Math.max(0, state.tourWait - dt)
  for (const checkpoint of CHECKPOINTS) {
    if (player.x + PHYSICS.playerWidth / 2 >= checkpoint.x && !discovered.includes(checkpoint.id)) {
      discovered.push(checkpoint.id)
      if (state.mode === 'tour') tourWait = 0.95
    }
  }

  const complete = player.x + PHYSICS.playerWidth >= WORLD.finish
  if (complete) {
    player.vx = 0
    player.jumpHeld = false
    player.jumpBuffer = 0
  }
  const target = cameraTarget(player.x, viewWidth)
  const camera = clamp(
    state.camera + (target - state.camera) * (1 - Math.exp(-7 * dt)),
    0,
    Math.max(0, WORLD.width - viewWidth),
  )

  return {
    phase: complete ? 'complete' : 'playing',
    mode: state.mode,
    player,
    camera,
    elapsed,
    collected,
    discovered,
    tourWait,
    sparkles,
  }
}
