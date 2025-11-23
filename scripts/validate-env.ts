/**
 * Environment Variables Validation Script
 * 
 * This script validates all required environment variables from .env file
 * and provides detailed feedback about what's missing or misconfigured.
 * 
 * Run: npm run validate-env
 */

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
dotenv.config();

interface ValidationResult {
  variable: string;
  required: boolean;
  status: 'valid' | 'missing' | 'invalid' | 'empty';
  message: string;
  value?: string;
}

interface KeyValidation {
  name: string;
  format: string;
  required: boolean;
  description: string;
}

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Define all expected environment variables
const environmentVariables: Record<string, KeyValidation> = {
  // Core Supabase
  NEXT_PUBLIC_SUPABASE_URL: {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    format: 'https://*.supabase.co',
    required: true,
    description: 'Supabase project URL (required for all operations)',
  },
  
  // New API Keys (Recommended)
  SUPABASE_SECRET_KEY: {
    name: 'SUPABASE_SECRET_KEY',
    format: 'sb_secret_*',
    required: false,
    description: 'New secret key (recommended for server-side operations)',
  },
  SUPABASE_PUBLISHABLE_KEY: {
    name: 'SUPABASE_PUBLISHABLE_KEY',
    format: 'sb_publishable_*',
    required: false,
    description: 'New publishable key (recommended for client-side)',
  },
  
  // Legacy JWT Keys
  SUPABASE_SERVICE_ROLE_KEY: {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    format: 'eyJ* (JWT)',
    required: false,
    description: 'Legacy service role key (fallback for server-side)',
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    format: 'eyJ* (JWT)',
    required: false,
    description: 'Legacy anon key (fallback for client-side)',
  },
  
  // Optional
  CRON_SECRET: {
    name: 'CRON_SECRET',
    format: 'base64 string',
    required: false,
    description: 'Secret for securing cron endpoints (optional but recommended)',
  },
  
  // Legacy Firebase (not in use)
  GOOGLE_PROJECT_ID: {
    name: 'GOOGLE_PROJECT_ID',
    format: 'string',
    required: false,
    description: 'Firebase project ID (legacy, not currently used)',
  },
  GOOGLE_SERVICE_ACCOUNT_EMAIL: {
    name: 'GOOGLE_SERVICE_ACCOUNT_EMAIL',
    format: 'email',
    required: false,
    description: 'Firebase service account email (legacy)',
  },
  GOOGLE_PRIVATE_KEY: {
    name: 'GOOGLE_PRIVATE_KEY',
    format: '-----BEGIN PRIVATE KEY-----',
    required: false,
    description: 'Firebase private key (legacy)',
  },
};

/**
 * Validate individual environment variable (format only)
 */
function validateVariable(config: KeyValidation): ValidationResult {
  const value = process.env[config.name];
  
  // Check if variable exists
  if (!value) {
    return {
      variable: config.name,
      required: config.required,
      status: 'missing',
      message: `Not set${config.required ? ' (REQUIRED)' : ' (optional)'}`,
    };
  }
  
  // Check if empty
  if (value.trim() === '') {
    return {
      variable: config.name,
      required: config.required,
      status: 'empty',
      message: 'Set but empty',
    };
  }
  
  // Validate format
  let isValidFormat = true;
  let formatMessage = '';
  
  switch (config.name) {
    case 'NEXT_PUBLIC_SUPABASE_URL':
      isValidFormat = value.startsWith('https://') && value.includes('supabase.co');
      formatMessage = isValidFormat ? 'Valid URL format' : 'Invalid format (should be https://*.supabase.co)';
      break;
      
    case 'SUPABASE_SECRET_KEY':
      isValidFormat = value.startsWith('sb_secret_');
      formatMessage = isValidFormat ? 'Valid secret key format' : 'Invalid format (should start with sb_secret_)';
      break;
      
    case 'SUPABASE_PUBLISHABLE_KEY':
      isValidFormat = value.startsWith('sb_publishable_');
      formatMessage = isValidFormat ? 'Valid publishable key format' : 'Invalid format (should start with sb_publishable_)';
      break;
      
    case 'SUPABASE_SERVICE_ROLE_KEY':
    case 'NEXT_PUBLIC_SUPABASE_ANON_KEY':
      isValidFormat = value.startsWith('eyJ');
      formatMessage = isValidFormat ? 'Valid JWT format' : 'Invalid format (should be JWT starting with eyJ)';
      break;
      
    case 'GOOGLE_PRIVATE_KEY':
      isValidFormat = value.includes('-----BEGIN PRIVATE KEY-----');
      formatMessage = isValidFormat ? 'Valid private key format' : 'Invalid format';
      break;
      
    case 'GOOGLE_SERVICE_ACCOUNT_EMAIL':
      isValidFormat = value.includes('@') && value.includes('.');
      formatMessage = isValidFormat ? 'Valid email format' : 'Invalid email format';
      break;
      
    case 'CRON_SECRET':
      // Check if it looks like a base64 string (at least 32 chars, alphanumeric with +/=)
      isValidFormat = value.length >= 32 && /^[A-Za-z0-9+/=]+$/.test(value);
      formatMessage = isValidFormat ? 'Valid base64 format' : 'Should be base64 string (min 32 chars)';
      break;
      
    default:
      formatMessage = 'Present';
  }
  
  return {
    variable: config.name,
    required: config.required,
    status: isValidFormat ? 'valid' : 'invalid',
    message: formatMessage,
    value: value.substring(0, 20) + '...',
  };
}

