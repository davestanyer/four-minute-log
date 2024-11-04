-- Check if this migration has been applied
do $$
begin
  if not exists (
    select 1 from public.schema_version where version = 3
  ) then
    -- Create daily_logs table
    create table if not exists public.daily_logs (
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references public.users(id) on delete cascade,
      log_date date not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      unique(user_id, log_date)
    );

    -- Create tasks table
    create table if not exists public.tasks (
      id uuid primary key default uuid_generate_v4(),
      daily_log_id uuid references public.daily_logs(id) on delete cascade,
      content text not null,
      completed boolean default false,
      completed_at timestamp with time zone,
      duration text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create task_tags table
    create table if not exists public.task_tags (
      id uuid primary key default uuid_generate_v4(),
      task_id uuid references public.tasks(id) on delete cascade,
      tag text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      unique(task_id, tag)
    );

    -- Record this migration
    insert into public.schema_version (version, description)
    values (3, 'Create task tables');
  end if;
end $$;