-- Check if this migration has been applied
do $$
begin
  if not exists (
    select 1 from public.schema_version where version = 2
  ) then
    -- Create users table
    create table if not exists public.users (
      id uuid primary key references auth.users(id) on delete cascade,
      email text unique not null,
      name text not null,
      role text not null check (role in ('admin', 'user')),
      avatar_url text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create clients table
    create table if not exists public.clients (
      id uuid primary key default uuid_generate_v4(),
      name text not null,
      emoji text not null,
      color text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create client_tags table
    create table if not exists public.client_tags (
      id uuid primary key default uuid_generate_v4(),
      client_id uuid references public.clients(id) on delete cascade,
      tag text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      unique(client_id, tag)
    );

    -- Create projects table
    create table if not exists public.projects (
      id uuid primary key default uuid_generate_v4(),
      client_id uuid references public.clients(id) on delete cascade,
      name text not null,
      description text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Record this migration
    insert into public.schema_version (version, description)
    values (2, 'Create base tables');
  end if;
end $$;