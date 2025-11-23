# Supabase API Keys Quick Reference

## TL;DR - What You Need to Know

### Current Status (November 2025)
- ✅ **New API keys available** since June 2025
- ⚠️ **Legacy JWT keys still work** until late 2026
- 🔄 **This app supports all 4 key types** automatically

### Recommended Setup (New Keys)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_key_here
```

### Alternative Setup (Legacy Keys - Still Works)

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Key Types at a Glance

| Key Type | Format | Use Case | Priority |
|----------|--------|----------|----------|
| **Secret** | `sb_secret_...` | Server-side, admin, keep-alive | 🥇 **Best** |
| **Service Role** | JWT `eyJ...` | Server-side, admin, keep-alive | 🥈 Good (legacy) |
| **Publishable** | `sb_publishable_...` | Client-side, mobile apps | 🥉 Works |
| **Anon** | JWT `eyJ...` | Client-side, mobile apps | 4️⃣ Works (legacy) |

## Quick Commands

### Test Keep-Alive
```powershell
npm run keep-alive
```

### Check Which Key Is Being Used
Look for this line in output:
```
🔑 Using secret (sb_secret_) key
```

## Do I Need to Do Anything?

### Right Now
**No.** Your legacy keys work fine until late 2026.

### Before November 2025
**Recommended.** Migrate to new keys for better security and features.

### Before Late 2026
**Required.** Legacy keys will stop working.

## Migration in 3 Steps

1. **Get new keys** from [Supabase Dashboard](https://supabase.com/dashboard/project/_/settings/api)
2. **Add to `.env.local`**: `SUPABASE_SECRET_KEY=sb_secret_...`
3. **Test**: Run `npm run keep-alive` and verify it works

That's it! The app automatically uses new keys if available.

## Where to Get Keys

### New Keys (Recommended)
1. [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project
3. **Settings** → **API** → **API Keys (New)**
4. Click **Generate New Keys** or **Opt In**
5. Copy `sb_secret_...` key

### Legacy Keys (Current)
1. [Supabase Dashboard](https://supabase.com/dashboard)
2. Select project
3. **Settings** → **API** → **API Keys (Legacy JWT)**
4. Copy `service_role` key (JWT format)

## Environment Variable Names

### For Keep-Alive (Pick One)

**New (Recommended):**
```env
SUPABASE_SECRET_KEY=sb_secret_...
```

**Legacy (Still Works):**
```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### Always Required
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
```

## Deployment Checklist

### Vercel
- [ ] Add `SUPABASE_SECRET_KEY` to environment variables
- [ ] Redeploy application
- [ ] Verify cron job uses new key (check logs)

### GitHub Actions
- [ ] Add `SUPABASE_SECRET_KEY` to repository secrets
- [ ] Run workflow manually to test
- [ ] Check logs confirm new key usage

### Local Development
- [ ] Add `SUPABASE_SECRET_KEY` to `.env.local`
- [ ] Run `npm run keep-alive` to test
- [ ] Confirm success message

## Troubleshooting One-Liners

### Keep-alive fails with "Missing Supabase key"
```powershell
# Check your .env.local has at least one key variable
```

### Want to see which key type is used?
```powershell
# Run: npm run keep-alive
# Look for: 🔑 Using [key_type] key
```

### New keys not working?
```powershell
# Verify key format:
# Secret: starts with sb_secret_
# Publishable: starts with sb_publishable_
```

### VS Code showing workflow warnings?
```
# Normal! Add secrets to GitHub, warnings disappear
```

## Key Benefits Comparison

### Why Upgrade to New Keys?

| Feature | Legacy JWT | New API Keys |
|---------|-----------|--------------|
| Rotation | Full restart needed | Zero downtime |
| Revocation | Regenerate all keys | Delete one key instantly |
| Multiple keys | No | Yes |
| Audit logs | No | Yes |
| Browser protection | No | Yes (secret keys) |
| Key format | Long JWT | Short, readable |

## More Information

- **Complete Guide**: See `docs/supabase-key-migration.md`
- **Environment Setup**: See `docs/environment-setup.md`
- **Official Discussion**: [GitHub #29260](https://github.com/orgs/supabase/discussions/29260)
- **Supabase Docs**: [API Keys](https://supabase.com/docs/guides/api/api-keys)

## Summary

✅ **You don't need to change anything immediately**  
✅ **Legacy keys work until late 2026**  
✅ **This app automatically supports all key types**  
✅ **Migration is simple: just add new key to .env**  
✅ **New keys offer better security and features**

**Recommended action**: Migrate to new keys when convenient for better security and zero-downtime rotation capability.
