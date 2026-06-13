const PROXY = 'https://streamflix-proxy-vetv.onrender.com/proxy?url=';
const p = (url) => PROXY + encodeURIComponent(url);

export const WC_CHANNELS = [
  {
    id: 'espn', name: 'ESPN', icon: '🏀', cat: 'sports',
    servers: [
      { label: 'ESPN ARG', url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnar_lng.m3u8') },
      { label: 'ESPN LAT', url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnlat_720.m3u8') },
      { label: 'ESPN CO',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/10685.m3u8') },
      { label: 'ESPN S2',  url: p('http://181.118.156.46:8000/play/a04g/index.m3u8') },
      { label: 'ESPN S3',  url: p('http://205.235.6.29:8000/play/a0zf/index.m3u8') },
    ]
  },
  {
    id: 'espn2', name: 'ESPN 2', icon: '📺', cat: 'sports',
    servers: [
      { label: 'ESPN2 ARG', url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn2ar_lng.m3u8') },
      { label: 'ESPN2 S2',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/108.m3u8') },
      { label: 'ESPN2 CO',  url: p('http://200.10.30.241:8000/play/a01r/index.m3u8') },
    ]
  },
  {
    id: 'fox', name: 'FOX Sports', icon: '🦊', cat: 'sports',
    servers: [
      { label: 'FOX Sports',   url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8') },
      { label: 'FOX S2',       url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/113.m3u8') },
      { label: 'FOX Premium',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/375.m3u8') },
      { label: 'FOX Deportes', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/376.m3u8') },
    ]
  },
  {
    id: 'tnt', name: 'TNT Sports', icon: '⚡', cat: 'sports',
    servers: [
      { label: 'TNT ARG',   url: p('https://1nyaler.streamhostingcdn.top/stream/30/index.m3u8') },
      { label: 'TNT Chile', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/462.m3u8') },
      { label: 'TNT UK',    url: p('http://200.115.120.1:8000/play/ca040/index.m3u8') },
      { label: 'TNT Sport', url: p('http://205.235.6.29:8000/play/a0xa/index.m3u8') },
    ]
  },
  {
    id: 'tyc', name: 'TyC Sports', icon: '🏆', cat: 'sports',
    servers: [
      { label: 'TyC ARG', url: p('https://1nyaler.streamhostingcdn.top/stream/84/index.m3u8') },
      { label: 'TyC S2',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/8631.m3u8') },
      { label: 'TyC Lat', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/380.m3u8') },
    ]
  },
  {
    id: 'tudn', name: 'TUDN', icon: '⚽', cat: 'sports',
    servers: [
      { label: 'TUDN USA', url: p('http://m3u.tvcluboficial.com/m/m/957.m3u8') },
      { label: 'TUDN S2',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/128.m3u8') },
      { label: 'TUDN MX',  url: p('http://45.5.119.43:4000/play/a05q/index.m3u8') },
    ]
  },
  {
    id: 'bein', name: 'beIN Sports', icon: '🌟', cat: 'sports',
    servers: [
      { label: 'beIN Esp',   url: p('https://amg01334-beinsportsllc-beinxtraesp-localnow-aekzc.amagi.tv/playlist.m3u8') },
      { label: 'beIN Extra', url: p('https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8') },
      { label: 'beIN FR 1',  url: p('http://99.27.51.147:8080/BeinSport/index.m3u8') },
      { label: 'beIN AU',    url: p('https://wahyu1ptv.pages.dev/AstroBein2.m3u8') },
    ]
  },
  {
    id: 'dsports', name: 'DSports', icon: '🎯', cat: 'sports',
    servers: [
      { label: 'DSports ARG', url: p('http://190.117.20.37:8000/play/a08d/index.m3u8') },
      { label: 'DSports S2',  url: p('http://205.235.6.29:8000/play/a0nq/index.m3u8') },
      { label: 'DSports+',    url: p('http://217.26.190.76:8888/play/a0jb/index.m3u8') },
    ]
  },
  {
    id: 'win', name: 'Win Sports', icon: '🏅', cat: 'sports',
    servers: [
      { label: 'Win S1', url: p('http://181.78.17.52:8000/play/a0pw/index.m3u8') },
      { label: 'Win S2', url: p('http://190.60.37.154:45000/play/a00q/index.m3u8') },
      { label: 'Win+',   url: p('http://m3u.tvcluboficial.com/m/m/1042.m3u8') },
    ]
  },
  {
    id: 'dazn', name: 'DAZN', icon: '🎬', cat: 'sports',
    servers: [
      { label: 'DAZN 1',  url: p('http://znty.dyndns.org:5010/hls/eleven1.m3u8') },
      { label: 'DAZN 2',  url: p('http://znty.dyndns.org:5010/hls/eleven2.m3u8') },
      { label: 'DAZN 3',  url: p('http://znty.dyndns.org:5010/hls/eleven3.m3u8') },
      { label: 'DAZN F1', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/374.m3u8') },
    ]
  },
  {
    id: 'eurosport', name: 'Eurosport', icon: '🇪🇺', cat: 'sports',
    servers: [
      { label: 'Euro 1', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/618.m3u8') },
      { label: 'Euro 2', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/619.m3u8') },
    ]
  },
  {
    id: 'caze', name: 'Caze TV', icon: '🎥', cat: 'sports',
    servers: [
      { label: 'Caze TV', url: p('https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8') },
    ]
  },
  {
    id: 'telemundo', name: 'Telemundo', icon: '🇲🇽', cat: 'sports',
    servers: [
      { label: 'Telemundo', url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
    ]
  },
  {
    id: 'redbull', name: 'Red Bull TV', icon: '🐂', cat: 'sports',
    servers: [
      { label: 'Red Bull', url: p('http://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8') },
    ]
  },
  {
    id: 'aljazeera', name: 'Al Jazeera', icon: '📡', cat: 'news',
    servers: [{ label: 'Al Jazeera', url: p('https://live-hls-web-aja.getaj.net/AJE/index.m3u8') }]
  },
  {
    id: 'france24', name: 'France 24', icon: '🇫🇷', cat: 'news',
    servers: [{ label: 'France 24', url: p('https://static.france24.com/live/F24_EN_LO_HLS/live_web.m3u8') }]
  },
  {
    id: 'dw', name: 'DW News', icon: '🌐', cat: 'news',
    servers: [{ label: 'DW News', url: p('https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8') }]
  },
];

export const MATCHES = [
  {
    id: 'cr-wi-sa', cat: 'cricket', tournament: 'TEST SERIES · Day 5',
    team1: { name: 'West Indies', flag: '🏝️' }, team2: { name: 'South Africa', flag: '🇿🇦' },
    status: 'live', time: 'Day 5 · Live', scoreA: '26/2', scoreB: '298 target',
    channels: ['espn', 'fox', 'bein', 'dsports']
  },
  {
    id: 'wc-qat-swi', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP A',
    team1: { name: 'Qatar', flag: '🇶🇦' }, team2: { name: 'Switzerland', flag: '🇨🇭' },
    status: 'upcoming', time: 'SUN, JUN 14 · 3:00 AM', scoreA: '', scoreB: '',
    channels: ['espn', 'tudn', 'bein', 'fox']
  },
  {
    id: 'wc-bra-mor', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP C',
    team1: { name: 'Brazil', flag: '🇧🇷' }, team2: { name: 'Morocco', flag: '🇲🇦' },
    status: 'upcoming', time: 'SUN, JUN 14 · 6:00 AM', scoreA: '', scoreB: '',
    channels: ['espn', 'espn2', 'tudn', 'tyc', 'bein']
  },
  {
    id: 'wc-hai-sco', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP B',
    team1: { name: 'Haiti', flag: '🇭🇹' }, team2: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    status: 'upcoming', time: 'SUN, JUN 14 · 9:00 AM', scoreA: '', scoreB: '',
    channels: ['espn', 'fox', 'tudn', 'tnt']
  },
  {
    id: 'wc-aus-tur', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP D',
    team1: { name: 'Australia', flag: '🇦🇺' }, team2: { name: 'Türkiye', flag: '🇹🇷' },
    status: 'upcoming', time: 'SUN, JUN 14 · 12:00 PM', scoreA: '', scoreB: '',
    channels: ['espn', 'bein', 'fox', 'dsports']
  },
  {
    id: 'wc-ger-cur', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP E',
    team1: { name: 'Germany', flag: '🇩🇪' }, team2: { name: 'Curaçao', flag: '🏝️' },
    status: 'upcoming', time: 'MON, JUN 15 · 1:00 AM', scoreA: '', scoreB: '',
    channels: ['espn', 'eurosport', 'dazn', 'bein']
  },
];

export const SPORT_TABS = [
  { id: 'all', label: 'All', icon: '🏆' },
  { id: 'football', label: 'Football', icon: '⚽' },
  { id: 'cricket', label: 'Cricket', icon: '🏏' },
  { id: 'basketball', label: 'Basketball', icon: '🏀' },
  { id: 'tennis', label: 'Tennis', icon: '🎾' },
  { id: 'baseball', label: 'Baseball', icon: '⚾' },
  { id: 'hockey', label: 'Hockey', icon: '🏒' },
  { id: 'mma', label: 'MMA', icon: '🥊' },
  { id: 'motorsport', label: 'F1', icon: '🏎️' },
];