/**
 * Test Supabase connection with actual API call
 * Different key types require different validation approaches
 */
async function testSupabaseConnection(url: string, key: string, keyType: string, isPublishableKey: boolean = false): Promise<{
  success: boolean;
  message: string;
  details?: string;
}> {
  try {
    let testEndpoint: string;
    let testMethod: string;
    
    // Publishable keys need to use auth endpoint, not REST API
    if (isPublishableKey) {
      // Test with auth/v1/health endpoint which accepts publishable keys
      testEndpoint = `${url}/auth/v1/health`;
      testMethod = 'GET';
    } else {
      // Secret/service_role keys can access REST API
      testEndpoint = `${url}/rest/v1/`;
      testMethod = 'HEAD';
    }

    const response = await fetch(testEndpoint, {
      method: testMethod,
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
      },
    });

    // Success statuses
    if (response.ok || response.status === 200) {
      return {
        success: true,
        message: `✅ ${keyType} is functional and authenticated`,
        details: `HTTP ${response.status} - Connection successful`,
      };
    }
    
    // 404 is acceptable for REST API root (means API works but no tables exposed)
    if (response.status === 404 && !isPublishableKey) {
      return {
        success: true,
        message: `✅ ${keyType} is functional and authenticated`,
        details: `HTTP 404 - REST API reachable (no root endpoint)`,
      };
    }
    
    // Authentication/authorization failures
    if (response.status === 401) {
      return {
        success: false,
        message: `❌ ${keyType} authentication failed`,
        details: `HTTP 401 - Key is invalid or revoked`,
      };
    }
    
    if (response.status === 403) {
      return {
        success: false,
        message: `❌ ${keyType} authorization failed`,
        details: `HTTP 403 - Key lacks required permissions`,
      };
    }
    
    // Other unexpected statuses
    return {
      success: false,
      message: `⚠️  ${keyType} returned unexpected status`,
      details: `HTTP ${response.status} - Check Supabase project status`,
    };
  } catch (error: any) {
    if (error.code === 'ENOTFOUND') {
      return {
        success: false,
        message: `❌ Cannot reach Supabase URL`,
        details: 'DNS resolution failed - check URL is correct',
      };
    } else if (error.code === 'ECONNREFUSED') {
      return {
        success: false,
        message: `❌ Connection refused`,
        details: 'Supabase project may be paused or unavailable',
      };
    } else {
      return {
        success: false,
        message: `❌ Connection test failed`,
        details: error.message || 'Unknown error',
      };
    }
  }
}

/**
 * Test all available Supabase keys
 */
async function testSupabaseKeys(results: ValidationResult[]): Promise<{
  tested: boolean;
  workingKey: string | null;
  testResults: Array<{ key: string; result: any }>;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!url) {
    return { tested: false, workingKey: null, testResults: [] };
  }

  const testResults: Array<{ key: string; result: any }> = [];
  let workingKey: string | null = null;

  // Test keys in priority order with appropriate validation method
  const keysToTest = [
    { name: 'SUPABASE_SECRET_KEY', env: 'SUPABASE_SECRET_KEY', type: 'Secret Key (sb_secret_)', isPublishable: false },
    { name: 'SUPABASE_SERVICE_ROLE_KEY', env: 'SUPABASE_SERVICE_ROLE_KEY', type: 'Service Role Key (JWT)', isPublishable: false },
    { name: 'SUPABASE_PUBLISHABLE_KEY', env: 'SUPABASE_PUBLISHABLE_KEY', type: 'Publishable Key (sb_publishable_)', isPublishable: true },
    { name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', env: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', type: 'Anon Key (JWT)', isPublishable: true },
  ];

  for (const keyInfo of keysToTest) {
    const result = results.find(r => r.variable === keyInfo.env);
    if (result?.status === 'valid') {
      const keyValue = process.env[keyInfo.env];
      if (keyValue) {
        const testResult = await testSupabaseConnection(url, keyValue, keyInfo.type, keyInfo.isPublishable);
        testResults.push({
          key: keyInfo.type,
          result: testResult,
        });
        
        if (testResult.success && !workingKey) {
          workingKey = keyInfo.type;
        }
      }
    }
  }

  return { tested: true, workingKey, testResults };
}

