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

alter table bookings enable row level security;
alter table content_ideas enable row level security;
alter table admins enable row level security;

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

-- LAST STEP (do this after you've created your own login in the app or Supabase dashboard):
-- insert into admins (email) values ('your-real-email@example.com');
