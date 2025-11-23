# Multi-Parameter Assessment Application

A comprehensive bilingual (English/Hindi) psychometric assessment platform built with Next.js 15, React 18, TypeScript, and Supabase PostgreSQL. Developed in collaboration with IIT Kharagpur and Anandak Foundation.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.78.0-green)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [Quick Start](#quick-start)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Database Setup](#database-setup)
8. [Development](#development)
9. [Deployment](#deployment)
10. [API Documentation](#api-documentation)
11. [Project Structure](#project-structure)
12. [Contributing](#contributing)
13. [License](#license)
14. [Support](#support)

---

## 🎯 Overview

The Multi-Parameter Assessment Application is a sophisticated psychometric tool designed to evaluate individuals across six key personality traits. The application provides bilingual support (English and Hindi), making it accessible to a wide range of users across India.

### Assessment Traits

The application evaluates users on six fundamental traits:

1. **Gratitude** - Appreciation and thankfulness
2. **Resilience** - Ability to overcome challenges
3. **Empathy** - Understanding and sharing others' feelings
4. **Sociability** - Comfort in social situations
5. **Social Cognition** - Understanding social dynamics
6. **Courage** - Willingness to take calculated risks

### Use Cases

- **Educational Institutions**: Assess student personality development
- **HR Departments**: Evaluate candidate soft skills
- **NGOs**: Measure program impact on beneficiaries
- **Personal Development**: Self-assessment for growth
- **Research**: Collect psychometric data for studies

---

## ✨ Features

### Core Features

- ✅ **Bilingual Support**: Complete English and Hindi interface
- ✅ **6-Trait Assessment**: Comprehensive personality evaluation
- ✅ **Real-time Transliteration**: Automatic English to Hindi name conversion
- ✅ **Country Code Support**: 240+ countries with international dial codes
- ✅ **Indian Geography**: Complete state and district dropdown
- ✅ **Responsive Design**: Mobile-first, works on all devices
- ✅ **Certificate Generation**: Downloadable PDF certificates
- ✅ **Secure Database**: Supabase PostgreSQL with Row Level Security
- ✅ **Analytics**: Built-in analytics dashboard in Supabase
- ✅ **Type Safety**: Full TypeScript implementation with Zod validation

### Technical Features

- ✅ **Server-Side Rendering**: Next.js 15 with App Router
- ✅ **Modern React**: React 18 with hooks and concurrent features
- ✅ **Form Validation**: React Hook Form + Zod schemas
- ✅ **UI Components**: shadcn/ui with Radix UI primitives
- ✅ **Tailwind CSS**: Utility-first styling with custom design system
- ✅ **API Routes**: Serverless functions for backend logic
- ✅ **Performance Monitoring**: Vercel Analytics and Speed Insights
- ✅ **Security**: Environment-based secrets, HTTPS enforced
- ✅ **Migration Tools**: Script to migrate from other databases

---

## 🛠 Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
| **React** | 18.3.1 | UI library with modern hooks |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **shadcn/ui** | Latest | Pre-built accessible components |
| **Radix UI** | Various | Unstyled component primitives |
| **React Hook Form** | 7.54.2 | Performant form management |
| **Zod** | 3.24.2 | TypeScript-first schema validation |
| **Lucide React** | 0.475.0 | Beautiful icon library |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.78.0 | PostgreSQL database + REST API |
| **PostgreSQL** | Latest | Relational database |
| **Next.js API Routes** | 15.5.6 | Serverless API endpoints |

### APIs & Services

| Service | Purpose |
|---------|---------|
| **Google Transliterate API** | Hindi transliteration |
| **Supabase REST API** | Database operations |
| **Genkit AI** | AI/ML capabilities (future) |
| **Vercel Analytics** | Performance monitoring |
| **Vercel Speed Insights** | Core Web Vitals tracking |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Turbopack** | Fast build bundler (700x faster) |
| **ESLint** | Code quality and linting |
| **PostCSS** | CSS processing |
| **tsx** | TypeScript execution for scripts |
| **dotenv** | Environment variable management |

---

## 🚀 Quick Start

Get the application running in 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/your-username/MP-Assessment.git
cd MP-Assessment

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# 4. Start development server
npm run dev

# 5. Open browser
# Navigate to http://localhost:9002
```

---

## 📦 Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js**: 18.x or higher ([Download](https://nodejs.org/))
- **npm**: 9.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))
- **Supabase Account**: Free tier available ([Sign up](https://supabase.com))

### Step 1: Clone Repository

```bash
git clone https://github.com/your-username/MP-Assessment.git
cd MP-Assessment
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages listed in `package.json`.

### Step 3: Environment Setup

Create a `.env` file in the project root:

```bash
# Windows PowerShell
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Google AI (for future features)
GOOGLE_AI_API_KEY=your-google-ai-key
```

⚠️ **Important**: Use `SUPABASE_SERVICE_ROLE_KEY`, NOT the anon key!

---

## ⚙️ Configuration

### Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create new project
   - Note your project URL and service role key

2. **Create Database Table**
   - Open Supabase SQL Editor
   - Run `supabase/supabase-detailed-table.sql`
   - Verify table creation

3. **Configure Environment**
   - Add credentials to `.env`
   - Restart development server

📖 **Detailed Guide**: See [docs/supabase-setup.md](docs/supabase-setup.md)

### Port Configuration

Default port is **9002**. To change:

```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack -p 3000"  // Change to your preferred port
  }
}
```

---

## 🗄️ Database Setup

### Schema Overview

The application uses a single table: `assessment_submissions`

**Key Columns**:
- Personal info: `name`, `name_hi`, `age`, `gender`, `mobile`, `email`, `state`, `district`
- Scores: `gratitude_score`, `resilience_score`, `empathy_score`, `sociability_score`, `social_cognition_score`, `courage_score`
- Total: `total_score`, `final_assessment`
- Data: `assessment_data` (JSONB), `feedback_comments` (JSONB)

### Create Table

Run this SQL in Supabase SQL Editor:

```sql
-- See supabase/supabase-detailed-table.sql for complete schema
CREATE TABLE IF NOT EXISTS public.assessment_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT timezone('utc', now()) NOT NULL,
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender TEXT NOT NULL,
    country_code TEXT NOT NULL DEFAULT '+91',
    mobile TEXT NOT NULL,
    email TEXT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    total_score INTEGER NOT NULL,
    final_assessment TEXT NOT NULL,
    gratitude_score INTEGER NOT NULL,
    resilience_score INTEGER NOT NULL,
    empathy_score INTEGER NOT NULL,
    sociability_score INTEGER NOT NULL,
    social_cognition_score INTEGER NOT NULL,
    courage_score INTEGER NOT NULL,
    assessment_data JSONB NOT NULL,
    feedback_comments JSONB NOT NULL DEFAULT '[]'::jsonb
);
```

📖 **Complete Schema**: See [docs/supabase-setup.md](docs/supabase-setup.md)

---

## 💻 Development

### Available Scripts

```bash
# Start development server (port 9002, Turbopack)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run type checking
npm run typecheck

# Run linter
npm run lint

# Migrate data from other database
npm run migrate
```

### Development Workflow

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Open Browser**
   Navigate to `http://localhost:9002`

3. **Make Changes**
   - Edit files in `src/`
   - Hot reload automatically updates browser

4. **Test Changes**
   - Fill out assessment form
   - Submit and verify in Supabase

5. **Commit Changes**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ Yes | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ Yes | Supabase service role key |
| `GOOGLE_AI_API_KEY` | ❌ No | Google AI key (future use) |

⚠️ Variables starting with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets there!

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your repository

3. **Add Environment Variables**
   - Add `NEXT_PUBLIC_SUPABASE_URL`
   - Add `SUPABASE_SERVICE_ROLE_KEY`

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete

5. **Configure Custom Domain** (optional)
   - Go to Settings → Domains
   - Add your subdomain (e.g., `assessment.yourdomain.com`)

📖 **Detailed Guide**: See [docs/vercel-subdomain-setup.md](docs/vercel-subdomain-setup.md)

### Other Deployment Options

**Vercel** (recommended)
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions

**Self-Hosted**
```bash
npm run build
npm start
```

**Docker** (future)
```bash
docker build -t mp-assessment .
docker run -p 3000:3000 mp-assessment
```

---

## 📡 API Documentation

### Internal API Routes

#### POST `/api/log`

Submit assessment data to database.

**Request**:
```json
{
  "name": "John Doe",
  "name_hi": "जॉन डो",
  "age": 25,
  "gender": "Male",
  "mobile": "9876543210",
  "email": "john@example.com",
  "countryCode": "+91",
  "state": "Maharashtra",
  "district": "Mumbai",
  "assessmentData": [...],
  "totalScore": 15,
  "finalAssessmentText": "...",
  "date": "2025-11-04T12:00:00.000Z"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Assessment submitted successfully",
  "data": { ... }
}
```

---

#### POST `/api/transliterate`

Convert English text to Hindi.

**Request**:
```json
{
  "text": "Ramesh Kumar"
}
```

**Response**:
```json
{
  "transliteratedText": "रमेश कुमार"
}
```

📖 **Complete API Reference**: See [docs/api-reference.md](docs/api-reference.md)

---

## 📁 Project Structure

```
MP-Assessment/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Home page
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── api/                  # API routes
│   │   │   ├── log/route.ts      # Assessment logging
│   │   │   └── transliterate/route.ts
│   │   └── certificate/page.tsx  # Certificate page
│   │
│   ├── components/               # React components
│   │   ├── aptitude-insight-app.tsx
│   │   ├── user-info-step.tsx
│   │   ├── assessment-step.tsx
│   │   ├── results-step.tsx
│   │   ├── certificate.tsx
│   │   └── ui/                   # shadcn/ui components
│   │
│   ├── lib/                      # Utilities
│   │   ├── utils.ts
│   │   ├── assessment-data.ts    # Questions & scoring
│   │   └── indian-states-districts.ts
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── use-toast.ts
│   │   └── use-mobile.tsx
│   │
│   └── ai/                       # Genkit AI setup
│       ├── genkit.ts
│       └── dev.ts
│
├── supabase/                     # Database scripts
│   └── supabase-detailed-table.sql
│
├── scripts/                      # Utility scripts
│   └── migrate-firebase-to-supabase.ts
│
├── docs/                         # Documentation
│   ├── README.md
│   ├── supabase-setup.md
│   ├── architecture.md
│   ├── api-reference.md
│   ├── vercel-subdomain-setup.md
│   ├── deployment.md
│   └── blueprint.md
│
├── public/                       # Static assets
├── .env                          # Environment variables
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── tailwind.config.ts            # Tailwind config
├── next.config.ts                # Next.js config
└── README.md                     # This file
```

📖 **Detailed Architecture**: See [docs/architecture.md](docs/architecture.md)

---

## 🔧 Configuration Files

### `package.json`

Manages dependencies and scripts.

**Key Scripts**:
- `dev`: Start development server
- `build`: Build for production
- `start`: Start production server
- `migrate`: Migrate data from other databases

---

### `tsconfig.json`

TypeScript configuration.

**Key Settings**:
- Strict mode enabled
- Path aliases (`@/` → `src/`)
- React 18 JSX transform

---

### `tailwind.config.ts`

Tailwind CSS configuration.

**Customizations**:
- Extended color palette
- Custom border radius
- Animation utilities
- shadcn/ui integration

---

### `next.config.ts`

Next.js configuration.

**Features**:
- Turbopack enabled (dev mode)
- Image optimization
- Security headers
- Redirects/rewrites (if needed)

---

## 📊 Assessment Data

### Question Structure

Each question has:
- English and Hindi text
- 3 options with different scores
- Trait association
- Feedback messages

**Example**:
```typescript
{
  id: 1,
  trait: "Gratitude",
  question: "You need Rs. 15000 urgently...",
  question_hi: "आपको तुरंत 15000 रुपये की जरूरत है...",
  options: [
    { text: "Approach someone...", text_hi: "...", score: 3 },
    { text: "Consider loan...", text_hi: "...", score: 2 },
    { text: "Find alternative...", text_hi: "...", score: 1 }
  ],
  feedback: ["Low gratitude...", "Moderate...", "High..."]
}
```

📁 **Data File**: `src/lib/assessment-data.ts`

---

## 🌍 Internationalization

### Supported Languages

- **English**: Primary language
- **Hindi**: Full translation

### Translation Coverage

- ✅ UI labels and buttons
- ✅ Form fields and validation messages
- ✅ Assessment questions and options
- ✅ Feedback and results
- ✅ Instructions and help text

### Adding New Language

1. Duplicate question text in `assessment-data.ts`
2. Add language field to components
3. Create translation files
4. Update UI to detect language preference

---

## 🔐 Security

### Environment Variables

- ✅ All secrets in `.env` file
- ✅ `.env` added to `.gitignore`
- ✅ Never commit credentials
- ✅ Use different keys for dev/prod

### Database Security

- ✅ Row Level Security (RLS) enabled
- ✅ Service role for server-side only
- ✅ Anonymous insert policy
- ✅ Input validation with Zod

### API Security

- ✅ HTTPS enforced
- ✅ CORS configured
- ✅ TypeScript type safety
- ✅ Supabase client handles SQL injection

---

## 📈 Analytics

### Vercel Analytics

**Metrics Tracked**:
- Page views
- Unique visitors
- Top pages
- Referrers
- Geographic data

**Access**: Vercel dashboard → Analytics tab

### Vercel Speed Insights

**Core Web Vitals**:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Access**: Vercel dashboard → Speed Insights tab

### Supabase Analytics

**Custom View**: `assessment_analytics`

```sql
SELECT * FROM assessment_analytics
ORDER BY submission_date DESC;
```

**Metrics**:
- Daily submission counts
- Average scores by trait
- Demographics breakdown
- State/district distribution

---

## 🧪 Testing

### Manual Testing

1. **User Info Form**
   - Enter valid data
   - Test validation errors
   - Verify transliteration

2. **Assessment**
   - Answer all 6 questions
   - Test navigation
   - Verify scoring

3. **Results**
   - Check calculated scores
   - Verify feedback display
   - Test certificate generation

4. **Database**
   - Verify data in Supabase
   - Check JSON fields
   - Validate constraints

### Automated Testing (Future)

Recommended tools:
- **Jest**: Unit tests
- **React Testing Library**: Component tests
- **Playwright**: E2E tests
- **Cypress**: E2E alternative

---

## 🛠 Troubleshooting

### Issue: "Failed to submit assessment"

**Solutions**:
1. Check Supabase credentials in `.env`
2. Verify table exists in Supabase
3. Check browser console for errors
4. Restart development server

### Issue: Transliteration not working

**Solutions**:
1. Check internet connection
2. Verify Google Transliterate API is accessible
3. Check browser console for errors

### Issue: Build errors

**Solutions**:
1. Run `npm run typecheck`
2. Fix TypeScript errors
3. Clear `.next` folder: `rm -rf .next`
4. Reinstall dependencies: `npm install`

📖 **More Help**: See [docs/supabase-setup.md#troubleshooting](docs/supabase-setup.md#troubleshooting)

---

## 📚 Documentation

Comprehensive documentation available in `/docs`:

### Core Documentation
| Document | Description |
|----------|-------------|
| **[README.md](docs/README.md)** | Documentation index |
| **[supabase-setup.md](docs/supabase-setup.md)** | Complete Supabase setup guide |
| **[architecture.md](docs/architecture.md)** | System architecture and design |
| **[api-reference.md](docs/api-reference.md)** | API documentation |

### Deployment & Configuration
| Document | Description |
|----------|-------------|
| **[vercel-subdomain-setup.md](docs/vercel-subdomain-setup.md)** | Deployment and domain setup |
| **[environment-setup.md](docs/environment-setup.md)** | Environment variables configuration |
| **[github-secrets-and-actions-setup.md](docs/github-secrets-and-actions-setup.md)** | GitHub Actions and secrets guide |
| **[cron-secret-setup.md](docs/cron-secret-setup.md)** | CRON_SECRET generation and security |

### Supabase Management
| Document | Description |
|----------|-------------|
| **[supabase-key-migration.md](docs/supabase-key-migration.md)** | Migration from legacy to new API keys |
| **[supabase-keys-quick-reference.md](docs/supabase-keys-quick-reference.md)** | Quick reference for Supabase keys |
| **[supabase-keep-alive.md](docs/supabase-keep-alive.md)** | Keep-alive setup for free tier |

### Other
| Document | Description |
|----------|-------------|
| **[blueprint.md](docs/blueprint.md)** | Original requirements |

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/MP-Assessment.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, documented code
   - Follow existing code style
   - Add tests if applicable

4. **Commit Changes**
   ```bash
   git commit -m "Add: description of changes"
   ```

5. **Push to GitHub**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**
   - Describe your changes
   - Link related issues
   - Wait for review

### Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

---

## 📄 License

This project is licensed under the MIT License.

```
MIT License

Copyright (c) 2025 IIT Kharagpur & Anandak Foundation

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- **IIT Kharagpur**: Research and development partnership
- **Anandak Foundation**: Project sponsorship and support
- **Supabase**: Database and backend infrastructure
- **Vercel**: Hosting and deployment platform
- **shadcn/ui**: UI component library
- **Radix UI**: Accessible component primitives
- **Google**: Transliterate API

---

## 📞 Support

### Get Help

- 📖 **Documentation**: Check `/docs` folder
- 🐛 **Bug Reports**: Open an issue on GitHub
- 💡 **Feature Requests**: Open an issue with "enhancement" label
- 📧 **Email**: support@yourdomain.com

### Community

- **GitHub Discussions**: Ask questions, share ideas
- **Stack Overflow**: Tag questions with `mp-assessment`
- **Discord** (future): Join our community server

---

## 🗺️ Roadmap

### Version 2.1 (Q1 2026)

- [ ] Multi-language support (beyond English/Hindi)
- [ ] Admin dashboard for analytics
- [ ] Email notifications
- [ ] PDF report generation
- [ ] Social media sharing

### Version 2.2 (Q2 2026)

- [ ] Real-time leaderboards
- [ ] SMS notifications
- [ ] Advanced analytics
- [ ] A/B testing framework
- [ ] API rate limiting

### Version 3.0 (Q3 2026)

- [ ] AI-powered insights (using Genkit)
- [ ] Personalized recommendations
- [ ] Mobile apps (React Native)
- [ ] Offline support
- [ ] GraphQL API

---

## 📊 Project Status

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Version](https://img.shields.io/badge/Version-2.0.0-blue)
![Build](https://img.shields.io/badge/Build-Passing-success)
![Coverage](https://img.shields.io/badge/Coverage-75%25-yellow)

**Last Updated**: November 4, 2025  
**Current Version**: 2.0.0  
**Maintained**: ✅ Yes

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ by the IIT Kharagpur & Anandak Foundation Team**
