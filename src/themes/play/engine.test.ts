import { describe, expect, it } from 'vitest'
import {
  advanceGame,
  cameraTarget,
  CHECKPOINTS,
  createGame,
  EMPTY_INPUT,
  pauseGame,
  PHYSICS,
  PLATFORMS,
  resumeGame,
  startGame,
  takeControl,
  TOKENS,
  WORLD,
  type GameInput,
  type GameState,
} from './engine'

function run(state: GameState, frames: number, input: GameInput = { ...EMPTY_INPUT }) {
  let next = state
  for (let frame = 0; frame < frames; frame += 1) {
    next = advanceGame(next, input, 1 / 60)
  }
  return next
}

describe('Roushan’s World engine', () => {
  it('does not animate or accept movement before an explicit start', () => {
    const state = createGame()
    expect(advanceGame(state, { left: false, right: true, jump: true }, 1)).toBe(state)
    expect(state.phase).toBe('ready')
  })

  it('moves in either direction without mutating its previous state', () => {
    const state = startGame()
    const right = run(state, 40, { ...EMPTY_INPUT, right: true })
    const left = run(state, 20, { ...EMPTY_INPUT, left: true })
    expect(right.player.x).toBeGreaterThan(state.player.x)
    expect(left.player.x).toBeLessThan(state.player.x)
    expect(right.player.facing).toBe(1)
    expect(left.player.facing).toBe(-1)
    expect(state.player.x).toBe(112)
    expect(state.elapsed).toBe(0)
  })

  it('jumps, falls, and lands safely without auto-jumping when jump is held', () => {
    const state = startGame()
    const airborne = run(state, 12, { ...EMPTY_INPUT, jump: true })
    expect(airborne.player.y).toBeLessThan(state.player.y)
    expect(airborne.player.grounded).toBe(false)
    const landed = run(airborne, 100, { ...EMPTY_INPUT, jump: true })
    expect(landed.player.y).toBe(WORLD.ground - PHYSICS.playerHeight)
    expect(landed.player.grounded).toBe(true)
    expect(landed.player.vy).toBe(0)
  })

  it('does not allow a second jump in midair', () => {
    const airborne = run(startGame(), 10, { ...EMPTY_INPUT, jump: true })
    const released = advanceGame(airborne, EMPTY_INPUT, 1 / 60)
    const pressedAgain = advanceGame(released, { ...EMPTY_INPUT, jump: true }, 1 / 60)
    expect(pressedAgain.player.vy).toBeGreaterThan(released.player.vy)
  })

  it('lands on a platform after crossing its top during a frame', () => {
    const platform = PLATFORMS[0]
    const state = startGame()
    state.player = {
      ...state.player,
      x: platform.x + 30,
      y: platform.y - PHYSICS.playerHeight - 4,
      vy: 360,
      grounded: false,
    }
    const landed = advanceGame(state, EMPTY_INPUT, 1 / 30)
    expect(landed.player.y + PHYSICS.playerHeight).toBe(platform.y)
    expect(landed.player.grounded).toBe(true)
    expect(landed.player.vy).toBe(0)
  })

  it('lets the player rise through platforms instead of catching underneath', () => {
    const platform = PLATFORMS[0]
    const state = startGame()
    state.player = { ...state.player, x: platform.x + 30 }
    const rising = run(state, 10, { ...EMPTY_INPUT, jump: true })
    expect(rising.player.y + PHYSICS.playerHeight).toBeLessThan(platform.y)
    expect(rising.player.vy).toBeLessThan(0)
  })

  it('keeps both horizontal world boundaries solid', () => {
    const left = run(startGame(), 150, { ...EMPTY_INPUT, left: true })
    expect(left.player.x).toBe(0)
    const state = startGame()
    state.player.x = WORLD.width - PHYSICS.playerWidth - 1
    const right = advanceGame(state, { ...EMPTY_INPUT, right: true }, 1 / 30)
    expect(right.player.x).toBeLessThanOrEqual(WORLD.width - PHYSICS.playerWidth)
    expect(right.player.x).toBeGreaterThanOrEqual(0)
  })

  it('collects each token only once, even after revisiting', () => {
    const state = startGame()
    state.player.x = TOKENS[0].x - PHYSICS.playerWidth / 2
    const collected = run(state, 3)
    expect(collected.collected).toEqual([TOKENS[0].id])
    const revisited = run(collected, 90)
    expect(revisited.collected).toEqual([TOKENS[0].id])
    expect(new Set(revisited.collected).size).toBe(revisited.collected.length)
  })

  it('pauses without advancing the world and clears held jump state', () => {
    const moving = run(startGame(), 12, { ...EMPTY_INPUT, right: true, jump: true })
    const paused = pauseGame(moving)
    expect(paused.phase).toBe('paused')
    expect(paused.player.jumpHeld).toBe(false)
    expect(paused.player.vx).toBe(0)
    expect(advanceGame(paused, { ...EMPTY_INPUT, right: true }, 1)).toBe(paused)
    expect(resumeGame(paused).phase).toBe('playing')
    expect(resumeGame(paused).collected).toEqual(moving.collected)
  })

  it('clamps long frames and ignores invalid frame durations', () => {
    const state = startGame()
    const input = { ...EMPTY_INPUT, right: true }
    expect(advanceGame(state, input, 45)).toEqual(advanceGame(state, input, PHYSICS.maxDelta))
    expect(advanceGame(state, input, Number.NaN)).toBe(state)
    expect(advanceGame(state, input, Number.POSITIVE_INFINITY)).toBe(state)
    expect(advanceGame(state, input, -1)).toBe(state)
  })

  it('keeps the camera inside the world, including oversized viewports', () => {
    expect(cameraTarget(0, 1000)).toBe(0)
    expect(cameraTarget(WORLD.width, 1000)).toBe(WORLD.width - 1000)
    expect(cameraTarget(WORLD.width, WORLD.width + 400)).toBe(0)
  })

  it('allows the finish without requiring perfect token collection', () => {
    const finished = run(startGame(), 1400, { ...EMPTY_INPUT, right: true })
    expect(finished.phase).toBe('complete')
    expect(finished.discovered).toHaveLength(CHECKPOINTS.length)
    expect(finished.collected.length).toBeLessThan(TOKENS.length)
    expect(advanceGame(finished, EMPTY_INPUT, 1 / 60)).toBe(finished)
  })

  it('automatically tours all four checkpoints, collects every token, and stops', () => {
    const finished = run(startGame('tour'), 2400)
    expect(finished.phase).toBe('complete')
    expect(finished.discovered).toEqual(CHECKPOINTS.map((checkpoint) => checkpoint.id))
    expect([...finished.collected].sort((a, b) => a - b)).toEqual(TOKENS.map((token) => token.id))
    expect(finished.player.vx).toBe(0)
    expect(advanceGame(finished, EMPTY_INPUT, 1 / 60)).toBe(finished)
  })

  it('can hand a tour to the player without losing progress', () => {
    const touring = run(startGame('tour'), 210)
    const manual = takeControl(touring)
    expect(manual.mode).toBe('manual')
    expect(manual.player.x).toBe(touring.player.x)
    expect(manual.collected).toEqual(touring.collected)
    expect(manual.discovered).toEqual(touring.discovered)
    expect(manual.tourWait).toBe(0)
  })

  it('restarts with a fresh score and the requested mode', () => {
    const finished = run(startGame('tour'), 2400)
    expect(finished.collected.length).toBeGreaterThan(0)
    const restarted = startGame('manual')
    expect(restarted.phase).toBe('playing')
    expect(restarted.mode).toBe('manual')
    expect(restarted.collected).toEqual([])
    expect(restarted.discovered).toEqual([])
    expect(restarted.camera).toBe(0)
    expect(restarted.player.x).toBe(112)
  })
})
