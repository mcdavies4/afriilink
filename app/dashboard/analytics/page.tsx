'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase'
import { Link as LinkType } from '@/types'
import { TrendingUp, Eye, MousePointerClick, Smartphone, Monitor, Tablet } from 'lucide-react'

interface DayStat { date: string; views: number; clicks: number }

function generateMockData(days: number): DayStat[] {
  const data: DayStat[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    data.push({
      date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      views: Math.floor(Math.random() * 80) + 20,
      clicks: Math.floor(Math.random() * 30) + 5,
    })
  }
  return data
}

export default function AnalyticsPage() {
  const [links, setLinks] = useState<LinkType[]>([])
  const [profileId, setProfileId] = useState('')
  const [range, setRange] = useState(7)
  const [chartData, setChartData] = useState<DayStat[]>([])
  const [plan, setPlan] = useState<'free' | 'pro'>('free')
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data: p } = await supabase.from('profiles').select('id, plan').eq('user_id', user.id).single()
      if (!p) return
      setProfileId(p.id)
      setPlan(p.plan)

      const { data: l } = await supabase.from('links').select('*')
        .eq('profile_id', p.id).order('click_count', { ascending: false })
      if (l) setLinks(l)
    }
    load()
    setChartData(generateMockData(range))
  }, [range])

  const totalViews  = chartData.reduce((s, d) => s + d.views, 0)
  const totalClicks = chartData.reduce((s, d) => s + d.clicks, 0)
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : '0'
  const maxViews = Math.max(...chartData.map(d => d.views), 1)

  const devices = [
    { label: 'Mobile',  icon: Smartphone, pct: 64, color: '#c8f04d' },
    { label: 'Desktop', icon: Monitor,    pct: 28, color: '#7b6ef6' },
    { label: 'Tablet',  icon: Tablet,     pct: 8,  color: '#ff6b35' },
  ]

  const cardStyle = {
    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px'
  }

  return (
    <div style={{ padding: '36px 40px', maxWidth: 900 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>Analytics</h1>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>How your page is performing</p>
        </div>

        {/* Range selector */}
        <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 100, padding: 4, gap: 4 }}>
          {[
            { label: '7d', val: 7 },
            { label: '30d', val: 30, pro: true },
            { label: '90d', val: 90, pro: true },
          ].map(r => (
            <button key={r.val}
              onClick={() => { if (r.pro && plan === 'free') return; setRange(r.val) }}
              style={{
                padding: '6px 16px', borderRadius: 100, fontSize: 13, cursor: r.pro && plan === 'free' ? 'not-allowed' : 'pointer',
                background: range === r.val ? 'var(--surface2)' : 'transparent',
                border: range === r.val ? '1px solid var(--border)' : '1px solid transparent',
                color: r.pro && plan === 'free' ? 'var(--muted)' : range === r.val ? 'var(--text)' : 'var(--muted)',
                fontFamily: 'inherit', opacity: r.pro && plan === 'free' ? 0.5 : 1
              }}>
              {r.label}{r.pro && plan === 'free' ? ' 🔒' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Page Views', value: totalViews.toLocaleString(), icon: Eye, color: 'var(--accent)', sub: `Last ${range} days` },
          { label: 'Link Clicks', value: totalClicks.toLocaleString(), icon: MousePointerClick, color: '#7b6ef6', sub: `Last ${range} days` },
          { label: 'Click Rate', value: `${ctr}%`, icon: TrendingUp, color: '#ff6b35', sub: 'Clicks / views' },
        ].map(s => (
          <div key={s.label} style={cardStyle}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <span style={{ fontSize: 12, color: 'var(--muted)' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 4, fontVariantNumeric: 'tabular-nums' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600 }}>Views & Clicks</h2>
          <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--accent)', display: 'inline-block' }} /> Views
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)' }}>
              <span style={{ width: 10, height: 10, borderRadius: 2, background: '#7b6ef6', display: 'inline-block' }} /> Clicks
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 140, overflowX: 'auto', paddingBottom: 8 }}>
          {chartData.map((d, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1, minWidth: range > 14 ? 20 : 32 }}>
              <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end', flex: 1, width: '100%' }}>
                <div style={{
                  flex: 1, background: 'var(--accent)', borderRadius: '3px 3px 0 0', opacity: 0.85,
                  height: `${Math.round((d.views / maxViews) * 110)}px`, minHeight: 3, transition: 'height 0.3s'
                }} />
                <div style={{
                  flex: 1, background: '#7b6ef6', borderRadius: '3px 3px 0 0', opacity: 0.85,
                  height: `${Math.round((d.clicks / maxViews) * 110)}px`, minHeight: 2, transition: 'height 0.3s'
                }} />
              </div>
              {(range <= 14 || i % 3 === 0) && (
                <span style={{ fontSize: 9, color: 'var(--muted)', whiteSpace: 'nowrap', transform: 'rotate(-30deg)', transformOrigin: 'top center' }}>
                  {d.date}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Top links */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Top Links</h2>
          {links.length === 0 && (
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>No clicks recorded yet</p>
          )}
          {links.slice(0, 6).map((l, i) => {
            const maxClicks = Math.max(...links.map(x => x.click_count), 1)
            return (
              <div key={l.id} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
                  <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span>{l.icon || '🔗'}</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>{l.title}</span>
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>{l.click_count}</span>
                </div>
                <div style={{ height: 4, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: 'var(--accent)', borderRadius: 4,
                    width: `${Math.round((l.click_count / maxClicks) * 100)}%`, transition: 'width 0.5s'
                  }} />
                </div>
              </div>
            )
          })}
          {links.length === 0 && (
            <div style={{ textAlign: 'center', paddingTop: 20 }}>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>Share your page to start getting clicks</p>
            </div>
          )}
        </div>

        {/* Devices */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Devices</h2>
          {devices.map(d => (
            <div key={d.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <d.icon size={14} style={{ color: 'var(--muted)' }} /> {d.label}
                </span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{d.pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: d.color, borderRadius: 4, width: `${d.pct}%`, opacity: 0.8
                }} />
              </div>
            </div>
          ))}

          {/* Pro nudge */}
          {plan === 'free' && (
            <div style={{
              marginTop: 20, padding: '14px 16px', borderRadius: 12,
              background: 'rgba(200,240,77,0.05)', border: '1px solid rgba(200,240,77,0.15)'
            }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🔒 Geo & referrer data</div>
              <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, lineHeight: 1.6 }}>
                See which countries and platforms your visitors come from. Pro feature.
              </p>
              <a href="/dashboard/settings" style={{
                fontSize: 12, color: 'var(--accent)', textDecoration: 'none', fontWeight: 600
              }}>Upgrade to Pro →</a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
