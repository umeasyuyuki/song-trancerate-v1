-- Vocabularies Table
create table if not exists vocabularies (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  song_id uuid references songs(id) on delete cascade not null,
  word text not null,
  meaning text not null, -- AI generated or user edited meaning
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table vocabularies enable row level security;

-- Policies
create policy "Users can view their own vocabularies." on vocabularies
  for select using (auth.uid() = user_id);

create policy "Users can insert their own vocabularies." on vocabularies
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own vocabularies." on vocabularies
  for delete using (auth.uid() = user_id);
