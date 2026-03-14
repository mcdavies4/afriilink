'use client'
import { useEffect } from 'react'
import { Profile, Link as LinkType, THEMES } from '@/types'
import { ExternalLink } from 'lucide-react'

interface Props { profile: Profile; links: LinkType[] }

const SOCIAL_TYPES = ['twitter','instagram','tiktok','linkedin','github','youtube','spotify']

export default function PublicPageClient({ profile, links }: Props) {
  const theme = THEMES.find(t => t.id === profile.theme) || THEMES[0]
  const socials = links.filter(l => SOCIAL_TYPES.includes(l.type))
  const mainLinks = links.filter(l => !SOCIAL_TYPES.includes(l.type))

  // Track page view
  useEffect(() => {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profile.id, event: 'page_view' })
    }).catch(() => {})
  }, [profile.id])

  function trackClick(linkId: string) {
    fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profile_id: profile.id, link_id: linkId, event: 'link_click' })
    }).catch(() => {})
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.bg, color: theme.text }}>
      <div style={{ maxWidth: 520, margin: '0 auto', paddingBottom: 80 }}>

        {/* Cover */}
        <div style={{ height: 180, background: profile.cover_color, position: 'relative' }}>
          <div style={{
            position: 'absolute', bottom: -44, left: 24,
            width: 88, height: 88, borderRadius: '50%',
            background: profile.avatar_url ? 'transparent' : profile.cover_color,
            border: `4px solid ${theme.bg}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 34, overflow: 'hidden', flexShrink: 0
          }}>
            {profile.avatar_url
              ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : '😊'
            }
          </div>
        </div>

        {/* Profile info */}
        <div style={{ padding: '56px 24px 24px' }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4, letterSpacing: '-0.5px' }}>
            {profile.display_name}
          </h1>
          <div style={{ fontSize: 13, color: theme.accent, fontFamily: 'monospace', marginBottom: 10 }}>
            @{profile.username}
          </div>
          {profile.bio && (
            <p style={{ fontSize: 14, opacity: 0.7, lineHeight: 1.7, marginBottom: 20, whiteSpace: 'pre-wrap' }}>
              {profile.bio}
            </p>
          )}

          {/* Social chips */}
          {socials.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {socials.map(s => (
                <a key={s.id} href={s.url} target="_blank" rel="noreferrer"
                  onClick={() => trackClick(s.id)}
                  style={{
                    padding: '7px 14px', borderRadius: 100, fontSize: 13, textDecoration: 'none',
                    background: theme.surface, color: theme.text, display: 'flex', alignItems: 'center', gap: 6,
                    border: `1px solid ${theme.id === 'light_clean' ? '#ddd' : '#2a2a2a'}`,
                    transition: 'transform 0.15s'
                  }}>
                  {s.icon || '🔗'} {s.title}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Main links */}
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mainLinks.map(link => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              onClick={() => trackClick(link.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none',
                background: theme.surface, color: theme.text,
                border: `1px solid ${theme.id === 'light_clean' ? '#ddd' : '#2a2a2a'}`,
                borderRadius: 16, padding: '16px 20px', transition: 'transform 0.15s, box-shadow 0.15s',
                position: 'relative', overflow: 'hidden'
              }}
              onMouseEnter={e => {
                const el = e.currentTarget
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget
                el.style.transform = ''
                el.style.boxShadow = ''
              }}
            >
              {/* Thumbnail or icon */}
              {link.thumbnail_url ? (
                <div style={{ width: 48, height: 48, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <img src={link.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ) : (
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${theme.accent}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22
                }}>
                  {link.icon || '🔗'}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {link.title}
                </div>
                {link.subtitle && (
                  <div style={{ fontSize: 12, opacity: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {link.subtitle}
                  </div>
                )}
              </div>

              <ExternalLink size={16} style={{ opacity: 0.3, flexShrink: 0 }} />
            </a>
          ))}

          {mainLinks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.4 }}>
              <p style={{ fontSize: 14 }}>No links added yet</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 48, opacity: 0.35, fontSize: 12 }}>
          <a href="/" style={{ textDecoration: 'none', color: theme.text }}>
            Made with Afriilink ✦
          </a>
        </div>
      </div>
    </div>
  )
}
