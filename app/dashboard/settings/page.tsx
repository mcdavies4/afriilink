'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'
import toast from 'react-hot-toast'
import { useSearchParams } from 'next/navigation'
import { Zap, Globe, Shield, Trash2, ExternalLink } from 'lucide-react'

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [customDomain, setCustomDomain] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDesc, setSeoDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [loadingCheckout, setLoadingCheckout] = useState(false)
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    if (searchParams.get('upgraded') === 'true') {
      toast.success('🎉 Welcome to Pro!')
    }
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (!p) return
      setProfile(p)
      setCustomDomain(p.custom_domain || '')
      setIsPublished(p.is_published)
      setSeoTitle(p.seo_title || '')
      setSeoDesc(p.seo_description || '')
    }
    load()
  }, [])

  async function saveSettings() {
    setSaving(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_published: isPublished,
        seo_title: seoTitle,
        seo_description: seoDesc,
        custom_domain: customDomain || null,
      })
    })
    const data = await res.json()
    setSaving(false)
    if (data.error) return toast.error(data.error)
    setProfile(data.profile)
    toast.success('Settings saved!')
  }

  async function upgradeToProHandler() {
    setLoadingCheckout(true)
    const res = await fetch('/api/stripe/checkout', { method: 'POST' })
    const data = await res.json()
    setLoadingCheckout(false)
    if (data.url) window.location.href = data.url
    else toast.error('Could not open checkout')
  }

  async function openPortal() {
    setLoadingPortal(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    setLoadingPortal(false)
    if (data.url) window.location.href = data.url
    else toast.error('No billing account found')
  }

  const inputStyle = {
    width: '100%', background: '#0a0a0a', border: '1px solid var(--border)',
    borderRadius: 10, padding: '10px 14px', color: 'var(--text)',
    fontSize: 14, outline: 'none', fontFamily: 'inherit'
  }

  const sectionStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: 24, marginBottom: 20
  }

  const isPro = profile?.plan === 'pro'

  return (
    <div style={{ padding: '36px 40px', maxWidth: 640 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--muted)' }}>Manage your page and account preferences</p>
      </div>

      {/* Plan & Billing */}
      <section style={{
        ...sectionStyle,
        background: isPro ? 'linear-gradient(135deg,rgba(123,110,246,0.08),rgba(200,240,77,0.04))' : 'var(--surface)',
        border: isPro ? '1px solid rgba(123,110,246,0.25)' : '1px solid var(--border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Zap size={18} style={{ color: isPro ? 'var(--accent)' : 'var(--muted)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Plan & Billing</h2>
          <span style={{
            marginLeft: 'auto', padding: '3px 12px', borderRadius: 100, fontSize: 11, fontWeight: 700,
            background: isPro ? 'var(--accent)' : 'var(--border)',
            color: isPro ? '#0a0a0a' : 'var(--muted)'
          }}>{isPro ? 'PRO' : 'FREE'}</span>
        </div>

        {isPro ? (
          <div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
              You're on the Pro plan — unlimited links, custom domain, 90-day analytics and all premium features.
            </p>
            <button onClick={openPortal} disabled={loadingPortal} style={{
              padding: '10px 20px', borderRadius: 100, background: 'transparent',
              border: '1px solid var(--border)', color: 'var(--text)', fontSize: 13,
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6
            }}>
              <ExternalLink size={14} />
              {loadingPortal ? 'Loading...' : 'Manage billing →'}
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
              {[
                ['5 links max', 'Unlimited links'],
                ['afriilink.com/you', 'Custom domain'],
                ['7 day analytics', '90 day analytics'],
                ['Standard support', 'Priority support'],
              ].map(([free, pro]) => (
                <div key={free} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', fontSize: 12 }}>
                  <span style={{ color: 'var(--accent)', marginTop: 1 }}>→</span>
                  <span style={{ color: 'var(--muted)' }}><span style={{ textDecoration: 'line-through' }}>{free}</span> → <strong style={{ color: 'var(--text)' }}>{pro}</strong></span>
                </div>
              ))}
            </div>
            <button onClick={upgradeToProHandler} disabled={loadingCheckout} style={{
              padding: '12px 28px', borderRadius: 100, background: 'var(--accent)',
              border: 'none', color: '#0a0a0a', fontSize: 14, fontWeight: 700,
              cursor: loadingCheckout ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              opacity: loadingCheckout ? 0.7 : 1
            }}>
              {loadingCheckout ? 'Redirecting...' : 'Upgrade to Pro — £7/mo →'}
            </button>
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>14 day free trial · Cancel anytime</p>
          </div>
        )}
      </section>

      {/* Publish */}
      <section style={sectionStyle}>
        <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Publish Status</h2>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.6 }}>
          When published, your page is publicly accessible at{' '}
          <span style={{ color: 'var(--accent)', fontFamily: 'monospace', fontSize: 12 }}>
            afriilink.com/{profile?.username}
          </span>
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div onClick={() => setIsPublished(!isPublished)}
            style={{
              width: 48, height: 26, borderRadius: 100, cursor: 'pointer',
              background: isPublished ? 'var(--accent)' : 'var(--border)',
              position: 'relative', transition: 'background 0.2s', flexShrink: 0
            }}>
            <div style={{
              position: 'absolute', top: 3, left: isPublished ? 25 : 3,
              width: 20, height: 20, borderRadius: '50%', background: 'white',
              transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)'
            }} />
          </div>
          <span style={{ fontSize: 14, color: isPublished ? 'var(--text)' : 'var(--muted)' }}>
            {isPublished ? '✦ Page is live' : 'Page is hidden (draft)'}
          </span>
        </div>
      </section>

      {/* Custom domain */}
      <section style={{ ...sectionStyle, opacity: isPro ? 1 : 0.6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Globe size={16} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Custom Domain</h2>
          {!isPro && (
            <span style={{ padding: '2px 10px', borderRadius: 100, fontSize: 10, background: 'var(--border)', color: 'var(--muted)' }}>PRO</span>
          )}
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
          Point your own domain to your Afriilink page. Add a CNAME record pointing to <code style={{ fontFamily: 'monospace', color: 'var(--accent)', fontSize: 12 }}>cname.afriilink.com</code>
        </p>
        <input value={customDomain} onChange={e => setCustomDomain(e.target.value)}
          placeholder="yourname.com" disabled={!isPro}
          style={{ ...inputStyle, opacity: isPro ? 1 : 0.5, cursor: isPro ? 'text' : 'not-allowed' }} />
        {!isPro && (
          <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
            <a href="#" onClick={e => { e.preventDefault(); upgradeToProHandler() }}
               style={{ color: 'var(--accent)', textDecoration: 'none' }}>Upgrade to Pro</a> to use a custom domain
          </p>
        )}
      </section>

      {/* SEO */}
      <section style={sectionStyle}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Shield size={16} style={{ color: 'var(--muted)' }} />
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>SEO & Social Sharing</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
          Customise how your page appears in search results and social previews
        </p>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: 6 }}>SEO TITLE</label>
          <input value={seoTitle} onChange={e => setSeoTitle(e.target.value)}
            placeholder={`${profile?.display_name || 'Your Name'} — Links`} style={inputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.5px', marginBottom: 6 }}>SEO DESCRIPTION</label>
          <textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)}
            placeholder="Short description for search engines..."
            rows={2}
            style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 } as React.CSSProperties} />
        </div>
      </section>

      {/* Danger zone */}
      <section style={{ ...sectionStyle, border: '1px solid rgba(255,80,80,0.2)', background: 'rgba(255,50,50,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <Trash2 size={16} style={{ color: '#ff5050' }} />
          <h2 style={{ fontSize: 15, fontWeight: 600, color: '#ff5050' }}>Danger Zone</h2>
        </div>
        <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
          Permanently delete your account and all data. This cannot be undone.
        </p>
        <button
          onClick={() => toast.error('Please contact support to delete your account')}
          style={{
            padding: '10px 20px', borderRadius: 100, background: 'transparent',
            border: '1px solid rgba(255,80,80,0.3)', color: '#ff5050',
            fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'
          }}>
          Delete my account
        </button>
      </section>

      <button onClick={saveSettings} disabled={saving} style={{
        width: '100%', padding: '14px', borderRadius: 100, background: 'var(--accent)',
        border: 'none', color: '#0a0a0a', fontSize: 15, fontWeight: 700,
        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'inherit'
      }}>
        {saving ? 'Saving...' : 'Save settings →'}
      </button>
    </div>
  )
}
