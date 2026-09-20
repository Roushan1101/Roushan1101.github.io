import { useEffect, useRef, useState } from 'react'
import { useMotion } from '../../hooks/useMotion'

export type CoreMode = 'data' | 'cloud' | 'ai'
type Point = { x: number; y: number; z: number }
type Vertex = { position: Point; normal: Point }

function rotate(point: Point, pitch: number, yaw: number): Point {
  const y = point.y * Math.cos(pitch) - point.z * Math.sin(pitch)
  const z = point.y * Math.sin(pitch) + point.z * Math.cos(pitch)
  return {
    x: point.x * Math.cos(yaw) + z * Math.sin(yaw),
    y,
    z: -point.x * Math.sin(yaw) + z * Math.cos(yaw),
  }
}

function makeMesh(mode: CoreMode): Vertex[][] {
  const faces: Vertex[][] = []
  const segments = 52
  const rings = 22

  function vertex(u: number, v: number): Vertex {
    if (mode === 'cloud') {
      const normal = { x: Math.cos(u) * Math.sin(v / 2), y: Math.cos(v / 2), z: Math.sin(u) * Math.sin(v / 2) }
      return { normal, position: { x: normal.x * 1.23, y: normal.y * 1.23, z: normal.z * 1.23 } }
    }
    const major = mode === 'ai' ? 0.79 : 0.95
    const minor = mode === 'ai' ? 0.47 + Math.sin(u * 3) * 0.06 : 0.38
    return {
      position: {
        x: (major + minor * Math.cos(v)) * Math.cos(u),
        y: (major + minor * Math.cos(v)) * Math.sin(u),
        z: minor * Math.sin(v),
      },
      normal: { x: Math.cos(v) * Math.cos(u), y: Math.cos(v) * Math.sin(u), z: Math.sin(v) },
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < rings; j++) {
      const u = (i / segments) * Math.PI * 2
      const nextU = ((i + 1) / segments) * Math.PI * 2
      const v = (j / rings) * Math.PI * 2
      const nextV = ((j + 1) / rings) * Math.PI * 2
      faces.push([vertex(u, v), vertex(nextU, v), vertex(nextU, nextV), vertex(u, nextV)])
    }
  }
  return faces
}

