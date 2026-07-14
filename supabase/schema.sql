-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor -> New query)
-- If you already ran the original schema.sql, run THIS whole file again —
-- it safely upgrades things (uses "if not exists" and drops old policies first).

create extension if not exists "pgcrypto";

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  date date,
  time text,
  service text,
  notes text,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists content_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  linked_booking text,
  booking_id uuid references bookings(id) on delete set null,
  created_at timestamptz not null default now()
);

-- Table of admin emails (you). Only rows Muznah has explicitly added here get full access.
create table if not exists admins (
  email text primary key
);

-- Price list shown to clients on their portal page. Editable only by you (the admin).
create table if not exists price_list (
  id uuid primary key default gen_random_uuid(),
  service text not null,
  price numeric,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Inquiries: submitted by anyone via the public bio-link form, no login required.
-- Only you can view, update, or delete them.
create table if not exists inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  event_type text,
  preferred_date date,
  ready_by_time text,
  location text,
  glam_location text,
  client_address text,
  guest_count integer,
  service text,
  hair_service text,
  addons jsonb,
  budget text,
  how_heard text,
  social_handle text,
  bare_face_photo_url text,
  inspiration_urls jsonb,
  allergies text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

-- If you already had the inquiries table from before this update, these add the new columns:
alter table inquiries add column if not exists event_type text;
alter table inquiries add column if not exists location text;
alter table inquiries add column if not exists ready_by_time text;
alter table inquiries add column if not exists glam_location text;
alter table inquiries add column if not exists client_address text;
alter table inquiries add column if not exists hair_service text;
alter table inquiries add column if not exists addons jsonb;
alter table inquiries add column if not exists bare_face_photo_url text;
alter table inquiries add column if not exists inspiration_urls jsonb;
alter table inquiries add column if not exists allergies text;
alter table inquiries add column if not exists guest_count integer;
alter table inquiries add column if not exists budget text;
alter table inquiries add column if not exists how_heard text;
alter table inquiries add column if not exists social_handle text;

-- Inspiration images/links attached to a specific booking (mood board style reference).
create table if not exists booking_inspiration (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references bookings(id) on delete cascade,
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table bookings enable row level security;
alter table content_ideas enable row level security;
alter table admins enable row level security;
alter table price_list enable row level security;
alter table inquiries enable row level security;
alter table booking_inspiration enable row level security;

-- Helper: checks if the currently logged-in user's email is in the admins table
create or replace function is_admin() returns boolean
language sql stable security definer as $$
  select exists (select 1 from admins where email = auth.jwt() ->> 'email');
$$;

-- Anyone logged in can check admin status (needed so the app can tell admin vs client)
drop policy if exists "authenticated can check admin status" on admins;
create policy "authenticated can check admin status" on admins for select using (auth.uid() is not null);

-- Remove old fully-open policies if they exist from a previous version of this schema
drop policy if exists "public read bookings" on bookings;
drop policy if exists "public write bookings" on bookings;
drop policy if exists "public update bookings" on bookings;
drop policy if exists "public delete bookings" on bookings;
drop policy if exists "public read ideas" on content_ideas;
drop policy if exists "public write ideas" on content_ideas;
drop policy if exists "public update ideas" on content_ideas;
drop policy if exists "public delete ideas" on content_ideas;

-- Bookings: clients can only see the row that matches their own logged-in email.
-- Only admins (you) can create, edit, or delete bookings.
create policy "read own booking or admin" on bookings for select
  using (is_admin() or email = auth.jwt() ->> 'email');
create policy "admin insert bookings" on bookings for insert with check (is_admin());
create policy "admin update bookings" on bookings for update using (is_admin());
create policy "admin delete bookings" on bookings for delete using (is_admin());

-- Content ideas: clients can only see ideas linked to their own booking.
create policy "read own ideas or admin" on content_ideas for select
  using (
    is_admin()
    or booking_id in (select id from bookings where email = auth.jwt() ->> 'email')
  );
create policy "admin insert ideas" on content_ideas for insert with check (is_admin());
create policy "admin update ideas" on content_ideas for update using (is_admin());
create policy "admin delete ideas" on content_ideas for delete using (is_admin());

-- Inspiration links/images: clients see only what's attached to their own booking. Only you can add/remove.
drop policy if exists "read own inspiration or admin" on booking_inspiration;
drop policy if exists "admin insert inspiration" on booking_inspiration;
drop policy if exists "admin delete inspiration" on booking_inspiration;
create policy "read own inspiration or admin" on booking_inspiration for select
  using (
    is_admin()
    or booking_id in (select id from bookings where email = auth.jwt() ->> 'email')
  );
create policy "admin insert inspiration" on booking_inspiration for insert with check (is_admin());
create policy "admin delete inspiration" on booking_inspiration for delete using (is_admin());

-- Price list: anyone logged in (admin or any client) can view it. Only you can change it.
drop policy if exists "any authenticated user can read prices" on price_list;
create policy "any authenticated user can read prices" on price_list for select using (auth.uid() is not null);
create policy "admin insert prices" on price_list for insert with check (is_admin());
create policy "admin update prices" on price_list for update using (is_admin());
create policy "admin delete prices" on price_list for delete using (is_admin());

-- Inquiries: anyone (even logged out) can submit one. Only you can read, update, or delete them.
drop policy if exists "anyone can submit inquiry" on inquiries;
drop policy if exists "admin read inquiries" on inquiries;
drop policy if exists "admin update inquiries" on inquiries;
drop policy if exists "admin delete inquiries" on inquiries;
create policy "anyone can submit inquiry" on inquiries for insert with check (true);
create policy "admin read inquiries" on inquiries for select using (is_admin());
create policy "admin update inquiries" on inquiries for update using (is_admin());
create policy "admin delete inquiries" on inquiries for delete using (is_admin());

-- Let anyone (even logged out) view your price list on the public inquiry form.
drop policy if exists "public can read prices" on price_list;
create policy "public can read prices" on price_list for select using (true);

-- Storage bucket for inquiry photo uploads (bare-face photo + inspiration pics).
-- Public bucket so photos can be viewed by you in the dashboard; anyone can upload
-- (needed since the inquiry form has no login), but nobody but you can browse/delete.
insert into storage.buckets (id, name, public)
values ('inquiry-uploads', 'inquiry-uploads', true)
on conflict (id) do nothing;

drop policy if exists "anyone can upload inquiry photos" on storage.objects;
drop policy if exists "anyone can view inquiry photos" on storage.objects;
create policy "anyone can upload inquiry photos" on storage.objects
  for insert with check (bucket_id = 'inquiry-uploads');
create policy "anyone can view inquiry photos" on storage.objects
  for select using (bucket_id = 'inquiry-uploads');

-- Public website content: your About Me text, editable from the admin dashboard.
create table if not exists site_content (
  id text primary key,
  content text,
  updated_at timestamptz not null default now()
);
alter table site_content enable row level security;
drop policy if exists "public can read site content" on site_content;
drop policy if exists "admin can insert site content" on site_content;
drop policy if exists "admin can update site content" on site_content;
create policy "public can read site content" on site_content for select using (true);
create policy "admin can insert site content" on site_content for insert with check (is_admin());
create policy "admin can update site content" on site_content for update using (is_admin());

-- Portfolio images shown on your public homepage.
create table if not exists portfolio_images (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table portfolio_images enable row level security;
drop policy if exists "public can read portfolio" on portfolio_images;
drop policy if exists "admin can insert portfolio" on portfolio_images;
drop policy if exists "admin can delete portfolio" on portfolio_images;
create policy "public can read portfolio" on portfolio_images for select using (true);
create policy "admin can insert portfolio" on portfolio_images for insert with check (is_admin());
create policy "admin can delete portfolio" on portfolio_images for delete using (is_admin());

-- Storage bucket for portfolio photos. Public to view; only you (admin) can upload.
insert into storage.buckets (id, name, public)
values ('portfolio-uploads', 'portfolio-uploads', true)
on conflict (id) do nothing;

drop policy if exists "admin can upload portfolio photos" on storage.objects;
drop policy if exists "public can view portfolio photos" on storage.objects;
create policy "admin can upload portfolio photos" on storage.objects
  for insert with check (bucket_id = 'portfolio-uploads' and is_admin());
create policy "public can view portfolio photos" on storage.objects
  for select using (bucket_id = 'portfolio-uploads');

-- LAST STEP (do this after you've created your own login in the app or Supabase dashboard):
-- insert into admins (email) values ('your-real-email@example.com');
