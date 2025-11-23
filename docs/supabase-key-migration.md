# Supabase API Keys Migration Guide

## Overview

Supabase is transitioning from legacy JWT-based API keys to new, more secure API keys. This guide explains the differences, migration process, and how to use the new keys with this application.

**Timeline:**
- **June 2025**: New API keys available (early access launched)
- **November 2025**: Monthly migration reminders begin
- **Late 2026**: Legacy JWT keys will be removed

## What's Changing?

### Legacy JWT Keys (Current - Being Phased Out)

| Key Name | Format | Access Level | Status |
|----------|--------|--------------|--------|
| `anon` | JWT (long-lived) | Low privilege (RLS applies) | ⚠️ Being replaced |
| `service_role` | JWT (long-lived) | Elevated (bypasses RLS) | ⚠️ Being replaced |

**Problems with Legacy Keys:**
- 10-year expiry duration (security risk)
- Cannot rotate independently without downtime
- Tight coupling with JWT secret
- Large size, hard to parse
- No rollback capability after rotation
- Forces mobile app version upgrades

### New API Keys (Recommended - Available Now)

| Key Name | Format | Access Level | Status |
|----------|--------|--------------|--------|
| `publishable` | `sb_publishable_...` | Low privilege (RLS applies) | ✅ Recommended |
| `secret` | `sb_secret_...` | Elevated (bypasses RLS) | ✅ Recommended |

**Benefits of New Keys:**
- ✅ Zero-downtime rotation
- ✅ Instant revocation when deleted
- ✅ Multiple secret keys support
- ✅ Hidden by default in dashboard
- ✅ Audit log for key access
- ✅ Browser use forbidden for secret keys
- ✅ Shorter, easier to manage
- ✅ Better security practices

## Key Comparison

### Publishable Key vs Anon Key

**Similarities:**
- Both safe to use in client-side code
- Both have low privilege (RLS policies apply)
- Both work with Supabase client libraries

**Differences:**
- Publishable: `sb_publishable_...` format, newer security features
- Anon: JWT format, legacy implementation

### Secret Key vs Service Role Key

**Similarities:**
- Both provide elevated access (bypass RLS)
- Both server-side only
- Both work with Supabase client libraries

**Differences:**
- Secret: `sb_secret_...` format, instant revocation, multiple keys support
- Service Role: JWT format, single key, requires full rotation

## Migration Strategy

This application supports **all four key types** with intelligent fallback:

### Priority Order (Automatic Selection)

1. **First Choice:** `SUPABASE_SECRET_KEY` (new secret key)
2. **Second Choice:** `SUPABASE_SERVICE_ROLE_KEY` (legacy service role)
3. **Third Choice:** `SUPABASE_PUBLISHABLE_KEY` (new publishable key)
4. **Fourth Choice:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` (legacy anon)

The keep-alive system automatically uses the best available key, so you can migrate gradually without breaking changes.

## Migration Steps

### Step 1: Generate New API Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** → **API** → **API Keys (New)**
4. Click **Generate New Keys** or **Opt In**
5. Copy both keys:
   - **Publishable Key**: `sb_publishable_...`
   - **Secret Key**: `sb_secret_...` (click "Reveal" to see it)

### Step 2: Update Local Environment

Update your `.env.local` file:

```env
# New API keys (add these)
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# Legacy keys (keep these during migration)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_existing_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_existing_service_role_key
```

### Step 3: Test Locally

Run the keep-alive script to verify new keys work:

```powershell
npm run keep-alive
```

Expected output:
```
🔄 Starting Supabase keep-alive check...
📅 Timestamp: 2025-11-23T10:30:00.000Z

🔑 Using secret (sb_secret_) key