export default function DataCore({ mode }: { mode: CoreMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [unavailable, setUnavailable] = useState(false)
  const { enabled } = useMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) {
      console.error('The data-core illustration could not obtain a 2D canvas context.')
      setUnavailable(true)
      return
    }

    const mesh = makeMesh(mode)
    const palette = mode === 'ai' ? [197, 162, 255] : mode === 'cloud' ? [136, 224, 232] : [197, 255, 120]
    let width = 1
    let height = 1
    let frame = 0
    let disposed = false
    let inView = true
    let pointerX = 0
    let pointerY = 0
    let easedX = 0
    let easedY = 0

    function draw(now: number) {
      if (!context) return
      const time = enabled ? now / 1000 : 0
      easedX += (pointerX - easedX) * 0.04
      easedY += (pointerY - easedY) * 0.04
      const pitch = 0.43 + easedY * 0.3 + Math.sin(time * 0.27) * 0.06
      const yaw = -0.45 + easedX * 0.3 + Math.sin(time * 0.22) * 0.15
      const scale = Math.min(width, height) * 0.292
      const centerX = width / 2
      const centerY = height / 2
      context.clearRect(0, 0, width, height)

      const glow = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, scale * 2)
      glow.addColorStop(0, `rgba(${palette.join(',')},.07)`)
      glow.addColorStop(0.6, `rgba(${palette.join(',')},.025)`)
      glow.addColorStop(1, `rgba(${palette.join(',')},0)`)
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      function project(point: Point) {
        const perspective = 4.6 / (4.6 - point.z)
        return { x: centerX + point.x * scale * perspective, y: centerY + point.y * scale * perspective }
      }

      context.strokeStyle = `rgba(${palette.join(',')},.14)`
      context.lineWidth = 0.7
      context.setLineDash([2, 6])
      context.beginPath()
      context.ellipse(centerX, centerY, scale * 1.65, scale * 1.65, 0, 0, Math.PI * 2)
      context.stroke()
      context.setLineDash([])
      context.beginPath()
      context.moveTo(centerX - scale * 1.86, centerY)
      context.lineTo(centerX + scale * 1.86, centerY)
      context.moveTo(centerX, centerY - scale * 1.82)
      context.lineTo(centerX, centerY + scale * 1.82)
      context.strokeStyle = `rgba(${palette.join(',')},.05)`
      context.stroke()

      const transformed = mesh.map((face) => {
        const points = face.map((item) => rotate(item.position, pitch, yaw))
        return {
          points,
          normal: rotate(face[0].normal, pitch, yaw),
          depth: points.reduce((sum, point) => sum + point.z, 0) / points.length,
        }
      }).sort((a, b) => a.depth - b.depth)

      for (const face of transformed) {
        const light = Math.max(0, -face.normal.x * 0.48 - face.normal.y * 0.55 + face.normal.z * 0.67)
        const shine = Math.pow(light, 10) * 0.53
        const lighting = 0.06 + light * 0.3 + shine
        const tint = palette.map((channel) => Math.round(7 + channel * lighting))
        context.beginPath()
        face.points.forEach((point, index) => {
          const projected = project(point)
          if (index === 0) context.moveTo(projected.x, projected.y)
          else context.lineTo(projected.x, projected.y)
        })
        context.closePath()
        context.fillStyle = `rgb(${tint.join(',')})`
        context.fill()
        context.strokeStyle = `rgba(${palette.join(',')},${0.055 + light * 0.2})`
        context.lineWidth = 0.5
        context.stroke()
      }

      for (let index = 0; index < 64; index++) {
        const angle = index * 2.39996 + time * 0.012
        const radius = scale * (1.53 + ((index * 13) % 31) / 55)
        const x = centerX + Math.cos(angle) * radius
        const y = centerY + Math.sin(angle) * radius * 0.9
        const brightness = 0.12 + (Math.sin(index + time * 0.7) + 1) * 0.15
        context.fillStyle = `rgba(${palette.join(',')},${brightness})`
        context.fillRect(x, y, index % 9 === 0 ? 3 : 1.4, index % 9 === 0 ? 3 : 1.4)
      }

      const satelliteAngle = -time * 0.13 - 0.6
      const x = centerX + Math.cos(satelliteAngle) * scale * 1.65
      const y = centerY + Math.sin(satelliteAngle) * scale * 1.65
      context.beginPath()
      context.arc(x, y, 4, 0, Math.PI * 2)
      context.fillStyle = `rgb(${palette.join(',')})`
      context.shadowColor = `rgb(${palette.join(',')})`
      context.shadowBlur = 18
      context.fill()
      context.shadowBlur = 0
      context.beginPath()
      context.arc(x, y, 11, 0, Math.PI * 2)
      context.strokeStyle = `rgba(${palette.join(',')},.35)`
      context.stroke()
    }

    function tick(now: number) {
      frame = 0
      if (disposed || !inView || document.hidden) return
      draw(now)
      if (enabled) frame = requestAnimationFrame(tick)
    }

    function resume() {
      if (!frame && !disposed && inView && !document.hidden) frame = requestAnimationFrame(tick)
    }

    function resize() {
      if (!canvas || !context) return
      const bounds = canvas.getBoundingClientRect()
      width = Math.max(1, bounds.width)
      height = Math.max(1, bounds.height)
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      draw(performance.now())
    }

    function move(event: PointerEvent) {
      if (!enabled || !canvas) return
      const bounds = canvas.getBoundingClientRect()
      pointerX = (event.clientX - bounds.left) / bounds.width - 0.5
      pointerY = (event.clientY - bounds.top) / bounds.height - 0.5
    }

    function leave() { pointerX = 0; pointerY = 0 }
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      if (inView) resume()
      else { cancelAnimationFrame(frame); frame = 0 }
    })
    visibilityObserver.observe(canvas)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerleave', leave)
    document.addEventListener('visibilitychange', resume)
    resize()
    resume()
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      visibilityObserver.disconnect()
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerleave', leave)
      document.removeEventListener('visibilitychange', resume)
    }
  }, [enabled, mode])

  return (
    <div className={`data-core data-core--${mode}`}>
      <canvas ref={canvasRef} aria-label={`Original ${mode} core illustration, an interactive three-dimensional ${mode === 'cloud' ? 'sphere' : 'torus'}`} role="img" />
      {unavailable && <p className="core-unavailable" role="status">The 3D illustration is unavailable in this browser. All portfolio content is still accessible.</p>}
    </div>
  )
}
