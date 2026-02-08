-- Likes Table
create table if not exists likes (
  user_id uuid references auth.users not null,
  song_id uuid references songs(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  primary key (user_id, song_id)
);

alter table likes enable row level security;

-- Policies
create policy "Likes are viewable by everyone." on likes
  for select using (true);

create policy "Authenticated users can insert their own likes." on likes
  for insert with check (auth.uid() = user_id);

create policy "Authenticated users can delete their own likes." on likes
  for delete using (auth.uid() = user_id);
