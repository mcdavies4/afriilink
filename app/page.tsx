import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Afriilink — One Link for Every Creator',
  description:
    'Afriilink gives creators one beautiful, customisable link page for all their content — socials, portfolio, shop, newsletter, and more. Free forever.',
  alternates: { canonical: 'https://afriilink.com' },
}

const FEATURES = [
  { icon: '✦', title: 'Drag & drop editor',       desc: 'Reorder links in seconds. No code, no friction.' },
  { icon: '📊', title: 'Real-time analytics',      desc: 'See views, clicks, and click-through rates live.' },
  { icon: '🎨', title: 'Theme builder',             desc: '7 premium themes, 12 cover gradients, custom colours.' },
  { icon: '🌐', title: 'Custom domain',             desc: 'Connect yourname.com to your page on Pro.' },
  { icon: '💰', title: 'Monetisation tools',        desc: 'Sell products, capture emails, take bookings.' },
  { icon: '📅', title: 'Link scheduling',           desc: 'Schedule links to go live at the right moment.' },
  { icon: '📱', title: 'Mobile-first design',       desc: 'Looks stunning on every screen, every device.' },
  { icon: '🔒', title: 'Secure & private',         desc: 'Row-level security and data you actually own.' },
]

const CREATOR_TYPES = [
  '🎵 Musicians',
  '🎨 Visual artists',
  '✍️ Writers & bloggers',
  '📸 Photographers',
  '🎬 Video creators',
  '💄 Beauty creators',
  '🍳 Food creators',
  '💪 Fitness coaches',
  '🎙️ Podcasters',
  '👗 Fashion creators',
  '🌍 Travel creators',
  '🛍️ E-commerce sellers',
]

const TESTIMONIALS = [
  {
    quote: "Finally a link page that doesn't look like it was built in 2015. My audience actually clicks.",
    name: 'Amara O.',
    handle: '@amaracreates',
    role: 'Fashion & lifestyle creator',
  },
  {
    quote: "Set it up in 10 minutes, already getting more traffic to my music. The analytics are 🔥",
    name: 'Kofi A.',
    handle: '@kofisounds',
    role: 'Independent musician',
  },
  {
    quote: "I switched from Linktree and my click-through rate doubled. The themes are unmatched.",
    name: 'Zara N.',
    handle: '@zaranarratives',
    role: 'Writer & content strategist',
  },
]

const FAQS = [
  {
    q: 'Is Afriilink really free?',
    a: 'Yes. The free plan gives you a fully functional link page with up to 5 links, all 7 themes, and 7 days of analytics — forever. No credit card required.',
  },
  {
    q: 'How is Afriilink different from Linktree?',
    a: 'Afriilink is built specifically for creators who want more control and better design. We offer richer analytics, monetisation tools, a custom domain option on Pro, and a significantly better editor experience.',
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes — on the Pro plan you can connect any custom domain. Add a CNAME record pointing to cname.afriilink.com and your page will be live at yourname.com.',
  },
  {
    q: 'Do I need to be based in Africa to use Afriilink?',
    a: 'Not at all. Afriilink is built for creators everywhere in the world. Our name reflects our roots and community, but the platform is 100% global.',
  },
  {
    q: 'What happens if I exceed the free plan limit?',
    a: "You'll be prompted to upgrade. Your existing 5 links stay live — you just won't be able to add more until you upgrade to Pro.",
  },
  {
    q: 'Can I cancel my Pro subscription anytime?',
    a: 'Absolutely. Cancel anytime from your billing portal. You keep Pro features until the end of your billing period, then move back to free.',
  },
]

