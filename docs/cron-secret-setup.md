# CRON_SECRET Setup Guide

## What is CRON_SECRET?

`CRON_SECRET` is a cryptographically secure random string used to protect your cron endpoints from unauthorized access. It acts as a password that only authorized services (like Vercel Cron Jobs or GitHub Actions) know, preventing third parties from triggering your scheduled tasks.

## Why Do You Need It?

### Without CRON_SECRET
```
Anyone can access: https://your-app.vercel.app/api/cron/keep-alive
❌ Malicious actors can trigger your cron jobs
❌ No way to verify the request is legitimate
❌ Risk of abuse and excessive database calls
```

### With CRON_SECRET
```
Only requests with correct secret work
✅ Vercel automatically includes secret in cron requests
✅ GitHub Actions includes secret from repository secrets
✅ Unauthorized requests are rejected with 401 Unauthorized
✅ Your endpoints are protected
```

## How It Works

```typescript
// In your API route: src/app/api/cron/keep-alive/route.ts
export async function GET(request: Request) {
  // 1. Get secret from request headers
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  // 2. Compare with expected secret
  const cronSecret = process.env.CRON_SECRET;
  
  // 3. Reject if not matching
  if (cronSecret && token !== cronSecret) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // 4. Continue with legitimate request
  // ... your cron logic here
}
```

## Generate CRON_SECRET

### Method 1: Using npm script (Recommended)
```bash
npm run generate-cron-secret
```

This will generate and display:
- A secure 32-byte base64 string
- Step-by-step instructions
- Usage examples

### Method 2: Using Node.js directly
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Method 3: Using PowerShell
```powershell
# Generate 32 random bytes and convert to base64
$bytes = New-Object byte[] 32
[System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
[System.Convert]::ToBase64String($bytes)
```

### Method 4: Using online tool
⚠️ **Not recommended for production** - generates locally for better security

Visit: https://generate-secret.vercel.app/32

## Add to Your Environment

### Step 1: Local Development (.env)

