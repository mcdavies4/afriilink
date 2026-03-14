import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID!

export async function createCheckoutSession({
  userId,
  userEmail,
  customerId,
  username,
}: {
  userId: string
  userEmail: string
  customerId?: string | null
  username: string
}) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : userEmail,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: PRO_PRICE_ID, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
    metadata: { userId, username },
    subscription_data: {
      metadata: { userId, username },
    },
  })
  return session
}

export async function createPortalSession(customerId: string) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
  })
  return session
}