✅ Supabase is active!
```

### Step 4: Update Vercel Environment Variables

1. Go to **Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**
2. Add new keys:

| Variable Name | Value | Environment |
|---------------|-------|-------------|
| `SUPABASE_SECRET_KEY` | `sb_secret_...` | Production |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | Production, Preview |

3. Keep legacy keys during migration (remove after testing)
4. Redeploy your application

### Step 5: Update GitHub Secrets

1. Go to **GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. Add new secrets:

| Secret Name | Value |
|-------------|-------|
| `SUPABASE_SECRET_KEY` | `sb_secret_...` |
| `SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` |

3. Keep legacy secrets during migration

### Step 6: Verify Migration

Monitor your applications:

**Vercel Cron:**
- Check **Deployments** → **Functions** → `/api/cron/keep-alive`
- Verify logs show: `🔑 Using secret (sb_secret_) key`

**GitHub Actions:**
- Check **Actions** tab → **Keep Supabase Active** workflow
- Verify successful execution with new keys

**Local Development:**
- Run `npm run keep-alive`
- Confirm new key is being used

### Step 7: Remove Legacy Keys (Optional - After Testing)

Once confident new keys work:

1. **Supabase Dashboard**: Disable legacy `anon` and `service_role` keys
2. **Local**: Remove old keys from `.env.local`
3. **Vercel**: Remove old environment variables
4. **GitHub**: Remove old secrets

⚠️ **Important**: Test thoroughly before removing legacy keys!

## Environment Variable Reference

### Complete Setup (All Keys)

```env
# Supabase URL (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# New API keys (recommended)
SUPABASE_SECRET_KEY=sb_secret_your_key_here
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here

# Legacy keys (fallback)
SUPABASE_SERVICE_ROLE_KEY=your_jwt_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_jwt_anon_key

# Cron security
CRON_SECRET=your_random_secret
```

### Minimal Setup (New Keys Only)

```env
# Supabase URL (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# New API keys (recommended)
SUPABASE_SECRET_KEY=sb_secret_your_key_here

# Cron security (optional)
CRON_SECRET=your_random_secret
```

### Minimal Setup (Legacy Keys Only)

```env
# Supabase URL (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Legacy keys (being phased out)
SUPABASE_SERVICE_ROLE_KEY=your_jwt_service_role_key

