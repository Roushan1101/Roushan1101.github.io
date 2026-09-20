import { CHECKPOINTS, PHYSICS, PLATFORMS, TOKENS, WORLD, type GameState, type Platform } from './engine'

const INK = '#294d3b'
const CREAM = '#fff9df'
const GOLD = '#efbf51'
const MONO = '"Space Mono", monospace'

function box(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  radius = 4,
  stroke = INK,
  lineWidth = 2,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }
}

function polygon(ctx: CanvasRenderingContext2D, points: number[][], fill: string, stroke = INK, width = 2) {
  ctx.beginPath()
  points.forEach(([x, y], index) => index === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y))
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.lineWidth = width
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, fill: string, stroke = '') {
  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.lineWidth = 2
    ctx.strokeStyle = stroke
    ctx.stroke()
  }
}

function line(ctx: CanvasRenderingContext2D, x: number, y: number, endX: number, endY: number, color = INK, width = 2) {
  ctx.beginPath()
  ctx.moveTo(x, y)
  ctx.lineTo(endX, endY)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size = 10, color = INK) {
  ctx.fillStyle = color
  ctx.font = `700 ${size}px ${MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, x, y)
}

function cloud(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  box(ctx, 3, 22, 112, 28, '#accbc1', 14, '')
  ctx.beginPath()
  ctx.moveTo(9, 41)
  ctx.bezierCurveTo(-10, 40, -6, 16, 15, 17)
  ctx.bezierCurveTo(13, -6, 47, -11, 56, 11)
  ctx.bezierCurveTo(74, -1, 94, 5, 96, 23)
  ctx.bezierCurveTo(121, 19, 130, 44, 107, 45)
  ctx.lineTo(9, 45)
  ctx.fillStyle = '#fffdf0'
  ctx.fill()
  line(ctx, 15, 38, 95, 38, '#e7edd9', 3)
  ctx.restore()
}

function tree(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1, pale = false) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  box(ctx, -8, -72, 17, 75, '#a98758', 2, pale ? '#7d9b77' : INK)
  line(ctx, 0, -34, 15, -50, pale ? '#7d9b77' : INK)
  const color = pale ? '#a4c1a0' : '#75a967'
  const top = pale ? '#b9cfa7' : '#a1c273'
  box(ctx, -37, -116, 73, 47, color, 12, pale ? '#8dac8c' : INK)
  box(ctx, -26, -144, 54, 45, top, 10, pale ? '#8dac8c' : INK)
  box(ctx, -18, -150, 13, 7, top, 3, pale ? '#8dac8c' : INK, 1.5)
  box(ctx, 7, -150, 13, 7, top, 3, pale ? '#8dac8c' : INK, 1.5)
  line(ctx, -26, -77, 24, -77, pale ? '#91ad8a' : '#639456', 3)
  if (!pale) {
    circle(ctx, -22, -104, 5, '#efbf51', INK)
    circle(ctx, 17, -88, 5, '#e5976f', INK)
  }
  ctx.restore()
}

function flower(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size = 1) {
  line(ctx, x, y, x, y - 19 * size, '#5e8757', 2)
  polygon(ctx, [[x, y - 6 * size], [x - 10 * size, y - 12 * size], [x - 7 * size, y - 3 * size]], '#8daf66', '')
  for (let petal = 0; petal < 4; petal += 1) {
    const angle = petal * Math.PI / 2
    circle(ctx, x + Math.cos(angle) * 4 * size, y - 20 * size + Math.sin(angle) * 4 * size, 4 * size, color)
  }
  circle(ctx, x, y - 20 * size, 2.5 * size, INK)
}

function backdrop(ctx: CanvasRenderingContext2D, state: GameState, width: number, time: number) {
  const sky = ctx.createLinearGradient(0, 0, 0, WORLD.ground)
  sky.addColorStop(0, '#b9dcd9')
  sky.addColorStop(1, '#e7edd1')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, width, WORLD.height)

  const sunX = width * 0.76 - state.camera * 0.025
  circle(ctx, sunX, 79, 42, '#e9d786')
  circle(ctx, sunX, 79, 31, '#f7e4a0')
  for (let ray = 0; ray < 8; ray += 1) {
    const angle = ray * Math.PI / 4
    line(ctx, sunX + Math.cos(angle) * 49, 79 + Math.sin(angle) * 49, sunX + Math.cos(angle) * 55, 79 + Math.sin(angle) * 55, '#decd82', 2)
  }

  for (let index = -1; index < 10; index += 1) {
    const x = index * 410 - state.camera * 0.19
    const top = 206 + Math.sin(index * 2.7) * 39
    ctx.beginPath()
    ctx.moveTo(x - 50, WORLD.ground)
    ctx.bezierCurveTo(x + 3, top - 60, x + 231, top - 18, x + 280, WORLD.ground)
    ctx.closePath()
    ctx.fillStyle = index % 2 ? '#abc7a8' : '#b6ceae'
    ctx.fill()
    for (let stripe = 0; stripe < 4; stripe += 1) {
      box(ctx, x + 76 + stripe * 18, top + 40 + stripe % 2 * 13, 5, 12, '#95b59a', 2, '')
    }
  }
  for (let index = -1; index < 9; index += 1) {
    const x = index * 510 + 220 - state.camera * 0.34
    ctx.beginPath()
    ctx.moveTo(x - 150, WORLD.ground)
    ctx.bezierCurveTo(x - 75, 229, x + 93, 252, x + 196, WORLD.ground)
    ctx.fillStyle = '#9dbc91'
    ctx.fill()
  }
  for (let index = -1; index < 9; index += 1) {
    const x = index * 382 + 90 - state.camera * 0.12 + Math.sin(time * 0.1 + index) * 12
    cloud(ctx, x, 49 + (index % 3) * 31, 0.63 + Math.abs(index % 3) * 0.18)
  }
}

function brick(ctx: CanvasRenderingContext2D, platform: Platform) {
  const { x, y, width, color } = platform
  const fill = color === 'gold' ? '#efbe51' : color === 'coral' ? '#e59d78' : '#93b87d'
  const light = color === 'gold' ? '#ffe29a' : color === 'coral' ? '#f8c7a8' : '#bdd798'
  box(ctx, x + 5, y + 7, width, 30, '#31513925', 4, '')
  box(ctx, x, y, width, 28, fill, 4)
  ctx.save()
  ctx.beginPath()
  ctx.rect(x + 1, y + 1, width - 2, 26)
  ctx.clip()
  for (let stud = 0; stud < width / 36; stud += 1) {
    line(ctx, x + stud * 36, y + 2, x + stud * 36, y + 26, '#294d3b65', 1.5)
    box(ctx, x + stud * 36 + 10, y + 7, 15, 8, light, 3, '#294d3b35', 1)
  }
  ctx.restore()
  for (let stud = 0; stud < Math.floor(width / 36); stud += 1) {
    box(ctx, x + stud * 36 + 10, y - 6, 17, 6, light, 2, INK, 1.5)
  }
  line(ctx, x + 3, y + 22, x + width - 3, y + 22, '#294d3b22', 3)
}

function windowPane(ctx: CanvasRenderingContext2D, x: number, y: number, color = '#b0d4c8') {
  box(ctx, x, y, 28, 31, color, 3)
  line(ctx, x + 14, y + 1, x + 14, y + 30, INK, 1.5)
  line(ctx, x + 1, y + 15, x + 27, y + 15, INK, 1.5)
  line(ctx, x + 5, y + 6, x + 9, y + 3, '#fffaf0', 2)
}

function workshop(ctx: CanvasRenderingContext2D, center: number) {
  const x = center - 124
  const y = WORLD.ground - 108
  box(ctx, x + 99, y - 51, 18, 49, '#e7a078', 2)
  box(ctx, x + 95, y - 54, 26, 10, '#f3be8d', 2)
  box(ctx, x, y, 147, 108, '#f4dfaa', 3)
  polygon(ctx, [[x - 15, y + 3], [x + 73, y - 53], [x + 162, y + 3]], '#df9670')
  polygon(ctx, [[x - 12, y + 3], [x + 73, y - 42], [x + 158, y + 3]], '#efb48a')
  for (let tile = 0; tile < 4; tile += 1) {
    line(ctx, x + 22 + tile * 27, y - 10, x + 47 + tile * 15, y - 25, '#bb795a', 1.2)
  }
  windowPane(ctx, x + 17, y + 37)
  windowPane(ctx, x + 101, y + 37)
  box(ctx, x + 57, y + 53, 32, 55, '#557d6c', 4)
  box(ctx, x + 61, y + 60, 24, 22, '#acd2b4', 2, '')
  circle(ctx, x + 82, y + 88, 2, GOLD)
  box(ctx, x + 42, y + 14, 65, 22, CREAM, 3, INK, 1.5)
  label(ctx, 'BI LAB', x + 74, y + 25, 10)
  box(ctx, x + 50, y + 106, 46, 7, '#a4aa7f', 2)
  flower(ctx, x - 13, WORLD.ground, '#f2bc6d')
  flower(ctx, x + 157, WORLD.ground, '#e69b7b', 0.8)
}

function cloudTower(ctx: CanvasRenderingContext2D, center: number) {
  const x = center - 120
  const y = WORLD.ground - 145
  box(ctx, x + 6, y + 8, 129, 139, '#507966', 5, '')
  box(ctx, x, y, 128, 145, '#a5ccd0', 5)
  box(ctx, x - 7, y - 5, 142, 17, '#dce9d8', 4)
  for (let floor = 0; floor < 3; floor += 1) {
    const top = y + 24 + floor * 36
    box(ctx, x + 14, top, 100, 24, '#6e9b9d', 4, INK, 1.5)
    box(ctx, x + 23, top + 6, 58, 11, '#d5e5cc', 2, '')
    circle(ctx, x + 100, top + 12, 3, GOLD, INK)
  }
  line(ctx, x + 36, y - 7, x + 36, y - 35)
  cloud(ctx, x + 15, y - 75, 0.84)
  box(ctx, x + 29, y + 130, 73, 18, CREAM, 3, INK, 1.5)
  label(ctx, 'CLOUD', x + 66, y + 139, 9)
  box(ctx, x + 136, WORLD.ground - 36, 28, 36, '#ecc65e', 3)
  box(ctx, x + 142, WORLD.ground - 42, 15, 6, '#f9dc88', 2)
}

function observatory(ctx: CanvasRenderingContext2D, center: number) {
  const x = center - 126
  const y = WORLD.ground - 93
  box(ctx, x, y, 150, 93, '#ded0df', 4)
  ctx.beginPath()
  ctx.arc(x + 75, y, 82, Math.PI, 0)
  ctx.closePath()
  ctx.fillStyle = '#bbafcf'
  ctx.fill()
  ctx.strokeStyle = INK
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(x + 75, y, 34, 81, 0, Math.PI, 0)
  ctx.stroke()
  line(ctx, x - 3, y - 25, x + 153, y - 25, '#776e90', 1.2)
  box(ctx, x - 9, y - 5, 168, 13, '#f0d89a', 4)
  box(ctx, x + 42, y + 25, 67, 45, '#48645d', 5)
  for (let index = 0; index < 3; index += 1) {
    const pointX = x + 57 + index * 20
    const pointY = y + 47 - index % 2 * 10
    if (index < 2) line(ctx, pointX, pointY, pointX + 20, y + 47 - (index + 1) % 2 * 10, '#abc3a5')
    box(ctx, pointX - 5, pointY - 5, 10, 10, index % 2 ? '#eeae8a' : '#e9c86b', 2, '#dae4cb', 1)
  }
  line(ctx, x + 75, y - 81, x + 92, y - 110)
  circle(ctx, x + 95, y - 115, 8, '#efbf51', INK)
  circle(ctx, x + 95, y - 115, 19, '#ffffff00', '#6e82716b')
  box(ctx, x + 36, y + 76, 79, 19, CREAM, 3, INK, 1.5)
  label(ctx, 'IDEA LAB', x + 75, y + 86, 9)
}

function greenhouse(ctx: CanvasRenderingContext2D, center: number) {
  const x = center - 136
  const y = WORLD.ground - 108
  box(ctx, x, y, 167, 108, '#b9d7b8', 3)
  polygon(ctx, [[x - 9, y], [x + 84, y - 58], [x + 177, y]], '#99bc94')
  polygon(ctx, [[x + 13, y - 6], [x + 84, y - 47], [x + 152, y - 6]], '#dce6bd', INK, 1.5)
  line(ctx, x + 84, y - 46, x + 84, y - 6, INK, 1.5)
  for (let column = 1; column < 4; column += 1) {
    line(ctx, x + column * 42, y + 1, x + column * 42, WORLD.ground, '#5f886d', 2)
  }
  line(ctx, x + 1, y + 43, x + 166, y + 43, '#5f886d', 2)
  for (let plant = 0; plant < 4; plant += 1) {
    box(ctx, x + 13 + plant * 41, WORLD.ground - 22, 20, 21, '#d69c73', 2, INK, 1.5)
    flower(ctx, x + 23 + plant * 41, WORLD.ground - 23, plant % 2 ? '#efc356' : '#e7aa88', 0.8)
  }
  circle(ctx, x + 84, y + 18, 22, '#f6dd94', INK)
  ctx.beginPath()
  ctx.moveTo(x + 84, y + 30)
  ctx.bezierCurveTo(x + 58, y + 14, x + 78, y, x + 84, y + 13)
  ctx.bezierCurveTo(x + 92, y, x + 110, y + 14, x + 84, y + 30)
  ctx.fillStyle = '#cf8262'
  ctx.fill()
  box(ctx, x + 52, WORLD.ground - 15, 63, 20, CREAM, 3, INK, 1.5)
  label(ctx, 'CARE', x + 84, WORLD.ground - 5, 10)
}

function checkpointMarker(ctx: CanvasRenderingContext2D, index: number, state: GameState) {
  const checkpoint = CHECKPOINTS[index]
  const found = state.discovered.includes(checkpoint.id)
  const x = checkpoint.x
  const y = 113
  box(ctx, x - 140 + 3, y + 4, 185, 31, '#294d3b1f', 5, '')
  box(ctx, x - 140, y, 185, 31, CREAM, 5, INK, 1.5)
  box(ctx, x - 134, y + 5, 23, 21, found ? '#7faa71' : checkpoint.color, 3, INK, 1)
  if (found) {
    line(ctx, x - 128, y + 16, x - 124, y + 20, CREAM, 2)
    line(ctx, x - 124, y + 20, x - 117, y + 11, CREAM, 2)
  } else {
    label(ctx, `0${index + 1}`, x - 122, y + 15, 9)
  }
  label(ctx, checkpoint.short.toUpperCase(), x - 36, y + 16, 8)
  line(ctx, x + 40, WORLD.ground, x + 40, WORLD.ground - 64, INK, 3)
  circle(ctx, x + 40, WORLD.ground - 66, 4, GOLD, INK)
  polygon(ctx, [[x + 42, WORLD.ground - 61], [x + 80, WORLD.ground - 61], [x + 68, WORLD.ground - 46], [x + 80, WORLD.ground - 32], [x + 42, WORLD.ground - 32]], found ? '#82ac70' : checkpoint.color, INK, 1.5)
  if (found) {
    line(ctx, x + 49, WORLD.ground - 46, x + 53, WORLD.ground - 42, CREAM)
    line(ctx, x + 53, WORLD.ground - 42, x + 62, WORLD.ground - 53, CREAM)
  } else {
    label(ctx, `${index + 1}`, x + 55, WORLD.ground - 47, 12)
  }
}

function ground(ctx: CanvasRenderingContext2D, camera: number, width: number) {
  ctx.fillStyle = '#b9bc8d'
  ctx.fillRect(camera, WORLD.ground + 6, width, WORLD.height - WORLD.ground)
  for (let row = 0; row < 3; row += 1) {
    const y = WORLD.ground + 17 + row * 30
    const offset = row % 2 * 43
    for (let column = Math.floor(camera / 86) - 1; column < (camera + width) / 86 + 1; column += 1) {
      const x = column * 86 + offset
      box(ctx, x, y, 86, 30, (row + column) % 3 === 0 ? '#c9c799' : '#c0c292', 2, '#8a9d74', 1)
      box(ctx, x + 34, y + 9, 17, 7, '#d4d2a8', 3, '#9fab812e', 1)
    }
  }
  box(ctx, Math.max(0, camera - 5), WORLD.ground, Math.min(width + 10, WORLD.width), 17, '#87ad64', 1, INK, 2)
  line(ctx, camera, WORLD.ground + 6, camera + width, WORLD.ground + 6, '#b5ce80', 3)
  for (let x = Math.floor(camera / 38) * 38; x < camera + width; x += 38) {
    box(ctx, x + 12, WORLD.ground - 5, 17, 5, '#b2cd7e', 2, INK, 1.2)
  }
}

function token(ctx: CanvasRenderingContext2D, x: number, y: number, time: number, id: number) {
  const bob = Math.sin(time * 2.4 + id * 1.7) * 3
  ctx.save()
  ctx.translate(x, y + bob)
  circle(ctx, 0, 0, 21, '#f8d16b28')
  circle(ctx, 0, 0, 15, '#ffe1a13b')
  polygon(ctx, [[0, -12], [10, -5], [10, 6], [0, 13], [-10, 6], [-10, -5]], GOLD, INK, 1.8)
  polygon(ctx, [[0, -9], [7, -4], [0, 1], [-7, -4]], '#ffe7a5', '', 0)
  line(ctx, 0, 1, 0, 9, '#c18c32', 1.5)
  line(ctx, -4, 0, 4, 0, CREAM, 2)
  line(ctx, 0, -4, 0, 4, CREAM, 2)
  line(ctx, 16, -15, 16, -9, '#fffdeb', 1.5)
  line(ctx, 13, -12, 19, -12, '#fffdeb', 1.5)
  ctx.restore()
}

function explorer(ctx: CanvasRenderingContext2D, state: GameState) {
  const { player } = state
  const walking = player.grounded && Math.abs(player.vx) > 10
  const stride = walking ? Math.sin(player.x * 0.16) * 3 : 0
  ctx.save()
  ctx.translate(player.x + PHYSICS.playerWidth / 2, player.y + PHYSICS.playerHeight)
  ctx.fillStyle = '#294d3b25'
  ctx.beginPath()
  ctx.ellipse(0, 1, player.grounded ? 22 : 13, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.scale(player.facing, 1)
  box(ctx, -21, -31, 12, 21, '#df956c', 3, INK, 1.7)
  box(ctx, -14, -12 + stride, 11, 9 - Math.min(0, stride), '#567966', 3, INK, 1.7)
  box(ctx, 3, -12 - stride, 11, 9 + Math.max(0, stride), '#567966', 3, INK, 1.7)
  box(ctx, -12, -33, 26, 24, '#91b27b', 5, INK, 2)
  box(ctx, -4, -28, 10, 10, '#f1c763', 2, INK, 1)
  line(ctx, 1, -26, 1, -21, INK, 1)
  line(ctx, -1, -23, 3, -23, INK, 1)
  box(ctx, 13, -29 + stride * 0.5, 7, 16, '#eed098', 3, INK, 1.5)
  box(ctx, -16, -52, 35, 25, '#f5dd9e', 6, INK, 2)
  box(ctx, -11, -45, 26, 12, '#2d554e', 4, INK, 1)
  box(ctx, -5, -42, 3, 5, '#fbf6d9', 1, '')
  box(ctx, 7, -42, 3, 5, '#fbf6d9', 1, '')
  circle(ctx, -12, -33, 2, '#d79367')
  line(ctx, 0, -53, 0, -59, INK, 2)
  circle(ctx, 0, -61, 3, GOLD, INK)
  ctx.restore()

  if (state.phase === 'ready') {
    box(ctx, player.x + 43, player.y - 48, 98, 30, CREAM, 7, INK, 1.5)
    polygon(ctx, [[player.x + 46, player.y - 20], [player.x + 42, player.y - 10], [player.x + 61, player.y - 19]], CREAM, INK, 1.5)
    line(ctx, player.x + 47, player.y - 19, player.x + 59, player.y - 19, CREAM, 2)
    label(ctx, "HI, I'M PIP!", player.x + 92, player.y - 33, 8)
  }
}

function finishFlag(ctx: CanvasRenderingContext2D, state: GameState, time: number) {
  const x = WORLD.finish
  line(ctx, x, WORLD.ground, x, WORLD.ground - 195, INK, 5)
  circle(ctx, x, WORLD.ground - 200, 7, GOLD, INK)
  const wave = Math.sin(time * 2) * 3
  polygon(ctx, [[x + 2, 149], [x + 93, 158 + wave], [x + 77, 184 + wave], [x + 93, 212 + wave], [x + 2, 203]], state.phase === 'complete' ? '#a1c77c' : GOLD)
  for (let row = 0; row < 2; row += 1) {
    for (let column = 0; column < 2; column += 1) {
      box(ctx, x + 18 + column * 20, 163 + row * 18, 13, 12, (row + column) % 2 ? CREAM : INK, 2, '')
    }
  }
  box(ctx, x - 24, WORLD.ground - 9, 47, 10, '#749561', 3)
  box(ctx, x - 117, 221, 101, 43, CREAM, 5)
  label(ctx, "LET'S BUILD", x - 66, 237, 8)
  label(ctx, 'WHAT’S NEXT.', x - 66, 251, 8)
  line(ctx, x - 63, 265, x - 63, WORLD.ground, INK, 3)
  flower(ctx, x + 37, WORLD.ground, '#dfa88b', 1.2)
}

export function renderWorld(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  viewportWidth: number,
  decorativeMotion: boolean,
) {
  ctx.clearRect(0, 0, viewportWidth, WORLD.height)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  const time = decorativeMotion ? state.elapsed : 0
  backdrop(ctx, state, viewportWidth, time)

  ctx.save()
  ctx.translate(-state.camera, 0)
  const visible = (x: number, padding = 180) => x > state.camera - padding && x < state.camera + viewportWidth + padding

  for (const [index, x] of [34, 337, 948, 1192, 1918, 2189, 2895, 3180, 3863, 4190].entries()) {
    if (visible(x)) tree(ctx, x, WORLD.ground, index % 3 === 0 ? 0.86 : 0.66, index % 3 !== 0)
  }
  const buildings = [workshop, cloudTower, observatory, greenhouse]
  CHECKPOINTS.forEach((checkpoint, index) => {
    if (visible(checkpoint.x, 230)) {
      buildings[index](ctx, checkpoint.x)
      checkpointMarker(ctx, index, state)
    }
  })
  for (let index = 0; index < 32; index += 1) {
    const x = index * 131 + 43
    if (visible(x, 20)) {
      if (index % 3 === 0) {
        flower(ctx, x, WORLD.ground, index % 2 ? '#f4ce70' : '#e6a486', 0.62)
      } else {
        line(ctx, x, WORLD.ground, x - 4, WORLD.ground - 10, '#709360', 2)
        line(ctx, x, WORLD.ground, x + 5, WORLD.ground - 8, '#709360', 2)
      }
    }
  }
  if (visible(WORLD.finish)) finishFlag(ctx, state, time)
  ground(ctx, state.camera, viewportWidth)
  PLATFORMS.forEach((platform) => {
    if (visible(platform.x)) brick(ctx, platform)
  })
  TOKENS.forEach((item) => {
    if (!state.collected.includes(item.id) && visible(item.x, 30)) token(ctx, item.x, item.y, time, item.id)
  })
  explorer(ctx, state)
  for (const sparkle of state.sparkles) {
    const age = state.elapsed - sparkle.born
    ctx.save()
    ctx.globalAlpha = Math.max(0, 1 - age / 0.65)
    const distance = decorativeMotion ? age * 42 : 12
    if (decorativeMotion) {
      for (let particle = 0; particle < 6; particle += 1) {
        const angle = particle * Math.PI / 3
        box(ctx, sparkle.x + Math.cos(angle) * distance - 2, sparkle.y + Math.sin(angle) * distance - 2, 4, 4, particle % 2 ? GOLD : CREAM, 1, '')
      }
    }
    label(ctx, '+1', sparkle.x, sparkle.y - 18 - distance, 12)
    ctx.restore()
  }
  ctx.restore()
}
