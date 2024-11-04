-- Check if this migration has been applied
do $$
begin
  if not exists (
    select 1 from public.schema_version where version = 4
  ) then
    -- Create recurring_tasks table
    create table if not exists public.recurring_tasks (
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references public.users(id) on delete cascade,
      title text not null,
      duration text,
      frequency text not null check (frequency in ('daily', 'weekly', 'monthly')),
      week_day integer,
      month_day integer,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Create recurring_task_tags table
    create table if not exists public.recurring_task_tags (
      id uuid primary key default uuid_generate_v4(),
      recurring_task_id uuid references public.recurring_tasks(id) on delete cascade,
      tag text not null,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      unique(recurring_task_id, tag)
    );

    -- Record this migration
    insert into public.schema_version (version, description)
    values (4, 'Create recurring tasks tables');
  end if;
end $$;