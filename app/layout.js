import './globals.css'

export const metadata = {
  title: 'StreamFlix — Live Sports & TV',
  description: 'Watch live sports, FIFA World Cup 2026, cricket, and more',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
