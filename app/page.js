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
  // Americas
  'Mexico':'🇲🇽','Brazil':'🇧🇷','Argentina':'🇦🇷','USA':'🇺🇸','United States':'🇺🇸',
  'Canada':'🇨🇦','Ecuador':'🇪🇨','Colombia':'🇨🇴','Chile':'🇨🇱','Peru':'🇵🇪',
  'Uruguay':'🇺🇾','Paraguay':'🇵🇾','Bolivia':'🇧🇴','Venezuela':'🇻🇪','Panama':'🇵🇦',
  'Costa Rica':'🇨🇷','Honduras':'🇭🇳','Jamaica':'🇯🇲','Haiti':'🇭🇹','Cuba':'🇨🇺',
  'Trinidad and Tobago':'🇹🇹','Curaçao':'🏝️','Guatemala':'🇬🇹','El Salvador':'🇸🇻',
  // Europe
  'England':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Scotland':'🏴󠁧󠁢󠁳󠁣󠁴󠁿','Wales':'🏴󠁧󠁢󠁷󠁬󠁳󠁿','Germany':'🇩🇪','France':'🇫🇷',
  'Spain':'🇪🇸','Italy':'🇮🇹','Portugal':'🇵🇹','Netherlands':'🇳🇱','Belgium':'🇧🇪',
  'Croatia':'🇭🇷','Poland':'🇵🇱','Denmark':'🇩🇰','Sweden':'🇸🇪','Norway':'🇳🇴',
  'Finland':'🇫🇮','Switzerland':'🇨🇭','Austria':'🇦🇹','Czech Republic':'🇨🇿','Czechia':'🇨🇿',
  'Hungary':'🇭🇺','Romania':'🇷🇴','Serbia':'🇷🇸','Ukraine':'🇺🇦','Russia':'🇷🇺',
  'Greece':'🇬🇷','Turkey':'🇹🇷','Türkiye':'🇹🇷','Slovakia':'🇸🇰','Slovenia':'🇸🇮',
  'Albania':'🇦🇱','Bosnia and Herzegovina':'🇧🇦','Bosnia':'🇧🇦','Kosovo':'🇽🇰',
  'North Macedonia':'🇲🇰','Montenegro':'🇲🇪','Bulgaria':'🇧🇬','Iceland':'🇮🇸',
  'Republic of Ireland':'🇮🇪','Ireland':'🇮🇪','Luxembourg':'🇱🇺','Moldova':'🇲🇩',
  'Georgia':'🇬🇪','Armenia':'🇦🇲','Azerbaijan':'🇦🇿','Cyprus':'🇨🇾','Malta':'🇲🇹',
  'Ivory Coast':'🇨🇮',"Côte d'Ivoire":'🇨🇮',
  // Africa
  'South Africa':'🇿🇦','Morocco':'🇲🇦','Nigeria':'🇳🇬','Ghana':'🇬🇭','Senegal':'🇸🇳',
  'Egypt':'🇪🇬','Cameroon':'🇨🇲','Algeria':'🇩🇿','Tunisia':'🇹🇳','Mali':'🇲🇱',
  'Burkina Faso':'🇧🇫','Guinea':'🇬🇳','Zambia':'🇿🇲','Zimbabwe':'🇿🇼','Kenya':'🇰🇪',
  'Tanzania':'🇹🇿','Ethiopia':'🇪🇹','Uganda':'🇺🇬','Angola':'🇦🇴','Congo':'🇨🇬',
  // Asia
  'Japan':'🇯🇵','South Korea':'🇰🇷','Australia':'🇦🇺','Saudi Arabia':'🇸🇦',
  'Qatar':'🇶🇦','Iran':'🇮🇷','UAE':'🇦🇪','Uzbekistan':'🇺🇿','China':'🇨🇳',
  'Indonesia':'🇮🇩','Thailand':'🇹🇭','Vietnam':'🇻🇳','Philippines':'🇵🇭',
  // Cricket specific
  'Bangladesh':'🇧🇩','India':'🇮🇳','Pakistan':'🇵🇰','West Indies':'🏝️',
  'Afghanistan':'🇦🇫','Sri Lanka':'🇱🇰','New Zealand':'🇳🇿',
  'WI':'🏝️','WI-W':'🏝️','NZ-W':'🇳🇿','BAN-W':'🇧🇩','IND-W':'🇮🇳',
  'PAK-W':'🇵🇰','NED-W':'🇳🇱','AUS-W':'🇦🇺','SA-W':'🇿🇦',
  'West Indies-W':'🏝️','New Zealand-W':'🇳🇿','Bangladesh-W':'🇧🇩',
  'Netherlands-W':'🇳🇱','India-W':'🇮🇳','Pakistan-W':'🇵🇰',
  // MLB Teams
  'New York Yankees':'⚾','Boston Red Sox':'🧦','Los Angeles Dodgers':'⚾',
  'Chicago Cubs':'🐻','San Francisco Giants':'⚾','Houston Astros':'⭐',
  'Atlanta Braves':'🪓','Philadelphia Phillies':'🔔','New York Mets':'🍎',
  'Washington Nationals':'🦅','Seattle Mariners':'🧭','Pittsburgh Pirates':'⚾',
  'Miami Marlins':'🐟','Minnesota Twins':'🌲','St. Louis Cardinals':'🔴',
  'Chicago White Sox':'⚾','Colorado Rockies':'⛰️','Cincinnati Reds':'🔴',
  'Arizona Diamondbacks':'💎','San Diego Padres':'🟤','Tampa Bay Rays':'🌊',
  'Detroit Tigers':'🐯','Kansas City Royals':'👑','Baltimore Orioles':'🐦',
  'Toronto Blue Jays':'🦅','Milwaukee Brewers':'🍺','Oakland Athletics':'🐘',
  'Texas Rangers':'⭐','Cleveland Guardians':'🛡️','Los Angeles Angels':'😇',
  // NHL Teams
  'Boston Celtics':'🍀','Dallas Mavericks':'⭐','Golden State Warriors':'🌉',
  'OKC Thunder':'⚡','Vegas Golden Knights':'⚔️','Carolina Hurricanes':'🌀',
  'Edmonton Oilers':'🛢️','Florida Panthers':'🐆','Toronto Maple Leafs':'🍁',
  'New York Rangers':'🗽','Colorado Avalanche':'⛰️','Tampa Bay Lightning':'⚡',
  'Pittsburgh Penguins':'🐧','Chicago Blackhawks':'🦅','Montreal Canadiens':'🍁',
  'Detroit Red Wings':'🔴','Dallas Stars':'⭐','San Jose Sharks':'🦈',
  // NBA Teams
  'Los Angeles Lakers':'💜','Golden State Warriors':'🌉','Milwaukee Bucks':'🦌',
  'Phoenix Suns':'☀️','Miami Heat':'🔥','Brooklyn Nets':'🕸️',
  'Philadelphia 76ers':'🔔','Denver Nuggets':'⛏️','Memphis Grizzlies':'🐻',
  'New Orleans Pelicans':'🦢','Oklahoma City Thunder':'⚡',
  // Tennis
  'Djokovic':'🇷🇸','Alcaraz':'🇪🇸','Swiatek':'🇵🇱','Sabalenka':'🇧🇾',
  'Nadal':'🇪🇸','Federer':'🇨🇭','Medvedev':'🇷🇺','Zverev':'🇩🇪',
  // Italian Serie A teams
  'Udinese':'🏴‍☠️','Como':'🏔️','Juventus':'⚫','Milan':'🔴','Inter':'🔵',
  'AC Milan':'🔴','Inter Milan':'🔵','Roma':'🟡','Napoli':'🔵','Lazio':'🔵',
  'Fiorentina':'🟣','Atalanta':'🔵','Torino':'🔴','Genoa':'🔵','Cagliari':'🔴',
  'Bologna':'🔴','Verona':'🟡','Sassuolo':'🟢','Lecce':'🟡','Empoli':'🔵',
  'Venezia':'🟠','Parma':'🟡','Monza':'🔴','Frosinone':'🟡','Salernitana':'🔴',
  // La Liga teams
  'Real Madrid':'⚪','Barcelona':'🔵','Atletico Madrid':'🔴','Sevilla':'🔴',
  'Valencia':'🦇','Athletic Bilbao':'🔴','Real Sociedad':'🔵','Villarreal':'🟡',
  'Real Betis':'🟢','Osasuna':'🔴','Mallorca':'🔴','Girona':'🔴',
  // Bundesliga teams
  'Bayern Munich':'🔴','Borussia Dortmund':'🟡','RB Leipzig':'🔴',
  'Bayer Leverkusen':'🔴','Eintracht Frankfurt':'🔴','Wolfsburg':'🟢',
  // Ligue 1 teams
  'PSG':'🔵','Paris Saint-Germain':'🔵','Marseille':'🔵','Lyon':'🔴',
  'Monaco':'🔴','Lille':'🔴','Nice':'🔴','Rennes':'🔴',
  // Premier League teams
  'Arsenal':'🔴','Chelsea':'🔵','Liverpool':'🔴','Manchester City':'🔵',
  'Manchester United':'🔴','Tottenham':'⚪','Newcastle':'⚫','Aston Villa':'🟣',
  'West Ham':'🔵','Brighton':'🔵','Crystal Palace':'🔴','Fulham':'⚪',
  'Brentford':'🔴','Wolves':'🟡','Everton':'🔵','Nottingham Forest':'🔴',
  'Burnley':'🟣','Luton':'🟠','Sheffield United':'🔴',
  // Argentinian teams
  'Atlético Tucumán':'🔵','Independiente Rivadavia':'🔴','Boca Juniors':'🟡',
  'River Plate':'🔴','Racing Club':'🔵','San Lorenzo':'🔵','Vélez Sársfield':'🔵',
  // Uzbekistan
  'Andijon':'🇺🇿','Surkhon Termez':'🇺🇿','Lokomotiv Tashkent':'🇺🇿',
  // Italian Serie A teams (for API)
  'Udinese':'🏴','Como':'🏴','Juventus':'⚫','Milan':'🔴','Inter':'🔵',
  'Roma':'🟡','Napoli':'🔵','Lazio':'🔵','Fiorentina':'🟣','Atalanta':'🔵',
}

