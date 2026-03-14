# Afriilink

> Your entire digital presence in one beautiful, customisable page. Built for creators.

## Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + CSS Variables
- **Auth & DB**: Supabase (Auth, PostgreSQL, Storage, RLS)
- **Payments**: Stripe (subscriptions + webhooks)
- **Deploy**: Vercel

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/you/afriilink
cd afriilink
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. In the SQL editor, run `supabase/migrations/001_initial.sql`
3. Enable Google OAuth in Auth → Providers (optional)

### 3. Set up Stripe

1. Create a product in Stripe dashboard → Products
2. Add a recurring price (£7/month)
3. Copy the Price ID
4. Set up webhook endpoint: `https://yourdomain.com/api/stripe/webhook`
5. Add events: `checkout.session.completed`, `customer.subscription.deleted`

### 4. Configure environment

```bash
cp .env.local.example .env.local
# Fill in your keys
```

### 5. Run locally

```bash
npm run dev
# → http://localhost:3000
```

## Deploying to Vercel

```bash
npx vercel --prod
```

Add all env vars in Vercel dashboard → Settings → Environment Variables.

## Project Structure

```
app/
  page.tsx                  ← Landing page
  login/page.tsx            ← Login (magic link + password + Google)
  register/page.tsx         ← Sign up
  dashboard/
    layout.tsx              ← Dashboard sidebar
    page.tsx                ← Overview + stats
    links/page.tsx          ← Link manager (add/toggle/delete)
    appearance/page.tsx     ← Theme + profile + cover editor
    analytics/page.tsx      ← Views, clicks, chart, device breakdown
    settings/page.tsx       ← Billing, publish, custom domain, SEO
  [username]/
    page.tsx                ← Public creator page (SSR + OG meta)
    PublicPageClient.tsx    ← Client component with analytics tracking
  api/
    auth/callback/          ← Supabase OAuth callback
    links/                  ← CRUD with free plan gating
    profile/                ← Get/update profile
    analytics/              ← Event tracking
    stripe/
      checkout/             ← Create Stripe checkout
      portal/               ← Open billing portal
      webhook/              ← Handle Stripe events

supabase/migrations/
  001_initial.sql           ← Full schema + RLS + triggers

types/index.ts              ← All types, themes, link icons
lib/
  supabase.ts               ← Browser client
  supabase-server.ts        ← Server client
  stripe.ts                 ← Stripe helpers
  utils.ts                  ← cn(), formatNumber(), etc.
middleware.ts               ← Auth protection for /dashboard
```

## Features

- ✦ Magic link + password + Google OAuth
- ✦ Auto-create profile on signup (username derived from email)
- ✦ Drag-to-reorder links (dnd-kit)
- ✦ 14 link types with icons
- ✦ 7 themes with live preview
- ✦ 12 cover gradients
- ✦ Page view + click tracking (analytics table)
- ✦ Free plan: 5 links, 7-day analytics
- ✦ Pro plan: unlimited links, custom domain, 90-day analytics
- ✦ Stripe checkout + billing portal + webhook
- ✦ SSR public pages with OG meta tags
- ✦ Row-Level Security on all tables
- ✦ Auth middleware protecting /dashboard

## Monetisation Model

| Feature | Free | Pro (£7/mo) |
|---|---|---|
| Links | 5 | Unlimited |
| Domain | afriilink.com/you | yourname.com |
| Analytics | 7 days | 90 days |
| Geo/referrer data | ✗ | ✓ |
| Support | Standard | Priority |
