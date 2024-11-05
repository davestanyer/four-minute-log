-- Check if this migration has been applied
do $$
begin
  if not exists (
    select 1 from public.schema_version where version = 6
  ) then
    -- Enable RLS on all tables
    alter table public.users enable row level security;
    alter table public.clients enable row level security;
    alter table public.client_tags enable row level security;
    alter table public.projects enable row level security;
    alter table public.daily_logs enable row level security;
    alter table public.tasks enable row level security;
    alter table public.task_tags enable row level security;
    alter table public.recurring_tasks enable row level security;
    alter table public.recurring_task_tags enable row level security;
    alter table public.one_off_tasks enable row level security;
    alter table public.one_off_task_tags enable row level security;

    -- Create policies
    create policy "Users can read all users"
      on public.users for select
      to authenticated
      using (true);

    create policy "Users can insert their own profile"
      on public.users for insert
      to authenticated
      with check (auth.uid() = id);

    create policy "Users can update their own profile"
      on public.users for update
      to authenticated
      using (auth.uid() = id);

    create policy "Enable insert for service role"
      on public.users for insert
      to service_role
      with check (true);

    create policy "Users can read all clients"
      on public.clients for select
      to authenticated
      using (true);

    create policy "Users can read all client tags"
      on public.client_tags for select
      to authenticated
      using (true);

    create policy "Users can read all projects"
      on public.projects for select
      to authenticated
      using (true);

    create policy "Users can read their own daily logs"
      on public.daily_logs for select
      to authenticated
      using (auth.uid() = user_id);

    create policy "Users can create their own daily logs"
      on public.daily_logs for insert
      to authenticated
      with check (auth.uid() = user_id);

    create policy "Users can update their own daily logs"
      on public.daily_logs for update
      to authenticated
      using (auth.uid() = user_id);

    create policy "Users can read their own tasks"
      on public.tasks for select
      to authenticated
      using (exists (
        select 1 from public.daily_logs
        where daily_logs.id = tasks.daily_log_id
        and daily_logs.user_id = auth.uid()
      ));

    create policy "Users can create tasks in their own daily logs"
      on public.tasks for insert
      to authenticated
      with check (exists (
        select 1 from public.daily_logs
        where daily_logs.id = daily_log_id
        and daily_logs.user_id = auth.uid()
      ));

    create policy "Users can update tasks in their own daily logs"
      on public.tasks for update
      to authenticated
      using (exists (
        select 1 from public.daily_logs
        where daily_logs.id = daily_log_id
        and daily_logs.user_id = auth.uid()
      ));

    create policy "Users can read their own recurring tasks"
      on public.recurring_tasks for select
      to authenticated
      using (user_id = auth.uid());

    create policy "Users can create their own recurring tasks"
      on public.recurring_tasks for insert
      to authenticated
      with check (user_id = auth.uid());

    create policy "Users can update their own recurring tasks"
      on public.recurring_tasks for update
      to authenticated
      using (user_id = auth.uid());

    create policy "Users can read their own one-off tasks"
      on public.one_off_tasks for select
      to authenticated
      using (user_id = auth.uid());

    create policy "Users can create their own one-off tasks"
      on public.one_off_tasks for insert
      to authenticated
      with check (user_id = auth.uid());

    create policy "Users can update their own one-off tasks"
      on public.one_off_tasks for update
      to authenticated
      using (user_id = auth.uid());

    -- Record this migration
    insert into public.schema_version (version, description)
    values (6, 'Setup RLS policies');
  end if;
end $$;