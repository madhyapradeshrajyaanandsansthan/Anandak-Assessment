# Deployment Guide

This guide covers deploying the MP Assessment application to production.

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Supabase database table created
- [ ] Supabase RLS policies configured
- [ ] Google Sheets (if used) set up with service account access
- [ ] Application tested locally
- [ ] Firebase migrated to Supabase (if applicable)
- [ ] Dependencies updated to latest stable versions
- [ ] Build succeeds locally: `npm run build`

## Deployment Platforms

### Option 1: Vercel (Recommended)

Vercel is the recommended platform as it's created by the Next.js team and offers the best integration.

#### Setup Steps

1. **Install Vercel CLI** (optional)
   ```bash
   npm i -g vercel
   ```

2. **Connect GitHub Repository**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select the `MP-Assessment` repository

3. **Configure Build Settings**
   - Framework Preset: **Next.js**
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Set Environment Variables**
   
   In Vercel Dashboard → Project Settings → Environment Variables:
   
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Google Sheets (if used)
   GOOGLE_SERVICE_ACCOUNT_EMAIL=service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   GOOGLE_SHEET_ID=1abc...xyz
   GOOGLE_SHEET_NAME=Sheet1
   
   # Google AI
   GOOGLE_GENAI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX
   ```
   
   **Important**: 
   - Add these to Production, Preview, and Development environments
   - For `GOOGLE_PRIVATE_KEY`, paste the entire key including `\n` characters

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Visit your production URL

6. **Configure Custom Domain** (Optional)
   - Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

#### Vercel CLI Deployment

```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### Vercel Features

- ✅ Automatic HTTPS
- ✅ Edge functions (fast API routes)
- ✅ Automatic preview deployments for PRs
- ✅ Analytics and monitoring
- ✅ Easy rollbacks
- ✅ Zero-config deployment

---

### Option 2: Firebase App Hosting

The project includes `apphosting.yaml` for Firebase deployment.

#### Setup Steps

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase**
   ```bash
   firebase init apphosting
   ```

4. **Configure apphosting.yaml**
   
   Already configured in the project:
   ```yaml
   runConfig:
     minInstances: 0
     maxInstances: 4
     cpu: 1
     memoryMiB: 512
   env:
     - variable: NEXT_PUBLIC_SUPABASE_URL
     - variable: NEXT_PUBLIC_SUPABASE_ANON_KEY
     - variable: SUPABASE_SERVICE_ROLE_KEY
     - variable: GOOGLE_GENAI_API_KEY
     # Add more as needed
   ```

5. **Set Environment Variables**
   ```bash
   firebase apphosting:secrets:set SUPABASE_SERVICE_ROLE_KEY
   # Follow prompts for each secret
   ```

6. **Deploy**
   ```bash
   firebase deploy --only apphosting
   ```

---

### Option 3: Netlify

1. **Connect Repository**
   - Go to https://netlify.com
   - New site from Git
   - Select repository

2. **Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Framework: Next.js

3. **Environment Variables**
   - Site settings → Build & deploy → Environment
   - Add all variables from `.env`

4. **Deploy**
   - Click "Deploy site"

**Note**: Netlify requires the `@netlify/plugin-nextjs` plugin for full Next.js support.

---

### Option 4: Self-Hosted (VPS/Cloud)

For deploying to a VPS (DigitalOcean, AWS EC2, etc.):

#### Requirements

