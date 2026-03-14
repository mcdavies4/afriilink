'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile, Link as LinkType } from '@/types'
import { BarChart2, MousePointerClick, Eye, TrendingUp, ExternalLink, Zap } from 'lucide-react'
import Link from 'next/link'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [stats, setStats] = useState({ views: 0, clicks: 0, ctr: 0 })
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: p } = await supabase.from('profiles').select('*').eq('user_id', user.id).single()
      if (p) setProfile(p)

      const { data: l } = await supabase.from('links').select('*')
        .eq('profile_id', p?.id).order('sort_order')
      if (l) {
        setLinks(l)
        const totalClicks = l.reduce((s: number, x: LinkType) => s + x.click_count, 0)
        setStats({ views: 1247, clicks: totalClicks, ctr: totalClicks > 0 ? Math.round((totalClicks / 1247) * 100) : 0 })
      }
    }
    load()
  }, [])

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 16, padding: '20px 24px'
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
          Welcome back{profile?.display_name ? `, ${profile.display_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>
          Your page is at{' '}
          <a href={`/${profile?.username}`} target="_blank" rel="noreferrer"
             style={{ color: 'var(--accent)', textDecoration: 'none', fontFamily: 'monospace' }}>
            afriilink.com/{profile?.username}
          </a>
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Page views', value: stats.views.toLocaleString(), icon: Eye, delta: '+12%' },
          { label: 'Link clicks', value: stats.clicks.toLocaleString(), icon: MousePointerClick, delta: '+8%' },
          { label: 'Click-through rate', value: `${stats.ctr}%`, icon: TrendingUp, delta: '+3%' },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <s.icon size={18} style={{ color: 'var(--muted)' }} />
              <span style={{ fontSize: 11, color: 'var(--accent)', background: 'rgba(200,240,77,0.1)', padding: '2px 8px', borderRadius: 100 }}>
                {s.delta}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 600 }}>Your Links</h2>
            <Link href="/dashboard/links" style={{ fontSize: 12, color: 'var(--accent)', textDecoration: 'none' }}>
              Manage →
            </Link>
          </div>
          {links.slice(0, 4).map(l => (
            <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 20 }}>{l.icon || '🔗'}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{l.title}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)' }}>{l.click_count} clicks</div>
              </div>
              <div style={{
                width: 8, height: 8, borderRadius: '50%',
                background: l.is_active ? 'var(--accent)' : 'var(--border)'
              }} />
            </div>
          ))}
          {links.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>No links yet. Add your first!</p>
          )}
        </div>

        {/* Pro upsell / status */}
        <div style={{
          ...cardStyle,
          background: profile?.plan === 'pro' ? 'linear-gradient(135deg, rgba(123,110,246,0.1), rgba(200,240,77,0.05))' : 'var(--surface)',
          border: profile?.plan === 'pro' ? '1px solid rgba(123,110,246,0.3)' : '1px solid var(--border)',
        }}>
          {profile?.plan === 'pro' ? (
            <>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
                <Zap size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: 14, fontWeight: 600 }}>Pro Plan Active</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
                You have unlimited links, custom domain support, 90-day analytics, and all premium features.
              </p>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>🚀 Upgrade to Pro</div>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
                Unlimited links · Custom domain · 90-day analytics · Link scheduling
              </p>
              <Link href="/dashboard/settings" style={{
                display: 'inline-block', padding: '9px 20px', borderRadius: 100,
                background: 'var(--accent)', color: '#0a0a0a', fontSize: 13, fontWeight: 600,
                textDecoration: 'none'
              }}>
                Upgrade for £7/mo →
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Publish status */}
      {!profile?.is_published && (
        <div style={{
          ...cardStyle,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'rgba(200,240,77,0.05)', border: '1px solid rgba(200,240,77,0.2)'
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Your page isn't published yet</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>Publish it to make it visible to the world.</div>
          </div>
          <button style={{
            padding: '10px 24px', borderRadius: 100, background: 'var(--accent)',
            color: '#0a0a0a', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer'
          }}>
            Publish page →
          </button>
        </div>
      )}
    </div>
  )
}
