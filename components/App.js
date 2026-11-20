'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { CHANNELS, CHANNEL_CATEGORIES, SPORTS } from '../lib/data'
import { isRecent } from '../lib/format'
import { check } from '../lib/streams'
import Icon from './Icon'
import { Logo } from './Brand'
import MatchCard, { Avatar, StatusBadge, TeamLogo } from './MatchCard'
import WatchView from './WatchView'
import TVMode from './TVMode'
import Pricing from './Pricing'
import Highlights from './Highlights'
import { AdBanner } from './Ads'
import { usePlan, PRO_PRICE } from '../lib/plan'

const TABS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'tv', label: 'TV Mode', icon: 'tv' },
  { id: 'categories', label: 'Categories', icon: 'grid' },
  { id: 'highlights', label: 'Highlights', icon: 'playBox' },
]
const FILTERS = [
  { id: 'recent', label: 'Recent' },
  { id: 'live', label: 'Live' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'all', label: 'All' },
]

const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch { return d } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)) } catch {} },
}

export default function App({ initialMatches = [] }) {
  const [splash, setSplash] = useState(true)
  const [tab, setTab] = useState('home')
  const [sport, setSport] = useState('all')
  const [filter, setFilter] = useState('recent')
  const [matches, setMatches] = useState(initialMatches)
  const [loading, setLoading] = useState(initialMatches.length === 0)
  const [error, setError] = useState(false)
  const [watching, setWatching] = useState(null)
  const [drawer, setDrawer] = useState(false)
  const [search, setSearch] = useState(false)
  const [query, setQuery] = useState('')
  const [tvCategory, setTvCategory] = useState('all')
  const [favorites, setFavorites] = useState([])
  const plan = usePlan()

  // Splash: once per browser session
  useEffect(() => {
    let seen = false
    try { seen = sessionStorage.getItem('ls_splash') === '1' } catch {}
    const t = setTimeout(() => {
      setSplash(false)
      try { sessionStorage.setItem('ls_splash', '1') } catch {}
    }, seen ? 0 : 1400)
    return () => clearTimeout(t)
  }, [])

  // This app has no service worker — remove any left by older projects on this port
  useEffect(() => {
    navigator.serviceWorker?.getRegistrations?.().then((rs) => rs.forEach((r) => r.unregister())).catch(() => {})
  }, [])

  useEffect(() => { setFavorites(store.get('sf_favs', [])) }, [])

  // Warm the stream-check cache in the background so channels open instantly later
  useEffect(() => {
    const t = setTimeout(() => check(CHANNELS.flatMap((c) => c.servers.map((s) => s.url))), 2500)
    return () => clearTimeout(t)
  }, [])
  const toggleFavorite = useCallback((id) => {
    setFavorites((f) => {
      const next = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]
      store.set('sf_favs', next)
      return next
    })
  }, [])

  const load = useCallback(async () => {
    try {
      const r = await fetch('/api/matches', { cache: 'no-store' })
      const d = await r.json()
      setMatches(d.matches || [])
      setError(false)
    } catch {
      setError(true)
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const i = setInterval(load, 30000)
    return () => clearInterval(i)
  }, [load])

  // "Go Pro" buttons anywhere (ads, player) open the pricing page
  useEffect(() => {
    const fn = () => go('pricing')
    window.addEventListener('ls:gopro', fn)
    return () => window.removeEventListener('ls:gopro', fn)
  })

  // Phone back button closes the watch screen / drawer
  useEffect(() => {
    const onPop = () => { setWatching(null); setDrawer(false); setSearch(false) }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const openMatch = (m) => {
    if (!watching) window.history.pushState({ v: 'watch' }, '')
    setWatching(m)
    setSearch(false)
    window.scrollTo({ top: 0 })
  }
  const closeMatch = () => {
    if (window.history.state?.v === 'watch') window.history.back()
    else setWatching(null)
  }
  const go = (t, cat) => {
    if (watching) closeMatch()
    if (cat) setTvCategory(cat)
    setTab(t)
    setDrawer(false)
    window.scrollTo({ top: 0 })
  }

  // ── Derived match lists ──
  const bySport = useMemo(() => (sport === 'all' ? matches : matches.filter((m) => m.sport === sport)), [matches, sport])
  const counts = useMemo(() => {
    const c = { all: 0 }
    for (const m of matches) {
      if (m.status === 'finished') continue
      c.all++
      c[m.sport] = (c[m.sport] || 0) + 1
    }
    return c
  }, [matches])
  const lists = useMemo(() => {
    const live = bySport.filter((m) => m.status === 'live')
    const upcoming = bySport.filter((m) => m.status === 'upcoming')
    const recent = bySport.filter((m) => isRecent(m))
    const order = { live: 0, upcoming: 1, finished: 2 }
    recent.sort((a, b) => order[a.status] - order[b.status] || new Date(a.start) - new Date(b.start))
    return { live, upcoming, recent, all: bySport }
  }, [bySport])
  const shown = lists[filter]
  const featured = useMemo(() => {
    const live = matches.filter((m) => m.status === 'live' && m.team1)
    return live.find((m) => m.sport === 'football') || live[0] || matches.find((m) => m.status === 'upcoming' && m.team1)
  }, [matches])
  const liveCount = matches.filter((m) => m.status === 'live').length

  const q = query.trim().toLowerCase()
  const results = useMemo(() => {
    if (!q) return { matches: [], channels: [] }
    const hit = (s) => (s || '').toLowerCase().includes(q)
    return {
      matches: matches.filter((m) => hit(m.team1?.name) || hit(m.team2?.name) || hit(m.league) || hit(m.title)).slice(0, 20),
      channels: CHANNELS.filter((c) => hit(c.name)).slice(0, 12),
    }
  }, [q, matches])

  const others = watching ? matches.filter((m) => m.status === 'live' && m.id !== watching.id).slice(0, 8) : []
  const pageTitle = watching ? 'Watch' : tab === 'pricing' ? 'Go Pro' : TABS.find((t) => t.id === tab)?.label
  const withAds = (cards, start = 0) => cards.flatMap((el, i) => (i % 6 === 5 ? [el, <AdBanner key={`ad-${i}`} index={start + Math.floor(i / 6)} onGoPro={() => go('pricing')} />] : [el]))

  return (
    <div className="app">
      {splash && (
        <div className="splash">
          <div className="splash-icon"><Logo size="lg" /></div>
          <p>Live sports &amp; TV, anytime</p>
          <div className="splash-bar"><i /></div>
        </div>
      )}

      {/* Sidebar (laptop) */}
      <aside className="side">
        <div className="side-logo"><Logo /></div>
        <nav className="side-nav">
          {TABS.map((t) => (
            <button key={t.id} className={`side-item ${tab === t.id && !watching ? 'on' : ''}`} onClick={() => go(t.id)}>
              <Icon name={t.icon} size={20} />{t.label}
              {t.id === 'home' && liveCount > 0 && <span className="side-badge">{liveCount}</span>}
            </button>
          ))}
          <button className="side-item" onClick={() => go('tv', 'favorites')}>
            <Icon name="star" size={20} />Favorites
            {favorites.length > 0 && <span className="side-count">{favorites.length}</span>}
          </button>
          <button className={`side-item ${tab === 'pricing' && !watching ? 'on' : ''}`} onClick={() => go('pricing')}>
            <Icon name="star" size={20} fill />{plan.pro ? 'My plan' : 'Go Pro'}
            {plan.pro ? <span className="pro-badge">PRO</span> : <span className="side-count">${PRO_PRICE}/wk</span>}
          </button>
        </nav>
        <div className="side-foot">
          <div className="side-live"><span className="dot" />{liveCount} live now</div>
          <span>{CHANNELS.length} TV channels</span>
        </div>
      </aside>

      <div className="main">
        {/* Top bar */}
        <header className="topbar">
          <button className="icon-btn only-mobile" onClick={() => setDrawer(true)} aria-label="Menu"><Icon name="menu" /></button>
          <div className="only-mobile topbar-logo">
            {tab === 'home' || watching ? <Logo size="sm" /> : <span className="topbar-title">{pageTitle}</span>}
          </div>
          <h1 className="only-desktop topbar-title">{pageTitle}</h1>
          <div className="topbar-search only-desktop" onClick={() => setSearch(true)}>
            <Icon name="search" size={18} /><span>Search teams, leagues, channels…</span>
          </div>
          <div className="topbar-actions">
            {plan.pro
              ? <span className="pro-badge big">PRO</span>
              : <button className="gopro" onClick={() => go('pricing')}><Icon name="star" size={15} fill /><span className="gopro-long">Go </span>Pro</button>}
            <button className="icon-btn round only-mobile" onClick={() => setSearch(true)} aria-label="Search"><Icon name="search" /></button>
            <button className="icon-btn round desk-only" onClick={() => go('tv', 'favorites')} aria-label="Favorites"><Icon name="star" fill /></button>
            <button className="icon-btn round desk-only" onClick={load} aria-label="Refresh"><Icon name="refresh" size={20} /></button>
          </div>
        </header>

        <main className="content">
          {watching ? (
            <WatchView match={watching} others={others} onBack={closeMatch} onOpen={openMatch} />
          ) : tab === 'home' ? (
            <>
              <div className="marquee">
                <div className="marquee-track">
                  {[0, 1].map((k) => (
                    <span key={k} className="marquee-set" aria-hidden={k === 1}>
                      <span>⚡ Welcome to LiveSports — live football, cricket, NBA, NHL, UFC &amp; {CHANNELS.length}+ TV channels in one place.</span>
                      <span>📺 Try TV Mode to flip through channels like a real TV.</span>
                      <span>🔁 If a stream buffers, switch server below the player.</span>
                    </span>
                  ))}
                </div>
              </div>

              {featured && (
                <button className="hero" onClick={() => openMatch(featured)}>
                  <div className="hero-top">
                    <span className="hero-league">
                      {featured.leagueLogo && <img src={featured.leagueLogo} alt="" />}
                      {featured.league}
                    </span>
                    <StatusBadge m={featured} />
                  </div>
                  <div className="hero-teams">
                    <div className="hero-team"><TeamLogo team={featured.team1} size={88} /><b>{featured.team1.name}</b></div>
                    <div className="hero-mid">
                      {featured.status === 'live' && featured.sport !== 'cricket'
                        ? <span className="hero-score">{featured.team1.score} - {featured.team2.score}</span>
                        : <span className="hero-vs">VS</span>}
                      <span className="btn btn-primary"><Icon name="play" size={16} fill />Watch now</span>
                    </div>
                    <div className="hero-team"><TeamLogo team={featured.team2} size={88} /><b>{featured.team2.name}</b></div>
                  </div>
                </button>
              )}

              <div className="sports">
                {SPORTS.map((s) => (
                  <button key={s.id} className={`sport ${sport === s.id ? 'on' : ''}`} onClick={() => setSport(s.id)}>
                    <span className="sport-circle">
                      <span className="sport-ico">{s.icon}</span>
                      {counts[s.id] > 0 && <span className="sport-badge">{counts[s.id]}</span>}
                    </span>
                    <span className="sport-label">{s.label}</span>
                  </button>
                ))}
              </div>

              <div className="filters">
                {FILTERS.map((f) => (
                  <button key={f.id} className={`filter ${filter === f.id ? 'on' : ''}`} onClick={() => setFilter(f.id)}>
                    {filter === f.id && <span className="check">✓</span>}
                    {f.label} ({lists[f.id].length})
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="mgrid">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="mcard skeleton" />)}</div>
              ) : error && !matches.length ? (
                <div className="empty"><Icon name="signal" size={36} /><b>Couldn&apos;t load matches</b><button className="btn" onClick={load}>Try again</button></div>
              ) : shown.length === 0 ? (
                <div className="empty">
                  <span className="empty-ico">{SPORTS.find((s) => s.id === sport)?.icon}</span>
                  <b>No {filter === 'all' ? '' : filter} matches here</b>
                  <span>Try another sport or filter — or open TV Mode.</span>
                  <button className="btn btn-primary" onClick={() => go('tv')}><Icon name="tv" size={16} />Open TV Mode</button>
                </div>
              ) : (
                <div className="mgrid">
                  {withAds(shown.map((m) => <MatchCard key={m.id} m={m} onClick={() => openMatch(m)} />))}
                </div>
              )}
            </>
          ) : tab === 'tv' ? (
            <TVMode category={tvCategory} setCategory={setTvCategory} favorites={favorites} toggleFavorite={toggleFavorite} />
          ) : tab === 'pricing' ? (
            <Pricing />
          ) : tab === 'categories' ? (
            <div className="cats">
              <button className="cat cat-live" onClick={() => { setFilter('live'); setSport('all'); go('home') }}>
                <span className="cat-ico" style={{ background: '#e50914' }}>🔴</span>
                <span className="cat-text"><b>Live Events</b><small>{liveCount} live now</small></span>
              </button>
              {CHANNEL_CATEGORIES.map((c) => {
                const n = c.id === 'all' ? CHANNELS.length : CHANNELS.filter((ch) => ch.group === c.id).length
                return (
                  <button key={c.id} className="cat" onClick={() => go('tv', c.id)}>
                    <span className="cat-ico" style={{ background: c.color }}>{c.icon}</span>
                    <span className="cat-text"><b>{c.label}</b><small>{n} channel{n === 1 ? '' : 's'}</small></span>
                  </button>
                )
              })}
              {favorites.length > 0 && (
                <button className="cat" onClick={() => go('tv', 'favorites')}>
                  <span className="cat-ico" style={{ background: '#ca8a04' }}>⭐</span>
                  <span className="cat-text"><b>Favorites</b><small>{favorites.length} saved</small></span>
                </button>
              )}
            </div>
          ) : (
            <Highlights sport="all" onGoPro={() => go('pricing')} />
          )}
        </main>
      </div>

      {/* Bottom nav (mobile) */}
      <nav className="bottomnav">
        {TABS.map((t) => (
          <button key={t.id} className={`bn-item ${tab === t.id && !watching ? 'on' : ''}`} onClick={() => go(t.id)}>
            <Icon name={t.icon} size={24} fill={tab === t.id && !watching && t.id !== 'tv'} />
            <span>{t.label}</span>
          </button>
        ))}
      </nav>

      {/* Drawer (mobile) */}
      <div className={`drawer-wrap ${drawer ? 'open' : ''}`} onClick={() => setDrawer(false)}>
        <aside className="drawer" onClick={(e) => e.stopPropagation()}>
          <div className="drawer-head"><Logo size="lg" /></div>
          <button className="drawer-item" onClick={() => go('tv', 'all')}><Icon name="list" />Channels</button>
          <button className="drawer-item" onClick={() => go('tv', 'favorites')}><Icon name="star" />Favorites</button>
          <button className="drawer-item" onClick={() => go('categories')}><Icon name="grid" />Categories</button>
          <button className="drawer-item" onClick={() => go('highlights')}><Icon name="playBox" />Highlights</button>
          <button className="drawer-item drawer-pro" onClick={() => go('pricing')}><Icon name="star" fill />{plan.pro ? 'My plan (Pro)' : `Go Pro — $${PRO_PRICE}/week`}</button>
          <button className="drawer-item" onClick={() => { load(); setDrawer(false) }}><Icon name="refresh" />Refresh matches</button>
          <button className="drawer-item" onClick={() => {
            const url = window.location.href
            if (navigator.share) navigator.share({ title: 'LiveSports', url }).catch(() => {})
            else navigator.clipboard?.writeText(url)
            setDrawer(false)
          }}><Icon name="share" />Share app</button>
          <div className="drawer-foot">
            <Icon name="info" size={16} />LiveSports · {CHANNELS.length} channels · {liveCount} live
          </div>
        </aside>
      </div>

      {/* Search */}
      {search && (
        <div className="search-wrap" onClick={() => setSearch(false)}>
          <div className="search-box" onClick={(e) => e.stopPropagation()}>
            <div className="search-input">
              <Icon name="search" size={20} />
              <input autoFocus placeholder="Search teams, leagues, channels…" value={query} onChange={(e) => setQuery(e.target.value)} />
              <button className="icon-btn" onClick={() => setSearch(false)} aria-label="Close"><Icon name="x" size={20} /></button>
            </div>
            <div className="search-results">
              {!q && <p className="muted small pad">Type a team (e.g. “Bayern”), a league or a channel name.</p>}
              {q && !results.matches.length && !results.channels.length && <p className="muted small pad">Nothing found for “{query}”.</p>}
              {results.channels.length > 0 && <h4>Channels</h4>}
              {results.channels.map((c) => (
                <button key={c.id} className="sr-row" onClick={() => { setSearch(false); go('tv', c.group) }}>
                  <Avatar name={c.name} size={36} /><span><b>{c.name}</b><small>{c.servers.length} servers</small></span>
                </button>
              ))}
              {results.matches.length > 0 && <h4>Matches</h4>}
              {results.matches.map((m) => (
                <button key={m.id} className="sr-row" onClick={() => openMatch(m)}>
                  {m.team1 ? <TeamLogo team={m.team1} size={36} /> : <Avatar name={m.title} size={36} />}
                  <span><b>{m.team1 ? `${m.team1.name} vs ${m.team2.name}` : m.title}</b><small>{m.league}</small></span>
                  <StatusBadge m={m} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
