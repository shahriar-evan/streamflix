import { NextResponse } from 'next/server'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const targetUrl = searchParams.get('url')
  if (!targetUrl) return NextResponse.json({ error: 'url required' }, { status: 400 })

  try {
    const res = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Referer': new URL(targetUrl).origin + '/',
        'Origin': new URL(targetUrl).origin,
        'Accept': '*/*',
      }
    })

    const contentType = res.headers.get('content-type') || ''
    const isM3U8 = targetUrl.includes('.m3u8') || contentType.includes('mpegurl')

    if (isM3U8) {
      const text = await res.text()
      const base = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1)
      const proxyBase = '/api/proxy?url='
      const rewritten = text.split('\n').map(line => {
        line = line.trim()
        if (!line || line.startsWith('#')) return line
        if (line.startsWith('http')) return proxyBase + encodeURIComponent(line)
        return proxyBase + encodeURIComponent(base + line)
      }).join('\n')
      return new Response(rewritten, {
        headers: {
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Access-Control-Allow-Origin': '*',
        }
      })
    }

    const buffer = await res.arrayBuffer()
    return new Response(buffer, {
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
      }
    })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 })
  }
}