export default function LandingPage() {
  return (
    <main style={{ background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 40px', borderBottom: '1px solid var(--border)',
        background: 'rgba(10,10,10,0.88)', backdropFilter: 'blur(20px)',
      }}>
        <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Afrii<span style={{ color: 'var(--accent)' }}>link</span>
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="#features" style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>Features</a>
          <a href="#pricing"  style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>Pricing</a>
          <a href="#faq"      style={{ fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>FAQ</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/login" style={{
            padding: '9px 20px', borderRadius: 100, fontSize: 14, textDecoration: 'none',
            border: '1px solid var(--border)', color: 'var(--muted)', transition: 'color 0.15s',
          }}>Log in</Link>
          <Link href="/register" style={{
            padding: '9px 20px', borderRadius: 100, fontSize: 14, fontWeight: 600,
            background: 'var(--accent)', color: '#0a0a0a', textDecoration: 'none',
          }}>Get started free</Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        padding: '120px 24px 80px',
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(123,110,246,0.12) 0%, transparent 70%)',
      }}>
        {/* Social proof pill */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 100, fontSize: 13, fontWeight: 500,
          background: 'var(--surface)', border: '1px solid var(--border)',
          color: 'var(--muted)', marginBottom: 36,
        }}>
          <span style={{ color: 'var(--accent)' }}>✦</span>
          Built for creators everywhere — not just link pages
        </div>

        <h1 style={{
          fontSize: 'clamp(42px, 7vw, 88px)', fontWeight: 800,
          letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 24, maxWidth: 860,
        }}>
          One link.<br />
          <span style={{
            background: 'linear-gradient(135deg, #c8f04d 0%, #7b6ef6 60%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Your entire world.
          </span>
        </h1>

        <p style={{
          fontSize: 18, maxWidth: 560, lineHeight: 1.7,
          color: 'var(--muted)', marginBottom: 40,
        }}>
          Share every link that matters — your socials, portfolio, music, shop, newsletter —
          from one stunning page. Built for creators anywhere in the world.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          <Link href="/register" style={{
            padding: '15px 36px', borderRadius: 100, fontSize: 16, fontWeight: 700,
            background: 'var(--accent)', color: '#0a0a0a', textDecoration: 'none',
            boxShadow: '0 0 48px rgba(200,240,77,0.2)',
          }}>
            Claim your free link →
          </Link>
          <Link href="/demo" style={{
            padding: '15px 28px', borderRadius: 100, fontSize: 15, fontWeight: 500,
            background: 'transparent', color: 'var(--text)', textDecoration: 'none',
            border: '1px solid var(--border)',
          }}>
            See an example page
          </Link>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>Free forever · No credit card · Live in 60 seconds</p>

        {/* Creator type ticker */}
        <div style={{ marginTop: 64, overflow: 'hidden', width: '100%', maxWidth: 700 }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 16 }}>
            Built for every kind of creator
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
            {CREATOR_TYPES.map(c => (
              <span key={c} style={{
                padding: '7px 16px', borderRadius: 100, fontSize: 13,
                background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)',
              }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            FEATURES
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Everything a creator needs
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            Afriilink isn't just a list of links. It's your entire digital presence in one place.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 20, padding: '28px 24px',
              transition: 'border-color 0.2s',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, fontSize: 20,
                background: i % 3 === 0 ? 'rgba(200,240,77,0.1)' : i % 3 === 1 ? 'rgba(123,110,246,0.1)' : 'rgba(255,107,53,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{
        padding: '80px 40px',
        background: 'radial-gradient(ellipse 80% 50% at 50% 50%, rgba(123,110,246,0.06) 0%, transparent 70%)',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 48 }}>
            WHAT CREATORS SAY
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.handle} style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 20, padding: '28px 24px',
              }}>
                <p style={{ fontSize: 15, lineHeight: 1.7, marginBottom: 20, color: 'var(--text)' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'linear-gradient(135deg, var(--accent), #7b6ef6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 700, color: '#0a0a0a', flexShrink: 0,
                  }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.handle} · {t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '100px 40px', maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            PRICING
          </p>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, letterSpacing: '-1px', marginBottom: 16 }}>
            Simple, honest pricing
          </h2>
          <p style={{ fontSize: 16, color: 'var(--muted)', lineHeight: 1.7 }}>
            Start free. Upgrade when you're ready to grow.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Free */}
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 24, padding: '36px 32px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--muted)', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>Free</div>
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-2px', marginBottom: 4 }}>£0</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>Forever. No card needed.</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {[
                'Up to 5 links',
                'afriilink.com/yourname',
                '7 days of analytics',
                'All 7 themes',
                'Google & magic link auth',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--muted)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/register" style={{
              display: 'block', textAlign: 'center', padding: '13px', borderRadius: 100,
              border: '1px solid var(--border)', color: 'var(--text)', textDecoration: 'none',
              fontSize: 14, fontWeight: 600,
            }}>
              Get started free
            </Link>
          </div>

          {/* Pro */}
          <div style={{
            background: 'var(--surface)', borderRadius: 24, padding: '36px 32px',
            border: '2px solid var(--accent)', position: 'relative', overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -40, right: -40, width: 180, height: 180,
              borderRadius: '50%', background: 'rgba(200,240,77,0.08)', pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', top: 16, right: 16, padding: '3px 12px',
              borderRadius: 100, fontSize: 11, fontWeight: 700,
              background: 'var(--accent)', color: '#0a0a0a',
            }}>MOST POPULAR</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 16, letterSpacing: '1px', textTransform: 'uppercase' }}>Pro</div>
            <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-2px', marginBottom: 4 }}>£7</div>
            <div style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 32 }}>per month · cancel anytime</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 36 }}>
              {[
                'Unlimited links',
                'Custom domain (yourname.com)',
                '90 days of analytics',
                'Geo & referrer breakdown',
                'Link scheduling',
                'Email capture',
                'Priority support',
              ].map(item => (
                <li key={item} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'var(--text)', alignItems: 'flex-start' }}>
                  <span style={{ color: 'var(--accent)', flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                </li>
              ))}
            </ul>
            <Link href="/register?plan=pro" style={{
              display: 'block', textAlign: 'center', padding: '13px', borderRadius: 100,
              background: 'var(--accent)', color: '#0a0a0a', textDecoration: 'none',
              fontSize: 14, fontWeight: 700, position: 'relative',
            }}>
              Start free 14-day trial →
            </Link>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
              No card required during trial
            </p>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '80px 40px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <p style={{ fontSize: 12, letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 12 }}>
            FAQ
          </p>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800, letterSpacing: '-1px' }}>
            Common questions
          </h2>
        </div>
        {/* Structured FAQ schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: FAQS.map(f => ({
                '@type': 'Question',
                name: f.q,
                acceptedAnswer: { '@type': 'Answer', text: f.a },
              })),
            }),
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {FAQS.map((f, i) => (
            <details key={i} style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, overflow: 'hidden',
            }}>
              <summary style={{
                padding: '18px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer',
                listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                {f.q}
                <span style={{ color: 'var(--accent)', fontSize: 18, flexShrink: 0, marginLeft: 12 }}>+</span>
              </summary>
              <div style={{ padding: '0 20px 18px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>
                {f.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        padding: '100px 40px', textAlign: 'center',
        background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(200,240,77,0.07) 0%, transparent 70%)',
      }}>
        <h2 style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: 16 }}>
          Your audience is waiting.
        </h2>
        <p style={{ fontSize: 17, color: 'var(--muted)', maxWidth: 420, margin: '0 auto 36px', lineHeight: 1.7 }}>
          Join thousands of creators who've made Afriilink their digital home base.
        </p>
        <Link href="/register" style={{
          display: 'inline-block', padding: '16px 40px', borderRadius: 100,
          fontSize: 16, fontWeight: 700, background: 'var(--accent)', color: '#0a0a0a',
          textDecoration: 'none', boxShadow: '0 0 60px rgba(200,240,77,0.2)',
        }}>
          Claim your free Afriilink →
        </Link>
        <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 14 }}>
          Free forever · No credit card · Live in 60 seconds
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border)', padding: '36px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
      }}>
        <span style={{ fontSize: 16, fontWeight: 800 }}>
          Afrii<span style={{ color: 'var(--accent)' }}>link</span>
        </span>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'var(--muted)' }}>
          <a href="/privacy" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Privacy</a>
          <a href="/terms"   style={{ color: 'var(--muted)', textDecoration: 'none' }}>Terms</a>
          <a href="/blog"    style={{ color: 'var(--muted)', textDecoration: 'none' }}>Blog</a>
          <a href="mailto:hello@afriilink.com" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Contact</a>
        </div>
        <p style={{ fontSize: 12, color: 'var(--muted)' }}>
          © {new Date().getFullYear()} Afriilink. Made with ✦ for creators everywhere.
        </p>
      </footer>

    </main>
  )
}
