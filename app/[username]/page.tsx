import { createServerSupabaseClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { Profile, Link as LinkType } from '@/types'
import type { Metadata } from 'next'
import PublicPageClient from './PublicPageClient'

interface Props { params: { username: string } }

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink.com'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createServerSupabaseClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, seo_title, seo_description, avatar_url, username')
    .eq('username', params.username)
    .single()

  if (!profile) {
    return {
      title: 'Page not found | Afriilink',
      robots: { index: false, follow: false },
    }
  }

  const title       = profile.seo_title       || `${profile.display_name} | Afriilink`
  const description = profile.seo_description || profile.bio
    || `Visit ${profile.display_name}'s Afriilink page — all their links in one place.`
  const url = `${APP_URL}/${profile.username}`
  const image = profile.avatar_url || `${APP_URL}/og-image.png`

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'profile',
      siteName: 'Afriilink',
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [image],
    },
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const supabase = createServerSupabaseClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile || !profile.is_published) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .eq('is_active', true)
    .order('sort_order')

  // Structured data for this creator's profile page
  const profileSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: profile.display_name,
    description: profile.bio || '',
    url: `${APP_URL}/${profile.username}`,
    mainEntity: {
      '@type': 'Person',
      name: profile.display_name,
      description: profile.bio || '',
      image: profile.avatar_url || undefined,
      url: `${APP_URL}/${profile.username}`,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <PublicPageClient profile={profile as Profile} links={(links || []) as LinkType[]} />
    </>
  )
}
