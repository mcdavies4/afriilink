'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { createClient } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [magicSent, setMagicSent] = useState(false)
  const [mode, setMode] = useState<'password' | 'magic'>('magic')

  async function handleMagicLink() {
    if (!email) return toast.error('Enter your email')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/api/auth/callback` }
    })
    setLoading(false)
    if (error) return toast.error(error.message)
    setMagicSent(true)
  }

  async function handlePassword() {
    if (!email || !password) return toast.error('Fill in all fields')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) return toast.error(error.message)
    router.push('/dashboard')
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/api/auth/callback` }
    })
  }

  const inputStyle = {
    width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: '10px', padding: '12px 16px', color: '#f0f0f0',
    fontSize: '14px', outline: 'none', fontFamily: 'inherit'
  }

  if (magicSent) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', maxWidth: 400, padding: '0 24px' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>Check your email</h2>
        <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.6 }}>
          We sent a magic link to <strong style={{ color: 'var(--text)' }}>{email}</strong>.<br />
          Click it to sign in instantly — no password needed.
        </p>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--text)' }}>
              Afrii<span style={{ color: "var(--accent)" }}>link</span>
            </span>
          </Link>
          <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 6 }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Sign in to your account</p>
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: 32 }}>
          {/* Google */}
          <button onClick={handleGoogle}
            style={{ width: '100%', padding: '12px 16px', borderRadius: 10, background: 'var(--bg)', border: '1px solid var(--border)',
                     color: 'var(--text)', fontSize: 14, fontWeight: 500, cursor: 'pointer', marginBottom: 20,
                     display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ color: 'var(--muted)', fontSize: 12 }}>or</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Mode toggle */}
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 10, padding: 4, marginBottom: 20, border: '1px solid var(--border)' }}>
            {(['magic', 'password'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                         background: mode === m ? 'var(--surface2)' : 'transparent',
                         border: mode === m ? '1px solid var(--border)' : '1px solid transparent',
                         color: mode === m ? 'var(--text)' : 'var(--muted)' }}>
                {m === 'magic' ? '✨ Magic link' : '🔑 Password'}
              </button>
            ))}
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.5px' }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" style={inputStyle} />
          </div>

          {mode === 'password' && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', marginBottom: 6, letterSpacing: '0.5px' }}>PASSWORD</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" style={inputStyle} />
            </div>
          )}

          <button
            onClick={mode === 'magic' ? handleMagicLink : handlePassword}
            disabled={loading}
            style={{ width: '100%', padding: '13px 16px', borderRadius: 10, border: 'none',
                     background: 'var(--accent)', color: '#0a0a0a', fontSize: 14, fontWeight: 600,
                     cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1,
                     fontFamily: 'inherit', marginTop: mode === 'magic' ? 20 : 0 }}>
            {loading ? 'Sending...' : mode === 'magic' ? 'Send magic link →' : 'Sign in →'}
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: 'var(--muted)' }}>
          No account?{' '}
          <Link href="/register" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
