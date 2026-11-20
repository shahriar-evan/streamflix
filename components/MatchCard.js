'use client'
import { useState } from 'react'
import { sportOf } from '../lib/data'
import { colorFor, formatDate, formatTime, initials, matchPath } from '../lib/format'
import Icon from './Icon'

export function TeamLogo({ team, size = 52 }) {
  const [broken, setBroken] = useState(false)
  if (!team?.logo || broken) {
    return (
      <span className="tlogo tlogo-fallback" style={{ width: size, height: size, background: colorFor(team?.name) }}>
        {initials(team?.name)}
      </span>
    )
  }
  return (
    <span className="tlogo" style={{ width: size, height: size }}>
      <img src={team.logo} alt="" loading="lazy" onError={() => setBroken(true)} />
    </span>
  )
}

export function Avatar({ name, size = 44 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: colorFor(name) }}>
      {initials(name)}
    </span>
  )
}

export function StatusBadge({ m }) {
  if (m.status === 'live') {
    return (
      <span className="mstatus">
        {m.detail && m.detail !== 'Live' && <span className="mclock">{m.detail}</span>}
        <span className="live-pill"><i />LIVE</span>
      </span>
    )
  }
  if (m.status === 'finished') {
    return (
      <span className="mstatus">
        <span className="ft-pill">{m.sport === 'cricket' ? 'Result' : 'FT'}</span>
        <span className="mdate" suppressHydrationWarning>{formatDate(m.start)}</span>
      </span>
    )
  }
  return (
    <span className="mstatus">
      <span className="mtime" suppressHydrationWarning>{formatTime(m.start)}</span>
      <span className="mdate" suppressHydrationWarning>{formatDate(m.start)}</span>
    </span>
  )
}

const hasScore = (m) => m.status !== 'upcoming' && m.team1?.score !== '' && m.team2?.score !== ''

export default function MatchCard({ m, onClick, action, compact }) {
  const sport = sportOf(m.sport)
  const longScores = m.sport === 'cricket'
  return (
    <a
      href={matchPath(m)}
      className={`mcard ${m.status === 'live' ? 'is-live' : ''} ${compact ? 'compact' : ''}`}
      onClick={(e) => {
        if (!onClick || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return // allow "open in new tab"
        e.preventDefault()
        onClick()
      }}
    >
      <div className="mcard-top">
        <span className="mleague">
          {m.leagueLogo ? <img src={m.leagueLogo} alt="" /> : <span className="mleague-ico">{sport.icon}</span>}
          <span className="mleague-name">{sport.label} <em>‖</em> {m.league}</span>
        </span>
        <StatusBadge m={m} />
      </div>

      {m.team1 ? (
        <div className="mteams">
          <TeamLogo team={m.team1} size={compact ? 36 : 52} />
          <span className="tname">
            {m.team1.name}
            {longScores && hasScore(m) && <small>{m.team1.score}</small>}
          </span>
          <span className="vs">
            {hasScore(m) && !longScores ? `${m.team1.score} - ${m.team2.score}` : 'VS'}
          </span>
          <span className="tname">
            {m.team2.name}
            {longScores && hasScore(m) && <small>{m.team2.score}</small>}
          </span>
          <TeamLogo team={m.team2} size={compact ? 36 : 52} />
        </div>
      ) : (
        <div className="mtitle">
          <span className="mtitle-ico">{sport.icon}</span>
          <span>{m.title}</span>
        </div>
      )}

      {((m.note && !compact) || action) && (
        <div className="mfoot">
          {m.note && <span className="mnote">{m.note}</span>}
          {action && <span className="maction"><Icon name="playBox" size={16} />{action}</span>}
        </div>
      )}
    </a>
  )
}