- Node.js 18+ installed
- PM2 or similar process manager
- Nginx (reverse proxy)
- SSL certificate (Let's Encrypt)

#### Setup Steps

1. **Clone repository on server**
   ```bash
   git clone https://github.com/ankits1802/MP-Assessment.git
   cd MP-Assessment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   # Create .env file
   nano .env
   # Paste all environment variables
   ```

4. **Build the application**
   ```bash
   npm run build
   ```

5. **Install PM2**
   ```bash
   npm install -g pm2
   ```

6. **Start with PM2**
   ```bash
   pm2 start npm --name "mp-assessment" -- start
   pm2 save
   pm2 startup
   ```

7. **Configure Nginx**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Enable SSL with Certbot**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

---

## Environment-Specific Configuration

### Production Optimizations

1. **Enable Analytics** (Vercel)
   ```bash
   npm install @vercel/analytics
   ```
   
   Already included in the project.

2. **Set NODE_ENV**
   ```env
   NODE_ENV=production
   ```

3. **Configure Caching**
   - Static assets are automatically cached by Next.js
   - API routes can use cache headers if needed

### Staging Environment

Create a separate branch for staging:

```bash
git checkout -b staging
# Make changes
git push origin staging
```

Deploy staging to a separate Vercel project or subdomain.

---

## Post-Deployment Tasks

### 1. Verify Deployment

- [ ] Visit production URL
- [ ] Submit a test assessment
- [ ] Check data in Supabase
- [ ] Verify certificate download works
- [ ] Test on mobile devices
- [ ] Check Google Sheets integration (if enabled)

### 2. Set Up Monitoring

#### Vercel Analytics
- Enabled by default
- View in Vercel Dashboard → Analytics

#### Supabase Logs
- Monitor database queries
- Set up alerts for errors

#### Error Tracking (Optional)
Consider adding:
- **Sentry** for error tracking
- **LogRocket** for session replay

### 3. Configure Backups

#### Supabase Backups
- Dashboard → Settings → Database → Backups
- Enable daily backups (included in paid plans)

#### Manual Backup
```sql
-- Export to CSV
COPY assessment_submissions TO '/path/to/backup.csv' CSV HEADER;
```

### 4. Set Up CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      # Add deployment step
```

---

## Rollback Procedures

### Vercel Rollback

1. Go to Vercel Dashboard → Deployments
2. Find the previous working deployment
3. Click "..." → "Promote to Production"

### Manual Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push --force origin main
```

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` files
- ✅ Use different keys for staging/production
- ✅ Rotate service account keys regularly
- ✅ Use secret managers for sensitive data

### Database Security

- ✅ Enable RLS in Supabase
- ✅ Use service role key only in API routes
- ✅ Never expose service role key to client

### API Security

- ✅ Implement rate limiting (if needed)
- ✅ Validate all inputs
- ✅ Use HTTPS only
- ✅ Set appropriate CORS headers

---

## Performance Optimization

### Next.js Optimizations

Already configured:
- Image optimization
- Automatic code splitting
- Static generation where possible

### Additional Optimizations

1. **Enable Turbopack** (for development)
   Already in `package.json`:
   ```json
   "dev": "next dev --turbopack"
   ```

2. **Optimize Images**
   - Use Next.js Image component
   - Serve WebP format

3. **Code Splitting**
   - Use dynamic imports for large components
   - Lazy load non-critical code

---

## Monitoring and Alerts

### Set Up Alerts

#### Supabase Webhooks
Configure webhooks for database events (if needed)

#### Vercel Alerts
- Enable deployment notifications
- Set up Slack/Discord integration

### Monitoring Checklist

- [ ] API response times
- [ ] Error rates
- [ ] Database query performance
- [ ] User traffic patterns
- [ ] Disk space (for self-hosted)

---

## Scaling Considerations

### Horizontal Scaling

Vercel automatically scales based on traffic.

For self-hosted:
- Use load balancer (Nginx/HAProxy)
- Deploy multiple instances
- Use Redis for session storage (if needed)

### Database Scaling

Supabase handles scaling automatically:
- Connection pooling
- Read replicas (paid plans)
- Automatic backups

---

## Troubleshooting Deployment Issues

### Build Failures

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Environment Variables Not Loading

- Verify variable names (exact match)
- Check for spaces in values
- Restart deployment after adding variables

### API Routes Failing

- Check API route logs in Vercel
- Verify environment variables are set
- Test locally with production build:
  ```bash
  npm run build
  npm start
  ```

### Database Connection Issues

- Verify Supabase URL is correct
- Check service role key
- Ensure RLS policies allow operations

---

## Support and Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production](https://supabase.com/docs/guides/platform/going-into-prod)
- [Firebase App Hosting](https://firebase.google.com/docs/app-hosting)

---

**Last Updated**: November 4, 2025  
**Version**: 1.0.0
