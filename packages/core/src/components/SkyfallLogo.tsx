import { LOGO_PATHS } from './logoPaths'

type SkyfallLogoProps = {
  /** Rendered width in px; height follows the 258:32 aspect ratio. */
  width?: number
  className?: string
}

/** Skyfall AI wordmark. Inherits `color`, so set text colour to recolour it. */
export function SkyfallLogo({ width = 194, className }: SkyfallLogoProps) {
  return (
    <svg
      viewBox="0 0 258 32"
      width={width}
      height={(width * 32) / 258}
      fill="currentColor"
      role="img"
      aria-label="Skyfall AI"
      className={className}
    >
      {LOGO_PATHS.map((d) => (
        <path key={d.slice(0, 16)} d={d} />
      ))}
    </svg>
  )
}
