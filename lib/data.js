const PROXY = '/api/proxy?url=';
const p = (url) => PROXY + encodeURIComponent(url);

export const WC_CHANNELS = [
  {
    id: 'fifa_wc', name: 'FIFA WORLDCUP 2026', icon: '🏆', cat: 'sports',
    servers: [
      { label: 'CazeTV BR',   url: p('https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8') },
      { label: 'Telemundo',   url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
      { label: 'TUDN USA',    url: p('http://m3u.tvcluboficial.com/m/m/957.m3u8') },
    ]
  },
  {
    id: 'fox_eng', name: 'FOX (ENG) 60Fps', icon: '🦊', cat: 'sports',
    servers: [
      { label: 'FOX S1',      url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8') },
      { label: 'FOX S2',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/113.m3u8') },
      { label: 'FOX Premium', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/375.m3u8') },
      { label: 'FOX S4',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/459.m3u8') },
      { label: 'FOX Dep',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/376.m3u8') },
    ]
  },
  {
    id: 'wctv', name: 'WORLD CUP TV (ENG)', icon: '🌍', cat: 'sports',
    servers: [
      { label: 'WC S1', url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
      { label: 'WC S2', url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8') },
      { label: 'WC S3', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/113.m3u8') },
    ]
  },
  {
    id: 'caze', name: 'CazéTV 1080p', icon: '🎥', cat: 'sports',
    servers: [
      { label: 'CazeTV S1', url: p('https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8') },
    ]
  },
  {
    id: 'dsports', name: 'D Sports', icon: '🎯', cat: 'sports',
    servers: [
      { label: 'DSports S1',  url: p('http://190.117.20.37:8000/play/a08d/index.m3u8') },
      { label: 'DSports S2',  url: p('http://205.235.6.29:8000/play/a0nq/index.m3u8') },
      { label: 'DSports S3',  url: p('http://217.26.190.76:8888/play/a0jb/index.m3u8') },
      { label: 'DSports S4',  url: p('http://38.226.210.46:8000/play/A008/index.m3u8') },
      { label: 'DSports S5',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/380.m3u8') },
    ]
  },
  {
    id: 'bein_tr', name: 'beIN SPORTS Türkiye', icon: '🌟', cat: 'sports',
    servers: [
      { label: 'beIN TR S1',  url: p('https://andro.okan11gote12sokan.cfd/checklist/androstreamlivebs2.m3u8') },
      { label: 'beIN TR S2',  url: p('https://andro.okan11gote12sokan.cfd/checklist/androstreamlivebs3.m3u8') },
      { label: 'beIN TR S3',  url: p('https://andro.okan11gote12sokan.cfd/checklist/androstreamlivebs4.m3u8') },
      { label: 'beIN TR S4',  url: p('https://andro.226503.xyz/checklist/androstreamlivebs5.m3u8') },
      { label: 'beIN Extra',  url: p('https://amg01334-beinsportsllc-beinxtraesp-localnow-aekzc.amagi.tv/playlist.m3u8') },
    ]
  },
  {
    id: 'tudn', name: 'TUDN', icon: '⚽', cat: 'sports',
    servers: [
      { label: 'TUDN USA', url: p('http://m3u.tvcluboficial.com/m/m/957.m3u8') },
      { label: 'TUDN S2',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/128.m3u8') },
      { label: 'TUDN MX',  url: p('http://45.5.119.43:4000/play/a05q/index.m3u8') },
      { label: 'TUDN S4',  url: p('http://200.229.147.142:8000/play/a096/index.m3u8') },
      { label: 'TUDN S5',  url: p('http://45.171.64.30:2000/play/a08j/index.m3u8') },
    ]
  },
  {
    id: 'bangla_fifa', name: 'Bangla FIFA 2026', icon: '🇧🇩', cat: 'sports',
    servers: [
      { label: 'T Sports S1', url: p('https://bss-hls.akamaized.net/hls/live/2093056/tsports/index.m3u8') },
      { label: 'T Sports S2', url: p('http://103.145.15.99:8080/tsports/live.m3u8') },
    ]
  },
  {
    id: 'hmtv', name: 'HM TV', icon: '📺', cat: 'sports',
    servers: [
      { label: 'HM TV S1', url: p('https://stream1.hmtvlive.com/hls/hmtv/index.m3u8') },
      { label: 'HM TV S2', url: p('http://45.131.211.152:8080/hmtv/index.m3u8') },
    ]
  },
  {
    id: 'telemundo', name: 'Telemundo', icon: '📡', cat: 'sports',
    servers: [
      { label: 'Telemundo S1', url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
      { label: 'Telemundo S2', url: p('https://nbculocallive.akamaized.net/hls/live/2037499/telemundolasvegas/stream1/master.m3u8') },
      { label: 'NBC Universo',  url: p('http://190.11.225.124:5000/live/universo_hd/playlist.m3u8') },
    ]
  },
  {
    id: 'm6', name: 'M6 Direct TV', icon: '🇫🇷', cat: 'sports',
    servers: [
      { label: 'M6 FR S1',  url: p('https://mtv-hls.m6.fr/m6live/mobile/m6.m3u8') },
      { label: 'Canal+ FR', url: p('http://151.80.18.177:86/Canal+_sport_HD/index.m3u8') },
      { label: 'Infosport', url: p('http://212.102.60.80/Infosport/index.m3u8') },
      { label: "L'Equipe",  url: p('https://jmp2.uk/stvp-FR200016Y5') },
    ]
  },
  // ─── Other channels ───────────────────────────────────────────────────────
  {
    id: 'espn', name: 'ESPN', icon: '🏀', cat: 'sports',
    servers: [
      { label: 'ESPN ARG',  url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnar_lng.m3u8') },
      { label: 'ESPN LAT',  url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnlat_720.m3u8') },
      { label: 'ESPN CO',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/10685.m3u8') },
      { label: 'ESPN S4',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/107.m3u8') },
      { label: 'ESPN S5',   url: p('http://181.118.156.46:8000/play/a04g/index.m3u8') },
      { label: 'ESPN S6',   url: p('http://205.235.6.29:8000/play/a0zf/index.m3u8') },
    ]
  },
  {
    id: 'espn2', name: 'ESPN 2', icon: '📺', cat: 'sports',
    servers: [
      { label: 'ESPN2 ARG', url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn2ar_lng.m3u8') },
      { label: 'ESPN2 S2',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/108.m3u8') },
      { label: 'ESPN2 CO',  url: p('http://200.10.30.241:8000/play/a01r/index.m3u8') },
      { label: 'ESPN2 S4',  url: p('http://45.5.119.43:4000/play/a053/index.m3u8') },
    ]
  },
  {
    id: 'tnt', name: 'TNT Sports', icon: '⚡', cat: 'sports',
    servers: [
      { label: 'TNT ARG',     url: p('https://1nyaler.streamhostingcdn.top/stream/30/index.m3u8') },
      { label: 'TNT Chile',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/462.m3u8') },
      { label: 'TNT UK',      url: p('http://200.115.120.1:8000/play/ca040/index.m3u8') },
      { label: 'TNT Premium', url: p('http://205.235.6.29:8000/play/a104/index.m3u8') },
      { label: 'TNT Sport',   url: p('http://205.235.6.29:8000/play/a0xa/index.m3u8') },
    ]
  },
  {
    id: 'tyc', name: 'TyC Sports', icon: '🏆', cat: 'sports',
    servers: [
      { label: 'TyC ARG', url: p('https://1nyaler.streamhostingcdn.top/stream/84/index.m3u8') },
      { label: 'TyC S2',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/8631.m3u8') },
      { label: 'TyC Lat', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/380.m3u8') },
      { label: 'TyC S4',  url: p('http://38.44.109.41:8003/play/a02l/index.m3u8') },
    ]
  },
  {
    id: 'bein', name: 'beIN Sports', icon: '⭐', cat: 'sports',
    servers: [
      { label: 'beIN Esp',   url: p('https://amg01334-beinsportsllc-beinxtraesp-localnow-aekzc.amagi.tv/playlist.m3u8') },
      { label: 'beIN Extra', url: p('https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8') },
      { label: 'beIN FR 1',  url: p('http://99.27.51.147:8080/BeinSport/index.m3u8') },
      { label: 'beIN FR 3',  url: p('http://99.27.51.147:8080/BeinSport3/index.m3u8') },
      { label: 'beIN AU',    url: p('https://wahyu1ptv.pages.dev/AstroBein2.m3u8') },
      { label: 'beIN AU2',   url: p('https://wahyu1ptv.pages.dev/AstroBein3.m3u8') },
    ]
  },
  {
    id: 'win', name: 'Win Sports', icon: '🏅', cat: 'sports',
    servers: [
      { label: 'Win S1',  url: p('http://181.78.17.52:8000/play/a0pw/index.m3u8') },
      { label: 'Win S2',  url: p('http://190.60.37.154:45000/play/a00q/index.m3u8') },
      { label: 'Win S3',  url: p('http://8.243.126.131:8000/play/a025/index.m3u8') },
      { label: 'Win+',    url: p('http://m3u.tvcluboficial.com/m/m/1042.m3u8') },
      { label: 'Win+ S2', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/126.m3u8') },
    ]
  },
  {
    id: 'dazn', name: 'DAZN', icon: '🎬', cat: 'sports',
    servers: [
      { label: 'DAZN 1',  url: p('http://znty.dyndns.org:5010/hls/eleven1.m3u8') },
      { label: 'DAZN 2',  url: p('http://znty.dyndns.org:5010/hls/eleven2.m3u8') },
      { label: 'DAZN 3',  url: p('http://znty.dyndns.org:5010/hls/eleven3.m3u8') },
      { label: 'DAZN 4',  url: p('http://znty.dyndns.org:5010/hls/eleven4.m3u8') },
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
  // ═══════════════════════════════════════════
  // ⚽ FOOTBALL — FIFA WORLD CUP 2026
  // ═══════════════════════════════════════════
  {
    id: 'wc-qat-swi', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP B',
    team1: { name: 'Qatar', flag: '🇶🇦' }, team2: { name: 'Switzerland', flag: '🇨🇭' },
    status: 'live', time: 'LIVE', scoreA: '0', scoreB: '1', hot: true,
    channels: ['fifa_wc', 'dsports', 'tudn', 'bein_tr', 'fox_eng', 'wctv', 'm6', 'telemundo', 'caze']
  },
  {
    id: 'wc-bra-mor', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP C',
    team1: { name: 'Brazil', flag: '🇧🇷' }, team2: { name: 'Morocco', flag: '🇲🇦' },
    status: 'upcoming', time: 'SUN, JUN 14 · 6:00 AM', scoreA: '', scoreB: '', hot: true,
    channels: ['fifa_wc', 'espn', 'tudn', 'tyc', 'bein_tr', 'caze', 'bangla_fifa']
  },
  {
    id: 'wc-hai-sco', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP C',
    team1: { name: 'Haiti', flag: '🇭🇹' }, team2: { name: 'Scotland', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
    status: 'upcoming', time: 'SUN, JUN 14 · 9:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc', 'fox_eng', 'tudn', 'tnt', 'wctv', 'm6']
  },
  {
    id: 'wc-aus-tur', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP D',
    team1: { name: 'Australia', flag: '🇦🇺' }, team2: { name: 'Türkiye', flag: '🇹🇷' },
    status: 'upcoming', time: 'SUN, JUN 14 · 12:00 PM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc', 'bein_tr', 'fox_eng', 'dsports', 'wctv', 'telemundo']
  },
  {
    id: 'wc-ger-cur', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP E',
    team1: { name: 'Germany', flag: '🇩🇪' }, team2: { name: 'Curaçao', flag: '🏝️' },
    status: 'upcoming', time: 'MON, JUN 15 · 1:00 AM', scoreA: '', scoreB: '', hot: true,
    channels: ['fifa_wc', 'eurosport', 'dazn', 'bein_tr', 'm6', 'caze']
  },
  {
    id: 'wc-ned-jpn', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP F',
    team1: { name: 'Netherlands', flag: '🇳🇱' }, team2: { name: 'Japan', flag: '🇯🇵' },
    status: 'upcoming', time: 'MON, JUN 15 · 4:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc', 'espn', 'tudn', 'fox_eng']
  },
  {
    id: 'wc-ivo-ecu', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP E',
    team1: { name: 'Ivory Coast', flag: '🇨🇮' }, team2: { name: 'Ecuador', flag: '🇪🇨' },
    status: 'upcoming', time: 'MON, JUN 15 · 5:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc', 'tudn', 'telemundo']
  },
  {
    id: 'wc-swe-tun', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP F',
    team1: { name: 'Sweden', flag: '🇸🇪' }, team2: { name: 'Tunisia', flag: '🇹🇳' },
    status: 'upcoming', time: 'MON, JUN 15 · 8:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc', 'espn', 'bein_tr']
  },

  // ═══════════════════════════════════════════
  // 🏏 CRICKET — ICC Women's World Twenty20
  // ═══════════════════════════════════════════
  {
    id: 'cr-wi-nz', cat: 'cricket', tournament: 'ICC WOMEN WORLD TWENTY20',
    team1: { name: 'WI-W', flag: '🏝️' }, team2: { name: 'NZ-W', flag: '🇳🇿' },
    status: 'live', time: 'LIVE', scoreA: '142/6', scoreB: '128', hot: true,
    channels: ['espn', 'bein', 'dsports']
  },
  {
    id: 'cr-wi-sl', cat: 'cricket', tournament: 'T20 INTERNATIONAL',
    team1: { name: 'West Indies', flag: '🏝️' }, team2: { name: 'Sri Lanka', flag: '🇱🇰' },
    status: 'upcoming', time: 'SUN, JUN 14 · 8:30 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['espn', 'dsports']
  },
  {
    id: 'cr-ban-aus', cat: 'cricket', tournament: 'ONE DAY INTERNATIONAL',
    team1: { name: 'Bangladesh', flag: '🇧🇩' }, team2: { name: 'Australia', flag: '🇦🇺' },
    status: 'upcoming', time: 'SUN, JUN 14 · 1:00 PM', scoreA: '', scoreB: '', hot: true,
    channels: ['bangla_fifa', 'espn', 'dsports']
  },
  {
    id: 'cr-ban-ned', cat: 'cricket', tournament: 'ICC WOMEN WORLD TWENTY20',
    team1: { name: 'BAN-W', flag: '🇧🇩' }, team2: { name: 'NED-W', flag: '🇳🇱' },
    status: 'upcoming', time: 'SUN, JUN 14 · 5:30 PM', scoreA: '', scoreB: '', hot: false,
    channels: ['bangla_fifa', 'espn']
  },
  {
    id: 'cr-ind-pak', cat: 'cricket', tournament: 'ICC WOMEN WORLD TWENTY20',
    team1: { name: 'IND-W', flag: '🇮🇳' }, team2: { name: 'PAK-W', flag: '🇵🇰' },
    status: 'upcoming', time: 'SUN, JUN 14 · 9:30 PM', scoreA: '', scoreB: '', hot: true,
    channels: ['espn', 'bein', 'dsports']
  },
  {
    id: 'cr-sa-eng', cat: 'cricket', tournament: 'TEST SERIES · Day 5',
    team1: { name: 'West Indies', flag: '🏝️' }, team2: { name: 'South Africa', flag: '🇿🇦' },
    status: 'live', time: 'Day 5 · Live', scoreA: '26/2', scoreB: '298 target', hot: false,
    channels: ['espn', 'fox_eng', 'bein', 'dsports']
  },

  // ═══════════════════════════════════════════
  // 🏀 BASKETBALL — NBA
  // ═══════════════════════════════════════════
  {
    id: 'nba-bos-dal', cat: 'basketball', tournament: 'NBA FINALS · Game 4',
    team1: { name: 'Boston Celtics', flag: '🍀' }, team2: { name: 'Dallas Mavericks', flag: '⭐' },
    status: 'live', time: 'LIVE · Q3', scoreA: '87', scoreB: '79', hot: true,
    channels: ['espn', 'tnt']
  },
  {
    id: 'nba-gs-okc', cat: 'basketball', tournament: 'NBA PLAYOFFS',
    team1: { name: 'Golden State', flag: '🌉' }, team2: { name: 'OKC Thunder', flag: '⚡' },
    status: 'upcoming', time: 'SUN, JUN 14 · 8:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['espn', 'tnt']
  },

  // ═══════════════════════════════════════════
  // ⚾ BASEBALL — MLB
  // ═══════════════════════════════════════════
  {
    id: 'mlb-twins-cards', cat: 'baseball', tournament: 'MLB · REGULAR SEASON',
    team1: { name: 'Twins', flag: '⚾' }, team2: { name: 'Cardinals', flag: '🔴' },
    status: 'live', time: 'LIVE · 5th Inn', scoreA: '3', scoreB: '2', hot: false,
    channels: ['espn2']
  },
  {
    id: 'mlb-bluejays-yank', cat: 'baseball', tournament: 'MLB · REGULAR SEASON',
    team1: { name: 'Blue Jays', flag: '🦅' }, team2: { name: 'Yankees', flag: '⚾' },
    status: 'live', time: 'LIVE · 3rd Inn', scoreA: '1', scoreB: '4', hot: false,
    channels: ['espn2']
  },
  {
    id: 'mlb-ori-pad', cat: 'baseball', tournament: 'MLB · REGULAR SEASON',
    team1: { name: 'Orioles', flag: '🐦' }, team2: { name: 'Padres', flag: '⚾' },
    status: 'live', time: 'LIVE · 1st Inn', scoreA: '0', scoreB: '0', hot: false,
    channels: ['espn2']
  },
  {
    id: 'mlb-nat-mar', cat: 'baseball', tournament: 'MLB · REGULAR SEASON',
    team1: { name: 'Nationals', flag: '🦅' }, team2: { name: 'Mariners', flag: '⚾' },
    status: 'upcoming', time: 'SUN, JUN 14 · 10:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['espn2']
  },

  // ═══════════════════════════════════════════
  // 🎾 TENNIS — Wimbledon
  // ═══════════════════════════════════════════
  {
    id: 'ten-djok-alca', cat: 'tennis', tournament: 'WIMBLEDON · QF',
    team1: { name: 'Djokovic', flag: '🇷🇸' }, team2: { name: 'Alcaraz', flag: '🇪🇸' },
    status: 'live', time: 'LIVE · Set 3', scoreA: '6-4, 3-6, 2', scoreB: '4-6, 6-3, 3', hot: true,
    channels: ['eurosport', 'dazn']
  },
  {
    id: 'ten-swi-sab', cat: 'tennis', tournament: 'WIMBLEDON · QF Women',
    team1: { name: 'Swiatek', flag: '🇵🇱' }, team2: { name: 'Sabalenka', flag: '🇧🇾' },
    status: 'upcoming', time: 'SUN, JUN 14 · 3:00 PM', scoreA: '', scoreB: '', hot: true,
    channels: ['eurosport', 'dazn']
  },

  // ═══════════════════════════════════════════
  // 🏒 HOCKEY — NHL
  // ═══════════════════════════════════════════
  {
    id: 'nhl-edm-fla', cat: 'hockey', tournament: 'NHL STANLEY CUP FINALS · Game 5',
    team1: { name: 'Edmonton Oilers', flag: '🛢️' }, team2: { name: 'Florida Panthers', flag: '🐆' },
    status: 'live', time: 'LIVE · P2', scoreA: '2', scoreB: '3', hot: true,
    channels: ['espn', 'tnt']
  },

  // ═══════════════════════════════════════════
  // 🥊 MMA/BOXING
  // ═══════════════════════════════════════════
  {
    id: 'mma-ufc', cat: 'mma', tournament: 'UFC FIGHT NIGHT',
    team1: { name: 'Poirier', flag: '🇺🇸' }, team2: { name: 'Gaethje', flag: '🇺🇸' },
    status: 'upcoming', time: 'SUN, JUN 14 · 11:00 PM', scoreA: '', scoreB: '', hot: true,
    channels: ['espn', 'dazn']
  },
  {
    id: 'box-aew', cat: 'mma', tournament: 'BOXING · AEW DYNAMITE',
    team1: { name: 'AEW', flag: '🥊' }, team2: { name: 'AEW', flag: '🥊' },
    status: 'upcoming', time: 'WED, JUN 18 · 3:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['tnt']
  },

  // ═══════════════════════════════════════════
  // 🏎️ MOTORSPORT — F1
  // ═══════════════════════════════════════════
  {
    id: 'f1-canada', cat: 'motorsport', tournament: 'F1 · CANADIAN GP · RACE',
    team1: { name: 'Verstappen', flag: '🇳🇱' }, team2: { name: 'Hamilton', flag: '🇬🇧' },
    status: 'upcoming', time: 'SUN, JUN 14 · 8:00 PM', scoreA: '', scoreB: '', hot: true,
    channels: ['dazn', 'redbull']
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