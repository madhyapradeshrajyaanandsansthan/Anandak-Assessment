# Environment Setup Guide

## Overview

This guide explains how to set up environment variables for the Madhya Pradesh Anandak Assessment application, including configuration for both local development and production deployment.

## Environment Variables

### Required Variables

#### 1. Supabase Configuration

The application uses Supabase as its database. **As of November 2025, Supabase offers both legacy JWT keys and new API keys.** This application supports all four key types for maximum flexibility.

> 📘 **Migration Notice**: Supabase is transitioning to new API keys. See [Supabase Key Migration Guide](./supabase-key-migration.md) for detailed migration instructions.

##### New API Keys (Recommended - Available since June 2025)

**SUPABASE_SECRET_KEY** (Secret) ✅ **Recommended**
- Description: New format secret key with enhanced security
- Format: `sb_secret_...`
- Usage: Server-side operations, keep-alive scripts, admin tasks
- Where to find: Supabase Dashboard → Project Settings → API Keys (New) → Secret Keys
- Security: ⚠️ **NEVER expose to client-side code!** Bypasses RLS
- Benefits: Zero-downtime rotation, instant revocation, multiple keys support
- Priority: **First choice** for keep-alive system

**SUPABASE_PUBLISHABLE_KEY** (Public)
- Description: New format publishable key (safe for client-side)
- Format: `sb_publishable_...`
- Usage: Client-side operations, mobile apps, web apps
- Where to find: Supabase Dashboard → Project Settings → API Keys (New) → Publishable Key
- Security: Safe to expose, Row Level Security (RLS) policies apply
- Benefits: Better security features than legacy anon key
- Priority: **Third choice** for keep-alive system (fallback)

##### Legacy JWT Keys (Being Phased Out - Will be removed late 2026)

**SUPABASE_SERVICE_ROLE_KEY** (Secret) ⚠️ **Legacy**
- Description: Legacy JWT service role key (admin access)
- Format: JWT (long string starting with `eyJ...`)
- Usage: Server-side operations, keep-alive scripts
- Where to find: Supabase Dashboard → Project Settings → API → service_role (JWT)
- Security: ⚠️ **NEVER expose to client-side code!** Bypasses RLS
- Status: Still supported but being replaced by `SUPABASE_SECRET_KEY`
- Priority: **Second choice** for keep-alive system (fallback)

**NEXT_PUBLIC_SUPABASE_ANON_KEY** (Public) ⚠️ **Legacy**
- Description: Legacy JWT anonymous key (safe for client-side)
- Format: JWT (long string starting with `eyJ...`)
- Usage: Client-side operations
- Where to find: Supabase Dashboard → Project Settings → API → anon/public (JWT)
- Security: Safe to expose, Row Level Security (RLS) policies apply
- Status: Still supported but being replaced by `SUPABASE_PUBLISHABLE_KEY`
- Priority: **Fourth choice** for keep-alive system (fallback)

**NEXT_PUBLIC_SUPABASE_URL** (Public)
- Description: Your Supabase project URL
- Usage: Both client-side and server-side
- Where to find: Supabase Dashboard → Project Settings → API
- Example: `https://twfbgqngefwomlssxoui.supabase.co`
- Required: **Yes** (all key types need this)

#### 2. Cron Job Security (Optional but Recommended)

**CRON_SECRET**
- Description: Secret token to protect cron endpoints from unauthorized access
- Usage: Vercel Cron Jobs authentication
- How to generate: 
  ```powershell
  # PowerShell
  [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
  
  # Or Node.js
  node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
  ```
- Where to add: Vercel Dashboard → Project → Settings → Environment Variables

## Local Development Setup

### Step 1: Create `.env.local` File

Create a `.env.local` file in the root of your project (already created for you):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://twfbgqngefwomlssxoui.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Cron Secret (optional for local development)
CRON_SECRET=your-random-secret-here
```

### Step 2: Verify Environment Variables

Run the keep-alive script to verify your configuration:

```powershell
npm run keep-alive
```

Expected output:
```
🔄 Starting Supabase keep-alive check...
📅 Timestamp: 2024-01-20T10:30:00.000Z

🔑 Using service_role key

