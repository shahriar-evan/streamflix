import Link from 'next/link'

export const metadata = { title: 'Page not found', robots: { index: false } }

export default function NotFound() {
  return (
    <main className="notfound">
      <span className="notfound-ico">🏟️</span>
      <h1>This match isn&apos;t available anymore</h1>
      <p>Matches are removed a few days after they finish. See today&apos;s live scores and fixtures instead.</p>
      <Link href="/" className="btn btn-primary">Go to live scores</Link>
    </main>
  )
}