const getFlag = (name='') => {
  if (!name) return '🏳️'
  if (FLAGS[name]) return FLAGS[name]
  const nl = name.toLowerCase()
  for (const [k,v] of Object.entries(FLAGS)) {
    if (nl === k.toLowerCase()) return v
    if (nl.includes(k.toLowerCase()) && k.length > 4) return v
  }
  // Generic sport emoji based on context
  if (/united|city|fc |sport|athletic|club|real |inter |ac /i.test(name)) return '⚽'
  if (/yankee|red sox|dodger|cubs|mets|astro|braves/i.test(name)) return '⚾'
  if (/lake|celtic|warrior|buck|heat|suns|knick/i.test(name)) return '🏀'
  if (/maple|ranger|penguin|hawk|shark|capital/i.test(name)) return '🏒'
  return '🏴'
}

export default function Home() {
  const [sport, setSport] = useState('all')
  const [activeMatch, setActiveMatch] = useState(null)
  const [activeChannel, setActiveChannel] = useState(null)
  const [activeServer, setActiveServer] = useState(null)
  const [streamUrl, setStreamUrl] = useState(null)
  const [apiMatches, setApiMatches] = useState([])
  const [loading, setLoading] = useState(true)

  // Load real matches — no cache, always fresh
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const res = await fetch(`/api/matches?t=${Date.now()}`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        })
        const data = await res.json()
        if (Array.isArray(data) && data.length > 0) {
          // API now returns fully formatted events directly
          setApiMatches(data)
        }
      } catch (e) {}
      setLoading(false)
    }
    loadMatches()
    const interval = setInterval(loadMatches, 30000) // refresh every 30s
    return () => clearInterval(interval)
  }, [])

  // Auto-play ONLY if there's a live match
  useEffect(() => {
    if (apiMatches.length === 0) return
    const valid = apiMatches.filter(m =>
      m.team1?.name && m.team2?.name &&
      m.team1.name !== 'Home' && m.team2.name !== 'Away' &&
      m.team1.name.length > 1 && m.team2.name.length > 1
    )
    // Only auto-select if there's a live match — never auto-select future/upcoming
    const live = valid.find(m => m.status === 'live')
    if (live) selectMatch(live)
    // No live match? Leave player blank — user chooses
  }, [apiMatches])

  // শুধু API থেকে real-time data — static পুরনো matches দেখাবে না
  const allMatches = apiMatches.length > 0
    ? apiMatches.filter(m =>
        m.team1?.name && m.team2?.name &&
        m.team1.name !== 'Home' && m.team2.name !== 'Away' &&
        m.team1.name !== 'TBA' && m.team2.name !== 'TBA'
      )
    : MATCHES // fallback শুধু API সম্পূর্ণ fail করলে

  const filtered = useCallback(() => {
    // sport filter — __live__/__upcoming__ are sidebar tab states, not sport filters
    if (sport === 'all' || sport === '__live__' || sport === '__upcoming__') return allMatches
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
  const [favorites, setFavorites] = useState([])
  const [scheduleTab, setScheduleTab] = useState('all')
  const [stageTab, setStageTab] = useState('all')
  const [voteChoice, setVoteChoice] = useState(null)
  const [votes, setVotes] = useState({ team1: 37, draw: 7, team2: 56 })

  const toggleFavorite = (chId) => {
    setFavorites(prev => prev.includes(chId) ? prev.filter(x => x !== chId) : [...prev, chId])
  }

  const handleVote = (choice) => {
    if (voteChoice) return
    setVoteChoice(choice)
    setVotes(prev => ({ ...prev, [choice]: prev[choice] + 1 }))
  }

  const SCHEDULE_MATCHES = [
    { id: 's1', group: 'GROUP A', team1: 'Mexico', flag1: '🇲🇽', team2: 'South Africa', flag2: '🇿🇦', date: 'Fri, Jun 12', time: '1:00 AM', status: 'finished', stage: 'group' },
    { id: 's2', group: 'GROUP A', team1: 'South Korea', flag1: '🇰🇷', team2: 'Czechia', flag2: '🇨🇿', date: 'Fri, Jun 12', time: '8:00 AM', status: 'finished', stage: 'group' },
    { id: 's3', group: 'GROUP B', team1: 'Canada', flag1: '🇨🇦', team2: 'Bosnia and Herzegovina', flag2: '🇧🇦', date: 'Sat, Jun 13', time: '1:00 AM', status: 'finished', stage: 'group' },
    { id: 's4', group: 'GROUP D', team1: 'USA', flag1: '🇺🇸', team2: 'Paraguay', flag2: '🇵🇾', date: 'Sat, Jun 13', time: '7:00 AM', status: 'finished', stage: 'group' },
    { id: 's5', group: 'GROUP B', team1: 'Qatar', flag1: '🇶🇦', team2: 'Switzerland', flag2: '🇨🇭', date: 'Sun, Jun 14', time: '1:00 AM', status: 'live', stage: 'group', countdown: '58m 03s left' },
    { id: 's6', group: 'GROUP C', team1: 'Brazil', flag1: '🇧🇷', team2: 'Morocco', flag2: '🇲🇦', date: 'Sun, Jun 14', time: '4:00 AM', status: 'upcoming', stage: 'group', countdown: '1h 58m 03s' },
    { id: 's7', group: 'GROUP C', team1: 'Haiti', flag1: '🇭🇹', team2: 'Scotland', flag2: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', date: 'Sun, Jun 14', time: '7:00 AM', status: 'upcoming', stage: 'group', countdown: '4h 58m 03s' },
    { id: 's8', group: 'GROUP D', team1: 'Australia', flag1: '🇦🇺', team2: 'Türkiye', flag2: '🇹🇷', date: 'Sun, Jun 14', time: '10:00 AM', status: 'upcoming', stage: 'group', countdown: '7h 58m 03s' },
    { id: 's9', group: 'GROUP E', team1: 'Germany', flag1: '🇩🇪', team2: 'Curaçao', flag2: '🏝️', date: 'Sun, Jun 14', time: '11:00 PM', status: 'upcoming', stage: 'group', countdown: '20h 58m 03s' },
    { id: 's10', group: 'GROUP F', team1: 'Netherlands', flag1: '🇳🇱', team2: 'Japan', flag2: '🇯🇵', date: 'Mon, Jun 15', time: '2:00 AM', status: 'upcoming', stage: 'group', countdown: '23h 58m 03s' },
    { id: 's11', group: 'GROUP E', team1: 'Ivory Coast', flag1: '🇨🇮', team2: 'Ecuador', flag2: '🇪🇨', date: 'Mon, Jun 15', time: '5:00 AM', status: 'upcoming', stage: 'group', countdown: '1d 2h 58m' },
    { id: 's12', group: 'GROUP F', team1: 'Sweden', flag1: '🇸🇪', team2: 'Tunisia', flag2: '🇹🇳', date: 'Mon, Jun 15', time: '8:00 AM', status: 'upcoming', stage: 'group', countdown: '1d 5h 58m' },
  ]

  const filteredSchedule = SCHEDULE_MATCHES.filter(m => {
    if (scheduleTab === 'live') return m.status === 'live'
    if (scheduleTab === 'today') return m.date === 'Sun, Jun 14'
    if (scheduleTab === 'upcoming') return m.status === 'upcoming'
    if (scheduleTab === 'finished') return m.status === 'finished'
    return true
  }).filter(m => stageTab === 'all' || m.stage === stageTab)

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

  const tryServersAuto = (ch) => {
    // Directly load first server — no HEAD check (proxied URLs don't respond to HEAD)
    setAutoTrying(false)
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

  // Auto-try next server when current stream fails
  const tryNextServer = () => {
    if (!activeChannel) return
    const servers = activeChannel.servers
    const currentIdx = servers.findIndex(s => s.label === activeServer?.label)
    const nextIdx = (currentIdx + 1) % servers.length
    if (nextIdx !== currentIdx) {
      const next = servers[nextIdx]
      setActiveServer(next)
      setStreamUrl(next.url)
    }
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
        padding: '0 20px', height: 54,
        background: '#1a1a2e',
        borderBottom: '3px solid #e50914',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
          Stream<span style={{ color: '#e50914' }}>Flix</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, color: '#ef4444' }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#ef4444',
              animation: 'pulse 1.2s infinite'
            }} />
            LIVE
          </div>
        </div>
      </nav>

      {/* CHANNEL TABS — sticky below nav */}
      <div style={{
        display: 'flex', gap: 6, padding: '8px 16px',
        background: '#fff', borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center',
        position: 'sticky', top: 54, zIndex: 90,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
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
            <span style={{display:'flex',alignItems:'center',gap:5}}>
              {ch.icon} {ch.name}
              <span
                onClick={(e) => { e.stopPropagation(); toggleFavorite(ch.id) }}
                style={{ fontSize: 13, opacity: favorites.includes(ch.id) ? 1 : 0.3, cursor: 'pointer', marginLeft: 2 }}
                title={favorites.includes(ch.id) ? 'Remove from favorites' : 'Add to favorites'}
              >⭐</span>
            </span>
          </button>
        ))}
      </div>

      {/* SPORT TABS */}
      <div style={{
        display: 'flex', gap: 6, padding: '8px 16px',
        background: '#fff', borderBottom: '1px solid #e5e7eb',
        overflowX: 'auto', scrollbarWidth: 'none'
      }}>
        {SPORT_TABS.map(tab => {
          const liveCount = tab.id === 'all' ? allMatches.filter(m=>m.status==='live').length : allMatches.filter(m=>m.cat===tab.id && m.status==='live').length
          const isActive = sport === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setSport(tab.id)}
              style={{
                padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', border: '1.5px solid',
                borderColor: isActive ? '#e50914' : '#d1d5db',
                background: isActive ? '#e50914' : '#fff',
                color: isActive ? '#fff' : '#374151',
                whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .2s',
                display: 'flex', alignItems: 'center', gap: 5
              }}
            >
              {tab.icon} {tab.label}
              {liveCount > 0 && (
                <span style={{
                  fontSize: 9, fontWeight: 800, padding: '1px 5px', borderRadius: 10,
                  background: isActive ? 'rgba(255,255,255,0.3)' : '#ef4444',
                  color: '#fff', minWidth: 16, textAlign: 'center'
                }}>{liveCount}</span>
              )}
            </button>
          )
        })}
      </div>

      {/* MAIN */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 104px)' }}>

        {/* SIDEBAR */}
        <div style={{
          width: 300, flexShrink: 0,
          borderRight: '1px solid #e5e7eb',
          background: '#fff', overflowY: 'auto'
        }}>
          {/* All/Live/Upcoming tabs */}
          <div style={{ display: 'flex', borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
            {[
              { id: 'all', label: 'All', count: allMatches.length },
              { id: 'live', label: 'Live', count: allMatches.filter(m=>m.status==='live').length },
              { id: 'upcoming', label: 'Upcoming', count: allMatches.filter(m=>m.status==='upcoming').length },
            ].map(tab => (
              <button key={tab.id} onClick={() => setSport(tab.id === 'live' ? '__live__' : tab.id === 'upcoming' ? '__upcoming__' : 'all')}
                style={{
                  flex: 1, padding: '9px 4px', fontSize: 11, fontWeight: 700,
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  borderBottom: (['all','__live__','__upcoming__'].includes(sport) ? (sport === '__live__' && tab.id === 'live') || (sport === '__upcoming__' && tab.id === 'upcoming') || (sport === 'all' && tab.id === 'all') : false) ? '3px solid #22c55e' : '3px solid transparent',
                  color: (sport === '__live__' && tab.id === 'live') || (sport === '__upcoming__' && tab.id === 'upcoming') || (sport === 'all' && tab.id === 'all') ? '#22c55e' : '#6b7280',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5
                }}>
                {tab.label}
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 10,
                  background: tab.id === 'live' && tab.count > 0 ? '#ef4444' : '#e5e7eb',
                  color: tab.id === 'live' && tab.count > 0 ? '#fff' : '#6b7280'
                }}>{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Live matches — hide when "Upcoming" tab selected */}
          {liveMatches.length > 0 && sport !== '__upcoming__' && (
            <>
              <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '1.2px', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
                🔴 Live Now · {liveMatches.length}
              </div>
              {liveMatches.map(m => <MatchCard key={m.id} match={m} active={activeMatch?.id === m.id} onClick={() => selectMatch(m)} />)}
            </>
          )}
          {/* Upcoming matches — hide when "Live" tab selected */}
          {upcomingMatches.length > 0 && sport !== '__live__' && (
            <>
              <div style={{ padding: '8px 14px 4px', fontSize: 10, fontWeight: 700, color: '#6b7280', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                🕐 Next Matches · {upcomingMatches.length}
              </div>
              {upcomingMatches.slice(0, 20).map(m => <MatchCard key={m.id} match={m} active={activeMatch?.id === m.id} onClick={() => selectMatch(m)} />)}
            </>
          )}
          {!liveMatches.length && !upcomingMatches.length && (
            <div style={{ padding: 30, color: '#9ca3af', fontSize: 12, textAlign: 'center' }}>No matches found</div>
          )}
        </div>

        {/* PLAYER AREA */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

          {/* VIDEO */}
          <VideoPlayer url={streamUrl} onStreamFail={tryNextServer} />

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
              background: '#fff', borderBottom: '1px solid #e5e7eb',
              padding: '8px 16px', display: 'flex', gap: 6,
              overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center'
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', marginRight: 4 }}>
                📺 CHANNELS
              </span>
              {getMatchChannels(activeMatch).map(ch => (
                <button
                  key={ch.id}
                  onClick={() => selectChannel(ch)}
                  style={{
                    padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid',
                    borderColor: activeChannel?.id === ch.id ? '#e50914' : '#d1d5db',
                    background: activeChannel?.id === ch.id ? '#e50914' : '#fff',
                    color: activeChannel?.id === ch.id ? '#fff' : '#374151',
                    whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s',
                    display: 'flex', alignItems: 'center', gap: 5,
                    boxShadow: activeChannel?.id === ch.id ? '0 2px 8px #e5091430' : 'none'
                  }}
                >
                  {ch.icon} {ch.name}
                  
                </button>
              ))}
            </div>
          )}

          {/* SERVER BAR */}
          {activeChannel && (
            <div style={{
              background: '#f9fafb', borderBottom: '1px solid #e5e7eb',
              padding: '7px 16px', display: 'flex', gap: 6,
              overflowX: 'auto', scrollbarWidth: 'none', alignItems: 'center'
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px', whiteSpace: 'nowrap', marginRight: 4 }}>
                🔗 SERVERS {autoTrying && <span style={{color:'#e50914'}}>⟳ Auto...</span>}
              </span>
              {activeChannel.servers.map((srv, i) => (
                <button
                  key={i}
                  onClick={() => selectServer(srv)}
                  style={{
                    padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    cursor: 'pointer', border: '1.5px solid',
                    borderColor: activeServer?.label === srv.label ? '#2563eb' : '#d1d5db',
                    background: activeServer?.label === srv.label ? '#2563eb' : '#fff',
                    color: activeServer?.label === srv.label ? '#fff' : '#6b7280',
                    whiteSpace: 'nowrap', flexShrink: 0, transition: 'all .15s'
                  }}
                >
                  {srv.label}
                </button>
              ))}
            </div>
          )}

          {/* FAN PREDICTION */}
          {activeMatch && (
            <div style={{ margin: '16px 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 18 }}>📊</span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Fan Prediction</span>
                </div>
                <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>{(votes.team1 + votes.draw + votes.team2 + 8040).toLocaleString()} votes</span>
              </div>
              <div style={{ color: '#374151', fontSize: 12, marginBottom: 14 }}>আপনার মতে কে জিতবে?</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 18 }}>
                {[
                  { key: 'team1', label: activeMatch.team1.name, flag: activeMatch.team1.flag, color: '#3b82f6' },
                  { key: 'draw', label: 'Draw', flag: '🤝', color: '#6b7280' },
                  { key: 'team2', label: activeMatch.team2.name, flag: activeMatch.team2.flag, color: '#22c55e' },
                ].map(opt => (
                  <button key={opt.key} onClick={() => handleVote(opt.key)} style={{
                    padding: '10px 8px', borderRadius: 8, border: '2px solid',
                    borderColor: voteChoice === opt.key ? opt.color : '#e5e7eb',
                    background: voteChoice === opt.key ? opt.color + '15' : '#fff',
                    cursor: voteChoice ? 'default' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 600,
                    color: voteChoice === opt.key ? opt.color : '#374151', transition: 'all .2s'
                  }}>
                    <span style={{ fontSize: 16 }}>{opt.flag}</span> {opt.label}
                  </button>
                ))}
              </div>
              {[
                { key: 'team1', label: activeMatch.team1.name, color: '#3b82f6' },
                { key: 'draw', label: 'Draw', color: '#9ca3af' },
                { key: 'team2', label: activeMatch.team2.name, color: '#22c55e' },
              ].map(opt => {
                const pct = Math.round(votes[opt.key] / (votes.team1 + votes.draw + votes.team2) * 100)
                return (
                  <div key={opt.key} style={{ marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4 }}>
                      <span>{opt.label}</span><span>{pct}%</span>
                    </div>
                    <div style={{ height: 8, background: '#f3f4f6', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pct + '%', background: opt.color, borderRadius: 4, transition: 'width .5s' }} />
                    </div>
                  </div>
                )
              })}
              {voteChoice && (
                <div style={{ marginTop: 12, fontSize: 12, color: '#22c55e', fontWeight: 600, textAlign: 'center' }}>
                  ✅ আপনার ভোট দেওয়া হয়েছে! ধন্যবাদ।
                </div>
              )}
            </div>
          )}

          {/* FAVORITE CHANNELS */}
          {favorites.length > 0 && (
            <div style={{ margin: '0 20px 16px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 10, padding: '12px 16px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#92400e', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '1px' }}>
                ⭐ Favorite Channels
              </div>
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none' }}>
                {WC_CHANNELS.filter(ch => favorites.includes(ch.id)).map(ch => (
                  <button key={ch.id} onClick={() => { setActiveMatch(null); selectChannel(ch) }} style={{
                    padding: '6px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                    background: activeChannel?.id === ch.id ? '#f59e0b' : '#fff',
                    color: activeChannel?.id === ch.id ? '#fff' : '#374151',
                    border: '1.5px solid #fcd34d', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                    {ch.icon} {ch.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* MATCH SCHEDULE */}
          <div style={{ margin: '0 20px 20px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>📅 MATCH SCHEDULE</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {['all','live','today','upcoming','finished'].map(tab => (
                  <button key={tab} onClick={() => setScheduleTab(tab)} style={{
                    padding: '5px 11px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    background: scheduleTab === tab ? '#1d4ed8' : '#f3f4f6',
                    color: scheduleTab === tab ? '#fff' : '#374151',
                    border: 'none', textTransform: 'capitalize'
                  }}>{tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
                ))}
              </div>
            </div>
            <div style={{ padding: '10px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
              {[
                { id: 'all', label: 'All Stage' },
                { id: 'group', label: 'Group Stage' },
                { id: 'r32', label: 'Round 32' },
                { id: 'r16', label: 'Round 16' },
                { id: 'qf', label: 'Quarterfinals' },
                { id: 'sf', label: 'Semi Finals' },
                { id: 'final', label: 'Final' },
              ].map(s => (
                <button key={s.id} onClick={() => setStageTab(s.id)} style={{
                  padding: '5px 13px', borderRadius: 20, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  background: stageTab === s.id ? '#1d4ed8' : '#f3f4f6',
                  color: stageTab === s.id ? '#fff' : '#374151',
                  border: 'none', whiteSpace: 'nowrap', flexShrink: 0
                }}>{s.label}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {filteredSchedule.map((m, i) => (
                <div key={m.id} style={{
                  padding: '14px 18px', borderBottom: '1px solid #f3f4f6',
                  borderRight: i % 2 === 0 ? '1px solid #f3f4f6' : 'none',
                  background: m.status === 'live' ? '#f0fdf4' : '#fff',
                  cursor: 'pointer', transition: 'background .15s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = m.status === 'live' ? '#dcfce7' : '#f9fafb'}
                  onMouseLeave={e => e.currentTarget.style.background = m.status === 'live' ? '#f0fdf4' : '#fff'}
                >
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#3b82f6', marginBottom: 8, letterSpacing: '0.5px' }}>{m.group}</div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                        {m.flag1} {m.team1}
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>
                        {m.flag2} {m.team2}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', minWidth: 80 }}>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{m.date}</div>
                      <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>{m.time}</div>
                      {m.status === 'live' ? (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#fff', background: '#ef4444', padding: '2px 8px', borderRadius: 4 }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', display: 'inline-block', animation: 'pulse 1s infinite' }} /> LIVE
                        </span>
                      ) : m.status === 'finished' ? (
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>Finished</span>
                      ) : (
                        <span style={{ fontSize: 10, color: '#6b7280' }}>{m.countdown}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {filteredSchedule.length === 0 && (
                <div style={{ padding: 30, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No matches found</div>
              )}
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
    <div onClick={onClick} style={{
      padding: '13px 14px',
      borderBottom: '1px solid #e5e7eb',
      borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
      background: active ? '#f0fdf4' : '#fff',
      cursor: 'pointer', position: 'relative', transition: 'background .15s'
    }}
      onMouseEnter={e => !active && (e.currentTarget.style.background = '#f9fafb')}
      onMouseLeave={e => !active && (e.currentTarget.style.background = '#fff')}
    >
      {/* Tournament header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <div style={{ fontSize: 10, color: '#6b7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {si(match.cat)} {match.tournament}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          {match.hot && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,#f59e0b,#ef4444)', padding: '2px 6px', borderRadius: 4 }}>HOT</span>
          )}
          {chCount > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, color: '#3b82f6', background: '#eff6ff', padding: '2px 6px', borderRadius: 4, border: '1px solid #bfdbfe' }}>{chCount} ch</span>
          )}
        </div>
      </div>

      {/* Teams */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Team badges / flags */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#111827' }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{match.team1.flag}</span>
            <span style={{ flex: 1 }}>{match.team1.name}</span>
            {match.scoreA !== '' && match.scoreA !== undefined && (
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827', minWidth: 20, textAlign: 'right' }}>{match.scoreA}</span>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#111827' }}>
            <span style={{ fontSize: 18, width: 24, textAlign: 'center', flexShrink: 0 }}>{match.team2.flag}</span>
            <span style={{ flex: 1 }}>{match.team2.name}</span>
            {match.scoreB !== '' && match.scoreB !== undefined && (
              <span style={{ fontSize: 16, fontWeight: 800, color: '#111827', minWidth: 20, textAlign: 'right' }}>{match.scoreB}</span>
            )}
          </div>
        </div>
      </div>

      {/* Status */}
      <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
        {isLive ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10, fontWeight: 700, color: '#ef4444' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', display: 'inline-block', animation: 'pulse 1s infinite' }} />
            Live
          </span>
        ) : (
          <span style={{ fontSize: 10, color: '#6b7280' }}>🕐 {match.time}</span>
        )}
        {match.elapsed && isLive && (
          <span style={{ fontSize: 10, color: '#6b7280' }}>· {match.elapsed}</span>
        )}
      </div>
    </div>
  )
}