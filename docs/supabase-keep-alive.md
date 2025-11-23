# Supabase Keep-Alive Guide

Complete guide to prevent Supabase free tier from pausing due to inactivity.

---

## 📋 Overview

**Problem**: Supabase free tier pauses after **7 days of inactivity**  
**Solution**: Automated daily ping to keep database active  
**Methods**: Vercel Cron (recommended), GitHub Actions, or manual script

---

## ✅ Method 1: Vercel Cron (Recommended)

### Advantages
- ✅ Fully automated
- ✅ No additional services needed
- ✅ Free on all Vercel plans
- ✅ Reliable and secure
- ✅ Built-in monitoring

### Setup Steps

#### 1. Deploy to Vercel

Your app must be deployed on Vercel for cron jobs to work.

```bash
# Push to GitHub
git add .
git commit -m "Add Supabase keep-alive cron"
git push origin main

# Deploy will happen automatically
```

#### 2. Add Cron Secret (Recommended)

Protect your cron endpoint from unauthorized access:

1. Go to Vercel Dashboard → Your Project
2. Click **Settings** → **Environment Variables**
3. Add new variable:
   - **Name**: `CRON_SECRET`
   - **Value**: Generate a random string (e.g., `openssl rand -hex 32`)
   - **Environment**: Production
4. Click **Save**
5. **Redeploy** your application

#### 3. Verify Cron Configuration

The `vercel.json` file is already configured:

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

**Schedule**: Daily at 6:00 AM UTC (11:30 AM IST)

#### 4. Test the Cron Job

**Manual Test via Browser** (after deployment):
```
https://your-domain.com/api/cron/keep-alive
```

**Expected Response**:
```json
{
  "success": true,
  "timestamp": "2025-11-22T06:00:00.000Z",
  "database": {
    "active": true,
    "totalRecords": 123,
    "url": "https://your-project.supabase.co"
  },
  "nextRun": "Tomorrow at 6:00 AM UTC"
}
```

**Manual Test with cURL** (with secret):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/keep-alive
```

#### 5. Monitor Cron Execution

**View Logs**:
1. Go to Vercel Dashboard
2. Click **Deployments**
3. Click on a deployment
4. Click **Functions** tab
5. Find `/api/cron/keep-alive`
6. View execution logs

**Expected Log Entry** (daily at 6 AM UTC):
```
🔄 Cron job triggered: 2025-11-22T06:00:00.000Z
✅ Supabase keep-alive successful
```

---

## ⚙️ Method 2: GitHub Actions (Alternative)

If not using Vercel, use GitHub Actions.

### Setup Steps

#### 1. Create GitHub Actions Workflow

Create `.github/workflows/keep-supabase-alive.yml`:

```yaml
name: Keep Supabase Active

on:
  schedule:
    # Run every day at 6:00 AM UTC
    - cron: '0 6 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Run keep-alive script
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: npm run keep-alive
```

#### 2. Add GitHub Secrets

1. Go to GitHub Repository → **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret**
3. Add secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `SUPABASE_SERVICE_ROLE_KEY`: Your service role key

#### 3. Test Workflow

1. Go to **Actions** tab
2. Select **Keep Supabase Active** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for completion
5. Check logs

---

## 🖥️ Method 3: Local Cron (Development/Self-Hosted)

### Windows Task Scheduler

#### 1. Create Batch File

Create `keep-supabase-alive.bat`:

```batch
@echo off
cd /d "D:\MP-Assessment"
call npm run keep-alive
```

#### 2. Setup Task Scheduler

1. Open **Task Scheduler**
2. Click **Create Basic Task**
3. **Name**: "Supabase Keep-Alive"
4. **Trigger**: Daily at 6:00 AM
5. **Action**: Start a program
6. **Program**: `D:\MP-Assessment\keep-supabase-alive.bat`
7. Click **Finish**

---

### macOS/Linux Crontab

#### 1. Edit Crontab

```bash
crontab -e
```

#### 2. Add Cron Entry

```bash
# Run Supabase keep-alive daily at 6 AM
0 6 * * * cd /path/to/MP-Assessment && npm run keep-alive >> /var/log/supabase-keep-alive.log 2>&1
```

#### 3. Verify Crontab

```bash
crontab -l
```

---

## 🧪 Testing

### Manual Test via npm

```bash
# Run the keep-alive script manually
npm run keep-alive
```

**Expected Output**:
```
🔄 Starting Supabase keep-alive check...
📅 Timestamp: 2025-11-22T10:30:00.000Z

✅ Supabase is active!
📊 Total submissions in database: 123
🌐 Database URL: https://your-project.supabase.co
⏰ Next check recommended: 2025-11-23T10:30:00.000Z

🎉 Keep-alive successful!

✅ Script completed successfully
```

### Test API Endpoint (After Deployment)

```bash
# Without auth (if CRON_SECRET not set)
curl https://your-domain.com/api/cron/keep-alive

