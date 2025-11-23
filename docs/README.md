# Documentation Index

Comprehensive documentation for the Multi-Parameter Assessment Application.

---

## 📚 Documentation Structure

This folder contains all technical documentation, guides, and references for the application.

### Quick Links

| Document | Purpose | Audience |
|----------|---------|----------|
| **[Supabase Setup](./supabase-setup.md)** | Database configuration guide | Developers, DevOps |
| **[Architecture](./architecture.md)** | System design and code structure | Developers, Architects |
| **[API Reference](./api-reference.md)** | API endpoints and integrations | Developers, Integration Teams |
| **[Vercel Deployment](./vercel-subdomain-setup.md)** | Deploy to production with custom domain | DevOps, Administrators |
| **[General Deployment](./deployment.md)** | All deployment options | DevOps |
| **[Blueprint](./blueprint.md)** | Original requirements and specifications | Product Managers, Stakeholders |

---

## 🚀 Getting Started

### For Developers

**New to the Project?**

1. Read **[Architecture](./architecture.md)** - Understand how the system works
2. Follow **[Supabase Setup](./supabase-setup.md)** - Set up your database
3. Check **[API Reference](./api-reference.md)** - Learn about available APIs
4. Review **[Blueprint](./blueprint.md)** - Understand requirements

**Starting Development?**

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm run dev
```

See **[Main README](../README.md)** for complete installation guide.

---

### For DevOps Engineers

**Deploying the Application?**

1. Read **[Vercel Deployment](./vercel-subdomain-setup.md)** - Deploy to Vercel with custom subdomain
2. Follow **[Supabase Setup](./supabase-setup.md)** - Create production database
3. Check **[Deployment Guide](./deployment.md)** - Explore all deployment options

**Managing Infrastructure?**

- Environment variables configuration
- Database backup strategies
- Monitoring and alerts
- SSL certificate management
- DNS configuration

All covered in the deployment guides.

---

### For Product Managers

**Understanding the Product?**

1. Read **[Blueprint](./blueprint.md)** - Original specifications
2. Check **[Architecture](./architecture.md#overview)** - Current implementation
3. Review **[Main README](../README.md#features)** - Feature list

**Planning Features?**

- See **[Architecture](./architecture.md#future-enhancements)** for planned features
- Check **[Main README](../README.md#roadmap)** for roadmap

---

## 📖 Documentation Guides

### [supabase-setup.md](./supabase-setup.md)

**Complete Supabase PostgreSQL Setup Guide**

**Contents**:
- Account creation and project setup
- Database schema creation
- Environment variable configuration
- Row Level Security (RLS) policies
- Testing connections
- Troubleshooting common issues
- Advanced queries and analytics

**Who Should Read**: Developers, DevOps Engineers

**Time to Complete**: 20-30 minutes

**Prerequisites**: Supabase account (free), basic SQL knowledge

---

### [architecture.md](./architecture.md)

**Technical Architecture & Code Documentation**

**Contents**:
- Technology stack overview
- Application structure and file organization
- Data flow diagrams
- Component hierarchy
- Database design and schema
- API architecture
- Frontend architecture
- State management patterns
- Security implementation
- Performance optimizations
- Scalability considerations

**Who Should Read**: Developers, Technical Architects

**Time to Read**: 45-60 minutes

**Prerequisites**: React, Next.js, TypeScript knowledge

---

### [api-reference.md](./api-reference.md)

**API Documentation & Integration Guide**

**Contents**:

**Internal API Routes**:
- `POST /api/log` - Submit assessment data
- `POST /api/transliterate` - Transliterate English to Hindi

**External APIs**:
- Google Transliterate API
- Supabase REST API
- Genkit AI (future)
- Vercel Analytics
- Vercel Speed Insights

**Additional Topics**:
- Request/response formats
- Type definitions
- Error handling strategies
- Rate limits and quotas
- Security best practices
- Testing guidelines

**Who Should Read**: Developers, Integration Teams, API Consumers

**Time to Read**: 30-40 minutes

**Prerequisites**: REST API knowledge, HTTP protocols

---

### [vercel-subdomain-setup.md](./vercel-subdomain-setup.md)

**Vercel Deployment & Custom Subdomain Guide**

**Contents**:
- Vercel account setup
- Git repository connection
- Environment variable configuration
- Production deployment steps
- Custom domain/subdomain setup
- DNS configuration (all major providers)
  - Namecheap
  - GoDaddy
  - Cloudflare
  - Google Domains
  - And more
- SSL certificate provisioning
- Troubleshooting deployment issues
- Post-deployment verification
- Performance optimization
- Security best practices

**Who Should Read**: DevOps Engineers, System Administrators

**Time to Complete**: 30-45 minutes (including DNS propagation)

**Prerequisites**: Domain name, DNS access, Vercel account

---

### [deployment.md](./deployment.md)

**General Deployment Options**

**Contents**:
- Overview of deployment platforms
- Vercel deployment (detailed)
- Self-hosted deployment
- Docker deployment (future)
- Environment-specific configurations
- CI/CD pipeline setup
- Monitoring and logging
- Backup strategies
- Rollback procedures

**Who Should Read**: DevOps Engineers, System Administrators

**Time to Read**: 20-30 minutes

**Prerequisites**: Basic DevOps knowledge

---

### [blueprint.md](./blueprint.md)

**Original Project Requirements & Specifications**

**Contents**:
- Project objectives and goals
- Functional requirements
- Non-functional requirements
- User stories and use cases
- Design specifications
- Technical constraints
- Success criteria
- Timeline and milestones

**Who Should Read**: Product Managers, Stakeholders, New Team Members

**Time to Read**: 15-20 minutes

**Prerequisites**: None

---

## 🛠 Technical References

### Technology Stack

Quick reference to all technologies used:

**Frontend**:
- Next.js 15.5.6 - React framework
- React 18.3.1 - UI library
- TypeScript 5.x - Type safety
- Tailwind CSS 3.4.1 - Styling
- shadcn/ui - Component library
- Radix UI - Primitives
- React Hook Form - Form management
- Zod - Validation

**Backend**:
- Supabase 2.78.0 - PostgreSQL + API
- Next.js API Routes - Serverless functions

**APIs**:
- Google Transliterate - Hindi conversion
- Vercel Analytics - Monitoring
- Genkit AI - AI/ML (future)

See **[Architecture](./architecture.md#technology-stack)** for complete list.

---

### Database Schema

**Table**: `assessment_submissions`

**Key Columns**:
- Personal info: name, age, gender, state, district
- Scores: 6 trait scores + total score
- Data: JSONB fields for full data + feedback
- Timestamps: created_at (auto)

**View**: `assessment_analytics` - Aggregated statistics

See **[Supabase Setup](./supabase-setup.md#database-schema)** for complete schema.

---

### API Endpoints

**Internal**:
- `POST /api/log` - Save assessment
- `POST /api/transliterate` - Convert to Hindi

**External**:
- Google Transliterate API
- Supabase REST API

See **[API Reference](./api-reference.md)** for complete documentation.

---

## 📝 Code Examples

### Save Assessment Submission

```typescript
const response = await fetch('/api/log', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: "John Doe",
    name_hi: "जॉन डो",
    age: 25,
    gender: "Male",
    mobile: "9876543210",
    state: "Maharashtra",
    district: "Mumbai",
    assessmentData: [...],
    totalScore: 15,
    finalAssessmentText: "...",
    date: new Date().toISOString()
  })
});
```

### Transliterate Name

```typescript
const response = await fetch('/api/transliterate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ text: "Ramesh Kumar" })
});
const { transliteratedText } = await response.json();
// Output: "रमेश कुमार"
```

### Query Supabase

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const { data, error } = await supabase
  .from('assessment_submissions')
  .select('*')
  .eq('state', 'Maharashtra')
  .order('created_at', { ascending: false })
  .limit(10);
```

