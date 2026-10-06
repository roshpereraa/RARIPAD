'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Scroll reveal.
 *
 * The child is parked low and transparent by `.reveal` and travels in the
 * first time it crosses into view; it is never hidden again, so scrolling back
 * up does not re-animate a section the reader has already passed. Browsers
 * without IntersectionObserver — and readers with JS off, via the `<noscript>`
 * rule in the layout — get the content shown outright.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  /** Stagger, in ms, for items revealed as a row. */
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'span'
}) {
  const ref = useRef<HTMLElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setShown(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      // Fire a little before the edge, so the travel finishes as it lands.
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag
      ref={ref as never}
      className={`reveal ${className}`}
      data-shown={shown ? 'true' : 'false'}
      style={{ ['--reveal-delay' as string]: `${delay}ms` }}
    >
      {children}
    </Tag>
  )
}

/**
 * The scroll tachometer: a red needle across the top of the viewport that
 * tracks how far down the document the reader is.
 *
 * Written straight to a CSS custom property inside a rAF, so scrolling never
 * queues a React render.
 */
export function ScrollTach() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0

    const read = () => {
      raf = 0
      const doc = document.documentElement
      const span = doc.scrollHeight - doc.clientHeight
      const p = span > 0 ? Math.min(1, Math.max(0, doc.scrollTop / span)) : 0
      el.style.setProperty('--tach', String(p))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }

    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return <div ref={ref} className="tach" aria-hidden />
}

/**
 * A figure that spins up to its value the first time it is seen, like a
 * needle sweeping its dial. Re-runs whenever the value itself changes, so a
 * live chain read animates from the old number to the new one.
 */
export function Odometer({
  value,
  pad = 2,
  duration = 900,
}: {
  value: number | undefined
  /** Minimum digits, zero-filled — "07" reads as a dial, "7" as a note. */
  pad?: number
  duration?: number
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [seen, setSeen] = useState(false)
  const [shown, setShown] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }
    const io = new IntersectionObserver(([e]) => {
      if (e?.isIntersecting) {
        setSeen(true)
        io.disconnect()
      }
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!seen || value === undefined) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const start = from.current
    const delta = value - start
    if (reduced || delta === 0) {
      from.current = value
      setShown(value)
      return
    }
    const t0 = performance.now()
    let raf = requestAnimationFrame(function tick(now) {
      const p = Math.min(1, (now - t0) / duration)
      // Ease out cubic: quick off the line, settling onto the figure.
      const e = 1 - (1 - p) ** 3
      setShown(Math.round(start + delta * e))
      if (p < 1) raf = requestAnimationFrame(tick)
      else from.current = value
    })
    return () => cancelAnimationFrame(raf)
  }, [seen, value, duration])

  return (
    <span ref={ref}>
      {value === undefined ? '—' : String(shown).padStart(pad, '0')}
    </span>
  )
}
