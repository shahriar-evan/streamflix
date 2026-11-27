'use client'
import { useEffect, useMemo } from 'react'
import { channelsForMatch, sportOf } from '../lib/data'
import { channelStatus, qualityLabel } from '../lib/streams'
import { formatDate, formatTime } from '../lib/format'
import Icon from './Icon'
import MatchCard, { StatusBadge, TeamLogo } from './MatchCard'
import PlayerPanel, { goPro } from './PlayerPanel'
import { AdBanner } from './Ads'
import usePlayer from './usePlayer'
import LiveCentre from './LiveCentre'

export function ChanStatus({ ch }) {
  const st = channelStatus(ch)
  if (st.state === 'ok') return <span className="cstat ok">{qualityLabel(st.height) || 'ON'}</span>
  if (st.state === 'off') return <span className="cstat off">OFF</span>
  return <span className="cstat wait" />
}

export default function WatchView({ match, others, onBack, onOpen, player: external }) {
  const own = usePlayer()
  const player = external || own
  const channels = useMemo(() => channelsForMatch(match), [match])

  useEffect(() => {
    if (channels.length) player.start(channels)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [match.id])

  const sport = sportOf(match.sport)
  const showScore = match.status !== 'upcoming' && match.team1?.score !== ''

  const noStream = (
    <div className="nostream">
      <span className="nostream-ico">📊</span>
      <b>{match.status === 'live' ? 'Live score — updating every 30 seconds' : match.status === 'upcoming' ? 'Match preview' : 'Full-time result'}</b>
      <span>There&apos;s no free live stream for this match. Follow the score here, or watch free sports channels in TV Mode.</span>
    </div>
  )

  return (
    <div className="watch">
      <div className="watch-main">
        <div className="watch-bar">
          <button className="icon-btn" onClick={onBack} aria-label="Back"><Icon name="back" /></button>
          <div className="watch-bar-title">
            <b>{match.team1 ? `${match.team1.name} vs ${match.team2.name}` : match.title}</b>
            <span>{sport.label} · {match.league}</span>
          </div>
        </div>

        {channels.length ? (
          <PlayerPanel player={player} adKey={match.id} allServers />
        ) : match.sport === 'cricket' && match.status !== 'upcoming' ? (
          <LiveCentre match={match} fallback={noStream} />
        ) : (
          noStream
        )}

        <div className="scoreboard">
          <StatusBadge m={match} />
          {match.status !== 'upcoming' && <span className="sb-when" suppressHydrationWarning>Started {formatTime(match.start)} · {formatDate(match.start)}</span>}
          {match.team1 ? (
            <div className="sb-teams">
              <div className="sb-team"><TeamLogo team={match.team1} size={56} /><span>{match.team1.name}</span></div>
              <div className="sb-score">
                {showScore ? (
                  match.sport === 'cricket'
                    ? <span className="sb-cricket"><b>{match.team1.score}</b><b>{match.team2.score}</b></span>
                    : `${match.team1.score} - ${match.team2.score}`
                ) : 'VS'}
              </div>
              <div className="sb-team"><TeamLogo team={match.team2} size={56} /><span>{match.team2.name}</span></div>
            </div>
          ) : (
            <div className="sb-title">{match.title}</div>
          )}
          {match.note && <p className="sb-note">{match.note}</p>}
        </div>

        <AdBanner onGoPro={goPro} index={1} />

        {channels.length > 0 && <section className="block">
          <h3 className="block-title">Free channels <span>{channels.length}</span></h3>
          <p className="block-hint">The highest-resolution working channel plays automatically. Tap another to switch.</p>
          <div className="chan-chips">
            {channels.map((ch) => (
              <button key={ch.id} className={`chan-chip ${player.channel?.id === ch.id ? 'on' : ''} ${channelStatus(ch).state === 'off' ? 'dim' : ''}`}
                onClick={() => player.start(channels, ch)}>
                <span className="chan-chip-ico">{ch.icon}</span>
                {ch.name}
                <ChanStatus ch={ch} />
              </button>
            ))}
          </div>
        </section>}
      </div>

      <aside className="watch-side">
        <h3 className="block-title">More live matches</h3>
        <div className="watch-others">
          {others.length === 0 && <p className="muted small">No other live matches right now.</p>}
          {others.map((m) => <MatchCard key={m.id} m={m} compact onClick={() => onOpen(m)} />)}
        </div>
      </aside>
    </div>
  )
}
