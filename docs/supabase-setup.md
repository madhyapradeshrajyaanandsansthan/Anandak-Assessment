# Supabase Setup Guide

Complete guide to setting up Supabase for the Multi-Parameter Assessment application.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Initial Setup](#initial-setup)
4. [Database Schema](#database-schema)
5. [Environment Configuration](#environment-configuration)
6. [Security Configuration](#security-configuration)
7. [Testing the Connection](#testing-the-connection)
8. [Troubleshooting](#troubleshooting)

---

## Overview

This application uses **Supabase** as the primary database solution for storing assessment submissions. Supabase is an open-source Firebase alternative built on PostgreSQL.

### Why Supabase?

- **PostgreSQL**: Industry-standard relational database
- **Real-time subscriptions**: Live data updates
- **Row Level Security (RLS)**: Built-in security policies
- **RESTful API**: Auto-generated APIs
- **Authentication**: Built-in user management
- **Storage**: File storage capabilities
- **Open Source**: Self-hostable and transparent

---

## Prerequisites

Before starting, ensure you have:

- ✅ A Supabase account (free tier available at [supabase.com](https://supabase.com))
- ✅ Basic understanding of SQL
- ✅ Access to your project's `.env` file
- ✅ Node.js 18+ installed

---

## Initial Setup

### Step 1: Create a Supabase Project

1. **Sign in to Supabase**
   - Go to [https://supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign in with GitHub, Google, or email

2. **Create New Project**
   - Click "New Project"
   - **Organization**: Select or create an organization
   - **Project Name**: `mp-assessment` (or your preferred name)
   - **Database Password**: Generate a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., `ap-south-1` for India)
   - **Pricing Plan**: Free tier is sufficient for development
   - Click "Create new project"

3. **Wait for Provisioning**
   - Takes 1-2 minutes
   - You'll see a loading screen

### Step 2: Get API Credentials

Once your project is ready:

1. **Navigate to Project Settings**
   - Click the gear icon (⚙️) in the left sidebar
   - Select "API" from the settings menu

2. **Copy Required Credentials**
   
   You need two values:
   
   - **Project URL**: 
     ```
     https://your-project-id.supabase.co
     ```
   
   - **Service Role Key** (NOT anon key):
     - Scroll down to "service_role key"
     - Click "Reveal" and copy the key
     - ⚠️ **IMPORTANT**: Use `service_role` key, NOT `anon` key
     - The service role key bypasses RLS policies (needed for server-side inserts)

---

## Database Schema

### Step 3: Create the Assessment Submissions Table

1. **Open SQL Editor**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

2. **Run the Table Creation Script**

   Copy and paste the entire content from `supabase/supabase-detailed-table.sql`:

```sql
-- Create the detailed assessment_submissions table
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
COMMENT ON TABLE public.assessment_submissions IS 'Assessment submissions with individual trait scores and feedback';
```

3. **Execute the Script**
   - Click "Run" or press `Ctrl+Enter`
   - You should see "Success. No rows returned"

### Understanding the Schema

**Table: `assessment_submissions`**

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Unique identifier (auto-generated) |
| `created_at` | TIMESTAMP | Submission timestamp (UTC) |
| `name` | TEXT | User's full name |
| `name_hi` | TEXT | User's name in Hindi (transliterated) |
| `age` | INTEGER | User's age (1-120) |
| `gender` | TEXT | Gender (Male/Female/Other/Prefer not to say) |
| `country_code` | TEXT | Country dial code (default: +91) |
| `mobile` | TEXT | Mobile number |
| `email` | TEXT | Email address (optional) |
| `state` | TEXT | Indian state |
| `district` | TEXT | District name |
| `total_score` | INTEGER | Sum of all 6 trait scores |
| `final_assessment` | TEXT | Overall assessment feedback |
| `gratitude_score` | INTEGER | Gratitude trait score (1-3) |
| `resilience_score` | INTEGER | Resilience trait score (1-3) |
| `empathy_score` | INTEGER | Empathy trait score (1-3) |
| `sociability_score` | INTEGER | Sociability trait score (1-3) |
| `social_cognition_score` | INTEGER | Social Cognition trait score (1-3) |
| `courage_score` | INTEGER | Courage trait score (1-3) |
| `assessment_data` | JSONB | Full assessment data (questions + answers) |
| `feedback_comments` | JSONB | Array of all trait feedbacks |

**Indexes Created:**
- `created_at DESC` - Fast date-based queries
- `state` - Filter by state
- `district` - Filter by district
- `total_score DESC` - Sort by score

**View: `assessment_analytics`**
- Aggregated statistics by date, state, district, and gender
- Average scores for all traits
- Submission counts

---

## Environment Configuration

### Step 4: Configure Environment Variables

1. **Create/Update `.env` File**

   In your project root, create or update `.env`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-service-role-key
```

2. **Replace Placeholders**
   - `your-project-id`: Your actual Supabase project ID
   - `your-service-role-key`: The service role key you copied earlier

3. **⚠️ Security Notes**
   - ✅ **DO** use `service_role` key (for API routes)
   - ❌ **DON'T** use `anon` key (insufficient permissions)
   - ✅ **DO** add `.env` to `.gitignore`
   - ❌ **DON'T** commit credentials to version control

### JWT Token Structure

The service role key is a JWT token with this structure:

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
{
  "iss": "supabase",
  "ref": "your-project-id",
  "role": "service_role",  // ← Must be "service_role"
  "iat": 1234567890,
  "exp": 9999999999
}
```

**Common Mistake**: Using a key with `"role": "anon"` instead of `"role": "service_role"`

---

## Security Configuration

### Row Level Security (RLS)

The table has RLS enabled with two policies:

1. **Anonymous Insert Policy**
   ```sql
   CREATE POLICY "Allow anonymous inserts" 
       ON public.assessment_submissions 
       FOR INSERT 
       TO anon 
       WITH CHECK (true);
   ```
   - Allows anyone to insert data
   - Necessary for public assessment submissions

2. **Service Role Full Access**
   ```sql
   CREATE POLICY "Allow service role full access" 
       ON public.assessment_submissions 
       FOR ALL 
       TO service_role 
       USING (true);
   ```
   - Full read/write access for service role
   - Used by API routes to insert data

### Best Practices

- ✅ Keep service role key in environment variables
- ✅ Use service role only in API routes (server-side)
- ✅ Never expose service role key to frontend
- ✅ Regularly rotate API keys
- ✅ Monitor database usage in Supabase dashboard

---

## Testing the Connection

### Step 5: Verify Setup

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Test the Application**
   - Navigate to `http://localhost:9002`
   - Fill out the user information
   - Complete the assessment
   - Submit the form

3. **Verify Data in Supabase**
   - Go to Supabase Dashboard
   - Click "Table Editor"
   - Select `assessment_submissions`
   - You should see your test submission

4. **Check the Data Structure**
   
   Your submission should have:
   - ✅ Personal info (name, age, gender, etc.)
   - ✅ All 6 trait scores
   - ✅ Total score
   - ✅ Assessment data (JSONB)
   - ✅ Feedback comments (JSONB array)

### Sample Query

Run this in SQL Editor to view submissions:

```sql
SELECT 
    name,
    age,
    state,
    total_score,
    gratitude_score,
    resilience_score,
    empathy_score,
    sociability_score,
    social_cognition_score,
    courage_score,
    created_at
FROM assessment_submissions
ORDER BY created_at DESC
LIMIT 10;
```

---

## Troubleshooting

### Issue: "Invalid API key" Error

**Problem**: Using wrong key or malformed JWT

**Solution**:
1. Verify you're using `service_role` key (not `anon` key)
2. Check the JWT payload at [jwt.io](https://jwt.io)
3. Ensure `"role": "service_role"` in the token
4. Regenerate the key if necessary

### Issue: "Failed to submit assessment"

**Problem**: Database insert failing

**Solutions**:
1. **Check environment variables**:
   ```bash
   # In terminal
   echo $NEXT_PUBLIC_SUPABASE_URL
   ```
   Restart dev server after .env changes

2. **Verify table exists**:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_name = 'assessment_submissions';
   ```

3. **Check RLS policies**:
   ```sql
   SELECT * FROM pg_policies 
   WHERE tablename = 'assessment_submissions';
   ```

4. **View error details** in browser console (F12)

### Issue: Missing `feedback_comments` Column

**Problem**: Old schema without feedback column

**Solution**:
```sql
ALTER TABLE public.assessment_submissions 
ADD COLUMN IF NOT EXISTS feedback_comments JSONB NOT NULL DEFAULT '[]'::jsonb;
```

### Issue: Connection Timeout

**Problem**: Network/firewall blocking Supabase

**Solutions**:
1. Check your internet connection
2. Verify Supabase project is active (not paused)
3. Try accessing project URL directly in browser
4. Check firewall/VPN settings

### Issue: Data Not Appearing

**Problem**: Wrong table or RLS blocking reads

**Solutions**:
1. **Verify table name**: `assessment_submissions`
2. **Check RLS policies**: Ensure service role has read access
3. **Use SQL Editor**: Query directly to confirm data exists

---

## Advanced Configuration

### Analytics Queries

**Total Submissions by State**:
```sql
SELECT state, COUNT(*) as total
FROM assessment_submissions
GROUP BY state
ORDER BY total DESC;
```

**Average Scores by Gender**:
```sql
SELECT 
    gender,
    AVG(total_score) as avg_total,
    AVG(gratitude_score) as avg_gratitude,
    AVG(resilience_score) as avg_resilience,
    AVG(empathy_score) as avg_empathy
FROM assessment_submissions
GROUP BY gender;
```

**Daily Submission Trends**:
```sql
SELECT * FROM assessment_analytics
WHERE submission_date >= CURRENT_DATE - INTERVAL '30 days'
ORDER BY submission_date DESC;
```

### Backup and Export

**Export Data as CSV**:
1. Go to Table Editor
2. Select `assessment_submissions`
3. Click "..." menu → "Download as CSV"

**SQL Backup**:
```sql
-- Export to local file
COPY (SELECT * FROM assessment_submissions) 
TO '/tmp/assessment_backup.csv' 
WITH CSV HEADER;
```

### Performance Optimization

**Add More Indexes** (if needed):
```sql
-- Index on email for faster lookups
CREATE INDEX idx_email ON assessment_submissions(email) 
WHERE email IS NOT NULL;

-- Composite index for state + district queries
CREATE INDEX idx_state_district ON assessment_submissions(state, district);

-- Index on gender for analytics
CREATE INDEX idx_gender ON assessment_submissions(gender);
```

---

## Migration from Other Databases

If you have existing data in another system, use the migration script:

```bash
npm run migrate
```

See `scripts/migrate-firebase-to-supabase.ts` for details.

**Migration Script Features**:
- ✅ Connects to old database
- ✅ Transforms data format
- ✅ Validates before insert
- ✅ Handles errors gracefully
- ✅ Provides progress feedback

---

## Next Steps

After completing Supabase setup:

1. ✅ **Deploy to Production**: See [docs/deployment.md](./deployment.md)
2. ✅ **Set Up Analytics**: Configure monitoring and dashboards
3. ✅ **Enable Backups**: Set up automated backups in Supabase
4. ✅ **Configure Alerts**: Set up email alerts for errors
5. ✅ **Review Security**: Audit RLS policies regularly

---

## Resources

- **Supabase Documentation**: [https://supabase.com/docs](https://supabase.com/docs)
- **PostgreSQL Docs**: [https://www.postgresql.org/docs/](https://www.postgresql.org/docs/)
- **Supabase Dashboard**: [https://app.supabase.com](https://app.supabase.com)
- **API Reference**: See [docs/api-reference.md](./api-reference.md)

---

## Support

If you encounter issues:

1. Check this documentation
2. Review [Troubleshooting](#troubleshooting) section
3. Check Supabase logs in dashboard
4. Review browser console errors
5. Check API route logs

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**Status**: Production Ready ✅
