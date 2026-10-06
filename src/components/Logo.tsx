/**
 * RARIPAD mark — the prancing horse.
 *
 * The horse is traced to a single even-odd path in `public/horse.svg` and
 * painted here as a CSS mask, so the one file renders the mark in any colour:
 * yellow on the carbon nav, carbon on the yellow hero, red where it is the
 * accent. The mane and tail highlights are holes in that path, so whatever is
 * behind the mark shows through them — the same way the badge is cut.
 *
 * The source path is 720x1000, so width tracks height at 0.72.
 */
const RATIO = 0.72

export function Logo({
  size = 30,
  withWordmark = false,
  color,
}: {
  size?: number
  /** Set the mark's colour explicitly; otherwise it inherits the text colour. */
  color?: string
  withWordmark?: boolean
}) {
  const mark = (
    <span
      className="horse shrink-0"
      role="img"
      aria-label="RARIPAD"
      style={{ width: size * RATIO, height: size, color }}
    />
  )

  if (!withWordmark) return mark

  return (
    <span className="flex items-center gap-2.5">
      {mark}
      <span className="flex flex-col leading-none">
        <span
          className="display text-[17px] font-extrabold uppercase"
          style={{ letterSpacing: '-0.01em' }}
        >
          Rari<span className="text-[var(--accent)]">pad</span>
        </span>
        {/* The racing stripe, the width of the word it sits under. */}
        <span className="stripe mt-[3px] h-[2px] w-full rounded-full opacity-80" />
      </span>
    </span>
  )
}
