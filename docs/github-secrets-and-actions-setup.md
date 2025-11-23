# GitHub Secrets and Actions Setup Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Understanding GitHub Secrets](#understanding-github-secrets)
3. [Setting Up GitHub Secrets](#setting-up-github-secrets)
4. [Setting Up GitHub Actions for Cron Jobs](#setting-up-github-actions-for-cron-jobs)
5. [Monitoring and Troubleshooting](#monitoring-and-troubleshooting)
6. [Security Best Practices](#security-best-practices)
7. [Advanced Configuration](#advanced-configuration)

---

## Introduction

This guide provides comprehensive instructions for storing secrets securely in GitHub and setting up automated cron jobs using GitHub Actions for the Supabase keep-alive functionality.

### What You'll Learn
- ✅ How to securely store secrets in GitHub
- ✅ How to set up GitHub Actions workflows
- ✅ How to configure automated cron jobs
- ✅ How to monitor and debug workflow executions
- ✅ Security best practices for CI/CD

### Prerequisites
- GitHub repository with admin access
- Supabase project with API keys
- Basic understanding of YAML syntax

---

## Understanding GitHub Secrets

### What are GitHub Secrets?

GitHub Secrets are encrypted environment variables that:
- 🔒 Are stored securely in GitHub's infrastructure
- 🚫 Are never exposed in logs or workflow files
- 🔑 Can only be accessed by authorized workflows
- 📝 Are automatically redacted from log outputs
- 🌍 Can be scoped to organization, repository, or environment

### Types of Secrets

| Type | Scope | Use Case |
|------|-------|----------|
| **Repository Secrets** | Single repository | Project-specific credentials |
| **Organization Secrets** | Multiple repositories | Shared credentials across projects |
| **Environment Secrets** | Specific environment | Production, staging, development keys |
| **Dependabot Secrets** | Dependabot only | Credentials for private registries |

For this project, we'll use **Repository Secrets**.

### Security Features

**Encryption:**
- Secrets are encrypted at rest using AES-256
- Encrypted in transit using TLS
- Only decrypted during workflow execution

**Access Control:**
- Only workflows in the repository can access secrets
- Secrets are not passed to forked repositories
- Can be limited to specific branches/tags

**Audit Trail:**
- All secret access is logged
- Available in organization audit log
- Tracks creation, modification, and deletion

---

## Setting Up GitHub Secrets

### Step 1: Navigate to Repository Settings

1. Go to your GitHub repository: `https://github.com/ankits1802/Madhya-Pradesh-Anandak-Assessment`
2. Click the **Settings** tab (you need admin access)
3. In the left sidebar, find **Secrets and variables** section
4. Click **Actions** under "Secrets and variables"

![GitHub Settings Navigation](https://docs.github.com/assets/cb-21851/mw-1440/images/help/repository/repo-settings.webp)

### Step 2: Add Required Secrets

Click **New repository secret** for each secret below:

#### Required Secrets

**1. NEXT_PUBLIC_SUPABASE_URL**
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://twfbgqngefwomlssxoui.supabase.co
```
- **Where to find**: Supabase Dashboard → Project Settings → API → Project URL
- **Public**: Yes (safe to expose)
- **Required**: ✅ Always needed

---

**2. SUPABASE_SECRET_KEY** (Recommended - New API Key)
```
Name: SUPABASE_SECRET_KEY
Value: sb_secret_your_actual_key_here
```
- **Where to find**: Supabase Dashboard → Project Settings → API Keys (New) → Secret Keys
- **Format**: Starts with `sb_secret_`
- **Public**: ❌ Never expose (bypasses RLS)
- **Required**: ✅ Highly recommended (best choice)
- **Priority**: First choice for keep-alive

---

**3. SUPABASE_SERVICE_ROLE_KEY** (Legacy Fallback)
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- **Where to find**: Supabase Dashboard → Project Settings → API → service_role (JWT)
- **Format**: JWT starting with `eyJ`
- **Public**: ❌ Never expose (bypasses RLS)
- **Required**: ⚠️ Optional (fallback if no secret key)
- **Priority**: Second choice for keep-alive

---

#### Optional Secrets (Recommended)

**4. SUPABASE_PUBLISHABLE_KEY** (New API Key - Public)
```
Name: SUPABASE_PUBLISHABLE_KEY
Value: sb_publishable_your_actual_key_here
```
- **Where to find**: Supabase Dashboard → Project Settings → API Keys (New) → Publishable Key
- **Format**: Starts with `sb_publishable_`
- **Public**: ✅ Safe to expose
- **Required**: ⚪ Optional (fallback)
- **Priority**: Third choice for keep-alive

---

**5. NEXT_PUBLIC_SUPABASE_ANON_KEY** (Legacy - Public)
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- **Where to find**: Supabase Dashboard → Project Settings → API → anon/public (JWT)
- **Format**: JWT starting with `eyJ`
- **Public**: ✅ Safe to expose
- **Required**: ⚪ Optional (fallback)
- **Priority**: Fourth choice for keep-alive

---

### Step 3: Verify Secrets Added

After adding all secrets, you should see them listed:

```
✅ NEXT_PUBLIC_SUPABASE_URL              Updated 1 minute ago
✅ SUPABASE_SECRET_KEY                   Updated 2 minutes ago
✅ SUPABASE_SERVICE_ROLE_KEY             Updated 3 minutes ago
✅ SUPABASE_PUBLISHABLE_KEY              Updated 4 minutes ago
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY         Updated 5 minutes ago
```

**Note**: Secret values are never shown after creation. Only names and last update time are visible.

### Step 4: Update Secrets (If Needed)

To update a secret:
1. Find the secret in the list
2. Click the secret name
3. Click **Update secret**
4. Enter the new value
5. Click **Update secret**

**Important**: Updating a secret takes effect immediately for new workflow runs.

---

## Setting Up GitHub Actions for Cron Jobs

### Understanding the Workflow File

Your repository already has a workflow file at:
```
.github/workflows/keep-supabase-alive.yml
```

Let's understand each section:

#### Workflow Structure

```yaml
name: Keep Supabase Active

on:
  schedule:
    # Run every day at 6:00 AM UTC (11:30 AM IST)
    - cron: '0 6 * * *'
  workflow_dispatch: # Allow manual trigger

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Supabase keep-alive
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
          SUPABASE_PUBLISHABLE_KEY: ${{ secrets.SUPABASE_PUBLISHABLE_KEY }}
          SUPABASE_SERVICE_ROLE_KEY: ${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
        run: npm run keep-alive
      
      - name: Notify on failure
        if: failure()
        run: |
          echo "⚠️ Supabase keep-alive failed!"
          echo "Check the logs and ensure Supabase credentials are correct."
```

### Workflow Components Explained

#### 1. Workflow Name
```yaml
name: Keep Supabase Active
```
- Displayed in GitHub Actions UI
- Helps identify the workflow purpose

#### 2. Triggers (on)
```yaml
on:
  schedule:
    - cron: '0 6 * * *'
  workflow_dispatch:
```

**Schedule Trigger:**
- `cron: '0 6 * * *'` = Every day at 6:00 AM UTC
- Cron format: `minute hour day month weekday`
- Uses UTC timezone (not local time)

**Cron Examples:**
```yaml
'0 6 * * *'      # Daily at 6:00 AM UTC
'0 */6 * * *'    # Every 6 hours
'0 0 * * 0'      # Every Sunday at midnight
'30 14 * * 1-5'  # Weekdays at 2:30 PM UTC
'0 8,20 * * *'   # Daily at 8 AM and 8 PM UTC
```

**Manual Trigger (workflow_dispatch):**
- Allows running workflow manually from GitHub UI
- Useful for testing without waiting for schedule
- Available in Actions tab → Workflow → "Run workflow" button

#### 3. Jobs
```yaml
jobs:
  keep-alive:
    runs-on: ubuntu-latest
```
- `keep-alive`: Job identifier
- `runs-on: ubuntu-latest`: Uses latest Ubuntu runner
- Other options: `windows-latest`, `macos-latest`

#### 4. Steps

**Checkout Code:**
```yaml
- name: Checkout repository
  uses: actions/checkout@v4
```
- Downloads repository code to runner
- Required to access scripts and config

**Setup Node.js:**
```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '18'
    cache: 'npm'
```
- Installs Node.js version 18
- Caches npm dependencies for faster runs
- Reduces build time significantly

**Install Dependencies:**
```yaml
- name: Install dependencies
  run: npm ci
```
- `npm ci`: Clean install (faster than `npm install`)
- Uses `package-lock.json` for reproducible builds
- Recommended for CI/CD environments

**Run Script with Secrets:**
```yaml
- name: Run Supabase keep-alive
  env:
    NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
    SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
    # ... other secrets
  run: npm run keep-alive
```
- `env`: Maps GitHub secrets to environment variables
- `${{ secrets.SECRET_NAME }}`: Accesses repository secret
- Secrets are automatically redacted in logs
- Script runs with environment variables set

**Failure Notification:**
```yaml
- name: Notify on failure
  if: failure()
  run: |
    echo "⚠️ Supabase keep-alive failed!"
```
- `if: failure()`: Only runs if previous step failed
- Logs error message for debugging
- Can be extended with email/Slack notifications

### Step 5: Understanding Workflow File Location

**Required Structure:**
```
your-repository/
├── .github/
│   └── workflows/
│       └── keep-supabase-alive.yml  ← Workflow file here
├── scripts/
│   └── keep-supabase-alive.ts
└── package.json
```

**Important Rules:**
- ✅ Must be in `.github/workflows/` directory
- ✅ File extension must be `.yml` or `.yaml`
- ✅ File must be on default branch (usually `main`)
- ✅ Proper YAML syntax (indentation matters!)
- ❌ Don't rename `.github` directory
- ❌ Don't move workflow file elsewhere

### Step 6: Enable GitHub Actions (If Disabled)

1. Go to repository **Settings**
2. Click **Actions** → **General** in left sidebar
3. Under "Actions permissions", select:
   - ✅ **Allow all actions and reusable workflows** (recommended)
   - OR ✅ **Allow [organization] actions and reusable workflows**
4. Under "Workflow permissions", select:
   - ✅ **Read and write permissions**
5. Click **Save**

### Step 7: Verify Workflow is Active

1. Go to **Actions** tab in your repository
2. You should see "Keep Supabase Active" in the workflows list
3. If not visible:
   - Check workflow file is in `.github/workflows/`
   - Check file syntax with YAML validator
   - Ensure file is committed to default branch

---

## Running and Testing the Workflow

### Manual Test Run

**Before relying on the schedule, test manually:**

1. Go to **Actions** tab
2. Click **Keep Supabase Active** workflow in left sidebar
3. Click **Run workflow** dropdown (top right)
4. Select branch (usually `main`)
5. Click **Run workflow** button
6. Wait for execution (usually 1-2 minutes)

### Reading Workflow Logs

1. After triggering workflow, click on the running workflow
2. Click on the **keep-alive** job
3. Expand each step to see detailed logs:

**Expected Success Output:**
```
Run npm run keep-alive
🔄 Starting Supabase keep-alive check...
📅 Timestamp: 2025-11-23T06:00:00.000Z

🔑 Using secret (sb_secret_) key

✅ Supabase is active!
📊 Total submissions in database: 42
🌐 Database URL: https://twfbgqngefwomlssxoui.supabase.co
⏰ Next check recommended: 2025-11-24T06:00:00.000Z

🎉 Keep-alive successful!

✅ Script completed successfully
```

**Secret Redaction in Logs:**
```
🔑 Using secret (sb_secret_) key
🌐 Database URL: https://***supabase.co  ← Automatically redacted
```

### Checking Scheduled Runs

**View Next Scheduled Run:**
1. Go to **Actions** tab
2. Click workflow name
3. Look for "This workflow has a workflow_dispatch event trigger" message
4. Next scheduled run appears after first scheduled execution

**Note**: First scheduled run may take up to 15 minutes after the scheduled time.

---

## Monitoring and Troubleshooting

### Monitoring Workflow Executions

#### Actions Dashboard

**View All Runs:**
1. Go to **Actions** tab
2. See list of all workflow runs with status:
   - ✅ Green checkmark = Success
   - ❌ Red X = Failed
   - 🟡 Yellow dot = In progress
   - ⚪ Gray circle = Cancelled/Skipped

**Filter Runs:**
- By workflow name
- By branch
- By event (schedule, workflow_dispatch, push)
- By status (success, failure, cancelled)

#### Email Notifications

**Default Behavior:**
- GitHub sends email on workflow failure
- Only to workflow author or committer
- Can be configured in GitHub settings

**Configure Notifications:**
1. GitHub Profile → **Settings**
2. **Notifications** in left sidebar
3. Scroll to **Actions**
4. Select notification preferences:
   - ✅ Only on failures
   - ✅ All notifications
   - ❌ Disabled

### Common Issues and Solutions

#### Issue 1: "Secret not found" Error

**Error Message:**
```
Error: Missing Supabase key. Set one of: SUPABASE_SECRET_KEY...
```

**Cause:** Secret not added to GitHub or wrong name

**Solution:**
1. Verify secret name exactly matches in workflow file
2. Names are case-sensitive: `SUPABASE_SECRET_KEY` ≠ `supabase_secret_key`
3. Re-add secret if needed
4. Re-run workflow

#### Issue 2: "Context access might be invalid" Warning

**Warning in VS Code:**
```yaml
SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
                          ^^^^^ Context access might be invalid
```

**Cause:** VS Code doesn't know which secrets exist in GitHub

**Solution:**
- ✅ This is just a warning, ignore it
- ✅ Add secrets to GitHub, workflow will work
- ✅ Warnings disappear after secrets are added (VS Code can't verify)

#### Issue 3: Workflow Doesn't Run on Schedule

**Possible Causes:**

1. **Workflow file not on default branch**
   - Solution: Merge to `main` or default branch

2. **Repository inactive**
   - GitHub disables scheduled workflows after 60 days of no activity
   - Solution: Make a commit or run workflow manually

3. **GitHub Actions disabled**
   - Solution: Enable Actions in repository settings

4. **Cron schedule in different timezone**
   - Remember: Cron uses UTC, not local time
   - Solution: Convert your local time to UTC

#### Issue 4: "npm ci" Fails

**Error Message:**
```
npm ERR! code ENOLOCK
npm ERR! npm ci can only install packages with an existing package-lock.json
```

**Cause:** Missing or outdated `package-lock.json`

**Solution:**
1. Run `npm install` locally
2. Commit `package-lock.json`
3. Push to GitHub

#### Issue 5: Script Exits with Error Code 1

**Error Message:**
```
❌ Script completed with errors
Error: Process completed with exit code 1.
```

**Cause:** Environment validation failed or database connection issue

**Solution:**
1. Check logs for specific error
2. Verify all required secrets are set
3. Test locally: `npm run validate-env`
4. Verify Supabase project is active

### Debugging Tips

#### Enable Debug Logging

Add this secret to get verbose logs:
```
Name: ACTIONS_STEP_DEBUG
Value: true
```

Re-run workflow to see detailed debug output.

#### Test Locally First

Before pushing to GitHub:
```powershell
# Set environment variables
$env:NEXT_PUBLIC_SUPABASE_URL="your-url"
$env:SUPABASE_SECRET_KEY="your-key"

# Run script
npm run keep-alive
```

#### Check Supabase Project Status

1. Go to Supabase Dashboard
2. Check project is active (not paused)
3. Verify keys are valid and not revoked
4. Check API keys page for any warnings

---

## Security Best Practices

### Secret Management

#### DO ✅

1. **Use Repository Secrets for All Sensitive Data**
   ```yaml
   # Good
   env:
     API_KEY: ${{ secrets.API_KEY }}
   ```

2. **Rotate Secrets Regularly**
   - New API keys support zero-downtime rotation
   - Rotate at least every 90 days
   - Rotate immediately if compromised

3. **Use Least Privilege**
   - Use `SUPABASE_PUBLISHABLE_KEY` for read-only operations
   - Use `SUPABASE_SECRET_KEY` only when necessary
   - Don't use admin keys for public operations

4. **Limit Secret Scope**
   - Use environment secrets for production
   - Different keys for dev/staging/production
   - Revoke old keys after rotation

5. **Monitor Secret Access**
   - Check organization audit log regularly
   - Review workflow run history
   - Set up alerts for failures

#### DON'T ❌

1. **Never Commit Secrets to Git**
   ```yaml
   # Bad - Never do this!
   env:
     API_KEY: "sb_secret_actual_key_here"
   ```

2. **Don't Echo or Log Secrets**
   ```yaml
   # Bad - Exposes secret in logs
   run: echo "Key is ${{ secrets.API_KEY }}"
   ```

3. **Don't Use Secrets in Pull Request Workflows**
   ```yaml
   # Bad - PR from fork can access secrets
   on: [pull_request]
   ```
   Use `pull_request_target` with caution instead.

4. **Don't Store Non-Secret Data as Secrets**
   - Configuration values → Use repository variables
   - Public URLs → Use variables or hardcode
   - Secrets are encrypted, slower to access

5. **Don't Share Secrets Across Untrusted Repos**
   - Use organization secrets carefully
   - Verify all repos before sharing secrets
   - Limit to specific repositories when possible

### Workflow Security

#### Secure Workflow Triggers

```yaml
on:
  schedule:
    - cron: '0 6 * * *'
  workflow_dispatch:  # Safe: Manual trigger by maintainers
  # push: # Careful: Runs on every commit
  # pull_request: # Risky: Runs for forked PRs
```

#### Use Dependabot

Keep actions up to date:
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
```

#### Pin Action Versions

```yaml
# Good - Pin to specific SHA
uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

# Acceptable - Pin to major version
uses: actions/checkout@v4

# Bad - Uses latest (may break)
uses: actions/checkout@main
```

### Compliance

#### GDPR / Data Protection

- Secrets are stored in GitHub's US data centers
- Encrypted at rest and in transit
- Automatically redacted from logs
- Access logged for audit purposes

#### SOC 2 / Enterprise

- GitHub Enterprise offers enhanced security
- SAML SSO for organization access
- Required reviews for workflow changes
- IP allow lists for Actions

---

## Advanced Configuration

### Multiple Environments

Use environment secrets for different deployment stages:

```yaml
jobs:
  keep-alive-prod:
    runs-on: ubuntu-latest
    environment: production  # Uses production environment secrets
    steps:
      - name: Keep alive production
        env:
          SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
        run: npm run keep-alive

  keep-alive-staging:
    runs-on: ubuntu-latest
    environment: staging  # Uses staging environment secrets
    steps:
      - name: Keep alive staging
        env:
          SUPABASE_SECRET_KEY: ${{ secrets.SUPABASE_SECRET_KEY }}
        run: npm run keep-alive
```

### Conditional Execution

Run workflow only on specific branches:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'
  workflow_dispatch:

jobs:
  keep-alive:
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'  # Only on main branch
    steps:
      # ... steps
```

### Notifications

#### Slack Notification on Failure

```yaml
- name: Notify Slack on failure
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "⚠️ Supabase keep-alive failed!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Workflow: ${{ github.workflow }}\nStatus: Failed"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

#### Email Notification

```yaml
- name: Send email on failure
  if: failure()
  uses: dawidd6/action-send-mail@v3
  with:
    server_address: smtp.gmail.com
    server_port: 465
    username: ${{ secrets.EMAIL_USERNAME }}
    password: ${{ secrets.EMAIL_PASSWORD }}
    subject: Supabase Keep-Alive Failed
    body: Check workflow logs for details
    to: admin@example.com
    from: noreply@example.com
```

### Matrix Strategy

Run keep-alive for multiple projects:

```yaml
jobs:
  keep-alive:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [project1, project2, project3]
    steps:
      - name: Keep alive ${{ matrix.project }}
        env:
          SUPABASE_URL: ${{ secrets[format('SUPABASE_URL_{0}', matrix.project)] }}
          SUPABASE_KEY: ${{ secrets[format('SUPABASE_KEY_{0}', matrix.project)] }}
        run: npm run keep-alive
```

### Timeout and Retry

```yaml
jobs:
  keep-alive:
    runs-on: ubuntu-latest
    timeout-minutes: 5  # Kill job after 5 minutes
    steps:
      - name: Keep alive with retry
        uses: nick-invision/retry@v2
        with:
          timeout_minutes: 2
          max_attempts: 3
          retry_wait_seconds: 30
          command: npm run keep-alive
```

---

## Summary

### Quick Checklist

#### Setup Secrets (5 minutes)
- [ ] Go to repository Settings → Secrets → Actions
- [ ] Add `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Add `SUPABASE_SECRET_KEY` (or legacy key)
- [ ] Verify secrets appear in list

#### Verify Workflow (2 minutes)
- [ ] Check `.github/workflows/keep-supabase-alive.yml` exists
- [ ] File is on `main` branch
- [ ] Actions enabled in repository settings

#### Test Workflow (3 minutes)
- [ ] Go to Actions tab
- [ ] Run workflow manually
- [ ] Check logs for success message
- [ ] Verify no errors

#### Monitor (Ongoing)
- [ ] Check workflow runs daily
- [ ] Review failure notifications
- [ ] Rotate secrets every 90 days

### Key Takeaways

✅ **Secrets are encrypted and secure** - Never exposed in logs  
✅ **Workflow runs automatically** - Daily at 6 AM UTC  
✅ **Manual testing available** - Use workflow_dispatch trigger  
✅ **Failures are notified** - Email sent automatically  
✅ **Multiple key types supported** - New and legacy keys work  
✅ **Zero downtime migration** - Add new keys without removing old  

### Next Steps

1. ✅ **Add secrets to GitHub** (if not done)
2. ✅ **Test workflow manually** once
3. ✅ **Wait for scheduled run** (next day at 6 AM UTC)
4. ✅ **Verify in Supabase** that database stays active
5. ✅ **Set up monitoring** (email notifications enabled by default)

### Support Resources

- **Documentation**: See `docs/` folder
- **Environment Setup**: `docs/environment-setup.md`
- **Key Migration**: `docs/supabase-key-migration.md`
- **Quick Reference**: `docs/supabase-keys-quick-reference.md`
- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Supabase Dashboard**: https://supabase.com/dashboard

---

**Congratulations!** 🎉 Your GitHub Actions cron job is now set up to keep your Supabase project active automatically!
