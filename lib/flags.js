// Country flags as a fallback logo when ESPN has no team image (common for cricket).
// A national side ("Bangladesh A", "China Women") gets its own flag; a domestic club gets
// the flag of the country its league is played in.
const COUNTRIES = {
  afghanistan: 'af', australia: 'au', bangladesh: 'bd', canada: 'ca', china: 'cn',
  england: 'gb-eng', scotland: 'gb-sct', wales: 'gb-wls', ireland: 'ie', india: 'in',
  'hong kong': 'hk', japan: 'jp', kenya: 'ke', malaysia: 'my', namibia: 'na', nepal: 'np',
  netherlands: 'nl', 'new zealand': 'nz', oman: 'om', pakistan: 'pk', 'papua new guinea': 'pg',
  qatar: 'qa', 'south africa': 'za', 'sri lanka': 'lk', thailand: 'th', uganda: 'ug',
  'united arab emirates': 'ae', uae: 'ae', 'united states': 'us', usa: 'us', 'west indies': 'jm',
  zimbabwe: 'zw', singapore: 'sg', indonesia: 'id', bahrain: 'bh', kuwait: 'kw', nigeria: 'ng',
  rwanda: 'rw', tanzania: 'tz', germany: 'de', italy: 'it', france: 'fr', spain: 'es',
  jersey: 'je', guernsey: 'gg', bhutan: 'bt', maldives: 'mv', myanmar: 'mm', philippines: 'ph',
  vietnam: 'vn', cambodia: 'kh', mongolia: 'mn', samoa: 'ws', vanuatu: 'vu', fiji: 'fj',
}

// League name keywords → host country
const LEAGUES = [
  [/plunket|ford trophy|super smash|new zealand/i, 'nz'],
  [/sheffield shield|marsh cup|big bash|wbbl|australia/i, 'au'],
  [/ranji|vijay hazare|syed mushtaq|duleep|ipl|indian premier|india/i, 'in'],
  [/quaid|pakistan|psl|national t20 cup/i, 'pk'],
  [/slc|sri lanka|lpl|major league tournament/i, 'lk'],
  [/csa|south africa|sa20|4-day series|one-day cup/i, 'za'],
  [/bpl|bangladesh|national cricket league/i, 'bd'],
  [/npl|nepal/i, 'np'],
  [/ilt20|international league t20|emirates|uae/i, 'ae'],
  [/county|vitality|blast|hundred|england/i, 'gb-eng'],
  [/cpl|caribbean|west indies|super50/i, 'jm'],
  [/mlc|major league cricket|usa/i, 'us'],
  [/hong kong/i, 'hk'],
  [/zimbabwe|logan cup/i, 'zw'],
  [/afghanistan|shpageeza/i, 'af'],
]

const url = (code) => `https://flagcdn.com/w160/${code}.png`

export function teamFlag(teamName = '', leagueName = '') {
  const name = teamName.toLowerCase().replace(/\(.*?\)/g, ' ').replace('new south wales', 'nsw')
  const hit = Object.keys(COUNTRIES)
    .sort((a, b) => b.length - a.length)
    .find((c) => new RegExp(`(^|\\b)${c}(\\b|$)`).test(name))
  if (hit) return url(COUNTRIES[hit])
  const lg = LEAGUES.find(([re]) => re.test(leagueName))
  return lg ? url(lg[1]) : ''
}