✅ Supabase is active!
📊 Total submissions in database: 42
```

## Production Deployment (Vercel)

### Step 1: Add Environment Variables to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **Environment Variables**
4. Add the following variables:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key | Production only |
| `CRON_SECRET` | Generated secret | Production only |

### Step 2: Redeploy

After adding environment variables, trigger a redeployment:

```powershell
git push origin main
```

Or manually redeploy from Vercel Dashboard.

### Step 3: Verify Cron Job

1. Wait for deployment to complete
2. Check **Deployments** → **Functions** → `/api/cron/keep-alive`
3. Verify cron is scheduled (check **Cron** tab)
4. Monitor logs for daily execution at 6:00 AM UTC

## GitHub Actions Setup (Backup Keep-Alive)

### Step 1: Add Secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:

| Secret Name | Value |
|-------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key |

### Step 2: Verify Workflow

The GitHub Actions workflow (`.github/workflows/keep-supabase-alive.yml`) will automatically:
- Run daily at 6:00 AM UTC
- Can be triggered manually from GitHub UI
- Logs available in **Actions** tab

**Note:** The VS Code warnings about "Context access might be invalid" for these secrets are expected and will disappear once you add the secrets to your GitHub repository.

## Key Priority and Fallback Logic

The keep-alive system supports **all four Supabase key types** and uses intelligent priority selection:

### Automatic Key Selection Priority

1. **First Choice:** `SUPABASE_SECRET_KEY` (new secret key - best)
2. **Second Choice:** `SUPABASE_SERVICE_ROLE_KEY` (legacy service role - good)
3. **Third Choice:** `SUPABASE_PUBLISHABLE_KEY` (new publishable - works)
4. **Fourth Choice:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy anon - works)

The system automatically selects the best available key, allowing seamless migration from legacy to new keys without breaking changes.

### Why Secret Keys are Preferred

**SUPABASE_SECRET_KEY (Best)**
- ✅ Bypasses Row Level Security (RLS) policies
- ✅ Guaranteed database access
- ✅ Zero-downtime rotation capability
- ✅ Instant revocation when deleted
- ✅ Multiple keys support
- ✅ Enhanced security features
- ✅ More reliable for automated scripts

**SUPABASE_SERVICE_ROLE_KEY (Good - Legacy)**
- ✅ Bypasses Row Level Security (RLS) policies
- ✅ Guaranteed database access
- ⚠️ Single key only
- ⚠️ Full rotation required for changes
- ⚠️ Being phased out (late 2026)

### When Publishable/Anon Keys are Sufficient

**For simple operations (like keep-alive count queries):**
- ✅ Works if RLS policies allow public read access
- ✅ No RLS bypass needed for basic queries
- ✅ Safe fallback option
- ⚠️ May fail if RLS restricts access

### Migration Strategy

You can use any combination of keys:
- **New keys only**: Set `SUPABASE_SECRET_KEY` (recommended)
- **Legacy keys only**: Set `SUPABASE_SERVICE_ROLE_KEY` (works until 2026)
- **Both new and legacy**: System uses new keys first, legacy as fallback
- **Gradual migration**: Add new keys, test, then remove legacy keys

See [Supabase Key Migration Guide](./supabase-key-migration.md) for detailed migration steps.

## Security Best Practices

### ✅ DO

- Store `SUPABASE_SERVICE_ROLE_KEY` only in server-side environments
- Use `CRON_SECRET` to protect cron endpoints
- Add both keys to GitHub Secrets for Actions workflow
- Use `.env.local` for local development (already in `.gitignore`)
- Generate a strong random `CRON_SECRET`

### ❌ DON'T

- Never commit `.env` or `.env.local` to git
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client-side code
- Never hardcode secrets in source code
- Never share service role key publicly
- Never use service role key in client-side components

## Troubleshooting

### Keep-Alive Script Fails

```
❌ Keep-alive failed: Missing Supabase credentials
```

**Solution:** Check your `.env.local` file and ensure `NEXT_PUBLIC_SUPABASE_URL` is set, and at least one key (`SUPABASE_SERVICE_ROLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`) is present.

### Cron Job Returns 401 Unauthorized

```
❌ Unauthorized cron request
```

**Solution:** 
1. Ensure `CRON_SECRET` is set in Vercel environment variables
2. Vercel automatically passes the correct header - no manual action needed
3. If testing manually, include the header: `Authorization: Bearer YOUR_CRON_SECRET`

### GitHub Actions Workflow Fails

```
❌ Script completed with errors
```

**Solution:**
1. Verify all three secrets are added to GitHub repository
2. Check secret names match exactly (case-sensitive)
3. Review workflow logs in GitHub Actions tab

### VS Code Warnings in GitHub Workflow

```
Context access might be invalid: NEXT_PUBLIC_SUPABASE_URL
```

**Solution:** These warnings are expected before secrets are added to GitHub. Once you add the secrets to your GitHub repository (Settings → Secrets → Actions), the functionality will work correctly. The warnings are just VS Code being cautious.

## Testing

### Test Keep-Alive Locally

```powershell
npm run keep-alive
```

### Test Cron Endpoint Manually

```powershell
# Without secret (will fail if CRON_SECRET is set)
curl https://your-domain.vercel.app/api/cron/keep-alive

# With secret
curl -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.vercel.app/api/cron/keep-alive
```

### Test GitHub Actions Workflow

1. Go to GitHub repository
2. Click **Actions** tab
3. Select **Keep Supabase Active** workflow
4. Click **Run workflow** → **Run workflow**
5. Monitor execution logs

## Environment Files Reference

### `.env` (Not in use, but present)
- Contains legacy Firebase configuration
- Not required for current functionality
- Kept for reference only

### `.env.local` (Active - Local Development)
- Used for local development
- Not committed to git (in `.gitignore`)
- Copy from `.env.local.example` if needed
- All environment variables for local testing

### `.env.production` (Not present - Managed by Vercel)
- Environment variables managed through Vercel Dashboard
- Automatically injected during build and runtime
- No file needed in repository

## Next Steps

1. ✅ Update `.env.local` with your actual Supabase keys
2. ✅ Test locally with `npm run keep-alive`
3. ✅ Add environment variables to Vercel
4. ✅ Deploy to Vercel (`git push`)
5. ✅ Generate and add `CRON_SECRET` to Vercel
6. ✅ Add secrets to GitHub for Actions workflow
7. ✅ Monitor first automated run (next day at 6 AM UTC)

## Support

For more information:
- Supabase Documentation: https://supabase.com/docs
- Vercel Cron Jobs: https://vercel.com/docs/cron-jobs
- GitHub Actions: https://docs.github.com/en/actions

## Summary

Your environment is now configured to:
- ✅ Support both service role and anon keys with intelligent fallback
- ✅ Work locally for development and testing
- ✅ Deploy seamlessly to Vercel with cron jobs
- ✅ Have backup keep-alive via GitHub Actions
- ✅ Maintain security best practices
- ✅ Handle edge cases and failures gracefully

The application will automatically keep Supabase active and prevent the free tier from pausing.
