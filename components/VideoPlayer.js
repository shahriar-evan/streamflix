'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

export default function VideoPlayer({ url, onStreamFail, muted = false }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [quality, setQuality] = useState('auto')
  const [qualityLevels, setQualityLevels] = useState([])
  const [showQuality, setShowQuality] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const countdownRef = useRef(null)
  const stuckRef = useRef(null)
  const lastTimeRef = useRef(0)
  const lastTimeStampRef = useRef(Date.now())
  const failCountRef = useRef(0)
  const mediaRecoveryRef = useRef(false)
  const failRef = useRef(onStreamFail)
  failRef.current = onStreamFail
  const fail = () => failRef.current?.()

  // Volume: remembered per viewer; the ad break (muted prop) always wins
  const [volume, setVolume] = useState(1)
  const [userMuted, setUserMuted] = useState(false)
  useEffect(() => {
    try {
      const v = parseFloat(localStorage.getItem('lf_volume'))
      if (!isNaN(v)) setVolume(Math.min(1, Math.max(0, v)))
      setUserMuted(localStorage.getItem('lf_muted') === '1')
    } catch {}
  }, [])
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.volume = volume
    v.muted = muted || userMuted || volume === 0
    try { localStorage.setItem('lf_volume', String(volume)); localStorage.setItem('lf_muted', userMuted ? '1' : '0') } catch {}
  }, [muted, userMuted, volume])
  const changeVolume = (v) => { setVolume(v); if (v > 0) setUserMuted(false) }
  const toggleMute = () => {
    if (userMuted || volume === 0) { setUserMuted(false); if (volume === 0) setVolume(0.5) }
    else setUserMuted(true)
  }
  // Keyboard: ↑/↓ volume, M mute, F fullscreen (ignored while typing in a field)
  useEffect(() => {
    const onKey = (e) => {
      if (!url || /input|textarea|select/i.test(e.target?.tagName)) return
      if (e.key === 'ArrowUp') { e.preventDefault(); changeVolume(Math.min(1, +(volume + 0.1).toFixed(2))) }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setVolume(Math.max(0, +(volume - 0.1).toFixed(2))) }
      else if (e.key === 'm' || e.key === 'M') toggleMute()
      else if (e.key === 'f' || e.key === 'F') toggleFullscreen()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const destroyHls = () => {
    clearInterval(stuckRef.current)
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
  }

  const loadHLS = useCallback(async (src) => {
    if (!src || !videoRef.current) return
    const video = videoRef.current
    destroyHls()
    failCountRef.current = 0
    mediaRecoveryRef.current = false

    const Hls = (await import('hls.js')).default
    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        autoLevelEnabled: true,
        startLevel: -1,
        maxBufferLength: 20,
        maxMaxBufferLength: 40,
        maxBufferHole: 0.3,
        nudgeOffset: 0.2,
        nudgeMaxRetry: 8,
        fragLoadingMaxRetry: 4,
        capLevelToPlayerSize: false,
        fragLoadingRetryDelay: 500,
        manifestLoadingMaxRetry: 5,
        manifestLoadingRetryDelay: 500,
        levelLoadingMaxRetry: 5,
        levelLoadingRetryDelay: 500,
      })
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        video.play().catch(() => {})
        const levels = data.levels
          .map((l, i) => ({ index: i, label: l.height ? `${l.height}p` : `Level ${i}`, bitrate: l.bitrate }))
          .sort((a, b) => (parseInt(b.label) || 0) - (parseInt(a.label) || 0))
        setQualityLevels(levels)
        failCountRef.current = 0
        // Lock to the highest resolution (manual level = hls.js won't drop quality)
        if (levels.length > 1) {
          hls.currentLevel = levels[0].index
          setQuality(levels[0].label)
        }
      })

      hls.on(Hls.Events.FRAG_LOADED, () => {
        failCountRef.current = 0
        mediaRecoveryRef.current = false
        lastTimeRef.current = video.currentTime
        lastTimeStampRef.current = Date.now()
      })

      hls.on(Hls.Events.ERROR, (_, d) => {
        if (!d.fatal) return
        failCountRef.current++
        console.warn('HLS fatal error:', d.type, d.details, 'attempt:', failCountRef.current)

        if (d.type === Hls.ErrorTypes.NETWORK_ERROR) {
          if (failCountRef.current <= 2) {
            setTimeout(() => hls.startLoad(), 700 * failCountRef.current)
          } else {
            failCountRef.current = 0
            fail()
          }
        } else if (d.type === Hls.ErrorTypes.MEDIA_ERROR) {
          if (!mediaRecoveryRef.current) {
            mediaRecoveryRef.current = true
            hls.recoverMediaError()
          } else {
            fail()
          }
        } else {
          fail()
        }
      })

      // Stuck detector — check every 5s
      stuckRef.current = setInterval(() => {
        const v = videoRef.current
        if (!v || v.paused || v.ended || !v.src) return
        const now = Date.now()
        const timeSinceProgress = now - lastTimeStampRef.current
        const currentTime = v.currentTime

        if (currentTime === lastTimeRef.current && timeSinceProgress > 8000 && !v.paused) {
          console.warn('Stream stuck detected, recovering...')
          failCountRef.current++
          if (failCountRef.current <= 2) {
            hls.startLoad()
            v.play().catch(() => {})
          } else {
            failCountRef.current = 0
            fail()
          }
        } else if (currentTime !== lastTimeRef.current) {
          lastTimeRef.current = currentTime
          lastTimeStampRef.current = now
        }
      }, 5000)

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.play().catch(() => {})
    }

    video.addEventListener('waiting', () => setBuffering(true))
    video.addEventListener('playing', () => {
      setBuffering(false)
      lastTimeRef.current = video.currentTime
      lastTimeStampRef.current = Date.now()
    })
  }, [])

  const startCountdown = useCallback((src, secs = 3) => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    destroyHls()
    setCountdown(secs)
    setBuffering(false)
    setQualityLevels([])
    setQuality('auto')

    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          loadHLS(src)
          return null
        }
        return prev - 1
      })
    }, 1000)
  }, [loadHLS])

  useEffect(() => {
    if (!url) { setCountdown(null); return }
    startCountdown(url, 1)
    return () => {
      clearInterval(countdownRef.current)
      destroyHls()
    }
  }, [url])

  const setQualityLevel = (idx) => {
    if (!hlsRef.current) return
    if (idx === -1) { hlsRef.current.currentLevel = -1; setQuality('auto') }
    else {
      hlsRef.current.currentLevel = idx
      const lvl = qualityLevels.find(l => l.index === idx)
      setQuality(lvl?.label || 'auto')
    }
    setShowQuality(false)
  }

  const refresh = () => url && startCountdown(url, 1)
  const toggleFullscreen = () => {
    const c = videoRef.current?.parentElement
    if (!document.fullscreenElement) c?.requestFullscreen?.().catch(() => {})
    else document.exitFullscreen?.()
  }

  const silent = muted || userMuted || volume === 0

  return (
    <div className="vplayer" style={{ position: 'relative', background: '#000', aspectRatio: '16/9', width: '100%' }}>

      {!url && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#0a0a0f,#1a1a28)', gap:14, padding:24, textAlign:'center' }}>
          <div style={{ fontSize:54, opacity:0.15 }}>📺</div>
          <p style={{ color:'#aaa', fontSize:15, fontWeight:700, margin:0 }}>Pick a channel to start watching</p>
          <p style={{ color:'#555', fontSize:12, margin:0 }}>Choose a channel from the list</p>
        </div>
      )}

      {countdown !== null && (
        <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.93)', zIndex:10 }}>
          <div style={{ position:'relative', width:100, height:100, marginBottom:20 }}>
            <div style={{ position:'absolute', inset:0, border:'5px solid rgba(255,255,255,0.08)', borderTop:'5px solid #e50914', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:800, color:'#fff' }}>{countdown}</div>
          </div>
          <p style={{ color:'#ccc', fontSize:14, fontWeight:600, marginBottom:6 }}>Connecting to server...</p>
          <p style={{ color:'#666', fontSize:12 }}>Optimizing stream for your device.</p>
        </div>
      )}

      {buffering && !countdown && (
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.3)', zIndex:5, pointerEvents:'none' }}>
          <div style={{ width:52, height:52, border:'4px solid rgba(255,255,255,0.15)', borderTop:'4px solid #e50914', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
        </div>
      )}

      <video ref={videoRef} playsInline style={{ width:'100%', height:'100%', display:'block', objectFit:'contain', background:'#000' }} />

      {url && !countdown && (
        <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'flex', alignItems:'center', justifyContent:'flex-end', gap:6, padding:'10px 12px', background:'linear-gradient(transparent,rgba(0,0,0,0.75))', zIndex:10 }}>
          <div className="vp-vol" style={{ display:'flex', alignItems:'center', gap:6, marginRight:'auto' }}>
            <button onClick={toggleMute} style={{ ...btn, padding:'5px 8px', display:'flex', alignItems:'center' }} aria-label={silent ? 'Unmute' : 'Mute'} title="Mute (M)">
              <SpeakerIcon level={silent ? 0 : volume < 0.5 ? 1 : 2} />
            </button>
            <input type="range" min="0" max="1" step="0.05" value={silent ? 0 : volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              aria-label="Volume" title="Volume (↑/↓)"
              style={{ width:90, accentColor:'#e50914', cursor:'pointer' }} />
          </div>
          <div style={{ position:'relative' }}>
            <button onClick={() => setShowQuality(!showQuality)} style={btn}>⚙ {quality === 'auto' ? 'AUTO' : quality}</button>
            {showQuality && (
              <div style={{ position:'absolute', bottom:'110%', right:0, background:'#1c1c2e', border:'1px solid rgba(255,255,255,0.12)', borderRadius:10, overflow:'hidden', minWidth:160, zIndex:30, boxShadow:'0 4px 24px rgba(0,0,0,0.5)' }}>
                <div style={{ padding:'10px 14px 6px', fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'1.5px', borderBottom:'1px solid rgba(255,255,255,0.06)' }}>Resolution</div>
                <div onClick={() => setQualityLevel(-1)} style={qItem(quality==='auto')}>
                  <span>Auto</span>{quality==='auto'&&<span style={{color:'#e50914'}}>✓</span>}
                </div>
                {qualityLevels.map(l => (
                  <div key={l.index} onClick={() => setQualityLevel(l.index)} style={qItem(quality===l.label)}>
                    <span>{l.label}{l.label==='1080p'&&<span style={{fontSize:9,color:'#e50914',fontWeight:700,marginLeft:4}}>HD</span>}
                      {l.bitrate>0&&<span style={{fontSize:10,color:'#666',marginLeft:6}}>{(l.bitrate/1000000).toFixed(1)}Mbps</span>}
                    </span>
                    {quality===l.label&&<span style={{color:'#e50914'}}>✓</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={refresh} style={btn}>↺ Refresh</button>
          <button onClick={toggleFullscreen} style={btn}>⛶ Fullscreen</button>
        </div>
      )}
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

const btn = { padding:'6px 12px', borderRadius:7, fontSize:11, fontWeight:600, cursor:'pointer', border:'1px solid rgba(255,255,255,0.18)', background:'rgba(0,0,0,0.65)', color:'#fff', backdropFilter:'blur(6px)', whiteSpace:'nowrap' }
const qItem = (a) => ({ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 14px', fontSize:13, cursor:'pointer', color:a?'#fff':'#ccc', fontWeight:a?600:400, background:a?'rgba(229,9,20,0.15)':'transparent' })
// White speaker glyph with 0 (muted ×), 1 or 2 sound waves
function SpeakerIcon({ level }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9h4l5-4v14l-5-4H4z" fill="#fff" />
      {level === 0 && <><line x1="16.5" y1="9.5" x2="21.5" y2="14.5" /><line x1="21.5" y1="9.5" x2="16.5" y2="14.5" /></>}
      {level >= 1 && <path d="M16 9.5a3.5 3.5 0 0 1 0 5" />}
      {level >= 2 && <path d="M18.5 6.5a7.5 7.5 0 0 1 0 11" />}
    </svg>
  )
}
