-- ─────────────────────────────────────────────
-- Afriilink — Supabase Schema
-- Run this in your Supabase SQL editor
-- ─────────────────────────────────────────────

-- Enable required extensions
create extension if not exists "uuid-ossp";

-- ── PROFILES ──────────────────────────────────
create table public.profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid references auth.users(id) on delete cascade not null unique,
  username        text not null unique,
  display_name    text not null default '',
  bio             text,
  avatar_url      text,
  cover_color     text not null default 'linear-gradient(135deg,#7b6ef6,#ff6b35)',
  theme           text not null default 'dark_lime',
  plan            text not null default 'free' check (plan in ('free','pro')),
  custom_domain   text unique,
  seo_title       text,
  seo_description text,
  stripe_customer_id text,
  stripe_subscription_id text,
  is_published    boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Username must be lowercase alphanumeric + hyphens, 3-30 chars
alter table public.profiles
  add constraint username_format check (username ~ '^[a-z0-9][a-z0-9\-]{1,28}[a-z0-9]$');

-- ── LINKS ─────────────────────────────────────
create table public.links (
  id            uuid primary key default uuid_generate_v4(),
  profile_id    uuid references public.profiles(id) on delete cascade not null,
  type          text not null default 'custom',
  title         text not null,
  url           text not null,
  subtitle      text,
  icon          text,
  thumbnail_url text,
  is_active     boolean not null default true,
  sort_order    integer not null default 0,
  click_count   integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index links_profile_id_idx on public.links(profile_id);
create index links_sort_order_idx on public.links(profile_id, sort_order);

-- ── ANALYTICS ─────────────────────────────────
create table public.analytics (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid references public.profiles(id) on delete cascade not null,
  link_id     uuid references public.links(id) on delete set null,
  event       text not null check (event in ('page_view','link_click')),
  referrer    text,
  country     text,
  device      text,
  created_at  timestamptz not null default now()
);

create index analytics_profile_id_idx on public.analytics(profile_id);
create index analytics_created_at_idx on public.analytics(created_at desc);

-- ── ROW LEVEL SECURITY ────────────────────────

-- Profiles: public read, owner write
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- Links: public read (if profile published), owner full access
alter table public.links enable row level security;

create policy "Links are publicly viewable"
  on public.links for select using (true);

create policy "Users can manage their own links"
  on public.links for all
  using (
    profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  );

-- Analytics: public insert (for tracking), owner read
alter table public.analytics enable row level security;

create policy "Anyone can insert analytics"
  on public.analytics for insert with check (true);

create policy "Users can view their own analytics"
  on public.analytics for select
  using (
    profile_id in (
      select id from public.profiles where user_id = auth.uid()
    )
  );

-- ── UPDATED_AT TRIGGER ────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger links_updated_at
  before update on public.links
  for each row execute procedure public.handle_updated_at();

-- ── AUTO CREATE PROFILE ON SIGNUP ─────────────
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter int := 0;
begin
  -- Derive a base username from email
  base_username := lower(regexp_replace(split_part(new.email, '@', 1), '[^a-z0-9]', '', 'g'));
  -- Ensure min length
  if length(base_username) < 3 then
    base_username := base_username || 'user';
  end if;
  -- Truncate to 28 chars
  base_username := substring(base_username from 1 for 28);

  final_username := base_username;

  -- Handle conflicts
  loop
    exit when not exists (select 1 from public.profiles where username = final_username);
    counter := counter + 1;
    final_username := base_username || counter::text;
  end loop;

  insert into public.profiles (user_id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
