import { MetadataRoute } from 'next'
import { createServerSupabaseClient } from '@/lib/supabase-server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://afriilink.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL,             lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${APP_URL}/login`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${APP_URL}/register`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  // Published creator pages
  try {
    const supabase = createServerSupabaseClient()
    const { data: profiles } = await supabase
      .from('profiles')
      .select('username, updated_at')
      .eq('is_published', true)
      .order('updated_at', { ascending: false })
      .limit(1000)

    const creatorPages: MetadataRoute.Sitemap = (profiles || []).map(p => ({
      url: `${APP_URL}/${p.username}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...creatorPages]
  } catch {
    return staticPages
  }
}