# With auth (if CRON_SECRET is set)
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  https://your-domain.com/api/cron/keep-alive
```

---

## 📊 Monitoring

### Verify Cron is Working

**Method 1: Check Vercel Logs**
1. Go to Vercel Dashboard
2. Select your project
3. Click **Deployments** → Latest deployment
4. Click **Functions** tab
5. Find `/api/cron/keep-alive`
6. View execution history

**Method 2: Check Supabase Dashboard**
1. Go to Supabase Dashboard
2. Click your project
3. Check **Database** → **Activity**
4. You should see daily queries at 6 AM UTC

**Method 3: Add Email Notifications** (Future)
Consider adding email notifications on failure:
```typescript
// In keep-alive route
if (error) {
  await sendEmail({
    to: 'admin@yourdomain.com',
    subject: 'Supabase Keep-Alive Failed',
    body: error.message
  });
}
```

---

## ⏰ Cron Schedule Reference

The cron schedule `0 6 * * *` means:

| Field | Value | Meaning |
|-------|-------|---------|
| Minute | 0 | At minute 0 |
| Hour | 6 | At 6 AM |
| Day of Month | * | Every day |
| Month | * | Every month |
| Day of Week | * | Every day of week |

**Result**: Runs every day at 6:00 AM UTC

### Change Schedule

Edit `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/keep-alive",
      "schedule": "0 */12 * * *"  // Every 12 hours
    }
  ]
}
```

**Common Schedules**:
- `0 6 * * *` - Daily at 6 AM
- `0 */12 * * *` - Every 12 hours
- `0 0 * * *` - Daily at midnight
- `0 6 * * 1` - Every Monday at 6 AM

---

## 🔒 Security

### Protect Cron Endpoint

**Add CRON_SECRET** (Recommended):

1. Generate secret:
   ```bash
   # PowerShell
   [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
   
   # macOS/Linux
   openssl rand -hex 32
   ```

2. Add to Vercel environment variables:
   - Name: `CRON_SECRET`
   - Value: Your generated secret

3. Vercel automatically adds `Authorization: Bearer YOUR_SECRET` header

### IP Whitelist (Advanced)

```typescript
// In /api/cron/keep-alive/route.ts
const ALLOWED_IPS = ['76.76.21.21']; // Vercel IPs
const clientIP = request.headers.get('x-forwarded-for');

if (!ALLOWED_IPS.includes(clientIP)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## 🚨 Troubleshooting

### Issue: Cron Not Running

**Causes**:
- Vercel deployment not configured
- Wrong schedule format
- Function timeout

**Solutions**:
1. Check `vercel.json` exists and is valid
2. Verify deployment is live
3. Check Vercel Function logs
4. Ensure function completes in <10s

---

### Issue: "Unauthorized" Error

**Cause**: CRON_SECRET mismatch

**Solutions**:
1. Verify `CRON_SECRET` is set in Vercel
2. Redeploy after adding secret
3. Check header format: `Authorization: Bearer SECRET`

---

### Issue: Database Query Fails

**Causes**:
- Wrong Supabase credentials
- Table doesn't exist
- RLS policy blocking

**Solutions**:
1. Verify `SUPABASE_SERVICE_ROLE_KEY` in environment
2. Check table `assessment_submissions` exists
3. Ensure service role has full access

---

### Issue: Supabase Still Pausing

**Causes**:
- Cron not running regularly
- Database not receiving queries
- Different inactivity criteria

**Solutions**:
1. Check cron execution logs (last 7 days)
2. Verify queries reaching database
3. Contact Supabase support if issue persists
4. Consider upgrading to paid plan

---

## 📈 Best Practices

1. **Monitor Regularly**
   - Check logs weekly
   - Set up alerts for failures

2. **Keep It Simple**
   - Lightweight queries only
   - No heavy operations
   - Fast execution (<1s)

3. **Secure the Endpoint**
   - Always use CRON_SECRET
   - Don't expose sensitive data
   - Log all attempts

4. **Have a Backup**
   - Use both Vercel Cron + GitHub Actions
   - Or Vercel Cron + manual check weekly

5. **Document Changes**
   - Note any schedule modifications
   - Track cron execution history

---

## 💰 Cost Considerations

**Vercel Cron Jobs**:
- ✅ **Free** on all plans (Hobby, Pro, Enterprise)
- ✅ Unlimited cron jobs
- ✅ No additional cost

**Supabase Free Tier**:
- ✅ 500 MB database
- ✅ 1 GB bandwidth/month
- ✅ Keep-alive queries use minimal bandwidth (~1 KB/day)

**Estimated Monthly Cost**: **$0** (Free)

---

## 📚 Additional Resources

- **Vercel Cron Documentation**: [https://vercel.com/docs/cron-jobs](https://vercel.com/docs/cron-jobs)
- **Supabase Free Tier**: [https://supabase.com/pricing](https://supabase.com/pricing)
- **Cron Schedule Generator**: [https://crontab.guru](https://crontab.guru)
- **GitHub Actions Docs**: [https://docs.github.com/en/actions](https://docs.github.com/en/actions)

---

## ✅ Checklist

Before going to production:

- [ ] Deploy application to Vercel
- [ ] Add `CRON_SECRET` to Vercel environment variables
- [ ] Verify `vercel.json` cron configuration
- [ ] Test cron endpoint manually
- [ ] Check Vercel Function logs
- [ ] Verify Supabase receives queries
- [ ] Set up monitoring/alerts
- [ ] Document cron schedule
- [ ] Add backup method (GitHub Actions)

---

## 🎯 Summary

**What Was Implemented**:

1. ✅ **Standalone Script**: `scripts/keep-supabase-alive.ts`
   - Run manually: `npm run keep-alive`
   - Can be used with any cron system

2. ✅ **Vercel Cron Job**: `src/app/api/cron/keep-alive/route.ts`
   - Fully automated
   - Runs daily at 6 AM UTC
   - Secure with CRON_SECRET

3. ✅ **Configuration**: `vercel.json`
   - Cron schedule defined
   - Ready to deploy

4. ✅ **npm Script**: Added to `package.json`
   - `npm run keep-alive`

**Deployment Steps**:

1. Push to GitHub: `git push origin main`
2. Deploy to Vercel (automatic)
3. Add `CRON_SECRET` to Vercel
4. Done! Cron runs automatically

**Verification**:
- Check Vercel logs daily
- Monitor Supabase dashboard
- Test endpoint manually monthly

---

**Last Updated**: November 22, 2025  
**Status**: ✅ Production Ready  
**Auto-Keep-Alive**: ✅ Enabled
