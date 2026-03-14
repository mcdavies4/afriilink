'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Link2, Palette, BarChart2, Settings, ExternalLink, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const NAV = [
  { href: '/dashboard',            label: 'Overview',   icon: LayoutGrid },
  { href: '/dashboard/links',      label: 'Links',      icon: Link2 },
  { href: '/dashboard/appearance', label: 'Appearance', icon: Palette },
  { href: '/dashboard/analytics',  label: 'Analytics',  icon: BarChart2 },
  { href: '/dashboard/settings',   label: 'Settings',   icon: Settings },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, flexShrink: 0, borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh',
        padding: '24px 16px', background: 'var(--surface)'
      }}>
        <Link href="/" style={{ textDecoration: 'none', marginBottom: 32, display: 'block', paddingLeft: 8 }}>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>
            Afrii<span style={{ color: "var(--accent)" }}>link</span>
          </span>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                fontSize: 14, fontWeight: active ? 500 : 400, transition: 'all 0.15s',
                background: active ? 'var(--surface2)' : 'transparent',
                color: active ? 'var(--text)' : 'var(--muted)',
                border: active ? '1px solid var(--border)' : '1px solid transparent',
              }}>
                <Icon size={16} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <a href="#" style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
            fontSize: 14, color: 'var(--muted)'
          }}>
            <ExternalLink size={16} /> View my page
          </a>
          <button onClick={signOut} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px', borderRadius: 10,
            fontSize: 14, color: 'var(--muted)', background: 'transparent',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit', width: '100%'
          }}>
            <LogOut size={16} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
