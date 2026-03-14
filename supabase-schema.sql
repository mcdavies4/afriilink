-- ============================================================
-- Afriilink — Supabase Schema
-- Run this in your Supabase SQL Editor (once)
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── profiles ────────────────────────────────────────────────
create table public.profiles (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  username        text not null unique,
  display_name    text not null default '',
  bio             text,
  avatar_url      text,
  cover_color_1   text not null default '#7b6ef6',
  cover_color_2   text not null default '#ff6b35',
  accent_color    text not null default '#c8f04d',
  theme           text not null default 'midnight',
  is_published    boolean not null default false,
  views           integer not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read any published profile (for public pages)
create policy "Public profiles are viewable by anyone"
  on public.profiles for select
  using (is_published = true or auth.uid() = user_id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

-- ── links ────────────────────────────────────────────────────
create table public.links (
  id          uuid primary key default uuid_generate_v4(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  title       text not null,
  url         text not null,
  subtitle    text,
  icon        text not null default '🌐',
  type        text not null default 'website',
  is_active   boolean not null default true,
  click_count integer not null default 0,
  position    integer not null default 0,
  created_at  timestamptz not null default now()
);

alter table public.links enable row level security;

-- Public can read active links for published profiles
create policy "Links readable for published profiles"
  on public.links for select
  using (
    is_active = true
    and exists (
      select 1 from public.profiles p
      where p.id = profile_id
      and (p.is_published = true or p.user_id = auth.uid())
    )
  );

-- Users manage their own links
create policy "Users manage own links"
  on public.links for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

-- ── link_events ──────────────────────────────────────────────
create table public.link_events (
  id          uuid primary key default uuid_generate_v4(),
  link_id     uuid references public.links(id) on delete set null,
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  event_type  text not null check (event_type in ('click', 'view')),
  referrer    text,
  country     text,
  created_at  timestamptz not null default now()
);

alter table public.link_events enable row level security;

-- Anyone can insert events (anonymous tracking)
create policy "Anyone can insert events"
  on public.link_events for insert
  with check (true);

-- Only profile owner can read their events
create policy "Profile owner can read events"
  on public.link_events for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

-- ── Storage bucket for avatars ───────────────────────────────
insert into storage.buckets (id, name, public) values ('avatars', 'avatars', true);

create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload own avatar"
  on storage.objects for insert
  with check (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

create policy "Users can update own avatar"
  on storage.objects for update
  using (bucket_id = 'avatars' and auth.uid()::text = (storage.foldername(name))[1]);

-- ── Auto-update updated_at ────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_profile_updated
  before update on public.profiles
  for each row execute function public.handle_updated_at();

-- ── Auto-create profile on signup ─────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
declare
  base_username text;
  final_username text;
  counter int := 0;
begin
  base_username := lower(regexp_replace(
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    '[^a-z0-9_-]', '', 'g'
  ));
  final_username := substr(base_username, 1, 30);

  -- Ensure uniqueness
  loop
    exit when not exists (select 1 from public.profiles where username = final_username);
    counter := counter + 1;
    final_username := substr(base_username, 1, 27) || counter::text;
  end loop;

  insert into public.profiles (user_id, username, display_name)
  values (
    new.id,
    final_username,
    coalesce(new.raw_user_meta_data->>'full_name', final_username)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
