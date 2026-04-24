import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vnreoknrkiuyapsyvzuh.supabase.co'
const supabaseAnonKey = 'sb_publishable_3BFIk-teOI1VnazyXXS4FQ_paTad7u_'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
