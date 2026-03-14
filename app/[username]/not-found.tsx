import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <div>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Page not found</h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28, lineHeight: 1.6 }}>
          This page doesn't exist or hasn't been published yet.
        </p>
        <Link href="/" style={{
          padding: '12px 28px', borderRadius: 100, background: 'var(--accent)',
          color: '#0a0a0a', textDecoration: 'none', fontSize: 14, fontWeight: 600
        }}>
          Create your own page →
        </Link>
      </div>
    </div>
  )
}