/**
 * Check if at least one Supabase key is available
 */
function validateSupabaseKeyAvailability(results: ValidationResult[]): {
  hasValidKey: boolean;
  keyType: string;
  message: string;
} {
  const secretKey = results.find(r => r.variable === 'SUPABASE_SECRET_KEY');
  const serviceRoleKey = results.find(r => r.variable === 'SUPABASE_SERVICE_ROLE_KEY');
  const publishableKey = results.find(r => r.variable === 'SUPABASE_PUBLISHABLE_KEY');
  const anonKey = results.find(r => r.variable === 'NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (secretKey?.status === 'valid') {
    return {
      hasValidKey: true,
      keyType: 'Secret Key (sb_secret_) - Best choice',
      message: '✅ Using new secret key (recommended)',
    };
  }
  
  if (serviceRoleKey?.status === 'valid') {
    return {
      hasValidKey: true,
      keyType: 'Service Role Key (JWT) - Legacy but works',
      message: '⚠️  Using legacy service role key (consider migrating to new keys)',
    };
  }
  
  if (publishableKey?.status === 'valid') {
    return {
      hasValidKey: true,
      keyType: 'Publishable Key (sb_publishable_) - Limited access',
      message: '⚠️  Using publishable key (works but limited - consider adding secret key)',
    };
  }
  
  if (anonKey?.status === 'valid') {
    return {
      hasValidKey: true,
      keyType: 'Anon Key (JWT) - Legacy, limited access',
      message: '⚠️  Using legacy anon key (limited access - consider migrating)',
    };
  }
  
  return {
    hasValidKey: false,
    keyType: 'None',
    message: '❌ No valid Supabase key found! Set at least one key.',
  };
}

/**
 * Print validation results
 */
