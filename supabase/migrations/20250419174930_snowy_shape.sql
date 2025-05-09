/*
  # Initial schema setup for Eight Glasses

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - references auth.users
      - `created_at` (timestamptz)
      - `username` (text, unique)
      - `avatar_url` (text, optional)
      - `is_public` (boolean)
    - `goals`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `user_id` (uuid, references profiles)
      - `name` (text)
      - `verb` (text)
      - `amount` (numeric)
      - `orientation` (enum: 'or more', 'or less', 'exactly')
      - `period` (enum: 'daily', 'weekly', 'monthly', 'yearly')
      - `unit_type` (enum: 'count', 'number', 'decimal', 'duration')
      - `avatar_url` (text, optional)
      - `description` (text, optional)
      - `is_public` (boolean)
      - `unit` (text, optional)
    - `entries`
      - `id` (uuid, primary key)
      - `created_at` (timestamptz)
      - `goal_id` (uuid, references goals)
      - `user_id` (uuid, references profiles)
      - `amount` (numeric)
      - `note` (text, optional)
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Add public access policies for public goals and profiles
*/

-- Create custom types
create type orientation_type as enum ('or more', 'or less', 'exactly');
create type period_type as enum ('daily', 'weekly', 'monthly', 'yearly');
create type unit_type as enum ('count', 'number', 'decimal', 'duration');

-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  created_at timestamptz default now(),
  username text unique not null,
  avatar_url text,
  is_public boolean default false
);

-- Create goals table
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid not null references profiles on delete cascade,
  name text not null,
  verb text not null,
  amount numeric not null,
  orientation orientation_type not null,
  period period_type not null,
  unit_type unit_type not null,
  avatar_url text,
  description text,
  is_public boolean default false,
  unit text
);

-- Create entries table
create table if not exists entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  goal_id uuid not null references goals on delete cascade,
  user_id uuid not null references profiles on delete cascade,
  amount numeric not null,
  note text
);

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table goals enable row level security;
alter table entries enable row level security;

-- Profiles policies
-- Users can view their own profile
create policy "Users can view own profile"
  on profiles
  for select
  to authenticated
  using (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on profiles
  for update
  to authenticated
  using (auth.uid() = id);

-- Anyone can view public profiles
create policy "Anyone can view public profiles"
  on profiles
  for select
  to anon, authenticated
  using (is_public = true);

-- Goals policies
-- Users can view their own goals
create policy "Users can view own goals"
  on goals
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create their own goals
create policy "Users can create goals"
  on goals
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own goals
create policy "Users can update own goals"
  on goals
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own goals
create policy "Users can delete own goals"
  on goals
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Anyone can view public goals
create policy "Anyone can view public goals"
  on goals
  for select
  to anon, authenticated
  using (is_public = true);

-- Entries policies
-- Users can view their own entries
create policy "Users can view own entries"
  on entries
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create their own entries
create policy "Users can create entries"
  on entries
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Users can update their own entries
create policy "Users can update own entries"
  on entries
  for update
  to authenticated
  using (auth.uid() = user_id);

-- Users can delete their own entries
create policy "Users can delete own entries"
  on entries
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Anyone can view entries for public goals
create policy "Anyone can view entries for public goals"
  on entries
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from goals
      where goals.id = entries.goal_id
      and goals.is_public = true
    )
  );