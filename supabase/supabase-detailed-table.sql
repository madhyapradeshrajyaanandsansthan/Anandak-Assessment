-- Create the detailed assessment_submissions table (for new submissions)
-- This is the NEW format with individual trait scores
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS public.assessment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Personal Information
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender TEXT NOT NULL CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    country_code TEXT NOT NULL DEFAULT '+91',
    mobile TEXT NOT NULL,
    email TEXT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    
    -- Assessment Scores
    total_score INTEGER NOT NULL CHECK (total_score >= 0),
    final_assessment TEXT NOT NULL,
    
    -- Individual Trait Scores
    gratitude_score INTEGER NOT NULL CHECK (gratitude_score >= 0),
    resilience_score INTEGER NOT NULL CHECK (resilience_score >= 0),
    empathy_score INTEGER NOT NULL CHECK (empathy_score >= 0),
    sociability_score INTEGER NOT NULL CHECK (sociability_score >= 0),
    social_cognition_score INTEGER NOT NULL CHECK (social_cognition_score >= 0),
    courage_score INTEGER NOT NULL CHECK (courage_score >= 0),
    
    -- Full Assessment Data (JSONB for flexibility)
    assessment_data JSONB NOT NULL,
    
    -- Feedback Comments (Array of all trait feedbacks)
    feedback_comments JSONB NOT NULL DEFAULT '[]'::jsonb
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_assessment_submissions_created_at 
    ON public.assessment_submissions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_state 
    ON public.assessment_submissions(state);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_district 
    ON public.assessment_submissions(district);

CREATE INDEX IF NOT EXISTS idx_assessment_submissions_total_score 
    ON public.assessment_submissions(total_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.assessment_submissions ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow inserts from authenticated and anonymous users
CREATE POLICY "Allow anonymous inserts" 
    ON public.assessment_submissions 
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Create a policy to allow service role to read all data
CREATE POLICY "Allow service role full access" 
    ON public.assessment_submissions 
    FOR ALL 
    TO service_role 
    USING (true);

-- Optional: Create a view for analytics
CREATE OR REPLACE VIEW public.assessment_analytics AS
SELECT 
    DATE_TRUNC('day', created_at) as submission_date,
    state,
    district,
    gender,
    AVG(total_score) as avg_total_score,
    AVG(gratitude_score) as avg_gratitude,
    AVG(resilience_score) as avg_resilience,
    AVG(empathy_score) as avg_empathy,
    AVG(sociability_score) as avg_sociability,
    AVG(social_cognition_score) as avg_social_cognition,
    AVG(courage_score) as avg_courage,
    COUNT(*) as submission_count
FROM public.assessment_submissions
GROUP BY DATE_TRUNC('day', created_at), state, district, gender;

-- Grant access to the view
GRANT SELECT ON public.assessment_analytics TO anon, authenticated, service_role;

-- Comment on table
COMMENT ON TABLE public.assessment_submissions IS 'Detailed format assessment submissions (new submissions with individual trait scores)';
