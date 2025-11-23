# Vercel Deployment & Subdomain Setup Guide

Complete guide to deploying the Multi-Parameter Assessment application on Vercel and connecting it to a custom subdomain.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deploy to Vercel](#deploy-to-vercel)
4. [Environment Variables](#environment-variables)
5. [Custom Domain Setup](#custom-domain-setup)
6. [Subdomain Configuration](#subdomain-configuration)
7. [DNS Configuration](#dns-configuration)
8. [SSL Certificate](#ssl-certificate)
9. [Troubleshooting](#troubleshooting)
10. [Post-Deployment](#post-deployment)

---

## Overview

This guide walks you through:
- Deploying the Next.js application to Vercel
- Connecting a custom subdomain (e.g., `assessment.yourdomain.com`)
- Configuring DNS records
- Setting up SSL certificates
- Verifying deployment

**Time Required**: 15-30 minutes

---

## Prerequisites

Before starting, ensure you have:

- ✅ A Vercel account ([Sign up free](https://vercel.com/signup))
- ✅ Your code pushed to Git (GitHub, GitLab, or Bitbucket)
- ✅ A custom domain (e.g., `yourdomain.com`)
- ✅ Access to your domain's DNS settings
- ✅ Supabase project set up with credentials
- ✅ Environment variables ready

---

## Deploy to Vercel

### Step 1: Connect Git Repository

1. **Sign in to Vercel**
   - Go to [https://vercel.com](https://vercel.com)
   - Click "Login" or "Sign Up"
   - Choose GitHub/GitLab/Bitbucket

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select your repository from the list
   - If not visible, configure GitHub app permissions

3. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `next build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

4. **Don't Deploy Yet** - Add environment variables first

---

### Step 2: Add Environment Variables

1. **Expand "Environment Variables" section**

2. **Add Supabase Variables**

   | Name | Value | Environment |
   |------|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
   | `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGc...` (your service role key) | Production, Preview, Development |

3. **⚠️ Important**:
   - Use **service_role** key, NOT anon key
   - Select all environments (Production, Preview, Development)
   - Don't use quotes around values

4. **Optional Variables** (if using):

   | Name | Value | Environment |
   |------|-------|-------------|
   | `GOOGLE_AI_API_KEY` | Your Google AI key | Production |
   | `NODE_ENV` | `production` | Production |

---

### Step 3: Deploy

1. **Click "Deploy"**
   - Vercel will start building your project
   - Build typically takes 1-2 minutes

2. **Monitor Build**
   - View real-time build logs
   - Check for errors

3. **Build Success**
   - You'll see "Congratulations!" message
   - Click "Continue to Dashboard"

4. **Visit Deployment**
   - Click "Visit" or the deployment URL
   - URL format: `https://your-project-name.vercel.app`

---

## Environment Variables

### Managing Variables

**After Deployment**:
1. Go to project dashboard
2. Click "Settings"
3. Click "Environment Variables"

**Update Variables**:
1. Click "Edit" on existing variable
2. Update value
3. Click "Save"
4. **Redeploy** to apply changes

**Add New Variable**:
1. Enter name and value
2. Select environments
3. Click "Save"
4. Redeploy

**⚠️ Important**: After changing environment variables, you must redeploy:
- Go to "Deployments"
- Click "..." menu on latest deployment
- Click "Redeploy"

---

## Custom Domain Setup

### Option 1: Root Domain (yourdomain.com)

If you want to use your root domain:

1. **Add Domain**
   - Go to project → Settings → Domains
   - Enter `yourdomain.com`
   - Click "Add"

2. **Configure DNS** (see [DNS Configuration](#dns-configuration))

3. **Recommended**: Use subdomain instead for better organization

---

### Option 2: Subdomain (Recommended)

Use a subdomain like `assessment.yourdomain.com`, `app.yourdomain.com`, etc.

---

## Subdomain Configuration

### Step 1: Add Subdomain in Vercel

1. **Navigate to Domains**
   - Go to your project dashboard
   - Click "Settings" tab
   - Click "Domains" in sidebar

2. **Add Subdomain**
   - In the "Add Domain" field, enter: `assessment.yourdomain.com`
   - Replace `assessment` with your preferred subdomain
   - Replace `yourdomain.com` with your actual domain
   - Click "Add"

3. **Verification Status**
   - Vercel will show "Invalid Configuration"
   - This is normal - we need to configure DNS

---

### Step 2: Get DNS Records

After adding the subdomain, Vercel provides DNS records:

**Type 1: CNAME (Recommended)**
```
Type: CNAME
Name: assessment (or your subdomain)
Value: cname.vercel-dns.com
```

**Type 2: A Record (Alternative)**
```
Type: A
Name: assessment
Value: 76.76.21.21
```

**Note**: Use CNAME if possible (easier to manage)

---

## DNS Configuration

Now configure DNS with your domain provider.

### Common DNS Providers

#### Namecheap

1. **Login to Namecheap**
   - Go to [namecheap.com](https://namecheap.com)
   - Sign in to account

2. **Manage Domain**
   - Go to "Domain List"
   - Click "Manage" next to your domain

3. **Advanced DNS**
   - Click "Advanced DNS" tab

4. **Add Record**
   - Click "Add New Record"
   - **Type**: CNAME Record
   - **Host**: `assessment` (your subdomain)
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: Automatic (or 1 min)
   - Click "Save"

5. **Wait for Propagation** (usually 5-10 minutes)

---

#### GoDaddy

1. **Login to GoDaddy**
   - Go to [godaddy.com](https://godaddy.com)
   - Sign in

2. **DNS Management**
   - Go to "My Products"
   - Find your domain → Click "DNS"

3. **Add Record**
   - Click "Add" under DNS Records
   - **Type**: CNAME
   - **Name**: `assessment`
   - **Value**: `cname.vercel-dns.com`
   - **TTL**: 600 seconds (or default)
   - Click "Save"

---

#### Cloudflare

1. **Login to Cloudflare**
   - Go to [cloudflare.com](https://cloudflare.com)
   - Select your domain

2. **DNS Settings**
   - Click "DNS" in left sidebar

3. **Add Record**
   - Click "Add record"
   - **Type**: CNAME
   - **Name**: `assessment`
   - **Target**: `cname.vercel-dns.com`
   - **Proxy status**: 🟠 DNS only (disable proxy)
   - Click "Save"

**⚠️ Important for Cloudflare**:
- Turn OFF the orange cloud (proxy)
- Use "DNS only" mode
- Otherwise, Vercel SSL won't work properly

---

#### Google Domains

1. **Login to Google Domains**
   - Go to [domains.google.com](https://domains.google.com)
   - Select your domain

2. **DNS Settings**
   - Click "DNS" in left sidebar

3. **Custom Records**
   - Scroll to "Custom resource records"
   - **Name**: `assessment`
   - **Type**: CNAME
   - **TTL**: 1H
   - **Data**: `cname.vercel-dns.com`
   - Click "Add"

---

#### Other Providers

**General Steps** (similar for all providers):

1. Login to your DNS provider
2. Find "DNS Management" or "DNS Records"
3. Add new CNAME record:
   - **Name/Host**: Your subdomain (e.g., `assessment`)
   - **Type**: CNAME
   - **Value/Target**: `cname.vercel-dns.com`
   - **TTL**: Lowest available (or automatic)
4. Save the record

---

## SSL Certificate

### Automatic SSL (Default)

Vercel automatically provisions SSL certificates:

1. **After DNS Propagation**
   - Wait 5-30 minutes
   - Vercel detects DNS changes

2. **Certificate Provisioning**
   - Vercel requests Let's Encrypt certificate
   - Usually takes 1-5 minutes

3. **Verification**
   - Go to Vercel → Settings → Domains
   - Your subdomain should show ✓ (green checkmark)
   - Status: "Valid Configuration"

4. **HTTPS Enforced**
   - HTTP automatically redirects to HTTPS
   - HTTP/2 enabled
   - TLS 1.3 supported

### Manual Verification

**Check DNS Propagation**:
```bash
# Windows (PowerShell)
nslookup assessment.yourdomain.com

# macOS/Linux
dig assessment.yourdomain.com

# Online tool
# Visit https://dnschecker.org
```

**Expected Result**:
```
assessment.yourdomain.com → cname.vercel-dns.com → Vercel IP
```

---

## Troubleshooting

### Issue: "Invalid Configuration" in Vercel

**Cause**: DNS not propagated yet

**Solutions**:
1. **Wait**: DNS can take up to 48 hours (usually 5-30 min)
2. **Check DNS**: Use `nslookup` or `dig`
3. **Verify CNAME**: Ensure value is `cname.vercel-dns.com`
4. **Clear DNS Cache**:
   ```bash
   # Windows
   ipconfig /flushdns
   
   # macOS
   sudo dscacheutil -flushcache
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

---

### Issue: DNS Not Propagating

**Causes**:
- TTL too high
- DNS provider caching
- Incorrect record

**Solutions**:
1. **Lower TTL** to 1 minute or 5 minutes
2. **Wait longer** (up to 48 hours)
3. **Check with multiple DNS checkers**:
   - [https://dnschecker.org](https://dnschecker.org)
   - [https://www.whatsmydns.net](https://www.whatsmydns.net)
4. **Contact DNS provider** support

---

### Issue: SSL Certificate Not Provisioning

**Causes**:
- DNS not fully propagated
- CAA record blocking Let's Encrypt
- Cloudflare proxy enabled

**Solutions**:
1. **Wait for DNS**: Ensure DNS fully propagated
2. **Check CAA Records**:
   ```bash
   dig CAA yourdomain.com
   ```
   - Should allow `letsencrypt.org`
3. **Disable Cloudflare Proxy** (if using)
4. **Check Vercel Logs** in dashboard

---

### Issue: "ERR_TOO_MANY_REDIRECTS"

**Cause**: Cloudflare SSL mode misconfiguration

**Solution**:
1. Go to Cloudflare → SSL/TLS
2. Set mode to "Full" (not "Flexible")
3. Or disable Cloudflare proxy (DNS only)

---

### Issue: 404 Not Found After Deployment

**Causes**:
- Routing issue
- Build error
- Wrong deployment

**Solutions**:
1. **Check Build Logs** in Vercel
2. **Verify Routes**: Ensure `app/page.tsx` exists
3. **Redeploy**: Force a new deployment
4. **Check Functions**: Ensure API routes deployed

---

## Post-Deployment

### Verification Checklist

After successful deployment and domain configuration:

- [ ] Visit `https://assessment.yourdomain.com`
- [ ] Verify HTTPS (padlock icon in browser)
- [ ] Test the application:
  - [ ] User info form loads
  - [ ] Transliteration works
  - [ ] Assessment questions display
  - [ ] Results show correctly
  - [ ] Data saves to Supabase
- [ ] Check browser console (F12) for errors
- [ ] Test on mobile device
- [ ] Verify analytics working (Vercel dashboard)

---

### Monitoring

**Vercel Dashboard**:
1. Go to project dashboard
2. Click "Analytics" tab
3. Monitor:
   - Page views
   - Performance metrics
   - Error rates
   - Geographic distribution

**Supabase Dashboard**:
1. Go to Supabase project
2. Check "Table Editor"
3. Verify submissions appearing

---

### Performance Optimization

**Enable Speed Insights**:
Already enabled via `@vercel/speed-insights` package

**Enable Analytics**:
Already enabled via `@vercel/analytics` package

**Add Custom Headers** (optional):

Create `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

---

### Continuous Deployment

**Automatic Deployments**:
- Every `git push` to main branch triggers deployment
- Pull requests get preview deployments
- Rollback available for previous deployments

**Manual Deployment**:
1. Go to "Deployments" tab
2. Click "..." menu
3. Select "Redeploy"

**Deployment Protection** (recommended for production):
1. Go to Settings → General
2. Enable "Password Protection"
3. Or enable "Vercel Authentication"

---

### Custom Deployment Aliases

**Add More Domains**:
You can connect multiple domains to the same project:

1. `assessment.yourdomain.com` (primary)
2. `test.yourdomain.com` (staging)
3. `app.yourdomain.com` (alternative)

**Branch-Based Domains**:
- `main` branch → `assessment.yourdomain.com`
- `staging` branch → `staging-assessment.yourdomain.com`
- `dev` branch → `dev-assessment.yourdomain.com`

Configure in Settings → Domains → Git Branch

---

## Advanced Configuration

### Environment-Specific Domains

**Production**: `assessment.yourdomain.com`  
**Preview**: `preview-assessment.yourdomain.com`  
**Development**: Use localhost

**Setup**:
1. Add domain for each environment
2. Set environment variables per environment
3. Use Vercel environment detection:
   ```typescript
   const isProd = process.env.VERCEL_ENV === 'production';
   ```

---

### Multiple Subdomains

**Use Cases**:
- `assessment.yourdomain.com` - Main app
- `admin.yourdomain.com` - Admin dashboard
- `api.yourdomain.com` - API endpoints

**Setup**: Deploy separate projects or use monorepo

---

### Custom Serverless Region

**Default**: Automatic (closest to users)

**Override** (if needed):
```json
// vercel.json
{
  "regions": ["bom1", "sin1"]
}
```

Regions:
- `bom1`: Mumbai, India
- `sin1`: Singapore
- `hnd1`: Tokyo, Japan
- `iad1`: Washington, D.C., USA

---

## Security Best Practices

### Headers

Add security headers in `next.config.ts`:

```typescript
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          }
        ]
      }
    ];
  }
};
```

---

### Rate Limiting

**Recommended**: Add rate limiting to API routes

**Options**:
- Upstash Rate Limit
- Vercel Edge Middleware
- Cloudflare Rate Limiting

---

### DDoS Protection

**Vercel Built-in**:
- Automatic DDoS mitigation
- WAF (Web Application Firewall)
- Edge network protection

**Additional**: Use Cloudflare (optional)

---

## Cost Considerations

### Vercel Pricing

**Hobby (Free)**:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited websites
- ✅ Automatic SSL
- ✅ Analytics included
- ❌ No commercial use
- ❌ Limited team members

**Pro ($20/month per member)**:
- ✅ 1 TB bandwidth/month
- ✅ Commercial use
- ✅ Team collaboration
- ✅ Custom domains unlimited
- ✅ Advanced analytics
- ✅ Priority support

**Enterprise (Custom pricing)**:
- ✅ Dedicated support
- ✅ SLA guarantees
- ✅ Custom integrations
- ✅ Advanced security

---

## Resources

- **Vercel Documentation**: [https://vercel.com/docs](https://vercel.com/docs)
- **Custom Domains Guide**: [https://vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)
- **DNS Configuration**: [https://vercel.com/docs/concepts/projects/domains/dns](https://vercel.com/docs/concepts/projects/domains/dns)
- **Environment Variables**: [https://vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)
- **Vercel Support**: [https://vercel.com/support](https://vercel.com/support)

---

## Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review Vercel deployment logs
3. Check DNS propagation status
4. Contact Vercel support (if on paid plan)
5. Check Vercel community forums

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**Deployment Status**: Production Ready ✅
