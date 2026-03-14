export type Plan = 'free' | 'pro'

export type LinkType =
  | 'website'
  | 'youtube'
  | 'spotify'
  | 'apple_music'
  | 'twitter'
  | 'instagram'
  | 'tiktok'
  | 'linkedin'
  | 'github'
  | 'shop'
  | 'newsletter'
  | 'booking'
  | 'podcast'
  | 'custom'

export interface Profile {
  id: string
  user_id: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  cover_color: string
  theme: string
  plan: Plan
  custom_domain: string | null
  seo_title: string | null
  seo_description: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  profile_id: string
  type: LinkType
  title: string
  url: string
  subtitle: string | null
  icon: string | null
  thumbnail_url: string | null
  is_active: boolean
  sort_order: number
  click_count: number
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  profile_id: string
  link_id: string | null
  event: 'page_view' | 'link_click'
  referrer: string | null
  country: string | null
  device: string | null
  created_at: string
}

export interface Theme {
  id: string
  name: string
  bg: string
  surface: string
  text: string
  accent: string
  cover: string
}

export const THEMES: Theme[] = [
  { id: 'dark_lime',    name: 'Dark Lime',    bg: '#0a0a0a', surface: '#141414', text: '#f0f0f0', accent: '#c8f04d', cover: 'linear-gradient(135deg,#7b6ef6,#ff6b35)' },
  { id: 'dark_violet',  name: 'Violet Night', bg: '#0d0014', surface: '#1a0a24', text: '#f0e8ff', accent: '#ff9ef8', cover: 'linear-gradient(135deg,#240046,#7b2d8b)' },
  { id: 'ocean',        name: 'Ocean',        bg: '#020c18', surface: '#071828', text: '#e8f4fd', accent: '#90e0ef', cover: 'linear-gradient(135deg,#0077b6,#00b4d8)' },
  { id: 'forest',       name: 'Forest',       bg: '#071a10', surface: '#0f2a18', text: '#e8f5e9', accent: '#b7e4c7', cover: 'linear-gradient(135deg,#2d6a4f,#52b788)' },
  { id: 'fire',         name: 'Fire',         bg: '#120500', surface: '#1f0a00', text: '#fff3ee', accent: '#ffbe0b', cover: 'linear-gradient(135deg,#ff006e,#fb5607)' },
  { id: 'sand',         name: 'Sand',         bg: '#1a1508', surface: '#2a2210', text: '#fdf5e4', accent: '#f4a261', cover: 'linear-gradient(135deg,#e9c46a,#f4a261)' },
  { id: 'light_clean',  name: 'Clean White',  bg: '#f8f9fa', surface: '#ffffff', text: '#1a1a1a', accent: '#212529', cover: 'linear-gradient(135deg,#dee2e6,#adb5bd)' },
]

export const LINK_ICONS: Record<LinkType, string> = {
  website:     '🌐',
  youtube:     '🎬',
  spotify:     '🎵',
  apple_music: '🎧',
  twitter:     '🐦',
  instagram:   '📸',
  tiktok:      '🎭',
  linkedin:    '💼',
  github:      '🐙',
  shop:        '🛍️',
  newsletter:  '📧',
  booking:     '📅',
  podcast:     '🎙️',
  custom:      '✨',
}

export const LINK_LABELS: Record<LinkType, string> = {
  website:     'Website',
  youtube:     'YouTube',
  spotify:     'Spotify',
  apple_music: 'Apple Music',
  twitter:     'Twitter / X',
  instagram:   'Instagram',
  tiktok:      'TikTok',
  linkedin:    'LinkedIn',
  github:      'GitHub',
  shop:        'Shop',
  newsletter:  'Newsletter',
  booking:     'Book a Call',
  podcast:     'Podcast',
  custom:      'Custom Link',
}

export const FREE_PLAN_LIMITS = {
  links: 5,
  analytics_days: 7,
  custom_domain: false,
}

export const PRO_PLAN_LIMITS = {
  links: Infinity,
  analytics_days: 90,
  custom_domain: true,
}
