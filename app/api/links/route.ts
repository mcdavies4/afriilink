import { createServerSupabaseClient } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('user_id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  const { data: links, error } = await supabase
    .from('links')
    .select('*')
    .eq('profile_id', profile.id)
    .order('sort_order')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ links })
}

export async function POST(req: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('id, plan').eq('user_id', user.id).single()
  if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 })

  // Free plan: max 5 links
  if (profile.plan === 'free') {
    const { count } = await supabase
      .from('links').select('*', { count: 'exact', head: true })
      .eq('profile_id', profile.id)
    if ((count || 0) >= 5) {
      return NextResponse.json({ error: 'Free plan limit reached. Upgrade to Pro for unlimited links.' }, { status: 403 })
    }
  }

  const body = await req.json()
  const { data, error } = await supabase
    .from('links')
    .insert({ ...body, profile_id: profile.id })
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ link: data })
}

export async function PATCH(req: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...updates } = body

  const { data: profile } = await supabase
    .from('profiles').select('id').eq('user_id', user.id).single()

  const { data, error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)
    .eq('profile_id', profile!.id)
    .select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ link: data })
}

export async function DELETE(req: Request) {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const { data: profile } = await supabase
    .from('profiles').select('id').eq('user_id', user.id).single()

  const { error } = await supabase
    .from('links').delete().eq('id', id).eq('profile_id', profile!.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
