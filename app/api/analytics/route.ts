import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'
import { getDeviceType } from '@/lib/utils'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const supabase = await createServerSupabaseClient()
  const body = await req.json()
  const { profile_id, link_id, event } = body

  const headersList = await headers()
  const ua = headersList.get('user-agent') || ''
  const device = getDeviceType(ua)

  await supabase.from('analytics').insert({
    profile_id,
    link_id: link_id || null,
    event,
    device,
    referrer: headersList.get('referer') || null,
  })

  if (event === 'link_click' && link_id) {
    await supabase.rpc('increment_click', { link_id })
  }

  return NextResponse.json({ ok: true })
}
