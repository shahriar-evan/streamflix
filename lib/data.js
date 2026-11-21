const PROXY = '/api/proxy?url=';
const p = (url) => PROXY + encodeURIComponent(url);

// Free channels only: streams the broadcasters themselves make available for free
// (their own sites or free ad-supported TV platforms). No paid / pay-TV channels.
export const CHANNELS = [
  // ─── Football ─────────────────────────────────────────────────────────────
  {
    id: 'bein_xtra', name: 'beIN SPORTS XTRA', icon: '⭐', cat: 'sports', group: 'football',
    servers: [
      { label: 'XTRA HD', url: p('https://bein-xtra-bein.amagi.tv/playlist.m3u8') },
    ],
  },
  {
    id: 'bein_xtra_es', name: 'beIN SPORTS XTRA Español', icon: '🌟', cat: 'sports', group: 'football',
    servers: [
      { label: 'XTRA ES 1', url: p('https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8') },
      { label: 'XTRA ES 2', url: p('https://amg01334-beinsportsllc-beinxtraesp-localnow-aekzc.amagi.tv/playlist.m3u8') },
    ],
  },
  {
    id: 'caze', name: 'CazéTV', icon: '🎥', cat: 'sports', group: 'football',
    servers: [
      { label: 'CazéTV', url: p('https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8') },
    ],
  },
  {
    id: 'realmadrid', name: 'Real Madrid TV', icon: '⚽', cat: 'sports', group: 'football',
    servers: [
      { label: 'RM TV', url: p('https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/bitrate_3.m3u8') },
    ],
  },
  {
    id: 'lequipe', name: "L'Équipe", icon: '🇫🇷', cat: 'sports', group: 'football',
    servers: [
      { label: "L'Équipe", url: p('https://jmp2.uk/stvp-FR200016Y5') },
    ],
  },

  // ─── Cricket ──────────────────────────────────────────────────────────────
  {
    id: 'cricketgold', name: 'Cricket Gold', icon: '🏏', cat: 'sports', group: 'cricket',
    servers: [
      { label: 'Cricket Gold', url: p('https://streams2.sofast.tv/ptnr-yupptv/title-cricketgold/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/b2048bb8-1686-4432-aa50-647245383e0c/manifest.m3u8') },
    ],
  },

  // ─── Fight & motorsport ───────────────────────────────────────────────────
  {
    id: 'dazncombat', name: 'DAZN Combat', icon: '🥊', cat: 'sports', group: 'fight',
    servers: [
      { label: 'DAZN Combat', url: p('https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8') },
    ],
  },
  {
    id: 'redbull', name: 'Red Bull TV', icon: '🐂', cat: 'sports', group: 'fight',
    servers: [
      { label: 'Red Bull TV', url: p('http://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8') },
    ],
  },
  {
    id: 'garagetv', name: 'Garage TV', icon: '🏎️', cat: 'sports', group: 'fight',
    servers: [
      { label: 'Garage TV', url: p('https://stream1.sersat.com/hls/garagetv.m3u8') },
    ],
  },

  // ─── News ─────────────────────────────────────────────────────────────────
  {
    id: 'aljazeera', name: 'Al Jazeera', icon: '📡', cat: 'news', group: 'news',
    servers: [{ label: 'Al Jazeera', url: p('https://live-hls-web-aja.getaj.net/AJE/index.m3u8') }],
  },
  {
    id: 'france24', name: 'France 24', icon: '🇫🇷', cat: 'news', group: 'news',
    servers: [{ label: 'France 24', url: p('https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8') }],
  },
  {
    id: 'dw', name: 'DW News', icon: '🌐', cat: 'news', group: 'news',
    servers: [{ label: 'DW News', url: p('https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8') }],
  },
];

CHANNELS.forEach((ch, i) => { ch.num = i + 1 });

// ─── Channel categories ─────────────────────────────────────────────────────
export const CHANNEL_CATEGORIES = [
  { id: 'all', label: 'All Channels', icon: '📺', color: '#e50914' },
  { id: 'football', label: 'Football', icon: '⚽', color: '#16a34a' },
  { id: 'cricket', label: 'Cricket', icon: '🏏', color: '#2563eb' },
  { id: 'fight', label: 'Fight & Motorsport', icon: '🏎️', color: '#dc2626' },
  { id: 'news', label: 'News', icon: '📰', color: '#0891b2' },
]

export const groupLabel = (id) => CHANNEL_CATEGORIES.find((c) => c.id === id)?.label || 'Sports'

// ─── Sports (home screen circles) ───────────────────────────────────────────
export const SPORTS = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
  { id: 'hockey', label: 'Hockey', icon: '🏒' },
  { id: 'amfootball', label: 'NFL', icon: '🏈' },
  { id: 'mma', label: 'UFC', icon: '🥊' },
  { id: 'motorsport', label: 'Motorsport', icon: '🏎️' },
]

export const sportOf = (id) => SPORTS.find((s) => s.id === id) || SPORTS[0]

// ─── Free channels worth trying for a match (they may or may not carry it) ──
const BY_SPORT = {
  football: ['bein_xtra', 'bein_xtra_es', 'caze', 'lequipe', 'realmadrid'],
  mma: ['dazncombat'],
  motorsport: ['redbull', 'garagetv'],
}

// Free channels are general sports channels, not this match's broadcast, so they're
// only offered while the match is actually live. Cricket Gold (classic matches) is TV-Mode only.
export function channelsForMatch(m) {
  if (m.status !== 'live') return []
  const ids = BY_SPORT[m.sport] || []
  return ids.map((id) => CHANNELS.find((c) => c.id === id)).filter(Boolean)
}