More examples in **[API Reference](./api-reference.md)** and **[Architecture](./architecture.md)**.

---

## 🔧 Configuration Files

### Environment Variables

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional
GOOGLE_AI_API_KEY=your-google-ai-key
```

See **[Supabase Setup](./supabase-setup.md#environment-configuration)** for details.

---

### TypeScript Config

`tsconfig.json` - TypeScript compiler options

**Key Settings**:
- Strict mode enabled
- Path aliases (`@/` → `src/`)
- React JSX transform

---

### Tailwind Config

`tailwind.config.ts` - Tailwind CSS configuration

**Customizations**:
- Extended colors
- Custom animations
- shadcn/ui theme variables

---

### Next.js Config

`next.config.ts` - Next.js framework configuration

**Features**:
- Turbopack in dev mode
- Image optimization
- Security headers

---

## 🐛 Troubleshooting

### Common Issues

#### "Failed to submit assessment"

**Causes**: Database connection, missing credentials, table not created

**Solutions**:
1. Check `.env` file has correct Supabase credentials
2. Verify table exists in Supabase (run SQL schema)
3. Use **service_role** key, not anon key
4. Check browser console for errors

See **[Supabase Setup](./supabase-setup.md#troubleshooting)** for more.

---

#### "Invalid API key" Error

**Causes**: Wrong Supabase key or malformed JWT

**Solutions**:
1. Verify using `SUPABASE_SERVICE_ROLE_KEY`
2. Check JWT at [jwt.io](https://jwt.io)
3. Ensure `"role": "service_role"` in token
4. Regenerate key if necessary

See **[Supabase Setup](./supabase-setup.md#troubleshooting)** for details.

---

#### Build Errors

**Solutions**:
1. Run `npm run typecheck` to find type errors
2. Clear `.next` folder: `rm -rf .next`
3. Reinstall dependencies: `npm install`
4. Check Next.js and React versions

---

#### DNS Not Propagating

**Causes**: High TTL, DNS provider caching

**Solutions**:
1. Wait (up to 48 hours, usually 5-30 min)
2. Check with [dnschecker.org](https://dnschecker.org)
3. Lower TTL to 1-5 minutes
4. Verify CNAME record is correct

See **[Vercel Deployment](./vercel-subdomain-setup.md#troubleshooting)** for more.

---

## 📚 Additional Resources

### External Documentation

- **Next.js Docs**: [https://nextjs.org/docs](https://nextjs.org/docs)
- **React Docs**: [https://react.dev](https://react.dev)
- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Tailwind CSS**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- **shadcn/ui**: [https://ui.shadcn.com](https://ui.shadcn.com)
- **Radix UI**: [https://www.radix-ui.com](https://www.radix-ui.com)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)
- **TypeScript**: [https://www.typescriptlang.org/docs](https://www.typescriptlang.org/docs)

---

### Video Tutorials

**Recommended Learning**:
- Next.js 15 App Router
- Supabase PostgreSQL
- React Hook Form with TypeScript
- Tailwind CSS best practices
- Vercel deployment

---

### Community

- **GitHub Discussions**: Ask questions, share ideas
- **Stack Overflow**: Tag `mp-assessment`
- **Discord** (future): Community server

---

## 🤝 Contributing to Documentation

Help improve our documentation:

1. **Found an Error?**
   - Open an issue on GitHub
   - Tag with "documentation" label

2. **Want to Add Content?**
   - Fork the repository
   - Edit documentation files
   - Submit a pull request

3. **Suggest Improvements**
   - Open a discussion
   - Share your ideas

---

## 📊 Documentation Metrics

**Total Documents**: 6 comprehensive guides  
**Total Pages**: ~100+ pages of documentation  
**Last Updated**: November 4, 2025  
**Status**: ✅ Complete and up-to-date

---

## 🗺️ Documentation Roadmap

### Planned Additions

- [ ] Video tutorials
- [ ] Interactive examples
- [ ] FAQ section
- [ ] Troubleshooting flowcharts
- [ ] Code snippets library
- [ ] Best practices guide
- [ ] Performance tuning guide
- [ ] Security audit guide

---

## 📞 Support

Need help?

1. **Check Documentation**: Browse guides above
2. **Search Issues**: Check GitHub issues
3. **Ask Community**: GitHub Discussions
4. **Contact Team**: Email or Discord

---

## ✨ Credits

Documentation maintained by the IIT Kharagpur & Anandak Foundation Development Team.

**Contributors**:
- Technical writers
- Developers
- DevOps engineers
- Product managers

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**Status**: Complete ✅
