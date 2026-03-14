import { createServerSupabaseClient } from '@/lib/supabase-server'
import { createCheckoutSession } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function POST() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('username, stripe_customer_id').eq('user_id', user.id).single()

  const session = await createCheckoutSession({
    userId: user.id,
    userEmail: user.email!,
    customerId: profile?.stripe_customer_id,
    username: profile?.username || '',
  })

  return NextResponse.json({ url: session.url })
}
