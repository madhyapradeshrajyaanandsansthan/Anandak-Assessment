/**
 * Supabase Keep-Alive Script
 * 
 * This script prevents Supabase free tier from pausing due to inactivity.
 * Supabase free tier pauses after 7 days of no activity.
 * 
 * This script:
 * 1. Pings the database with a simple query
 * 2. Should be run daily via cron job or scheduled task
 * 3. Keeps your project active
 * 
 * Run manually: npm run keep-alive
 * Setup cron: See deployment documentation
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Legacy JWT-based keys (being phased out)
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// New API keys (recommended)
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY;
const SUPABASE_PUBLISHABLE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY;

/**
 * Select the best available Supabase key
 * Priority: Secret > Service Role > Publishable > Anon
 */
function selectSupabaseKey(): { key: string; type: string } {
  if (SUPABASE_SECRET_KEY) {
    return { key: SUPABASE_SECRET_KEY, type: 'secret (sb_secret_)' };
  }
  if (SUPABASE_SERVICE_ROLE_KEY) {
    return { key: SUPABASE_SERVICE_ROLE_KEY, type: 'service_role (JWT - legacy)' };
  }
  if (SUPABASE_PUBLISHABLE_KEY) {
    return { key: SUPABASE_PUBLISHABLE_KEY, type: 'publishable (sb_publishable_)' };
  }
  if (SUPABASE_ANON_KEY) {
    return { key: SUPABASE_ANON_KEY, type: 'anon (JWT - legacy)' };
  }
  throw new Error(
    'Missing Supabase key. Set one of: SUPABASE_SECRET_KEY (recommended), ' +
    'SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PUBLISHABLE_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY'
  );
}

/**
 * Ping Supabase database to keep it active
 */
async function keepSupabaseAlive() {
  try {
    console.log('🔄 Starting Supabase keep-alive check...');
    console.log(`📅 Timestamp: ${new Date().toISOString()}\n`);

    // Validate environment variables
    if (!SUPABASE_URL) {
      throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL. Check your .env file.');
    }

    // Select the best available key
    const { key: supabaseKey, type: keyType } = selectSupabaseKey();
    console.log(`🔑 Using ${keyType} key\n`);

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, supabaseKey);

    // Perform a simple query to keep database active
    // This counts total submissions (lightweight query)
    const { count, error } = await supabase
      .from('assessment_submissions')
      .select('id', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Database query failed: ${error.message}`);
    }

    console.log('✅ Supabase is active!');
    console.log(`📊 Total submissions in database: ${count ?? 0}`);
    console.log(`🌐 Database URL: ${SUPABASE_URL}`);
    console.log(`⏰ Next check recommended: ${new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}\n`);
    
    console.log('🎉 Keep-alive successful!\n');
    
    return { success: true, count, timestamp: new Date().toISOString() };
  } catch (error: any) {
    console.error('❌ Keep-alive failed:', error.message);
    console.error('📋 Full error:', error);
    
    // Don't throw - we want the script to exit gracefully for cron
    return { success: false, error: error.message, timestamp: new Date().toISOString() };
  }
}

// Run the keep-alive function
keepSupabaseAlive()
  .then((result) => {
    if (result.success) {
      console.log('✅ Script completed successfully');
      process.exit(0);
    } else {
      console.error('⚠️  Script completed with errors');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  });
