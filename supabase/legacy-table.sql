-- Create legacy assessment submissions table (matches Firebase structure)
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS assessment_submissions_legacy (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    age INTEGER NOT NULL,
    gender TEXT NOT NULL,
    mobile TEXT,
    email TEXT,
    country_code TEXT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    assessment_data JSONB NOT NULL,
    total_score INTEGER NOT NULL,
    final_assessment_text TEXT NOT NULL,
    date TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_legacy_created_at ON assessment_submissions_legacy(created_at DESC);

-- Create index on state and district
CREATE INDEX IF NOT EXISTS idx_legacy_location ON assessment_submissions_legacy(state, district);

-- Create index on total_score
CREATE INDEX IF NOT EXISTS idx_legacy_score ON assessment_submissions_legacy(total_score DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE assessment_submissions_legacy ENABLE ROW LEVEL SECURITY;

-- Create policy to allow INSERT (for API to save data)
CREATE POLICY "Enable insert for authenticated users" ON assessment_submissions_legacy
    FOR INSERT
    WITH CHECK (true);

-- Create policy to allow SELECT for service role (for admin access)
CREATE POLICY "Enable read access for service role" ON assessment_submissions_legacy
    FOR SELECT
    USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Grant permissions
GRANT ALL ON assessment_submissions_legacy TO authenticated;
GRANT ALL ON assessment_submissions_legacy TO service_role;

-- Comment on table
COMMENT ON TABLE assessment_submissions_legacy IS 'Legacy format assessment submissions (matching original Firebase structure)';

-- Sample query to view data
-- SELECT 
--     id,
--     name,
--     age,
--     gender,
--     state,
--     district,
--     total_score,
--     date,
--     created_at
-- FROM assessment_submissions_legacy
-- ORDER BY created_at DESC
-- LIMIT 10;