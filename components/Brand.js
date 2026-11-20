'use client'
import { useId } from 'react'

// LiveSports app mark: navy tile, colour swoosh, football + cricket ball + bat.
export function BrandMark({ size = 40 }) {
  const id = useId().replace(/:/g, '')
  const g = (n) => `${n}-${id}`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="brand-mark-svg">
      <defs>
        <linearGradient id={g('bg')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1d3b9e" />
          <stop offset="1" stopColor="#07103a" />
        </linearGradient>
        <linearGradient id={g('sw')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset=".45" stopColor="#facc15" />
          <stop offset="1" stopColor="#f97316" />
        </linearGradient>
        <radialGradient id={g('red')} cx=".35" cy=".3" r=".8">
          <stop offset="0" stopColor="#ff6b5b" />
          <stop offset="1" stopColor="#b91c1c" />
        </radialGradient>
        <radialGradient id={g('ball')} cx=".35" cy=".3" r=".85">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d4e6" />
        </radialGradient>
        <linearGradient id={g('bat')} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fde68a" />
          <stop offset="1" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      <rect width="100" height="100" rx="24" fill={`url(#${g('bg')})`} />
      <circle cx="30" cy="26" r="30" fill="#3b82f6" opacity=".18" />

      {/* swooshes */}
      <path d="M8 66 C 24 92, 70 94, 94 58" fill="none" stroke={`url(#${g('sw')})`} strokeWidth="7" strokeLinecap="round" />
      <path d="M12 76 C 32 98, 74 96, 92 70" fill="none" stroke="#ffffff" strokeOpacity=".75" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 84 C 38 99, 70 98, 86 82" fill="none" stroke="#22d3ee" strokeOpacity=".7" strokeWidth="1.8" strokeLinecap="round" />

      {/* cricket bat */}
      <g transform="rotate(38 64 40)">
        <rect x="59.5" y="4" width="9" height="20" rx="3" fill="#2563eb" />
        <rect x="60.5" y="7" width="7" height="2" fill="#93c5fd" />
        <rect x="60.5" y="12" width="7" height="2" fill="#93c5fd" />
        <rect x="56" y="22" width="16" height="42" rx="5" fill={`url(#${g('bat')})`} />
        <rect x="62.5" y="26" width="3" height="34" rx="1.5" fill="#fff" opacity=".45" />
      </g>

      {/* football */}
      <circle cx="34" cy="56" r="18" fill={`url(#${g('ball')})`} stroke="#0f172a" strokeWidth="1.5" />
      <path d="M34 48 l7 5 -2.7 8.2 h-8.6 L27 53z" fill="#111827" />
      <path d="M34 48 V39 M41 53 l8-3 M38.3 61.2 l4.5 7 M29.7 61.2 l-4.5 7 M27 53 l-8-3" stroke="#111827" strokeWidth="1.6" />

      {/* cricket ball */}
      <circle cx="55" cy="68" r="11.5" fill={`url(#${g('red')})`} stroke="#7f1d1d" strokeWidth="1" />
      <path d="M46.5 61 C 52 66, 52 71, 47 76" fill="none" stroke="#fff" strokeWidth="1.4" strokeDasharray="2 1.6" />
      <path d="M50 59 C 55.5 64, 55.5 72, 50.5 78" fill="none" stroke="#fff" strokeWidth="1.4" strokeDasharray="2 1.6" />
    </svg>
  )
}

// Wordmark: "Live" + "Sports" with a play button as the "o"
export function Wordmark() {
  return (
    <span className="wordmark">
      <span className="wm-live" aria-hidden="true">Live</span>
      <span className="wm-sports" aria-hidden="true">
        Sp
        <span className="wm-o" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="100%" height="100%"><path d="M9 6.5v11l9-5.5z" fill="#fff" /></svg>
        </span>
        rts
      </span>
      <span className="sr-only">LiveSports</span>
    </span>
  )
}

export function Logo({ size = 'md' }) {
  const px = size === 'lg' ? 64 : size === 'sm' ? 30 : 38
  return (
    <span className={`brand brand-${size}`}>
      <BrandMark size={px} />
      <Wordmark />
    </span>
  )
}
