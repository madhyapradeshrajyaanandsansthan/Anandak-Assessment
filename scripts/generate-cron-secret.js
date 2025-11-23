/**
 * Generate a secure CRON_SECRET for protecting cron endpoints
 * 
 * This script generates a cryptographically secure random base64 string
 * suitable for use as CRON_SECRET in your environment variables.
 * 
 * Run: node scripts/generate-cron-secret.js
 */

const crypto = require('crypto');

// Generate 32 random bytes and convert to base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('   CRON_SECRET Generator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Your new CRON_SECRET:');
console.log('\n  ' + secret + '\n');

console.log('How to use:');
console.log('  1. Copy the secret above');
console.log('  2. Add to your .env file:');
console.log('     CRON_SECRET=' + secret);
console.log('  3. Add to GitHub Secrets (Settings → Secrets → Actions):');
console.log('     Name: CRON_SECRET');
console.log('     Value: ' + secret);
console.log('  4. Add to Vercel Environment Variables:');
console.log('     Name: CRON_SECRET');
console.log('     Value: ' + secret);
console.log('\nWhy you need CRON_SECRET:');
console.log('  • Protects /api/cron/keep-alive endpoint from unauthorized access');
console.log('  • Vercel Cron Jobs automatically include this secret in requests');
console.log('  • Prevents third parties from triggering your cron endpoints');
console.log('  • Industry standard security practice for webhooks/cron jobs\n');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