# Cron security (optional)
CRON_SECRET=your_random_secret
```

## Key Rotation Best Practices

### New Secret Keys (Recommended)

**Zero-Downtime Rotation:**
1. Create a second secret key in Supabase Dashboard
2. Add new key to environment variables (both keys active)
3. Deploy application with both keys
4. Delete old secret key in dashboard
5. Old key instantly revoked, new key continues working

**Benefits:**
- ✅ No downtime
- ✅ Instant revocation
- ✅ Can roll back easily
- ✅ Multiple keys for different services

### Legacy JWT Keys (Old Method)

**Full Rotation (Requires Downtime):**
1. Generate new JWT secret in Supabase Dashboard
2. All keys change simultaneously
3. Update all environment variables
4. Redeploy all services immediately
5. Any missed service breaks until updated

**Drawbacks:**
- ❌ Requires coordinated deployment
- ❌ Potential downtime
- ❌ Cannot roll back without another rotation
- ❌ Mobile apps may break for weeks

## Key Differences to Be Aware Of

### Authorization Header Behavior

**Legacy Keys:**
- Could use `anon` or `service_role` in `Authorization` header
- Header value acts as both API key and JWT

**New Keys:**
- `Authorization` header should contain user's JWT (from auth)
- API key goes in `apikey` header automatically
- Secret keys forbidden in browser (HTTP 401)

### Realtime Connections

**New Keys:**
- Connections last 24 hours with secret key or no signed-in user
- Sign users in to extend connections indefinitely

**Legacy Keys:**
- No time limit restrictions

### Edge Functions

**New Keys:**
- Need `--no-verify-jwt` flag for functions without auth
- Secret keys work but should verify manually

**Legacy Keys:**
- Automatic verification with `service_role`

## Troubleshooting

### "PGRST301: Expected 3 parts in JWT; got 1"

**Cause:** Using new API key format where JWT expected

**Solution:** Update to latest Supabase CLI and client libraries

### "PGRST301: No suitable key or wrong key type"

**Cause:** Key type mismatch or old JWT secret

**Solution:** 
1. Regenerate JWT signing keys if using asymmetric JWTs
2. Import correct private key to platform
3. Ensure `kid` matches between JWT and JWK

### Keep-Alive Uses Legacy Key Instead of New Key

**Cause:** New key not set or has wrong format

**Solution:**
1. Verify new key starts with `sb_secret_` or `sb_publishable_`
2. Check environment variable names match exactly
3. Restart application after updating `.env.local`

### GitHub Actions Shows "Context access might be invalid"

**Cause:** VS Code warnings before secrets added to GitHub

**Solution:** These are informational warnings. Add secrets to GitHub repository, and workflow will work correctly.

## FAQ

### Do I need to migrate immediately?

**No.** Legacy keys work until late 2026. However:
- ✅ Migrate now for better security
- ✅ New keys offer zero-downtime rotation
- ✅ Multiple secret keys for different services
- ⚠️ After November 2025, new projects won't get legacy keys

### Can I use both old and new keys simultaneously?

**Yes!** This application supports all four keys with automatic fallback. Keep both during migration for safety.

### Which key should I use for keep-alive?

**Recommended order:**
1. `SUPABASE_SECRET_KEY` (best - new secret key)
2. `SUPABASE_SERVICE_ROLE_KEY` (good - legacy service role)
3. `SUPABASE_PUBLISHABLE_KEY` (works - new publishable)
4. `NEXT_PUBLIC_SUPABASE_ANON_KEY` (works - legacy anon)

The system automatically selects the best available.

### Do new keys work with existing Supabase client libraries?

**Yes!** No code changes needed. Just replace the key value:

```typescript
// Old way
const supabase = createClient(url, process.env.SUPABASE_SERVICE_ROLE_KEY)

// New way (same code!)
const supabase = createClient(url, process.env.SUPABASE_SECRET_KEY)
```

### What about RLS policies referencing `service_role`?

**No changes needed!** New secret keys default to `service_role` Postgres role. Your RLS policies continue working:

```sql
-- This still works with new secret keys
GRANT ALL ON table_name TO service_role;
```

### How many secret keys can I create?

**Multiple!** Unlike legacy `service_role` (only one), you can create multiple secret keys:
- One for production servers
- One for staging servers
- One for CI/CD pipelines
- Rotate individually with zero downtime

### Will this affect my mobile app users?

**No!** Existing apps continue working with legacy keys. When you migrate:
- Use new `publishable` key in app updates
- Old app versions with `anon` key still work
- No forced upgrade required

### What happens to my database connection strings?

**No change!** Connection strings are separate from API keys. Postgres connections unaffected by API key migration.

## Additional Resources

- **Official Discussion**: [GitHub Discussion #29260](https://github.com/orgs/supabase/discussions/29260)
- **Supabase Docs**: [API Keys Guide](https://supabase.com/docs/guides/api/api-keys)
- **Dashboard**: [Your Project Settings](https://supabase.com/dashboard/project/_/settings/api)
- **Support**: [Supabase Support](https://supabase.help/)

## Summary

Your application now supports **all four Supabase key types**:

✅ **New Keys (Recommended)**
- `SUPABASE_SECRET_KEY` - Secret key (`sb_secret_...`)
- `SUPABASE_PUBLISHABLE_KEY` - Publishable key (`sb_publishable_...`)

✅ **Legacy Keys (Fallback)**
- `SUPABASE_SERVICE_ROLE_KEY` - Service role (JWT)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon key (JWT)

The keep-alive system **automatically selects the best available key**, so you can:
- Continue using legacy keys (works until late 2026)
- Migrate to new keys at your own pace
- Use both simultaneously during transition
- No breaking changes or downtime

**Recommended Action**: Migrate to new keys now for better security and flexibility!
