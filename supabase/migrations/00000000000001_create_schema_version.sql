-- Create schema version tracking
create table if not exists public.schema_version (
  version integer primary key,
  applied_at timestamp with time zone default timezone('utc'::text, now()) not null,
  description text not null
);