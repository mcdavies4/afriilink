'use client'
import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile, THEMES, Theme } from '@/types'
import toast from 'react-hot-toast'
import { Check, Eye } from 'lucide-react'

export default function AppearancePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [saving, setSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(true)
  const supabase = createClient()

  // Editable fields
  const [displayName, setDisplayName] = useState('')
  const [username, setUsername]     = useState('')
  const [bio, setBio]               = useState('')
  const [theme, setTheme]           = useState('dark_lime')
  const [coverColor, setCoverColor] = useState('linear-gradient(135deg,#7b6ef6,#ff6b35)')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (!p) return
      setProfile(p)
      setDisplayName(p.display_name || '')
      setUsername(p.username || '')
      setBio(p.bio || '')
      setTheme(p.theme || 'dark_lime')
      setCoverColor(p.cover_color || 'linear-gradient(135deg,#7b6ef6,#ff6b35)')
    }
    load()
  }, [])

  const activeTheme = THEMES.find(t => t.id === theme) || THEMES[0]

  async function save() {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ display_name: displayName, username, bio, theme, cover_color: coverColor })
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    setProfile(data.profile)
    toast.success('Saved!')
  }

  const inputStyle = {
    width: '100%', background: '#0a0a0a', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit', transition: 'border-color 0.2s'
  }

  const coverGradients = [
    'linear-gradient(135deg,#7b6ef6,#ff6b35)',
    'linear-gradient(135deg,#ff006e,#fb5607)',
    'linear-gradient(135deg,#0077b6,#00b4d8)',
    'linear-gradient(135deg,#2d6a4f,#52b788)',
    'linear-gradient(135deg,#e9c46a,#f4a261)',
    'linear-gradient(135deg,#240046,#7b2d8b)',
    'linear-gradient(135deg,#1a1a1a,#3a3a3a)',
    'linear-gradient(135deg,#c8f04d,#7b6ef6)',
    'linear-gradient(135deg,#ff6b35,#ffbe0b)',
    'linear-gradient(135deg,#0d1b2a,#1b4332)',
    'linear-gradient(135deg,#6a0572,#ab83a1)',
    'linear-gradient(135deg,#2c3e50,#4ca1af)',
  ]

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 'calc(100vh - 0px)' }}>

      {/* Editor Panel */}
      <div style={{ flex: 1, padding: '36px 40px', overflowY: 'auto', maxWidth: 520 }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Appearance</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>Customise how your page looks to visitors</p>
        </div>

        {/* Profile Info */}
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 18 }}>Profile</h2>

          {/* Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%', cursor: 'pointer',
              background: coverColor, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 28, border: '3px solid var(--border)',
              flexShrink: 0, transition: 'transform 0.2s'
            }}>😊</div>
            <div>
              <button style={{
                padding: '8px 16px', borderRadius: 100, background: 'transparent',
                border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13,
                cursor: 'pointer', fontFamily: 'inherit', marginBottom: 6, display: 'block'
              }}>Upload photo</button>
              <p style={{ fontSize: 11, color: 'var(--muted)' }}>JPG, PNG or GIF · Max 2MB</p>
            </div>
          </div>

          {[
            { label: 'Display Name', value: displayName, set: setDisplayName, placeholder: 'Your full name' },
            { label: 'Username', value: username, set: setUsername, placeholder: 'yourname', prefix: 'afriilink.com/' },
          ].map(f => (
            <div key={f.label} style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: 6 }}>
                {f.label.toUpperCase()}
              </label>
              {f.prefix ? (
                <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden', background: '#0a0a0a' }}>
                  <span style={{ padding: '10px 12px', fontSize: 14, color: 'var(--muted)', background: 'var(--surface2)', borderRight: '1px solid var(--border)', whiteSpace: 'nowrap' }}>
                    {f.prefix}
                  </span>
                  <input value={f.value} onChange={e => f.set(e.target.value)}
                    placeholder={f.placeholder}
                    style={{ ...inputStyle, border: 'none', borderRadius: 0 }} />
                </div>
              ) : (
                <input value={f.value} onChange={e => f.set(e.target.value)}
                  placeholder={f.placeholder} style={inputStyle} />
              )}
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: 6 }}>BIO</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Tell the world who you are..."
              rows={3}
              style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
            <div style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>
              {bio.length}/160
            </div>
          </div>
        </section>

        {/* Cover gradient */}
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Cover</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>The header gradient shown at the top of your page</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 8 }}>
            {coverGradients.map(g => (
              <div key={g} onClick={() => setCoverColor(g)}
                style={{
                  height: 40, borderRadius: 10, background: g, cursor: 'pointer',
                  border: `2px solid ${coverColor === g ? 'var(--accent)' : 'transparent'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'border-color 0.15s'
                }}>
                {coverColor === g && <Check size={14} color="#fff" />}
              </div>
            ))}
          </div>
        </section>

        {/* Themes */}
        <section style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, marginBottom: 24 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Theme</h2>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>Background and colour scheme for your page</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10 }}>
            {THEMES.map(t => (
              <div key={t.id} onClick={() => setTheme(t.id)}
                style={{
                  padding: '14px 16px', borderRadius: 12, cursor: 'pointer',
                  background: t.bg, border: `2px solid ${theme === t.id ? 'var(--accent)' : t.id === 'light_clean' ? '#ddd' : '#2a2a2a'}`,
                  display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 0.15s'
                }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: t.accent, flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: t.text, fontWeight: theme === t.id ? 600 : 400 }}>{t.name}</span>
                {theme === t.id && <Check size={14} style={{ color: t.accent, marginLeft: 'auto' }} />}
              </div>
            ))}
          </div>
        </section>

        <button onClick={save} disabled={saving} style={{
          width: '100%', padding: '14px', borderRadius: 100, background: 'var(--accent)',
          border: 'none', color: '#0a0a0a', fontSize: 15, fontWeight: 700,
          cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit'
        }}>
          {saving ? 'Saving...' : 'Save changes →'}
        </button>
      </div>

      {/* Live Preview */}
      <div style={{
        width: 360, borderLeft: '1px solid var(--border)', padding: '36px 28px',
        position: 'sticky', top: 0, height: '100vh', overflowY: 'auto',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(123,110,246,0.06), transparent 60%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 500 }}>LIVE PREVIEW</span>
          <Eye size={14} style={{ color: 'var(--muted)' }} />
        </div>

        {/* Mini phone preview */}
        <div style={{
          background: '#000', borderRadius: 36, border: '8px solid #222',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)', overflow: 'hidden'
        }}>
          {/* Notch */}
          <div style={{ background: '#000', height: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div style={{ width: 80, height: 22, background: '#111', borderRadius: '0 0 14px 14px' }} />
          </div>

          {/* Screen */}
          <div style={{ background: activeTheme.bg, maxHeight: 600, overflowY: 'auto' }}>
            {/* Cover */}
            <div style={{ height: 120, background: coverColor, position: 'relative' }}>
              <div style={{
                position: 'absolute', bottom: -36, left: 20,
                width: 72, height: 72, borderRadius: '50%',
                background: coverColor, border: `4px solid ${activeTheme.bg}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
              }}>😊</div>
            </div>

            <div style={{ padding: '44px 20px 24px' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: activeTheme.text, marginBottom: 2 }}>
                {displayName || 'Your Name'}
              </div>
              <div style={{ fontSize: 11, color: activeTheme.accent, fontFamily: 'monospace', marginBottom: 8 }}>
                @{username || 'yourname'}
              </div>
              <div style={{ fontSize: 12, color: activeTheme.text, opacity: 0.6, lineHeight: 1.6, marginBottom: 16, whiteSpace: 'pre-wrap' }}>
                {bio || 'Your bio will appear here...'}
              </div>

              {/* Sample links */}
              {['🌐 My Website', '📸 Instagram', '🛍️ Shop'].map(l => (
                <div key={l} style={{
                  background: activeTheme.surface, border: `1px solid ${activeTheme.id === 'light_clean' ? '#ddd' : '#2a2a2a'}`,
                  borderRadius: 10, padding: '10px 14px', marginBottom: 8, fontSize: 13,
                  color: activeTheme.text, display: 'flex', alignItems: 'center', gap: 8
                }}>
                  <span>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
