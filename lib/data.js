const PROXY = '/api/proxy?url=';
const p = (url) => PROXY + encodeURIComponent(url);

export const WC_CHANNELS = [

  // ─── FOX Sports (from m3u) ────────────────────────────────────────────────
  {
    id: 'fox_eng', name: 'FOX (ENG) 60Fps', icon: '🦊', cat: 'sports',
    servers: [
      { label: 'FOX S1',      url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8') },
      { label: 'FOX HD',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/459.m3u8') },
      { label: 'FOX 2 HD',    url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/10532.m3u8') },
      { label: 'FOX LAT',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/113.m3u8') },
      { label: 'FOX 2 LAT',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/114.m3u8') },
      { label: 'FOX Prem',    url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/375.m3u8') },
      { label: 'FOX Dep',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/376.m3u8') },
      { label: 'FOX Soccer',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/3414.m3u8') },
      { label: 'FOX S3',      url: p('http://45.5.119.43:4000/play/a024/index.m3u8') },
      { label: 'FOX India',   url: p('http://y3fqd48g.megatv.fun/iptv/NRLXRWSBWBPLN4/19146/index.m3u8') },
    ]
  },

  // ─── WORLD CUP TV ─────────────────────────────────────────────────────────
  {
    id: 'wctv', name: 'WORLD CUP TV (ENG)', icon: '🌍', cat: 'sports',
    servers: [
      { label: 'WC Fox ENG',  url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8') },
      { label: 'WC NBC',      url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
      { label: 'WC Fox HD',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/459.m3u8') },
    ]
  },

  // ─── FIFA WORLDCUP 2026 ───────────────────────────────────────────────────
  {
    id: 'fifa_wc', name: 'FIFA WORLDCUP 2026', icon: '🏆', cat: 'sports',
    servers: [
      { label: 'FOX ENG',     url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-fox1ar_720.m3u8') },
      { label: 'FOX HD',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/459.m3u8') },
      { label: 'TUDN USA',    url: p('http://m3u.tvcluboficial.com/m/m/957.m3u8') },
      { label: 'Telemundo',   url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
      { label: 'CazeTV BR',   url: p('https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8') },
    ]
  },

  // ─── CazéTV 1080p ─────────────────────────────────────────────────────────
  {
    id: 'caze', name: 'CazéTV 1080p', icon: '🎥', cat: 'sports',
    servers: [
      { label: 'CazeTV',      url: p('https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8') },
    ]
  },

  // ─── D Sports ─────────────────────────────────────────────────────────────
  {
    id: 'dsports', name: 'D Sports', icon: '🎯', cat: 'sports',
    servers: [
      { label: 'DSports S1',  url: p('http://190.117.20.37:8000/play/a08d/index.m3u8') },
      { label: 'DSports S2',  url: p('http://205.235.6.29:8000/play/a0nq/index.m3u8') },
      { label: 'DSports S3',  url: p('http://217.26.190.76:8888/play/a0jb/index.m3u8') },
      { label: 'DSports S4',  url: p('http://38.226.210.46:8000/play/A008/index.m3u8') },
      { label: 'DSports S5',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/380.m3u8') },
      { label: 'DSports S6',  url: p('http://jumangis.cloud:2082/JairoVargas/5T5wLJjTbu/117708') },
    ]
  },

  // ─── beIN SPORTS Türkiye ──────────────────────────────────────────────────
  {
    id: 'bein_tr', name: 'beIN SPORTS Türkiye', icon: '🌟', cat: 'sports',
    servers: [
      { label: 'beIN TR 2',   url: p('https://andro.okan11gote12sokan.cfd/checklist/androstreamlivebs2.m3u8') },
      { label: 'beIN TR 3',   url: p('https://andro.okan11gote12sokan.cfd/checklist/androstreamlivebs3.m3u8') },
      { label: 'beIN TR 4',   url: p('https://andro.okan11gote12sokan.cfd/checklist/androstreamlivebs4.m3u8') },
      { label: 'beIN TR 5',   url: p('https://andro.226503.xyz/checklist/androstreamlivebs5.m3u8') },
    ]
  },

  // ─── TUDN ─────────────────────────────────────────────────────────────────
  {
    id: 'tudn', name: 'TUDN', icon: '⚽', cat: 'sports',
    servers: [
      { label: 'TUDN USA',    url: p('http://m3u.tvcluboficial.com/m/m/957.m3u8') },
      { label: 'TUDN 1',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/128.m3u8') },
      { label: 'TUDN 2',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/791.m3u8') },
      { label: 'TUDN MX',     url: p('http://45.5.119.43:4000/play/a05q/index.m3u8') },
      { label: 'TUDN S5',     url: p('http://45.171.64.30:2000/play/a08j/index.m3u8') },
      { label: 'TUDN IXP',    url: p('http://200.229.147.142:8000/play/a096/index.m3u8') },
    ]
  },

  // ─── Bangla FIFA 2026 ─────────────────────────────────────────────────────
  {
    id: 'bangla_fifa', name: 'Bangla FIFA 2026', icon: '🇧🇩', cat: 'sports',
    servers: [
      { label: 'T Sports HD', url: p('https://tvsen7.aynaott.com/tsports-hd/index.m3u8') },
      { label: 'T Sports S2', url: p('https://bss-hls.akamaized.net/hls/live/2093056/tsports/index.m3u8') },
    ]
  },

  // ─── HM TV ────────────────────────────────────────────────────────────────
  {
    id: 'hmtv', name: 'HM TV', icon: '📺', cat: 'sports',
    servers: [
      { label: 'HM TV',       url: p('https://stream1.hmtvlive.com/hls/hmtv/index.m3u8') },
    ]
  },

  // ─── Telemundo ────────────────────────────────────────────────────────────
  {
    id: 'telemundo', name: 'Telemundo', icon: '📡', cat: 'sports',
    servers: [
      { label: 'Telemundo',   url: p('https://nbculocallive.akamaized.net/hls/live/2037499/puertorico/stream1/master.m3u8') },
      { label: 'NBC Universo', url: p('http://190.11.225.124:5000/live/universo_hd/playlist.m3u8') },
    ]
  },

  // ─── M6 / French ──────────────────────────────────────────────────────────
  {
    id: 'm6', name: 'M6 Direct TV', icon: '🇫🇷', cat: 'sports',
    servers: [
      { label: "L'Equipe",    url: p('https://jmp2.uk/stvp-FR200016Y5') },
      { label: 'Infosport',   url: p('http://212.102.60.80/Infosport/index.m3u8') },
      { label: 'Canal+ FR',   url: p('http://151.80.18.177:86/Canal+_sport_HD/index.m3u8') },
    ]
  },

  // ─── ESPN Family ──────────────────────────────────────────────────────────
  {
    id: 'espn', name: 'ESPN', icon: '🏀', cat: 'sports',
    servers: [
      { label: 'ESPN LAT',    url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnlat_720.m3u8') },
      { label: 'ESPN ARG',    url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnar_lng.m3u8') },
      { label: 'ESPN HD',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/107.m3u8') },
      { label: 'ESPN CO',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/10685.m3u8') },
      { label: 'ESPN S5',     url: p('http://181.118.156.46:8000/play/a04g/index.m3u8') },
      { label: 'ESPN S6',     url: p('http://205.235.6.29:8000/play/a0zf/index.m3u8') },
      { label: 'ESPN Prem',   url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espnpremar_lng.m3u8') },
    ]
  },
  {
    id: 'espn2', name: 'ESPN 2', icon: '📺', cat: 'sports',
    servers: [
      { label: 'ESPN2 ARG',   url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn2ar_lng.m3u8') },
      { label: 'ESPN2 HD',    url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/108.m3u8') },
      { label: 'ESPN2 CO',    url: p('http://200.10.30.241:8000/play/a01r/index.m3u8') },
      { label: 'ESPN2 S4',    url: p('http://45.5.119.43:4000/play/a053/index.m3u8') },
      { label: 'ESPN2 HD AR', url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/449.m3u8') },
    ]
  },
  {
    id: 'espn3', name: 'ESPN 3', icon: '📡', cat: 'sports',
    servers: [
      { label: 'ESPN3 ARG',   url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn3ar_lng.m3u8') },
      { label: 'ESPN3 HD',    url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/109.m3u8') },
    ]
  },
  {
    id: 'espn4', name: 'ESPN 4', icon: '📡', cat: 'sports',
    servers: [
      { label: 'ESPN4',       url: p('http://181.191.141.7/Live/51334cbb88db0e050c59ef2d28c53491/local-espn4lat_720.m3u8') },
      { label: 'ESPN4 HD',    url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/110.m3u8') },
      { label: 'ESPN4 S3',    url: p('http://45.5.119.43:4000/play/a028/index.m3u8') },
    ]
  },

  // ─── TNT Sports ───────────────────────────────────────────────────────────
  {
    id: 'tnt', name: 'TNT Sports', icon: '⚡', cat: 'sports',
    servers: [
      { label: 'TNT ARG',     url: p('https://1nyaler.streamhostingcdn.top/stream/30/index.m3u8') },
      { label: 'TNT Chile',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/462.m3u8') },
      { label: 'TNT UK',      url: p('http://200.115.120.1:8000/play/ca040/index.m3u8') },
      { label: 'TNT Sport',   url: p('http://205.235.6.29:8000/play/a0xa/index.m3u8') },
      { label: 'TNT Prem',    url: p('http://205.235.6.29:8000/play/a104/index.m3u8') },
    ]
  },

  // ─── TyC Sports ───────────────────────────────────────────────────────────
  {
    id: 'tyc', name: 'TyC Sports', icon: '🏆', cat: 'sports',
    servers: [
      { label: 'TyC ARG',     url: p('https://1nyaler.streamhostingcdn.top/stream/84/index.m3u8') },
      { label: 'TyC HD',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/8631.m3u8') },
      { label: 'TyC S3',      url: p('http://190.60.37.154:45000/play/a05a/index.m3u8') },
      { label: 'TyC S4',      url: p('http://38.44.109.41:8003/play/a02l/index.m3u8') },
    ]
  },

  // ─── Win Sports ───────────────────────────────────────────────────────────
  {
    id: 'win', name: 'Win Sports', icon: '🏅', cat: 'sports',
    servers: [
      { label: 'Win S1',      url: p('http://8.243.126.131:8000/play/a025/index.m3u8') },
      { label: 'Win S2',      url: p('http://181.78.17.52:8000/play/a0pw/index.m3u8') },
      { label: 'Win S3',      url: p('http://181.78.71.71:18000/play/a03p/index.m3u8') },
      { label: 'Win+ S4',     url: p('http://190.60.37.154:45000/play/a00q/index.m3u8') },
      { label: 'Win+ HD',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/126.m3u8') },
      { label: 'Win+ S6',     url: p('http://m3u.tvcluboficial.com/m/m/1042.m3u8') },
    ]
  },

  // ─── DAZN ─────────────────────────────────────────────────────────────────
  {
    id: 'dazn', name: 'DAZN', icon: '🎬', cat: 'sports',
    servers: [
      { label: 'DAZN 1',      url: p('http://znty.dyndns.org:5010/hls/eleven1.m3u8') },
      { label: 'DAZN 2',      url: p('http://znty.dyndns.org:5010/hls/eleven2.m3u8') },
      { label: 'DAZN 3',      url: p('http://znty.dyndns.org:5010/hls/eleven3.m3u8') },
      { label: 'DAZN 4',      url: p('http://znty.dyndns.org:5010/hls/eleven4.m3u8') },
      { label: 'DAZN 5',      url: p('http://znty.dyndns.org:5010/hls/eleven5.m3u8') },
      { label: 'DAZN PT 1',   url: p('http://wo0dyefk.dienalt.org/iptv/DV3AC2Q6YSR9XE/2531/index.m3u8') },
      { label: 'DAZN PT 2',   url: p('http://wo0dyefk.dienalt.org/iptv/DV3AC2Q6YSR9XE/2532/index.m3u8') },
      { label: 'DAZN PT 3',   url: p('http://wo0dyefk.dienalt.org/iptv/DV3AC2Q6YSR9XE/7062/index.m3u8') },
    ]
  },

  // ─── Eurosport ────────────────────────────────────────────────────────────
  {
    id: 'eurosport', name: 'Eurosport', icon: '🇪🇺', cat: 'sports',
    servers: [
      { label: 'Euro 1',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/618.m3u8') },
      { label: 'Euro 2',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/619.m3u8') },
    ]
  },

  // ─── beIN Sports ──────────────────────────────────────────────────────────
  {
    id: 'bein', name: 'beIN Sports', icon: '⭐', cat: 'sports',
    servers: [
      { label: 'beIN Esp',    url: p('https://amg01334-beinsportsllc-beinxtraesp-localnow-aekzc.amagi.tv/playlist.m3u8') },
      { label: 'beIN Extra',  url: p('https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8') },
      { label: 'beIN FR 1',   url: p('http://99.27.51.147:8080/BeinSport/index.m3u8') },
      { label: 'beIN FR 3',   url: p('http://99.27.51.147:8080/BeinSport3/index.m3u8') },
      { label: 'beIN AU 1',   url: p('https://wahyu1ptv.pages.dev/AstroBein2.m3u8') },
      { label: 'beIN AU 2',   url: p('https://wahyu1ptv.pages.dev/AstroBein3.m3u8') },
      { label: 'beIN ñ HD',   url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/101.m3u8') },
    ]
  },
  {
    id: 'beinxtra', name: 'beIN XTRA', icon: '🌟', cat: 'sports',
    servers: [
      { label: 'beIN XTRA',   url: p('https://bein-xtra-bein.amagi.tv/playlist.m3u8') },
    ]
  },

  // ─── Real Madrid TV ───────────────────────────────────────────────────────
  {
    id: 'realmadrid', name: 'Real Madrid TV', icon: '⚽', cat: 'sports',
    servers: [
      { label: 'RM TV',       url: p('https://rmtv.akamaized.net/hls/live/2043153/rmtv-es-web/bitrate_3.m3u8') },
      { label: 'RM HD',       url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/121.m3u8') },
    ]
  },

  // ─── Red Bull TV ──────────────────────────────────────────────────────────
  {
    id: 'redbull', name: 'Red Bull TV', icon: '🐂', cat: 'sports',
    servers: [
      { label: 'Red Bull',    url: p('http://rbmn-live.akamaized.net/hls/live/590964/BoRB-AT/master_3360.m3u8') },
      { label: 'Garage TV',   url: p('https://stream1.sersat.com/hls/garagetv.m3u8') },
    ]
  },

  // ─── NBA TV ───────────────────────────────────────────────────────────────
  {
    id: 'nbatv', name: 'NBA TV', icon: '🏀', cat: 'sports',
    servers: [
      { label: 'NBA TV',      url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/402.m3u8') },
    ]
  },

  // ─── F1 Channel ───────────────────────────────────────────────────────────
  {
    id: 'f1tv', name: 'F1 Channel', icon: '🏎️', cat: 'sports',
    servers: [
      { label: 'DAZN F1',     url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/374.m3u8') },
    ]
  },

  // ─── Star Sports ──────────────────────────────────────────────────────────
  {
    id: 'star1', name: 'Star Sports 1', icon: '⭐', cat: 'sports',
    servers: [
      { label: 'Star S1 HD',  url: p('https://tvsen7.aynaott.com/sspts1/index.m3u8') },
      { label: 'Star India',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/113.m3u8') },
    ]
  },
  {
    id: 'star2', name: 'Star Sports 2 HD', icon: '⭐', cat: 'sports',
    servers: [
      { label: 'Star 2 HD',   url: p('https://tvsen7.aynaott.com/ssport2hd/index.m3u8') },
    ]
  },

  // ─── Willow Cricket ───────────────────────────────────────────────────────
  {
    id: 'willow', name: 'Willow Cricket', icon: '🏏', cat: 'sports',
    servers: [
      { label: 'Willow HD',   url: p('https://tvsen5.aynaott.com/willowhd/index.m3u8') },
      { label: 'Willow 1080', url: p('https://d36r8jifhgsk5j.cloudfront.net/Willow_TV1080p.m3u8') },
    ]
  },

  // ─── T Sports (Bangladesh) ────────────────────────────────────────────────
  {
    id: 'tsports', name: 'T Sports BD', icon: '🇧🇩', cat: 'sports',
    servers: [
      { label: 'T Sports HD', url: p('https://tvsen7.aynaott.com/tsports-hd/index.m3u8') },
      { label: 'T Sports S2', url: p('https://bss-hls.akamaized.net/hls/live/2093056/tsports/index.m3u8') },
    ]
  },

  // ─── Sony Sports ──────────────────────────────────────────────────────────
  {
    id: 'sony1', name: 'Sony Sports Ten 1', icon: '📺', cat: 'sports',
    servers: [
      { label: 'Sony Ten 1',  url: p('https://sl.vodep39240327.workers.dev/channel/SONY+TEN+1+HD.m3u8') },
    ]
  },
  {
    id: 'sony2', name: 'Sony Sports Ten 2', icon: '📺', cat: 'sports',
    servers: [
      { label: 'Sony Ten 2',  url: p('https://sl.vodep39240327.workers.dev/channel/SONY+TEN+2+HD.m3u8') },
    ]
  },
  {
    id: 'sony3', name: 'Sony Sports Ten 3', icon: '📺', cat: 'sports',
    servers: [
      { label: 'Sony Ten 3',  url: p('https://sl.vodep39240327.workers.dev/channel/SONY+TEN+3+HD.m3u8') },
    ]
  },

  // ─── Ten Sports ───────────────────────────────────────────────────────────
  {
    id: 'tensports', name: 'Ten Sports', icon: '🎯', cat: 'sports',
    servers: [
      { label: 'Ten Sports',  url: p('http://121.91.61.106:8000/play/a04h/index.m3u8') },
    ]
  },

  // ─── FS1 ──────────────────────────────────────────────────────────────────
  {
    id: 'fs1', name: 'Fox Sports 1', icon: '🦊', cat: 'sports',
    servers: [
      { label: 'FS1',         url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/3414.m3u8') },
    ]
  },

  // ─── Fancode ──────────────────────────────────────────────────────────────
  {
    id: 'fancode', name: 'Fancode', icon: '🏏', cat: 'sports',
    servers: [
      { label: 'Fancode S1',  url: p('https://tv.topmediatv.net:25463/live/TopMediaWeb/bOteTR8ED1/fancode.m3u8') },
      { label: 'Fancode S2',  url: p('http://185.246.209.123:8080/FanCode/index.m3u8') },
      { label: 'Fancode S3',  url: p('http://38.226.210.46:8000/play/A009/index.m3u8') },
    ]
  },

  // ─── Cricket Gold ─────────────────────────────────────────────────────────
  {
    id: 'cricketgold', name: 'Cricket Gold', icon: '🏏', cat: 'sports',
    servers: [
      { label: 'Cricket Gold', url: p('https://streams2.sofast.tv/ptnr-yupptv/title-cricketgold/v1/master/611d79b11b77e2f571934fd80ca1413453772ac7/b2048bb8-1686-4432-aa50-647245383e0c/manifest.m3u8') },
    ]
  },

  // ─── DAZN Combat ─────────────────────────────────────────────────────────
  {
    id: 'dazncombat', name: 'DAZN Combat', icon: '🥊', cat: 'sports',
    servers: [
      { label: 'DAZN Combat', url: p('https://dazn-combat-rakuten.amagi.tv/hls/amagi_hls_data_rakutenAA-dazn-combat-rakuten/CDN/master.m3u8') },
    ]
  },

  // ─── SPOTV ────────────────────────────────────────────────────────────────
  {
    id: 'spotv', name: 'SPOTV', icon: '🏅', cat: 'sports',
    servers: [
      { label: 'SPOTV 1',     url: p('http://primestreams.tv:826/live/mookie22/49aV7nBsK4/119515.m3u8') },
      { label: 'SPOTV 2',     url: p('http://primestreams.tv:826/live/mookie22/49aV7nBsK4/119516.m3u8') },
    ]
  },

  // ─── News ─────────────────────────────────────────────────────────────────
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
  // ── FOOTBALL — FIFA WORLD CUP 2026 ───────────────────────────────────────
  {
    id: 'wc-ger-cur', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP E',
    team1: { name: 'Germany', flag: '🇩🇪' }, team2: { name: 'Curaçao', flag: '🏝️' },
    status: 'upcoming', time: 'MON, JUN 15 · 1:00 AM', scoreA: '', scoreB: '', hot: true,
    channels: ['fox_eng','wctv','dsports','tudn','bein_tr','telemundo','m6','espn','fifa_wc','caze']
  },
  {
    id: 'wc-ned-jpn', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP F',
    team1: { name: 'Netherlands', flag: '🇳🇱' }, team2: { name: 'Japan', flag: '🇯🇵' },
    status: 'upcoming', time: 'MON, JUN 15 · 4:00 AM', scoreA: '', scoreB: '', hot: true,
    channels: ['fifa_wc','espn','tudn','fox_eng','bein_tr','wctv']
  },
  {
    id: 'wc-ivo-ecu', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP E',
    team1: { name: 'Ivory Coast', flag: '🇨🇮' }, team2: { name: 'Ecuador', flag: '🇪🇨' },
    status: 'upcoming', time: 'MON, JUN 15 · 7:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc','tudn','telemundo','fox_eng','espn']
  },
  {
    id: 'wc-swe-tun', cat: 'football', tournament: 'FIFA WORLD CUP 2026 · GROUP F',
    team1: { name: 'Sweden', flag: '🇸🇪' }, team2: { name: 'Tunisia', flag: '🇹🇳' },
    status: 'upcoming', time: 'MON, JUN 15 · 10:00 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['fifa_wc','espn','bein_tr','eurosport']
  },

  // ── CRICKET ───────────────────────────────────────────────────────────────
  {
    id: 'cr-wi-sl', cat: 'cricket', tournament: 'T20 INTERNATIONAL',
    team1: { name: 'West Indies', flag: '🏝️' }, team2: { name: 'Sri Lanka', flag: '🇱🇰' },
    status: 'upcoming', time: 'MON, JUN 15 · 8:30 AM', scoreA: '', scoreB: '', hot: false,
    channels: ['star1','star2','willow','sony1','espn','dsports']
  },

  // ── BASEBALL — MLB ────────────────────────────────────────────────────────
  {
    id: 'mlb-pir-mar', cat: 'baseball', tournament: 'MLB · REGULAR SEASON',
    team1: { name: 'Pittsburgh Pirates', flag: '⚾' }, team2: { name: 'Miami Marlins', flag: '⚾' },
    status: 'upcoming', time: 'MON, JUN 15 · 4:15 PM', scoreA: '', scoreB: '', hot: false,
    channels: ['espn2','espn']
  },

  // ── HOCKEY — NHL ──────────────────────────────────────────────────────────
  {
    id: 'nhl-vgk-car', cat: 'hockey', tournament: 'NHL STANLEY CUP FINALS',
    team1: { name: 'Vegas Golden Knights', flag: '🏒' }, team2: { name: 'Carolina Hurricanes', flag: '🌀' },
    status: 'upcoming', time: 'MON, JUN 15 · 12:00 AM', scoreA: '', scoreB: '', hot: true,
    channels: ['espn','tnt']
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