1. Copy your generated secret
2. Open `.env` file (create if doesn't exist)
3. Add the line:
   ```bash
   CRON_SECRET=your-generated-secret-here
   ```
4. Never commit `.env` to git!

Example `.env`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_xxx

# Security
CRON_SECRET=ojLnwa1AKVy9omHJkHhkQPG3aJC8c+6rNudd8DG/36Q=
```

### Step 2: Vercel (Production)

1. Go to your project dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Click **Add New**
5. Fill in:
   - **Name**: `CRON_SECRET`
   - **Value**: (paste your generated secret)
   - **Environments**: Select all (Production, Preview, Development)
6. Click **Save**
7. Redeploy your application for changes to take effect

### Step 3: GitHub Secrets (for GitHub Actions)

1. Go to your repository: https://github.com/your-username/your-repo
2. Click **Settings** tab
3. In sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Fill in:
   - **Name**: `CRON_SECRET`
   - **Secret**: (paste your generated secret)
6. Click **Add secret**

### Step 4: Update Vercel Cron Configuration

In `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Vercel automatically includes `CRON_SECRET` in the `Authorization` header:
```
Authorization: Bearer <your-cron-secret>
```

## Verify It's Working

### Test Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Test WITHOUT secret (should fail):
   ```bash
   curl http://localhost:9002/api/cron/keep-alive
   # Expected: {"error":"Unauthorized"}
   ```

3. Test WITH secret (should work):
   ```bash
   # Get your secret from .env
   curl -H "Authorization: Bearer YOUR_SECRET_HERE" http://localhost:9002/api/cron/keep-alive
   # Expected: {"success":true, ...}
   ```

### Test on Vercel

1. Deploy your app with the secret configured
2. Try accessing without secret:
   ```bash
   curl https://your-app.vercel.app/api/cron/keep-alive
   # Expected: {"error":"Unauthorized"}
   ```

3. Vercel Cron Jobs will automatically include the secret
4. Check logs in Vercel dashboard to confirm cron runs succeed

### Test GitHub Actions

1. Push changes to trigger workflow
2. Go to **Actions** tab in GitHub
3. Click on "Keep Supabase Active" workflow
4. Check the log output - should show success

## Common Issues

### Issue 1: "Unauthorized" error on legitimate requests

**Cause**: Secret mismatch between platforms

**Solution**:
```bash
# 1. Check your secret in .env
cat .env | grep CRON_SECRET

# 2. Verify it matches in Vercel
# Go to Settings → Environment Variables → CRON_SECRET

# 3. Verify it matches in GitHub Secrets
# Go to Settings → Secrets → Actions → CRON_SECRET

# 4. Make sure all three are EXACTLY the same (no extra spaces)
```

### Issue 2: Cron job still runs without secret

**Cause**: Secret check not properly implemented

**Solution**: Check your API route has the authorization check:
```typescript
const authHeader = request.headers.get('authorization');
const token = authHeader?.replace('Bearer ', '');
const cronSecret = process.env.CRON_SECRET;

if (cronSecret && token !== cronSecret) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Issue 3: Secret not loading in production

**Cause**: Environment variable not reloaded after adding

**Solution**:
1. Redeploy your application in Vercel
2. Environment variables are only loaded at build time
3. Use "Redeploy" button in Deployments tab

### Issue 4: GitHub Actions failing with 401

**Cause**: Secret not passed to workflow

**Solution**: Check your workflow file `.github/workflows/keep-supabase-alive.yml`:
```yaml
env:
  CRON_SECRET: ${{ secrets.CRON_SECRET }}  # Make sure this line exists
```

## Security Best Practices

### ✅ DO

- Generate a new secret with `npm run generate-cron-secret`
- Use at least 32 bytes (256 bits) of randomness
- Store in environment variables, never in code
- Use different secrets for different environments
- Rotate secrets periodically (every 6-12 months)
- Keep secrets in password manager for backup

### ❌ DON'T

- Use simple strings like "mysecret123"
- Commit secrets to git
- Share secrets in chat/email
- Reuse secrets across multiple projects
- Log secrets in console/files
- Include secrets in error messages

## Secret Rotation

If you need to change your CRON_SECRET:

1. Generate new secret:
   ```bash
   npm run generate-cron-secret
   ```

2. Update in all three places:
   - `.env` file (local)
   - Vercel Environment Variables
   - GitHub Secrets

3. Redeploy application:
   ```bash
   git push  # Triggers deployment with new secret
   ```

4. Verify cron jobs still work

5. Delete old secret from password manager

## Alternative: No CRON_SECRET

If you choose not to use CRON_SECRET:

**Pros:**
- Simpler setup
- One less thing to manage

**Cons:**
- ❌ Anyone can trigger your cron endpoints
- ❌ No protection against abuse
- ❌ Potential for excessive database usage
- ❌ Not recommended for production

To disable (not recommended):
```typescript
// Remove or comment out this check in your API route:
// if (cronSecret && token !== cronSecret) {
//   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
// }
```

## Related Documentation

- [GitHub Secrets and Actions Setup](./github-secrets-and-actions-setup.md)
- [Environment Setup Guide](./environment-setup.md)
- [Supabase Keep-Alive Documentation](./supabase-keep-alive.md)

## Summary

| Platform | Location | How to Add |
|----------|----------|------------|
| **Local** | `.env` file | Copy from generator output |
| **Vercel** | Settings → Environment Variables | Add via dashboard |
| **GitHub** | Settings → Secrets → Actions | Add via repository settings |

**Command to generate:**
```bash
npm run generate-cron-secret
```

**Expected format:**
```
CRON_SECRET=base64-encoded-random-string-here==
```

**Length:**
- Minimum: 32 characters
- Recommended: 44 characters (32 bytes base64)
- Pattern: `[A-Za-z0-9+/=]+`
