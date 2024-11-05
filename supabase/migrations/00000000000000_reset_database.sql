-- Disable row level security to allow dropping tables
alter table if exists public.users disable row level security;
alter table if exists public.clients disable row level security;
alter table if exists public.client_tags disable row level security;
alter table if exists public.projects disable row level security;
alter table if exists public.daily_logs disable row level security;
alter table if exists public.tasks disable row level security;
alter table if exists public.task_tags disable row level security;
alter table if exists public.recurring_tasks disable row level security;
alter table if exists public.recurring_task_tags disable row level security;
alter table if exists public.one_off_tasks disable row level security;
alter table if exists public.one_off_task_tags disable row level security;

-- Drop triggers and functions with CASCADE
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user() cascade;

-- Drop tables in correct order (respecting foreign key constraints)
drop table if exists public.one_off_task_tags;
drop table if exists public.one_off_tasks;
drop table if exists public.recurring_task_tags;
drop table if exists public.recurring_tasks;
drop table if exists public.task_tags;
drop table if exists public.tasks;
drop table if exists public.daily_logs;
drop table if exists public.client_tags;
drop table if exists public.projects;
drop table if exists public.clients;
drop table if exists public.users;
drop table if exists public.schema_version;

-- Reset the auth schema (optional - uncomment if needed)
-- truncate table auth.users cascade;