// Supabase client configuration
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for database tables
export interface AssessmentSubmission {
  id?: string;
  created_at?: string;
  name: string;
  name_hi: string;
  age: number;
  gender: string;
  country_code: string;
  mobile: string;
  email?: string;
  state: string;
  district: string;
  total_score: number;
  final_assessment: string;
  gratitude_score: number;
  resilience_score: number;
  empathy_score: number;
  sociability_score: number;
  social_cognition_score: number;
  assessment_data: any; // JSONB field for full assessment details
}
