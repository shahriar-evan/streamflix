'use client'
import { useEffect, useRef, useState } from 'react'

export default function VideoPlayer({ url }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)
  const [quality, setQuality] = useState('auto')
  const [qualityLevels, setQualityLevels] = useState([])
  const [showQuality, setShowQuality] = useState(false)
  const [buffering, setBuffering] = useState(false)
  const [countdown, setCountdown] = useState(null)
  const countdownRef = useRef(null)

  const loadHLS = async (src) => {
    if (!src || !videoRef.current) return
    const video = videoRef.current
    const Hls = (await import('hls.js')).default
    if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
    if (Hls.isSupported()) {
      const hls = new Hls({ enableWorker: true, lowLatencyMode: true, autoLevelEnabled: true })
      hlsRef.current = hls
      hls.loadSource(src)
      hls.attachMedia(video)
      hls.on(Hls.Events.MANIFEST_PARSED, (e, data) => {
        video.play().catch(() => {})
        const levels = data.levels.map((l, i) => ({
          index: i,
          label: l.height ? `${l.height}p` : `Level ${i}`,
          bitrate: l.bitrate
        })).reverse()
        setQualityLevels(levels)
      })
      hls.on(Hls.Events.ERROR, (e, d) => {
        if (d.fatal) console.warn('HLS error', d.type)
      })
      video.addEventListener('waiting', () => setBuffering(true))
      video.addEventListener('playing', () => setBuffering(false))
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = src
      video.play().catch(() => {})
    }
  }

  useEffect(() => {
    // Clear old countdown
    if (countdownRef.current) clearInterval(countdownRef.current)
    if (!url) { setCountdown(null); return }

    // Start 5s countdown
    setCountdown(5)
    setBuffering(false)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current)
          loadHLS(url)
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearInterval(countdownRef.current)
      if (hlsRef.current) { hlsRef.current.destroy(); hlsRef.current = null }
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

  const refresh = () => {
    if (countdownRef.current) clearInterval(countdownRef.current)
    setCountdown(5)
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(countdownRef.current); loadHLS(url); return null }
        return prev - 1
      })
    }, 1000)
  }

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement
    if (!document.fullscreenElement) container?.requestFullscreen().catch(() => {})
    else document.exitFullscreen()
  }

  return (
    <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', maxHeight: '58vh' }}>
      {/* No stream selected */}
      {!url && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, background: 'linear-gradient(135deg,#0a0a0f,#1a1a28)'
        }}>
          <div style={{ fontSize: 52, opacity: 0.2 }}>▶</div>
          <p style={{ color: '#777', fontSize: 13 }}>Select a match or channel to watch live</p>
        </div>
      )}

      {/* Countdown Overlay */}
      {countdown !== null && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.92)', zIndex: 10
        }}>
          {/* Spinner ring */}
          <div style={{ position: 'relative', width: 100, height: 100, marginBottom: 20 }}>
            <div style={{
              position: 'absolute', inset: 0,
              border: '4px solid rgba(255,255,255,0.1)',
              borderTop: '4px solid #e50914',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: '#fff'
            }}>
              {countdown}
            </div>
          </div>
          <p style={{ color: '#aaa', fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            Connecting securely to the server...
          </p>
          <p style={{ color: '#666', fontSize: 12 }}>
            Optimizing stream for your device.
          </p>
        </div>
      )}

      {/* Buffering Spinner (after countdown) */}
      {buffering && !countdown && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.3)', zIndex: 5, pointerEvents: 'none'
        }}>
          <div style={{
            width: 48, height: 48, border: '4px solid rgba(255,255,255,0.2)',
            borderTop: '4px solid #e50914', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
        </div>
      )}

      <video ref={videoRef} controls playsInline style={{ width: '100%', height: '100%', display: 'block' }} />

      {url && !countdown && (
        <div style={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', gap: 6, zIndex: 10 }}>
          <div style={{ position: 'relative' }}>
            <button onClick={() => setShowQuality(!showQuality)} style={btnStyle}>
              ⚙ {quality.toUpperCase()}
            </button>
            {showQuality && (
              <div style={{
                position: 'absolute', bottom: '110%', right: 0,
                background: '#1a1a28', border: '1px solid #ffffff20',
                borderRadius: 8, overflow: 'hidden', minWidth: 140, zIndex: 20
              }}>
                <div onClick={() => setQualityLevel(-1)} style={qualityItemStyle(quality === 'auto')}>✓ Auto</div>
                {qualityLevels.map(l => (
                  <div key={l.index} onClick={() => setQualityLevel(l.index)} style={qualityItemStyle(quality === l.label)}>
                    {quality === l.label ? '✓ ' : ''}{l.label}
                    {l.bitrate ? ` • ${(l.bitrate/1000000).toFixed(1)} Mbps` : ''}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button onClick={refresh} style={btnStyle}>↺ Refresh</button>
          <button onClick={toggleFullscreen} style={btnStyle}>⛶ Fullscreen</button>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const btnStyle = {
  padding: '5px 10px', borderRadius: 6, fontSize: 11,
  fontWeight: 600, cursor: 'pointer',
  border: '1.5px solid rgba(255,255,255,0.2)',
  background: 'rgba(0,0,0,0.7)', color: '#fff',
  backdropFilter: 'blur(4px)', whiteSpace: 'nowrap'
}

const qualityItemStyle = (active) => ({
  padding: '8px 14px', fontSize: 12, cursor: 'pointer',
  color: active ? '#e50914' : '#f0f0f0',
  fontWeight: active ? 700 : 400,
  background: active ? '#ffffff08' : 'transparent',
  transition: 'background .15s',
})