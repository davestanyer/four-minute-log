-- Check if this migration has been applied
do $$
declare
  trigger_exists boolean;
begin
  if not exists (
    select 1 from public.schema_version where version = 7
  ) then
    -- Drop existing trigger if it exists
    drop trigger if exists on_auth_user_created on auth.users;
    
    -- Drop existing function if it exists
    drop function if exists public.handle_new_user();

    -- Create function to handle new user creation
    create or replace function public.handle_new_user()
    returns trigger
    security definer
    set search_path = public
    language plpgsql
    as $$
    begin
      insert into public.users (id, email, name, role)
      values (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        'user'
      );
      return new;
    end;
    $$;

    -- Create trigger
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute function public.handle_new_user();

    -- Record this migration
    insert into public.schema_version (version, description)
    values (7, 'Add auth trigger for user creation');
  end if;
end $$;