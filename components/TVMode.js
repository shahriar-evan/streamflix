'use client'
import { useMemo, useState } from 'react'
import { CHANNELS, CHANNEL_CATEGORIES, groupLabel } from '../lib/data'
import Icon from './Icon'
import { Avatar } from './MatchCard'
import PlayerPanel, { goPro } from './PlayerPanel'
import { AdBanner } from './Ads'
import usePlayer from './usePlayer'
import { ChanStatus } from './WatchView'

export default function TVMode({ category, setCategory, favorites, toggleFavorite }) {
  const player = usePlayer()
  const [q, setQ] = useState('')
  const [searching, setSearching] = useState(false)

  const list = useMemo(() => {
    let l = CHANNELS
    if (category === 'favorites') l = l.filter((c) => favorites.includes(c.id))
    else if (category !== 'all') l = l.filter((c) => c.group === category)
    if (q.trim()) l = l.filter((c) => c.name.toLowerCase().includes(q.trim().toLowerCase()))
    return l
  }, [category, favorites, q])

  const chips = [
    ...CHANNEL_CATEGORIES,
    ...(favorites.length ? [{ id: 'favorites', label: 'Favorites', icon: '⭐' }] : []),
  ]
  const ch = player.channel

  return (
    <div className="tv">
      <aside className="tv-list">
        <div className="tv-head">
          <h2>Channels <span>{list.length}</span></h2>
          <button className={`icon-btn ${searching ? 'on' : ''}`} onClick={() => { setSearching(!searching); setQ('') }} aria-label="Search channels">
            <Icon name={searching ? 'x' : 'search'} size={20} />
          </button>
        </div>
        {searching && (
          <input className="tv-search" autoFocus placeholder="Search channels…" value={q} onChange={(e) => setQ(e.target.value)} />
        )}
        <div className="chips-row">
          {chips.map((c) => (
            <button key={c.id} className={`chip ${category === c.id ? 'on' : ''}`} onClick={() => setCategory(c.id)}>
              <span>{c.icon}</span>{c.label}
            </button>
          ))}
        </div>
        <button className="autotune" onClick={() => list.length && player.start(list, list[0])}>
          <Icon name="playBox" size={20} />Auto tune — from first channel
        </button>
        <AdBanner slim onGoPro={goPro} index={0} />
        <div className="ch-rows">
          {list.length === 0 && <p className="muted small pad">No channels here yet.</p>}
          {list.map((c) => (
            <div key={c.id} className={`ch-row ${ch?.id === c.id ? 'on' : ''}`} onClick={() => player.start(list, c)} role="button" tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && player.start(list, c)}>
              <span className="ch-num">{c.num}</span>
              <Avatar name={c.name} />
              <span className="ch-info">
                <b>{c.name}</b>
                <small>{groupLabel(c.group)} · {c.servers.length} server{c.servers.length > 1 ? 's' : ''}</small>
              </span>
              <ChanStatus ch={c} />
              <button className={`star ${favorites.includes(c.id) ? 'on' : ''}`} aria-label="Favorite"
                onClick={(e) => { e.stopPropagation(); toggleFavorite(c.id) }}>
                <Icon name="star" size={18} fill={favorites.includes(c.id)} />
              </button>
              {ch?.id === c.id && <Icon name="play" size={16} fill className="ch-playing" />}
            </div>
          ))}
        </div>
      </aside>

      <section className="tv-stage">
        {ch && (
          <div className="now-card">
            <span className="now-num">{ch.num}</span>
            <Avatar name={ch.name} size={52} />
            <span className="now-info">
              <b>{ch.name}</b>
              <span><span className="live-pill"><i />LIVE</span>{groupLabel(ch.group)}</span>
            </span>
          </div>
        )}
        <PlayerPanel player={player} adKey={player.session > 0 ? 'tv' : null} />
      </section>
    </div>
  )
}
