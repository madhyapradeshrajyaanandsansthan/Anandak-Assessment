# System Architecture

Complete technical documentation of the Multi-Parameter Assessment application architecture.

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Application Structure](#application-structure)
4. [Data Flow](#data-flow)
5. [Component Architecture](#component-architecture)
6. [Database Design](#database-design)
7. [API Architecture](#api-architecture)
8. [Frontend Architecture](#frontend-architecture)
9. [State Management](#state-management)
10. [Security](#security)

---

## Overview

The Multi-Parameter Assessment application is a bilingual (English/Hindi) psychometric assessment tool built with Next.js 15, React 18, TypeScript, and Supabase PostgreSQL.

### Key Features

- **Bilingual Support**: English and Hindi throughout the application
- **6 Trait Assessment**: Gratitude, Resilience, Empathy, Sociability, Social Cognition, Courage
- **Real-time Transliteration**: Convert names to Hindi using Google Transliterate API
- **Responsive Design**: Mobile-first responsive UI using Tailwind CSS
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Server-side Database**: Supabase PostgreSQL with Row Level Security
- **Country Code Support**: 240+ countries with dial codes
- **Certificate Generation**: PDF certificate with IIT Kharagpur and Anandak logos
- **Analytics**: Built-in analytics view in Supabase

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 15.5.6 | React framework with App Router |
| **React** | 18.3.1 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS framework |
| **Radix UI** | Various | Accessible component primitives |
| **shadcn/ui** | Latest | Pre-built component library |
| **React Hook Form** | 7.54.2 | Form state management |
| **Zod** | 3.24.2 | Schema validation |
| **Lucide React** | 0.475.0 | Icon library |

### Backend & Database

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.78.0 | PostgreSQL database + API |
| **PostgreSQL** | Latest | Relational database |
| **Next.js API Routes** | 15.5.6 | Serverless API endpoints |

### APIs & Services

| Service | Purpose |
|---------|---------|
| **Google Transliterate API** | Hindi transliteration |
| **Genkit AI** | AI/ML capabilities (future use) |
| **Vercel Analytics** | Performance monitoring |
| **Vercel Speed Insights** | Core Web Vitals tracking |

### Development Tools

| Tool | Purpose |
|------|---------|
| **Turbopack** | Fast build bundler |
| **ESLint** | Code linting |
| **PostCSS** | CSS processing |
| **tsx** | TypeScript execution |
| **dotenv** | Environment variables |

---

## Application Structure

```
MP-Assessment/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (fonts, providers)
│   │   ├── page.tsx                  # Home page (main app)
│   │   ├── globals.css               # Global styles
│   │   ├── api/                      # API routes
│   │   │   ├── log/                  # Assessment logging
│   │   │   │   └── route.ts          # POST /api/log
│   │   │   └── transliterate/        # Name transliteration
│   │   │       └── route.ts          # POST /api/transliterate
│   │   └── certificate/              # Certificate page
│   │       └── page.tsx              # Certificate display
│   │
│   ├── components/                   # React components
│   │   ├── aptitude-insight-app.tsx  # Main app component
│   │   ├── user-info-step.tsx        # Step 1: User info form
│   │   ├── assessment-step.tsx       # Step 2: Assessment questions
│   │   ├── results-step.tsx          # Step 3: Results & feedback
│   │   ├── certificate.tsx           # Certificate component
│   │   ├── anandak-logo.tsx          # Anandak logo SVG
│   │   ├── iit-kgp-logo.tsx          # IIT KGP logo SVG
│   │   └── ui/                       # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── select.tsx
│   │       ├── progress.tsx
│   │       ├── alert.tsx
│   │       └── ... (30+ components)
│   │
│   ├── lib/                          # Utilities and data
│   │   ├── utils.ts                  # Helper functions
│   │   ├── assessment-data.ts        # Questions & scoring
│   │   └── indian-states-districts.ts # Location data
│   │
│   ├── hooks/                        # Custom React hooks
│   │   ├── use-toast.ts              # Toast notifications
│   │   └── use-mobile.tsx            # Mobile detection
│   │
│   └── ai/                           # AI/Genkit setup
│       ├── genkit.ts                 # Genkit configuration
│       └── dev.ts                    # Development server
│
├── supabase/                         # Database scripts
│   └── supabase-detailed-table.sql   # Table schema
│
├── scripts/                          # Utility scripts
│   └── migrate-firebase-to-supabase.ts # Migration script
│
├── docs/                             # Documentation
│   ├── README.md                     # Docs index
│   ├── supabase-setup.md             # Database setup
│   ├── architecture.md               # This file
│   ├── api-reference.md              # API documentation
│   ├── deployment.md                 # Deployment guide
│   ├── blueprint.md                  # Original requirements
│   └── vercel-subdomain-setup.md     # Subdomain guide
│
├── public/                           # Static assets
│
├── .env                              # Environment variables
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── next.config.ts                    # Next.js config
├── postcss.config.mjs                # PostCSS config
└── components.json                   # shadcn/ui config
```

---

## Data Flow

### Complete User Journey

```
┌─────────────────┐
│   User Visits   │
│   Application   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Step 1: User Info      │
│  - Name (auto-Hindi)    │
│  - Age, Gender, Mobile  │
│  - State, District      │
│  - Country Code         │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Step 2: Instructions   │
│  - Bilingual guidelines │
│  - Click "Begin"        │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Step 2: Assessment     │
│  - 6 questions          │
│  - 3 options each       │
│  - Scoring (1-3 each)   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Calculate Scores       │
│  - Sum trait scores     │
│  - Total score (6-18)   │
│  - Generate feedback    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Step 3: Results        │
│  - Display scores       │
│  - Show feedback        │
│  - Certificate link     │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Submit to API          │
│  POST /api/log          │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Save to Supabase       │
│  - Personal info        │
│  - Trait scores         │
│  - Feedback comments    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Show Certificate       │
│  - View/Download PDF    │
└─────────────────────────┘
```

### Data Transformation Flow

```
Frontend Data (React State)
         │
         ▼
┌─────────────────────────────────────┐
│  assessmentData: Array<{            │
│    id: number,                      │
│    trait: string,                   │
│    score: number,                   │
│    feedback: string                 │
│  }>                                 │
└────────┬────────────────────────────┘
         │
         ▼ (API Route)
┌─────────────────────────────────────┐
│  Extract Individual Scores:         │
│  - gratitude_score                  │
│  - resilience_score                 │
│  - empathy_score                    │
│  - sociability_score                │
│  - social_cognition_score           │
│  - courage_score                    │
│                                     │
│  Extract Feedback:                  │
│  - feedback_comments: JSONB Array   │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Supabase Insert:                   │
│  {                                  │
│    name, name_hi, age, gender,      │
│    mobile, email, country_code,     │
│    state, district,                 │
│    total_score, final_assessment,   │
│    gratitude_score, ...,            │
│    assessment_data: JSONB,          │
│    feedback_comments: JSONB         │
│  }                                  │
└─────────────────────────────────────┘
```

---

## Component Architecture

### Component Hierarchy

```
App (page.tsx)
└── AptitudeInsightApp
    ├── Card (UI wrapper)
    │   ├── CardHeader
    │   │   └── Progress bar
    │   │
    │   └── CardContent
    │       │
    │       ├── UserInfoStep (step === 1)
    │       │   ├── Form (react-hook-form)
    │       │   ├── Input components
    │       │   ├── Select (country code)
    │       │   ├── Select (state)
    │       │   └── Select (district)
    │       │
    │       ├── AssessmentStep (step === 2)
    │       │   ├── Instructions screen
    │       │   └── Question cards
    │       │       ├── RadioGroup (options)
    │       │       └── Navigation buttons
    │       │
    │       └── ResultsStep (step === 3)
    │           ├── Score display
    │           ├── Feedback cards
    │           ├── Certificate button
    │           └── Restart button
    │
    └── Toaster (notifications)
```

### Component Responsibilities

#### **AptitudeInsightApp** (`aptitude-insight-app.tsx`)
- **Purpose**: Main container component
- **State Management**: Multi-step form state
- **Responsibilities**:
  - Step navigation
  - Data aggregation
  - Global state management
  - Coordinating child components

#### **UserInfoStep** (`user-info-step.tsx`)
- **Purpose**: Collect user information
- **Form Validation**: Zod schema
- **Features**:
  - Auto-transliteration (name → Hindi)
  - Country code selector (240+ countries)
  - State/District cascading dropdowns
  - Age validation (1-120)
  - Mobile validation
  - Email validation (optional)
- **API Calls**: POST `/api/transliterate`

#### **AssessmentStep** (`assessment-step.tsx`)
- **Purpose**: Display questions and collect answers
- **Features**:
  - Bilingual instructions
  - 6 questions (bilingual)
  - 3 options per question
  - Enforced answer validation
  - Question navigation
  - Progress tracking
- **Data Source**: `lib/assessment-data.ts`

#### **ResultsStep** (`results-step.tsx`)
- **Purpose**: Display results and submit data
- **Features**:
  - Calculate trait scores
  - Display feedback for each trait
  - Overall assessment
  - Certificate generation
  - Data submission to API
- **API Calls**: POST `/api/log`
- **Side Effects**: Submit to Supabase on mount

---

## Database Design

### Table: `assessment_submissions`

#### Schema

```sql
CREATE TABLE public.assessment_submissions (
    -- Primary Key & Timestamp
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    
    -- Personal Information
    name TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 120),
    gender TEXT NOT NULL,
    country_code TEXT NOT NULL DEFAULT '+91',
    mobile TEXT NOT NULL,
    email TEXT,
    state TEXT NOT NULL,
    district TEXT NOT NULL,
    
    -- Scores
    total_score INTEGER NOT NULL CHECK (total_score >= 0),
    final_assessment TEXT NOT NULL,
    
    -- Individual Trait Scores
    gratitude_score INTEGER NOT NULL,
    resilience_score INTEGER NOT NULL,
    empathy_score INTEGER NOT NULL,
    sociability_score INTEGER NOT NULL,
    social_cognition_score INTEGER NOT NULL,
    courage_score INTEGER NOT NULL,
    
    -- JSON Data
    assessment_data JSONB NOT NULL,
    feedback_comments JSONB NOT NULL DEFAULT '[]'::jsonb
);
```

#### Indexes

1. **created_at** (DESC): Fast date queries
2. **state**: Filter by state
3. **district**: Filter by district
4. **total_score** (DESC): Leaderboards/rankings

#### Constraints

- **Age**: 1-120
- **Gender**: Male/Female/Other/Prefer not to say
- **Total Score**: ≥ 0
- **All trait scores**: ≥ 0

#### Row Level Security (RLS)

**Policies**:
1. `Allow anonymous inserts`: Anyone can insert
2. `Allow service role full access`: Service role can read/write all

### View: `assessment_analytics`

Aggregated statistics:
```sql
SELECT 
    DATE_TRUNC('day', created_at) as submission_date,
    state,
    district,
    gender,
    AVG(total_score) as avg_total_score,
    AVG(gratitude_score) as avg_gratitude,
    AVG(resilience_score) as avg_resilience,
    AVG(empathy_score) as avg_empathy,
    AVG(sociability_score) as avg_sociability,
    AVG(social_cognition_score) as avg_social_cognition,
    AVG(courage_score) as avg_courage,
    COUNT(*) as submission_count
FROM public.assessment_submissions
GROUP BY DATE_TRUNC('day', created_at), state, district, gender;
```

---

## API Architecture

### API Routes

#### POST `/api/transliterate`

**Purpose**: Transliterate English name to Hindi using Google Transliterate API

**Request**:
```typescript
{
  text: string  // English text
}
```

**Response**:
```typescript
{
  transliteratedText: string  // Hindi text
}
```

**Implementation**:
- Uses Google Transliterate API
- Language: English → Hindi (hi)
- No authentication required (public API)

**Error Handling**:
- Returns original text if API fails
- Logs errors to console

---

#### POST `/api/log`

**Purpose**: Save assessment submission to Supabase

**Request**:
```typescript
{
  name: string,
  name_hi: string,
  age: number,
  gender: string,
  mobile: string,
  email?: string,
  countryCode: string,
  state: string,
  district: string,
  assessmentData: Array<{
    id: number,
    trait: string,
    score: number,
    feedback: string
  }>,
  totalScore: number,
  finalAssessmentText: string,
  date: string
}
```

**Response (Success)**:
```typescript
{
  success: true,
  message: "Assessment submitted successfully",
  data: { /* inserted row */ }
}
```

**Response (Error)**:
```typescript
{
  success: false,
  error: "Failed to submit assessment",
  details: "Error message"
}
```

**Implementation**:
1. Receive submission data
2. Extract individual trait scores from `assessmentData`
3. Extract feedback comments into JSONB array
4. Insert into Supabase `assessment_submissions` table
5. Return success/error response

**Error Handling**:
- Validates environment variables
- Catches database errors
- Returns detailed error messages

---

## Frontend Architecture

### Routing

Using **Next.js App Router**:

| Route | File | Purpose |
|-------|------|---------|
| `/` | `app/page.tsx` | Main assessment app |
| `/certificate` | `app/certificate/page.tsx` | Certificate display |

### State Management

**Component-Level State** (React `useState`):
- Form data (user info, answers)
- UI state (step, current question)
- Loading states
- Error messages

**Form State** (React Hook Form):
- User info form validation
- Field-level errors
- Form submission

**No Global State Management**:
- Application is simple enough for local state
- Data flows parent → child via props
- Child → parent via callbacks

### Validation Strategy

**Zod Schemas**:

```typescript
// User info validation
const userInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(1).max(120),
  gender: z.string(),
  mobile: z.string().min(10),
  email: z.string().email().optional().or(z.literal('')),
  state: z.string(),
  district: z.string(),
  countryCode: z.string()
});
```

**Validation Points**:
1. **Client-side**: React Hook Form + Zod
2. **API Routes**: TypeScript types + runtime checks
3. **Database**: PostgreSQL constraints + CHECK clauses

### Styling Approach

**Tailwind CSS** with **shadcn/ui**:
- Utility-first approach
- Component variants with `class-variance-authority`
- Responsive breakpoints: `sm:`, `md:`, `lg:`, `xl:`
- Dark mode ready (not currently enabled)

**Custom CSS** (`globals.css`):
- CSS variables for theming
- Radix UI overrides
- Tailwind layers

---

## Security

### Environment Variables

**Sensitive Credentials**:
```env
SUPABASE_SERVICE_ROLE_KEY=***  # Server-side only
```

**Public Variables**:
```env
NEXT_PUBLIC_SUPABASE_URL=https://...  # Safe to expose
```

**Security Rules**:
- ✅ Service role key NEVER sent to client
- ✅ `.env` in `.gitignore`
- ✅ Use `NEXT_PUBLIC_` prefix only for safe values
- ✅ API routes run server-side (credentials safe)

### Database Security

**Row Level Security (RLS)**:
- Enabled on all tables
- Anonymous users can INSERT only
- Service role has full access
- Regular users cannot read others' data

**Input Validation**:
- Zod schemas validate all inputs
- PostgreSQL CHECK constraints
- TypeScript type safety

**SQL Injection Prevention**:
- Using Supabase client (parameterized queries)
- No raw SQL from user input

### API Security

**Rate Limiting**: Not implemented (add if needed)

**CORS**: Handled by Next.js (same-origin by default)

**Authentication**: Not required (public assessment)

---

## Performance Optimizations

### Build Optimizations

- **Turbopack**: 700x faster than Webpack
- **App Router**: Server Components by default
- **Image Optimization**: Next.js `<Image>` component
- **Code Splitting**: Automatic route-based splitting

### Runtime Optimizations

- **React 18**: Automatic batching, transitions
- **Memoization**: `useMemo`, `useCallback` where needed
- **Lazy Loading**: Dynamic imports for heavy components
- **Database Indexes**: Fast queries on common filters

### Monitoring

- **Vercel Analytics**: Track page views, vitals
- **Vercel Speed Insights**: Core Web Vitals
- **Console Logging**: API route logs

---

## Scalability Considerations

### Current Limits

- **Database**: Supabase free tier (500MB, 50,000 rows)
- **API**: Vercel serverless limits (10s timeout, 50MB response)
- **Concurrent Users**: Limited by Vercel plan

### Scaling Strategies

**Database**:
- Upgrade Supabase plan for more storage
- Add read replicas for analytics
- Archive old submissions

**API**:
- Add caching layer (Redis)
- Implement rate limiting
- Use CDN for static assets

**Frontend**:
- Add service worker for offline support
- Implement Progressive Web App (PWA)
- Add client-side caching

---

## Future Enhancements

### Planned Features

- [ ] Multi-language support (beyond English/Hindi)
- [ ] Admin dashboard for analytics
- [ ] Real-time leaderboards
- [ ] Email/SMS notifications
- [ ] PDF report generation
- [ ] Social media sharing
- [ ] A/B testing for questions
- [ ] AI-powered insights (using Genkit)

### Technical Debt

- [ ] Add comprehensive unit tests
- [ ] Add E2E tests (Playwright)
- [ ] Improve error boundaries
- [ ] Add retry logic for API calls
- [ ] Implement proper logging service
- [ ] Add monitoring/alerting

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start dev server (port 9002)
npm run dev

# Type check
npm run typecheck

# Lint code
npm run lint

# Build for production
npm run build
```

### Environment Setup

1. Create `.env` file
2. Add Supabase credentials
3. Run database migrations
4. Test with sample submission

### Debugging

**Frontend**:
- React DevTools
- Browser console (F12)
- Network tab for API calls

**Backend**:
- Console logs in API routes
- Supabase dashboard logs
- Vercel deployment logs

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**Maintained By**: Development Team
