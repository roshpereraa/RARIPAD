/**
 * The asphalt seam: a dark band with a sliding centre line and a field of cars
 * crossing it on their own laps.
 *
 * Purely decorative, and entirely CSS — no canvas, no JS, no state — so it
 * costs nothing on a page that is already doing live chain reads. `.asphalt`
 * animates the road markings and `.car` runs each lap; both stop dead under
 * prefers-reduced-motion, where the cars simply park mid-band.
 */

/** Side profile, nose to the right: the direction the laps run. */
const REAR_WING = 'M30 18 H40 V34 H32 V26 H30 Z M30 20 H68 V26 H54 L54 46 H45 L45 26 H30 Z'
const BODY =
  'M36 58 L36 46 C36 42 41 40 50 39 L90 37 ' +
  'C95 28 106 24 119 24 C131 24 139 28 143 36 ' +
  'L188 40 C214 43 234 48 250 54 L250 58 Z'
const SIDEPOD = 'M98 58 L106 40 L148 42 L156 58 Z'
const HALO =
  'M100 37 C103 27 110 23 120 23 C131 23 138 28 141 37 L134 37 C131 31 126 29 120 29 C113 29 108 31 105 37 Z'
const FRONT_WING = 'M234 51 H256 V57 H234 Z M250 45 H256 V57 H250 Z'

function Car({ color, width }: { color: string; width: number }) {
  return (
    <svg width={width} height={(width * 80) / 256} viewBox="0 0 256 80" aria-hidden>
      <g fill={color}>
        <path d={REAR_WING} />
        <path d={BODY} />
        <path d={FRONT_WING} />
      </g>
      {/* Shadowed openings, so the body reads as having depth at a glance. */}
      <path d={SIDEPOD} fill="#0b0b0c" opacity="0.3" />
      <path d={HALO} fill="#0b0b0c" opacity="0.5" />
      <g fill="#0b0b0c">
        <circle cx="64" cy="56" r="17" />
        <circle cx="196" cy="58" r="15" />
      </g>
      <g fill="#45454a">
        <circle cx="64" cy="56" r="7" />
        <circle cx="196" cy="58" r="6" />
      </g>
    </svg>
  )
}

/** The grid: colour, size, lap time and stagger, so no two cars ever pair up. */
const GRID = [
  { color: '#e4002b', width: 150, lap: '6.5s', delay: '0s' },
  { color: '#f7c600', width: 112, lap: '9s', delay: '1.8s' },
  { color: '#0b0b0c', width: 128, lap: '7.8s', delay: '3.6s' },
  { color: '#ff2d4f', width: 96, lap: '11s', delay: '5.2s' },
] as const

export function RaceStrip({ height = 64 }: { height?: number }) {
  return (
    <div
      className="asphalt -mx-4 my-10 border-y border-black/30"
      style={{ height }}
      aria-hidden
    >
      {GRID.map((c) => (
        <span
          key={c.color + c.lap}
          className="car"
          style={{
            ['--lap' as string]: c.lap,
            ['--lap-delay' as string]: c.delay,
          }}
        >
          <Car color={c.color} width={c.width} />
        </span>
      ))}
    </div>
  )
}
