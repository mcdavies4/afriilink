import type { Theme, LinkTypeOption, ThemeName } from '@/types'

export const THEMES: Theme[] = [
  { name: 'midnight', label: 'Midnight', c1: '#7b6ef6', c2: '#ff6b35', accent: '#c8f04d', bg: '#0a0a0a', surface: '#141414', text: '#f0f0f0' },
  { name: 'coral',    label: 'Coral',    c1: '#ff006e', c2: '#fb5607', accent: '#ffbe0b', bg: '#0a0a0a', surface: '#141414', text: '#f0f0f0' },
  { name: 'ocean',    label: 'Ocean',    c1: '#0077b6', c2: '#00b4d8', accent: '#90e0ef', bg: '#050a14', surface: '#0d1a2d', text: '#e0f0ff' },
  { name: 'forest',   label: 'Forest',   c1: '#2d6a4f', c2: '#52b788', accent: '#b7e4c7', bg: '#050f08', surface: '#0d1f12', text: '#e8f5e9' },
  { name: 'sand',     label: 'Sand',     c1: '#e9c46a', c2: '#f4a261', accent: '#264653', bg: '#1a1206', surface: '#261a08', text: '#fdf6e3' },
  { name: 'cosmic',   label: 'Cosmic',   c1: '#240046', c2: '#7b2d8b', accent: '#ff9ef8', bg: '#080010', surface: '#12001e', text: '#f5e6ff' },
  { name: 'noir',     label: 'Noir',     c1: '#1a1a1a', c2: '#3a3a3a', accent: '#f0f0f0', bg: '#000000', surface: '#111111', text: '#ffffff' },
  { name: 'paper',    label: 'Paper',    c1: '#dee2e6', c2: '#adb5bd', accent: '#212529', bg: '#f8f9fa', surface: '#ffffff',  text: '#212529' },
]

export const getTheme = (name: ThemeName): Theme =>
  THEMES.find(t => t.name === name) ?? THEMES[0]

export const LINK_TYPES: LinkTypeOption[] = [
  { type: 'website',    label: 'Website',    icon: '🌐', placeholder: 'https://yoursite.com',       color: 'rgba(123,110,246,0.15)' },
  { type: 'youtube',    label: 'YouTube',    icon: '🎬', placeholder: 'https://youtube.com/@you',   color: 'rgba(255,0,0,0.15)' },
  { type: 'spotify',    label: 'Spotify',    icon: '🎵', placeholder: 'https://open.spotify.com/…', color: 'rgba(30,215,96,0.15)' },
  { type: 'instagram',  label: 'Instagram',  icon: '📸', placeholder: 'https://instagram.com/you',  color: 'rgba(225,48,108,0.15)' },
  { type: 'twitter',    label: 'Twitter/X',  icon: '𝕏',  placeholder: 'https://x.com/you',          color: 'rgba(255,255,255,0.1)' },
  { type: 'tiktok',     label: 'TikTok',     icon: '🎭', placeholder: 'https://tiktok.com/@you',    color: 'rgba(105,201,208,0.15)' },
  { type: 'newsletter', label: 'Newsletter', icon: '📧', placeholder: 'https://yoursubstack.com',   color: 'rgba(255,107,53,0.15)' },
  { type: 'shop',       label: 'Shop',       icon: '🛍️', placeholder: 'https://yourshop.com',       color: 'rgba(200,240,77,0.15)' },
  { type: 'booking',    label: 'Book a Call',icon: '📅', placeholder: 'https://cal.com/you',        color: 'rgba(100,210,255,0.15)' },
  { type: 'podcast',    label: 'Podcast',    icon: '🎙️', placeholder: 'https://yourpodcast.com',    color: 'rgba(180,130,255,0.15)' },
  { type: 'github',     label: 'GitHub',     icon: '⌨️', placeholder: 'https://github.com/you',     color: 'rgba(255,255,255,0.08)' },
  { type: 'linkedin',   label: 'LinkedIn',   icon: '💼', placeholder: 'https://linkedin.com/in/you',color: 'rgba(10,102,194,0.2)' },
  { type: 'custom',     label: 'Custom',     icon: '✦',  placeholder: 'https://...',                color: 'rgba(200,240,77,0.1)' },
]

export const getLinkType = (type: string): LinkTypeOption =>
  LINK_TYPES.find(l => l.type === type) ?? LINK_TYPES[0]

export const RESERVED_USERNAMES = [
  'admin','api','app','dashboard','login','register','signup',
  'settings','help','about','terms','privacy','blog','pricing',
  'afriilink','support','team','careers','press'
]

export const USERNAME_REGEX = /^[a-z0-9_-]{3,30}$/
