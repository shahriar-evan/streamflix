'use client'
import { useEffect, useRef } from 'react'

export default function VideoPlayer({ url }) {
  const videoRef = useRef(null)
  const hlsRef = useRef(null)

  useEffect(() => {
    if (!url || !videoRef.current) return

    const video = videoRef.current

    const loadHls = async () => {
      const Hls = (await import('hls.js')).default

      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, lowLatencyMode: true })
        hlsRef.current = hls
        hls.loadSource(url)
        hls.attachMedia(video)
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {})
        })
        hls.on(Hls.Events.ERROR, (e, d) => {
          if (d.fatal) console.warn('HLS error', d.type)
        })
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url
        video.play().catch(() => {})
      }
    }

    loadHls()

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [url])

  const toggleFullscreen = () => {
    const container = videoRef.current?.parentElement
    if (!document.fullscreenElement) {
      container?.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div style={{ position: 'relative', background: '#000', aspectRatio: '16/9', maxHeight: '58vh' }}>
      {!url && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 12, background: 'linear-gradient(135deg,#0a0a0f,#1a1a28)'
        }}>
          <div style={{ fontSize: 52, opacity: 0.2 }}>▶</div>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>Select a match to watch live</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        playsInline
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
      {url && (
        <button
          onClick={toggleFullscreen}
          style={{
            position: 'absolute', bottom: 8, right: 8,
            padding: '4px 10px', borderRadius: 6, fontSize: 11,
            fontWeight: 600, cursor: 'pointer',
            border: '1.5px solid rgba(255,255,255,0.2)',
            background: 'rgba(0,0,0,0.6)', color: '#fff',
            backdropFilter: 'blur(4px)'
          }}
        >
          ⛶ Fullscreen
        </button>
      )}
    </div>
  )
}
