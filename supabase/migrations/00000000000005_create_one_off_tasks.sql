-- Check if this migration has been applied
do $$
begin
  if not exists (
    select 1 from public.schema_version where version = 5
  ) then
    -- Create one_off_tasks table
    create table if not exists public.one_off_tasks (
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references public.users(id) on delete cascade,
      title text not null,
      duration text,
      start_date date not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create one_off_task_tags table
    create table if not exists public.one_off_task_tags (
      id uuid primary key default uuid_generate_v4(),
      one_off_task_id uuid references public.one_off_tasks(id) on delete cascade,
      tag text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      unique(one_off_task_id, tag)
    );

    -- Record this migration
    insert into public.schema_version (version, description)
    values (5, 'Create one-off tasks tables');
  end if;
end $$;