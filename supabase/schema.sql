-- Create a table for public profiles (optional, but good practice)
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  username text unique,
  avatar_url text,
  website text,

  constraint username_length check (char_length(username) >= 3)
);

alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Songs Table (Metadata)
create table songs (
  id uuid default gen_random_uuid() primary key,
  itunes_id text unique not null,
  title text not null,
  artist text not null,
  album_art_url text,
  preview_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table songs enable row level security;

create policy "Songs are viewable by everyone." on songs
  for select using (true);

create policy "Authenticated users can insert songs." on songs
  for insert with check (auth.role() = 'authenticated');

-- Lyrics Table
create table lyrics (
  id uuid default gen_random_uuid() primary key,
  song_id uuid references songs(id) on delete cascade not null,
  content_en text not null,
  content_ja text,
  created_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(song_id) -- One set of lyrics per song for now (Wiki style: edit existing rather than multiple versions)
);

alter table lyrics enable row level security;

create policy "Lyrics are viewable by everyone." on lyrics
  for select using (true);

create policy "Authenticated users can insert lyrics." on lyrics
  for insert with check (auth.role() = 'authenticated');

create policy "Users can update their own lyrics." on lyrics
  for update using (auth.uid() = created_by);

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