async function printResults(results: ValidationResult[]) {
  console.log(`\n${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}   Environment Variables Validation Report${colors.reset}`);
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
  
  // Group by category
  const categories = {
    'Core Configuration': ['NEXT_PUBLIC_SUPABASE_URL'],
    'New API Keys (Recommended)': ['SUPABASE_SECRET_KEY', 'SUPABASE_PUBLISHABLE_KEY'],
    'Legacy JWT Keys': ['SUPABASE_SERVICE_ROLE_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'],
    'Security': ['CRON_SECRET'],
    'Legacy Firebase (Not in use)': ['GOOGLE_PROJECT_ID', 'GOOGLE_SERVICE_ACCOUNT_EMAIL', 'GOOGLE_PRIVATE_KEY'],
  };
  
  let hasErrors = false;
  let hasWarnings = false;
  
  for (const [category, variables] of Object.entries(categories)) {
    console.log(`${colors.bold}${category}:${colors.reset}`);
    
    for (const varName of variables) {
      const result = results.find(r => r.variable === varName);
      if (!result) continue;
      
      const config = environmentVariables[varName];
      let statusIcon = '';
      let statusColor = colors.reset;
      
      switch (result.status) {
        case 'valid':
          statusIcon = '✅';
          statusColor = colors.green;
          break;
        case 'missing':
          statusIcon = result.required ? '❌' : '⚪';
          statusColor = result.required ? colors.red : colors.yellow;
          if (result.required) hasErrors = true;
          else hasWarnings = true;
          break;
        case 'empty':
          statusIcon = '⚠️ ';
          statusColor = colors.yellow;
          hasWarnings = true;
          break;
        case 'invalid':
          statusIcon = '❌';
          statusColor = colors.red;
          hasErrors = true;
          break;
      }
      
      console.log(`  ${statusIcon} ${colors.bold}${result.variable}${colors.reset}`);
      console.log(`     ${statusColor}${result.message}${colors.reset}`);
      console.log(`     ${colors.cyan}Format: ${config.format}${colors.reset}`);
      console.log(`     ${config.description}\n`);
    }
  }
  
  // Check Supabase key availability
  console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}Supabase Key Availability Check:${colors.reset}\n`);
  
  const keyCheck = validateSupabaseKeyAvailability(results);
  console.log(`  ${keyCheck.message}`);
  console.log(`  Key Type: ${keyCheck.keyType}\n`);
  
  if (!keyCheck.hasValidKey) {
    hasErrors = true;
  }
  
  // Test Supabase connections
  console.log(`${colors.bold}${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}Supabase Connection Tests:${colors.reset}\n`);
  
  const connectionTests = await testSupabaseKeys(results);
  
  if (!connectionTests.tested) {
    console.log(`  ${colors.yellow}⚠️  Skipped - No valid Supabase URL${colors.reset}\n`);
  } else if (connectionTests.testResults.length === 0) {
    console.log(`  ${colors.yellow}⚠️  Skipped - No valid keys to test${colors.reset}\n`);
  } else {
    let hasFailedKeys = false;
    
    for (const test of connectionTests.testResults) {
      console.log(`  ${colors.bold}${test.key}${colors.reset}`);
      console.log(`     ${test.result.message}`);
      console.log(`     ${colors.cyan}${test.result.details}${colors.reset}\n`);
      
      if (!test.result.success) {
        hasFailedKeys = true;
      }
    }
    
    if (connectionTests.workingKey) {
      console.log(`  ${colors.green}${colors.bold}✅ Working Key: ${connectionTests.workingKey}${colors.reset}\n`);
      
      // Only mark as error if no keys work at all
      if (hasFailedKeys) {
        console.log(`  ${colors.yellow}⚠️  Some keys failed but application can still function${colors.reset}\n`);
        hasWarnings = true;
      }
    } else {
      console.log(`  ${colors.red}${colors.bold}❌ No working keys found${colors.reset}\n`);
      hasErrors = true;
    }
  }
  
  // Summary
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.bold}Summary:${colors.reset}\n`);
  
  const validCount = results.filter(r => r.status === 'valid').length;
  const missingCount = results.filter(r => r.status === 'missing' && r.required).length;
  const warningCount = results.filter(r => r.status === 'missing' && !r.required || r.status === 'empty').length;
  const invalidCount = results.filter(r => r.status === 'invalid').length;
  
  console.log(`  ${colors.green}✅ Valid Format: ${validCount}${colors.reset}`);
  if (connectionTests.workingKey) {
    console.log(`  ${colors.green}✅ Functional Keys: ${connectionTests.testResults.filter(t => t.result.success).length}${colors.reset}`);
  }
  if (invalidCount > 0) console.log(`  ${colors.red}❌ Invalid: ${invalidCount}${colors.reset}`);
  if (missingCount > 0) console.log(`  ${colors.red}❌ Missing (required): ${missingCount}${colors.reset}`);
  if (warningCount > 0) console.log(`  ${colors.yellow}⚠️  Warnings: ${warningCount}${colors.reset}`);
  
  console.log();
  
  if (hasErrors) {
    console.log(`${colors.red}${colors.bold}❌ Validation Failed!${colors.reset}`);
    console.log(`${colors.red}   Fix the errors above before proceeding.${colors.reset}\n`);
    
    console.log(`${colors.yellow}Quick Fix:${colors.reset}`);
    console.log(`  1. Copy .env.local to .env if not already done`);
    console.log(`  2. Fill in the missing required values`);
    console.log(`  3. Get values from: https://supabase.com/dashboard/project/_/settings/api`);
    console.log(`  4. Verify keys are not revoked or expired`);
    console.log(`  5. Run this script again: npm run validate-env\n`);
    
    return false;
  } else if (hasWarnings) {
    console.log(`${colors.yellow}${colors.bold}⚠️  Validation Passed with Warnings${colors.reset}`);
    console.log(`${colors.yellow}   Optional variables are missing but application can still run.${colors.reset}\n`);
    
    console.log(`${colors.cyan}Recommendations:${colors.reset}`);
    console.log(`  • Add CRON_SECRET for better security (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")`);
    console.log(`  • Consider migrating to new API keys (sb_secret_, sb_publishable_)`);
    console.log(`  • See docs/supabase-key-migration.md for migration guide\n`);
    
    return true;
  } else {
    console.log(`${colors.green}${colors.bold}✅ All Validations Passed!${colors.reset}`);
    console.log(`${colors.green}   Your environment is properly configured and keys are functional.${colors.reset}\n`);
    return true;
  }
}

/**
 * Check if .env file exists
 */
function checkEnvFileExists(): boolean {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    console.log(`${colors.red}${colors.bold}❌ Error: .env file not found!${colors.reset}\n`);
    console.log(`${colors.yellow}Quick Fix:${colors.reset}`);
    console.log(`  1. Copy .env.local to .env:`);
    console.log(`     ${colors.cyan}copy .env.local .env${colors.reset}`);
    console.log(`  2. Edit .env and fill in your actual values`);
    console.log(`  3. Never commit .env to git!\n`);
    return false;
  }
  return true;
}

/**
 * Main validation function
 */
async function validateEnvironment() {
  console.log(`${colors.bold}${colors.blue}🔍 Starting Environment Validation...${colors.reset}\n`);
  
  // Check if .env exists
  if (!checkEnvFileExists()) {
    process.exit(1);
  }
  
  // Validate all variables
  const results: ValidationResult[] = [];
  for (const config of Object.values(environmentVariables)) {
    results.push(validateVariable(config));
  }
  
  // Print results
  const success = await printResults(results);
  
  // Exit with appropriate code
  process.exit(success ? 0 : 1);
}

// Run validation
validateEnvironment();
