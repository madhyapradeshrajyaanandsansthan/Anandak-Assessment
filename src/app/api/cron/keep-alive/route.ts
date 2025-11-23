import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Legacy JWT-based keys (being phased out)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// New API keys (recommended)
const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
const supabasePublishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

/**
 * Select the best available Supabase key
 * Priority: Secret > Service Role > Publishable > Anon
 */
function selectSupabaseKey(): { key: string; type: string } {
  if (supabaseSecretKey) {
    return { key: supabaseSecretKey, type: 'secret (sb_secret_)' };
  }
  if (supabaseServiceKey) {
    return { key: supabaseServiceKey, type: 'service_role (JWT - legacy)' };
  }
  if (supabasePublishableKey) {
    return { key: supabasePublishableKey, type: 'publishable (sb_publishable_)' };
  }
  if (supabaseAnonKey) {
    return { key: supabaseAnonKey, type: 'anon (JWT - legacy)' };
  }
  throw new Error(
    'Missing Supabase key. Set one of: SUPABASE_SECRET_KEY (recommended), ' +
    'SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * Vercel Cron Job: Keep Supabase Active
 * 
 * This endpoint is called daily by Vercel Cron Jobs to prevent
 * Supabase free tier from pausing due to inactivity.
 * 
 * Cron Schedule: Daily at 6:00 AM UTC (0 6 * * *)
 * 
 * Security: Protected by Vercel Cron Secret
 */
export async function GET(request: NextRequest) {
  try {
    // Verify request is from Vercel Cron (security check)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('❌ Unauthorized cron request');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('🔄 Cron job triggered:', new Date().toISOString());

    // Validate Supabase credentials
    if (!supabaseUrl) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
    }

    // Select the best available key
    const { key: supabaseKey, type: keyType } = selectSupabaseKey();
    console.log(`🔑 Using ${keyType} key`);

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Perform lightweight query to keep database active
    const { count, error } = await supabase
      .from('assessment_submissions')
      .select('id', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    const result = {
      success: true,
      timestamp: new Date().toISOString(),
      database: {
        active: true,
        totalRecords: count ?? 0,
        url: supabaseUrl
      },
      nextRun: 'Tomorrow at 6:00 AM UTC'
    };

    console.log('✅ Supabase keep-alive successful:', result);

    return NextResponse.json(result, { status: 200 });

  } catch (error: any) {
    console.error('❌ Cron job failed:', error.message);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Also support POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
