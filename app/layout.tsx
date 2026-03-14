import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink.com'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Afriilink — One Link for Every Creator',
    template: '%s | Afriilink',
  },
  description:
    'Afriilink gives creators one beautiful, customisable link page for all their content — socials, portfolio, shop, newsletter, and more. Free to start.',
  keywords: [
    'link in bio',
    'creator tools',
    'link page',
    'bio link',
    'social media links',
    'one link',
    'creator platform',
    'link tree alternative',
    'portfolio link',
    'digital presence',
    'African creators',
    'global creators',
    'content creator',
    'influencer tools',
  ],
  authors: [{ name: 'Afriilink', url: APP_URL }],
  creator: 'Afriilink',
  publisher: 'Afriilink',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: APP_URL,
    siteName: 'Afriilink',
    title: 'Afriilink — One Link for Every Creator',
    description:
      'One beautiful page for all your links. Built for creators everywhere. Free to start.',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Afriilink — One Link for Every Creator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Afriilink — One Link for Every Creator',
    description:
      'One beautiful page for all your links. Built for creators everywhere. Free to start.',
    images: [`${APP_URL}/og-image.png`],
    creator: '@afriilink',
    site: '@afriilink',
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
  alternates: { canonical: APP_URL },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Structured data — Organisation */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Afriilink',
              url: APP_URL,
              logo: `${APP_URL}/logo.png`,
              sameAs: [
                'https://twitter.com/afriilink',
                'https://instagram.com/afriilink',
              ],
            }),
          }}
        />
        {/* Structured data — SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Afriilink',
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              description:
                'One beautiful, customisable link page for creators. Share all your content, socials, shop and more from a single URL.',
              offers: [
                {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'GBP',
                  name: 'Free plan',
                },
                {
                  '@type': 'Offer',
                  price: '7',
                  priceCurrency: 'GBP',
                  name: 'Pro plan',
                  billingIncrement: 'month',
                },
              ],
            }),
          }}
        />
      </head>
      <body>
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1e1e1e',
              color: '#f0f0f0',
              border: '1px solid #2a2a2a',
              borderRadius: '100px',
              fontSize: '13px',
            },
          }}
        />
      </body>
    </html>
  )
}
