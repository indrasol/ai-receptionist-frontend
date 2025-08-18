import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(`Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_KEY are set in your .env.local file.`)
}

// Create a supabase client with service key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Regular client for authenticated users
export const supabase = createClient(supabaseUrl, supabaseServiceKey)

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: number
          first_name: string
          last_name: string
          phone_number: string
          source: string
          imported_at: string
          created_at: string
          created_by_user_id: string | null
          created_by_user_email: string | null
          vapi_call_id: string | null
          call_status: string
          call_summary: string | null
          call_recording_url: string | null
          call_transcript: string | null
          success_evaluation: string | null
          sheet_url: string | null
        }
        Insert: {
          id?: number
          first_name: string
          last_name: string
          phone_number: string
          source?: string
          imported_at?: string
          created_at?: string
          created_by_user_id?: string | null
          created_by_user_email?: string | null
          vapi_call_id?: string | null
          call_status?: string
          call_summary?: string | null
          call_recording_url?: string | null
          call_transcript?: string | null
          success_evaluation?: string | null
          sheet_url?: string | null
        }
        Update: {
          id?: number
          first_name?: string
          last_name?: string
          phone_number?: string
          source?: string
          imported_at?: string
          created_at?: string
          created_by_user_id?: string | null
          created_by_user_email?: string | null
          vapi_call_id?: string | null
          call_status?: string
          call_summary?: string | null
          call_recording_url?: string | null
          call_transcript?: string | null
          success_evaluation?: string | null
          sheet_url?: string | null
        }
      }
    }
  }
}
