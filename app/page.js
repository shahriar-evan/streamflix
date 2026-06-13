'use client'
import { useState, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { WC_CHANNELS, MATCHES, SPORT_TABS } from '../lib/data'

const VideoPlayer = dynamic(() => import('../components/VideoPlayer'), { ssr: false })

const SPORT_ICONS = {
  football: '⚽', cricket: '🏏', basketball: '🏀', tennis: '🎾',
  baseball: '⚾', hockey: '🏒', mma: '🥊', boxing: '🥊', motorsport: '🏎️', f1: '🏎️'
}
const si = (s) => SPORT_ICONS[(s || '').toLowerCase()] || '🏆'

const FLAGS = {
  'Mexico':'🇲🇽','South Africa':'🇿🇦','Brazil':'🇧🇷','Argentina':'🇦🇷',
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','France':'🇫🇷','Germany':'🇩🇪','Spain':'🇪🇸',
  'USA':'🇺🇸','United States':'🇺🇸','Portugal':'🇵🇹','Italy':'🇮🇹',
  'Netherlands':'🇳🇱','Belgium':'🇧🇪','Croatia':'🇭🇷','Morocco':'🇲🇦',
  'Japan':'🇯🇵','South Korea':'🇰🇷','Australia':'🇦🇺','Canada':'🇨🇦',
  'Bangladesh':'🇧🇩','India':'🇮🇳','Pakistan':'🇵🇰','West Indies':'🏝️',
  'Afghanistan':'🇦🇫','Sri Lanka':'🇱🇰','New Zealand':'🇳🇿',
  'Saudi Arabia':'🇸🇦','Qatar':'🇶🇦','Ecuador':'🇪🇨','Switzerland':'🇨🇭',
  'Uruguay':'🇺🇾','Colombia':'🇨🇴','Chile':'🇨🇱','Peru':'🇵🇪',
  'Türkiye':'🇹🇷','Turkey':'🇹🇷','Haiti':'🇭🇹','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Curaçao':'🏝️','Australia-W':'🇦🇺','South Africa-W':'🇿🇦',
  'West Indies-W':'🏝️','New Zealand-W':'🇳🇿','Bangladesh-W':'🇧🇩',
  'Netherlands-W':'🇳🇱','India-W':'🇮🇳','Pakistan-W':'🇵🇰',
}
const getFlag = (name) => FLAGS[name] || '🏳️'

export default function Home() {
  const [sport, setSport] = useState('all')
  const [activeMatch, setActiveMatch] = useState(null)
  const [activeChannel, setActiveChannel] = useState(null)
  const [activeServer, setActiveServer] = useState(null)
  const [streamUrl, setStreamUrl] = useState(null)
  const [apiMatches, setApiMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // Load real matches from API
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await fetch('/api/matches')
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((e, i) => ({
            id: e.id || `api-${i}`,
            cat: (e.category || 'football').toLowerCase(),
            tournament: e.league || e.category || 'Live Match',
            team1: {
              name: e.teams?.home?.name || e.title?.split(' vs ')[0] || 'Home',
              flag: getFlag(e.teams?.home?.name || '')
            },
            team2: {
              name: e.teams?.away?.name || e.title?.split(' vs ')[1] || 'Away',
              flag: getFlag(e.teams?.away?.name || '')
            },
            scoreA: e.score?.home ?? '',
            scoreB: e.score?.away ?? '',
            status: e.status === 'live' || e.live ? 'live' : 'upcoming',
            time: e.startTime || e.date || 'TBA',
            channels: ['espn', 'fox', 'bein', 'tnt'],
          }))
          setApiMatches(mapped)
        }
      } catch (e) {}
      setLoading(false)
    }
    loadMatches()
    const interval = setInterval(loadMatches, 60000)
    return () => clearInterval(interval)
  }, [])

  const allMatches = apiMatches.length > 0 ? apiMatches : MATCHES

  const filtered = useCallback(() => {
    if (sport === 'all') return allMatches
    return allMatches.filter(m => m.cat === sport)
  }, [sport, allMatches])

  const liveMatches = filtered().filter(m => m.status === 'live')
  const upcomingMatches = filtered().filter(m => m.status !== 'live')

  const selectMatch = (match) => {
    setActiveMatch(match)
    setStreamUrl(null)
    const matchChannels = (match.channels || []).map(id => WC_CHANNELS.find(c => c.id === id)).filter(Boolean)
    if (matchChannels.length > 0) {
      selectChannel(matchChannels[0], match)
    } else {
      setActiveChannel(null)
      setActiveServer(null)
    }
  }

  const [viewers, setViewers] = useState({})
  const [autoTrying, setAutoTrying] = useState(false)

  // Generate fake viewer counts per channel
  useEffect(() => {
    const counts = {}
    WC_CHANNELS.forEach(ch => {
      counts[ch.id] = Math.floor(Math.random() * 450) + 50
    })
    setViewers(counts)
    const interval = setInterval(() => {
      setViewers(prev => {
        const next = { ...prev }
        Object.keys(next).forEach(id => {
          const change = Math.floor(Math.random() * 21) - 10
          next[id] = Math.max(10, Math.min(999, next[id] + change))
        })
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const tryServersAuto = async (ch) => {
    setAutoTrying(true)
    for (let i = 0; i < ch.servers.length; i++) {
      const srv = ch.servers[i]
      try {
        const res = await fetch(srv.url, { method: 'HEAD', signal: AbortSignal.timeout(3000) })
        if (res.ok) {
          setActiveServer(srv)
          setStreamUrl(srv.url)
          setAutoTrying(false)
          return
        }
      } catch (e) {}
    }
    // fallback to first
    setActiveServer(ch.servers[0])
    setStreamUrl(ch.servers[0].url)
    setAutoTrying(false)
  }

  const selectChannel = (ch, match = activeMatch) => {
    setActiveChannel(ch)
    if (ch.servers.length > 0) {
      tryServersAuto(ch)
    }
  }

  const selectServer = (srv) => {
    setActiveServer(srv)
    setStreamUrl(srv.url)
  }

  const getMatchChannels = (match) => {
    if (!match) return []
    return (match.channels || []).map(id => WC_CHANNELS.find(c => c.id === id)).filter(Boolean)
  }

  return (
    <div style={{ minHeight: '100vh' }}>

      {/* NAV */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 20px', height: 52,
        background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: 20, fontWeight: 800 }}>
          Stream<span style={{ color: 'var(--accent)' }}>Flix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)' }}>
            👁 {Object.values(viewers).reduce((a, b) => a + b, 0).toLocaleString()} watching
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: 'var(--live)' }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', background: 'var(--live)',
              animation: 'pulse 1.2s infinite'
            }} />
            LIVE
          </div>
        </div>
      </nav>

      {/* CHANNEL TABS — KickBD style, always visible at top */}
      <div style={{
        display: 'flex', gap: 6, padding: '8px 16px',
        background: '#fff', borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center'
      }}>
        {WC_CHANNELS.map(ch => (
          <button
            key={ch.id}
            onClick={() => { setActiveMatch(null); selectChannel(ch) }}
            style={{
              padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid',
              borderColor: activeChannel?.id === ch.id ? '#2563eb' : '#d1d5db',
              background: activeChannel?.id === ch.id ? '#2563eb' : '#fff',
              color: activeChannel?.id === ch.id ? '#fff' : '#374151',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s',
              boxShadow: activeChannel?.id === ch.id ? '0 2px 8px #2563eb44' : 'none'
            }}
          >
            {ch.icon} {ch.name}
          </button>
        ))}
      </div>

      {/* SPORT TABS */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 20px',
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {SPORT_TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSport(tab.id)}
            style={{
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
              cursor: 'pointer', border: '1.5px solid',
              borderColor: sport === tab.id ? 'var(--accent)' : 'var(--border)',
              background: sport === tab.id ? 'var(--accent)' : 'transparent',
              color: sport === tab.id ? '#fff' : 'var(--muted)',
              whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 104px)' }}>

        {/* SIDEBAR */}
        <div style={{
          width: 300, flexShrink: 0,
          borderRight: '1px solid var(--border)',
          background: 'var(--surface)', overflowY: 'auto'
        }}>
          {liveMatches.length > 0 && (
            <>
              <div style={{ padding: '10px 14px 4px', fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                🔴 Live Now
              </div>
              {liveMatches.map(m => <MatchCard key={m.id} match={m} active={activeMatch?.id === m.id} onClick={() => selectMatch(m)} />)}
            </>
          )}
          {upcomingMatches.length > 0 && (
            <>
              <div style={{ padding: '10px 14px 4px', fontSize: 10, fontWeight: 700, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                🕐 Next Matches
              </div>
              {upcomingMatches.slice(0, 8).map(m => <MatchCard key={m.id} match={m} active={activeMatch?.id === m.id} onClick={() => selectMatch(m)} />)}
            </>
          )}
          {!liveMatches.length && !upcomingMatches.length && (
            <div style={{ padding: 30, color: 'var(--muted)', fontSize: 12, textAlign: 'center' }}>No matches</div>
          )}
        </div>

        {/* PLAYER AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* VIDEO */}
          <VideoPlayer url={streamUrl} />

          {/* MATCH INFO */}
          {activeMatch && (
            <div style={{
              background: 'var(--surface)', borderBottom: '1px solid var(--border)',
              padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
                  <span style={{ fontSize: 26 }}>{activeMatch.team1.flag}</span>
                  {activeMatch.team1.name}
                </div>
                {activeMatch.scoreA !== '' ? (
                  <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--accent)' }}>
                    {activeMatch.scoreA} - {activeMatch.scoreB}
                  </span>
                ) : (
                  <span style={{ color: 'var(--muted)', fontSize: 12, fontWeight: 700 }}>VS</span>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 15, fontWeight: 700 }}>
                  <span style={{ fontSize: 26 }}>{activeMatch.team2.flag}</span>
                  {activeMatch.team2.name}
                </div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 4,
                background: activeMatch.status === 'live' ? '#ff2d2d22' : '#ffffff0a',
                color: activeMatch.status === 'live' ? 'var(--live)' : 'var(--muted)'
              }}>
                {activeMatch.status === 'live' ? '🔴 LIVE' : `🕐 ${activeMatch.time}`}
              </span>
            </div>
          )}

          {/* CHANNEL BAR */}
          {activeMatch && getMatchChannels(activeMatch).length > 0 && (
            <div style={{
              background: 'var(--surface2)', borderBottom: '1px solid var(--border)',
              padding: '10px 20px', display: 'flex', gap: 8,
              overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center'
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', marginRight: 4 }}>
                📺 Channels
              </span>
              {getMatchChannels(activeMatch).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => selectChannel(ch)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid',
                    borderColor: activeChannel?.id === ch.id ? 'var(--accent)' : 'var(--border)',
                    background: activeChannel?.id === ch.id ? 'var(--accent)' : 'transparent',
                    color: activeChannel?.id === ch.id ? '#fff' : 'var(--muted)',
                    whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 5
                  }}
                >
                  {ch.icon} {ch.name}
                  <span style={{ fontSize: 9, opacity: 0.8 }}>👁 {viewers[ch.id] || 0}</span>
                </button>
              ))}
            </div>
          )}

          {/* SERVER BAR */}
          {activeChannel && (
            <div style={{
              background: '#0f0f18', borderBottom: '1px solid var(--border)',
              padding: '8px 20px', display: 'flex', gap: 6,
              overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center'
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', marginRight: 4 }}>
                🔗 Servers {autoTrying && <span style={{color:'var(--accent)'}}>⟳ Auto...</span>}
              </span>
              {activeChannel.servers.map((srv, i) => (
                <button
                  key={i}
                  onClick={() => selectServer(srv)}
                  style={{
                    padding: '4px 10px', borderRadius: 5, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid',
                    borderColor: activeServer?.label === srv.label ? '#ff6b35' : 'var(--border)',
                    background: activeServer?.label === srv.label ? 'rgba(255,107,53,0.3)' : 'transparent',
                    color: activeServer?.label === srv.label ? '#ff6b35' : 'var(--muted)',
                    whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s'
                  }}
                >
                  {srv.label}
                </button>
              ))}
            </div>
          )}

          {/* UPCOMING */}
          <div style={{ padding: '18px 20px' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '1.5px',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
            }}>
              Upcoming Matches
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
              {upcomingMatches.slice(0, 8).map(m => (
                <div
                  key={m.id}
                  onClick={() => selectMatch(m)}
                  style={{
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    borderRadius: 8, padding: 12, cursor: 'pointer', transition: 'all .2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: 9, color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7 }}>
                    {si(m.cat)} {m.tournament}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5 }}>
                    {m.team1.flag} {m.team1.name} vs {m.team2.flag} {m.team2.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>🕐 {m.time}</div>
                </div>
              ))}
            </div>
          </div>

          {/* LIVE TV CHANNELS */}
          <div style={{ padding: '18px 20px', borderTop: '1px solid var(--border)' }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'var(--muted)',
              textTransform: 'uppercase', letterSpacing: '1.5px',
              marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8
            }}>
              Live TV Channels
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
              {WC_CHANNELS.map(ch => (
                <div
                  key={ch.id}
                  onClick={() => {
                    setActiveMatch(null)
                    selectChannel(ch)
                  }}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
                    padding: '10px 14px', background: 'var(--surface)',
                    border: '1px solid var(--border)', borderRadius: 8,
                    cursor: 'pointer', minWidth: 70, flexShrink: 0, transition: 'all .2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: 22 }}>{ch.icon}</div>
                  <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {ch.name}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

function MatchCard({ match, active, onClick }) {
  const isLive = match.status === 'live'
  const chCount = (match.channels || []).length

  return (
    <div
      onClick={onClick}
      style={{
        padding: '12px 14px',
        borderBottom: '1px solid var(--border)',
        borderLeft: active ? '3px solid var(--accent)' : '3px solid transparent',
        background: active ? 'var(--surface2)' : 'transparent',
        cursor: 'pointer', position: 'relative', transition: 'background .15s'
      }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = 'var(--surface2)')}
      onMouseLeave={e => !active && (e.currentTarget.style.background = 'transparent')}
    >
      <div style={{ fontSize: 9, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 7 }}>
        {si(match.cat)} {match.tournament}
      </div>
      {chCount > 0 && (
        <div style={{
          position: 'absolute', right: 12, top: 12,
          fontSize: 9, fontWeight: 700, color: 'var(--accent)',
          background: '#e5091422', padding: '2px 6px', borderRadius: 4
        }}>
          {chCount} ch
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[match.team1, match.team2].map((team, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 500 }}>
            <span style={{ fontSize: 17, width: 22, textAlign: 'center' }}>{team.flag}</span>
            <span style={{ flex: 1 }}>{team.name}</span>
            {i === 0 && match.scoreA !== '' && (
              <span style={{ fontSize: 15, fontWeight: 700 }}>{match.scoreA}</span>
            )}
            {i === 1 && match.scoreB !== '' && (
              <span style={{ fontSize: 15, fontWeight: 700 }}>{match.scoreB}</span>
            )}
          </div>
        ))}
      </div>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        marginTop: 7, fontSize: 10, fontWeight: 700,
        padding: '2px 7px', borderRadius: 4,
        background: isLive ? '#ff2d2d22' : '#ffffff0a',
        color: isLive ? 'var(--live)' : 'var(--muted)'
      }}>
        {isLive ? (
          <><span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--live)', display: 'inline-block', animation: 'pulse 1s infinite' }} /> LIVE</>
        ) : `🕐 ${match.time}`}
      </span>
    </div>
  )
}