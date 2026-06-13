export async function GET() {
  try {
    const res = await fetch('https://streamed.su/api/matches/live', {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://streamed.su/' },
      next: { revalidate: 60 }
    })
    const data = await res.json()
    return Response.json(data)
  } catch(e) {
    return Response.json([])
  }
}
