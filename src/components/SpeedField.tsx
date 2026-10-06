'use client'

import { useEffect, useRef } from 'react'

/** How many streaks are in flight at once. */
const COUNT = 90

type Streak = {
  /** Position along the tunnel: 0 at the vanishing point, 1 at the viewer. */
  z: number
  /** Angle out of the vanishing point, in radians. */
  a: number
  speed: number
  hue: 'red' | 'ink' | 'white'
  len: number
}

/**
 * The hero's speed tunnel, drawn live.
 *
 * Streaks are spawned at a vanishing point off to the right and accelerate
 * outward along fixed bearings. Because everything is drawn from one origin,
 * the field reads as a road rushing past rather than as drifting noise: a
 * streak's length and width scale with its distance travelled, so the whole
 * thing gathers speed towards the edges of the frame.
 *
 * The loop pauses while the hero is off screen, and under reduced motion a
 * single frame is drawn and left still.
 */
export function SpeedField() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let visible = true
    let last = 0

    const spawn = (): Streak => ({
      // Start spread through the tunnel so the field is full on the first frame.
      z: Math.random(),
      a: Math.random() * Math.PI * 2,
      speed: 0.0022 + Math.random() * 0.0075,
      hue: Math.random() < 0.26 ? 'red' : Math.random() < 0.55 ? 'ink' : 'white',
      len: 0.05 + Math.random() * 0.16,
    })

    const streaks: Streak[] = Array.from({ length: COUNT }, spawn)

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      // The vanishing point sits right-of-centre, behind where the horse rears.
      const ox = w * 0.74
      const oy = h * 0.46
      // The frame's own radius, so streaks always reach past the corners.
      const reach = Math.hypot(Math.max(ox, w - ox), Math.max(oy, h - oy)) * 1.15

      ctx.lineCap = 'round'
      for (const s of streaks) {
        // Ease the travel so motion is slow at the centre and rips at the edge.
        const t = s.z * s.z
        const r0 = t * reach
        const r1 = Math.min(reach, (t + s.len * s.z) * reach)
        const cos = Math.cos(s.a)
        const sin = Math.sin(s.a)

        // Fade in off the vanishing point, fade out at the frame edge.
        const alpha = Math.min(1, s.z * 3) * (1 - s.z * s.z * 0.85)
        if (alpha <= 0.01) continue

        ctx.globalAlpha =
          alpha * (s.hue === 'red' ? 0.6 : s.hue === 'white' ? 0.5 : 0.26)
        ctx.strokeStyle =
          s.hue === 'red' ? '#e4002b' : s.hue === 'white' ? '#fff6c8' : '#140c00'
        ctx.lineWidth = 0.6 + t * 3.4

        ctx.beginPath()
        ctx.moveTo(ox + cos * r0, oy + sin * r0)
        ctx.lineTo(ox + cos * r1, oy + sin * r1)
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    const step = () => {
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i]
        if (!s) continue
        s.z += s.speed
        if (s.z >= 1) {
          // Recycle rather than allocate; the field keeps a constant count.
          const next = spawn()
          next.z = 0
          streaks[i] = next
        }
      }
    }

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      // ~40fps: smooth enough for streaks this long, and far cheaper than 60.
      if (!visible || now - last < 25) return
      last = now
      step()
      draw()
    }

    resize()
    draw()
    if (!reduced) raf = requestAnimationFrame(loop)

    const ro = new ResizeObserver(() => {
      resize()
      draw()
    })
    ro.observe(canvas)
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting
    })
    io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
    }
  }, [])

  return <canvas ref={ref} aria-hidden />
}
