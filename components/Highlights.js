'use client'
import { useEffect, useRef, useState } from 'react'
import { sportOf } from '../lib/data'
import { dayLabel } from '../lib/format'
import { AdBanner } from './Ads'
import Icon from './Icon'
import { TeamLogo } from './MatchCard'

const mmss = (s) => (s ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}` : '')

function HighlightPlayer({ match, onClose }) {
  const [i, setI] = useState(0)
  const ref = useRef(null)
  const clip = match.clips[i]

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [onClose])

  return (
    <div className="hl-wrap" onClick={onClose}>
      <div className="hl-modal" onClick={(e) => e.stopPropagation()}>
        <div className="hl-head">
          <div className="hl-title">
            <b>{match.team1 ? `${match.team1.name} ${match.team1.score} - ${match.team2.score} ${match.team2.name}` : match.title}</b>
            <span>{match.league} · {dayLabel(match.start)}</span>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="x" /></button>
        </div>
        <div className="hl-body">
          <div className="hl-video">
            <video
              ref={ref}
              key={clip.id}
              src={clip.src}
              poster={clip.thumb || undefined}
              controls
              autoPlay
              playsInline
              onEnded={() => i < match.clips.length - 1 && setI(i + 1)}
            />
            <div className="hl-now">{i + 1}/{match.clips.length} · {clip.title}</div>
          </div>
          <div className="hl-list">
            {match.clips.map((c, k) => (
              <button key={c.id} className={`hl-clip ${k === i ? 'on' : ''}`} onClick={() => setI(k)}>
                <span className="hl-thumb">
                  {c.thumb ? <img src={c.thumb} alt="" loading="lazy" /> : <Icon name="playBox" />}
                  {c.duration > 0 && <em>{mmss(c.duration)}</em>}
                  {k === i && <span className="hl-playing"><Icon name="play" size={14} fill /></span>}
                </span>
                <span className="hl-clip-title">{c.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function HighlightCard({ m, onOpen }) {
  const sport = sportOf(m.sport)
  const cover = m.clips[0]?.thumb
  return (
    <button className="hcard" onClick={onOpen}>
      <div className="hcard-cover">
        {cover ? <img src={cover} alt="" loading="lazy" /> : <span className="hcard-ph">{sport.icon}</span>}
        <span className="hcard-play"><Icon name="play" size={22} fill /></span>
        <span className="hcard-count"><Icon name="playBox" size={14} />{m.clips.length} clip{m.clips.length > 1 ? 's' : ''}</span>
      </div>
      <div className="hcard-info">
        <div className="hcard-league">
          {m.leagueLogo ? <img src={m.leagueLogo} alt="" /> : <span>{sport.icon}</span>}
          <span>{m.league}</span>
          <em>{dayLabel(m.start)}</em>
        </div>
        {m.team1 ? (
          <div className="hcard-teams">
            <TeamLogo team={m.team1} size={34} />
            <span className="hcard-name">{m.team1.name}</span>
            <b className="hcard-score">{m.team1.score} - {m.team2.score}</b>
            <span className="hcard-name">{m.team2.name}</span>
            <TeamLogo team={m.team2} size={34} />
          </div>
        ) : (
          <div className="hcard-teams"><span className="hcard-name">{m.title}</span></div>
        )}
      </div>
    </button>
  )
}

export default function Highlights({ sport, onGoPro }) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(false)
  const [open, setOpen] = useState(null)

  useEffect(() => {
    let alive = true
    fetch('/api/highlights', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => alive && setData(d.highlights || []))
      .catch(() => alive && setError(true))
    return () => { alive = false }
  }, [])

  const list = (data || []).filter((m) => sport === 'all' || m.sport === sport)

  return (
    <>
      <p className="section-note">Highlights from the last 3 days — they play right here. Older ones are removed automatically.</p>
      {!data && !error ? (
        <div className="hgrid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="hcard skeleton" />)}</div>
      ) : error ? (
        <div className="empty"><Icon name="signal" size={36} /><b>Couldn&apos;t load highlights</b></div>
      ) : list.length === 0 ? (
        <div className="empty"><Icon name="playBox" size={36} /><b>No highlights yet</b><span>New clips appear here after matches finish.</span></div>
      ) : (
        <div className="hgrid">
          {list.flatMap((m, i) => {
            const card = <HighlightCard key={m.id} m={m} onOpen={() => setOpen(m)} />
            return i % 8 === 7 ? [card, <AdBanner key={`ad-${i}`} index={Math.floor(i / 8) + 1} onGoPro={onGoPro} />] : [card]
          })}
        </div>
      )}
      {open && <HighlightPlayer match={open} onClose={() => setOpen(null)} />}
    </>
  )
}
