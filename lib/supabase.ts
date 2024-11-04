import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Tables = {
  users: {
    id: string
    email: string
    name: string
    role: 'admin' | 'user'
    avatar_url?: string
    created_at: string
  }
  clients: {
    id: string
    name: string
    emoji: string
    color: string
    created_at: string
  }
  client_tags: {
    id: string
    client_id: string
    tag: string
    created_at: string
  }
  projects: {
    id: string
    client_id: string
    name: string
    description?: string
    created_at: string
  }
  daily_logs: {
    id: string
    user_id: string
    log_date: string
    created_at: string
  }
  tasks: {
    id: string
    daily_log_id: string
    content: string
    completed: boolean
    completed_at?: string
    duration?: string
    created_at: string
  }
  task_tags: {
    id: string
    task_id: string
    tag: string
    created_at: string
  }
  recurring_tasks: {
    id: string
    user_id: string
    title: string
    duration?: string
    frequency: 'daily' | 'weekly' | 'monthly'
    week_day?: number
    month_day?: number
    created_at: string
  }
  recurring_task_tags: {
    id: string
    recurring_task_id: string
    tag: string
    created_at: string
  }
  one_off_tasks: {
    id: string
    user_id: string
    title: string
    duration?: string
    start_date: string
    created_at: string
  }
  one_off_task_tags: {
    id: string
    one_off_task_id: string
    tag: string
    created_at: string
  }
}