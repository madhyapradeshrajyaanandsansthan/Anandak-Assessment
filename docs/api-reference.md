# API Reference

Complete documentation of all APIs, services, and integrations used in the Multi-Parameter Assessment application.

## Table of Contents

1. [Internal API Routes](#internal-api-routes)
2. [External APIs](#external-apis)
3. [Database API (Supabase)](#database-api-supabase)
4. [Type Definitions](#type-definitions)
5. [Error Handling](#error-handling)
6. [Rate Limits](#rate-limits)

---

## Internal API Routes

These are Next.js API routes hosted within the application.

### POST `/api/log`

Save assessment submission to Supabase database.

#### Endpoint

```
POST https://your-domain.com/api/log
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```typescript
{
  name: string;              // User's full name
  name_hi: string;           // Name in Hindi (transliterated)
  age: number;               // Age (1-120)
  gender: string;            // "Male" | "Female" | "Other" | "Prefer not to say"
  mobile: string;            // Mobile number
  email?: string;            // Email (optional)
  countryCode: string;       // Country dial code (e.g., "+91")
  state: string;             // Indian state name
  district: string;          // District name
  assessmentData: Array<{
    id: number;              // Question ID (1-6)
    trait: string;           // Trait name
    score: number;           // Score (1-3)
    feedback: string;        // Feedback text
  }>;
  totalScore: number;        // Sum of all scores (6-18)
  finalAssessmentText: string; // Overall assessment
  date: string;              // ISO timestamp
}
```

#### Example Request

```bash
curl -X POST https://your-domain.com/api/log \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "name_hi": "जॉन डो",
    "age": 25,
    "gender": "Male",
    "mobile": "9876543210",
    "email": "john@example.com",
    "countryCode": "+91",
    "state": "Maharashtra",
    "district": "Mumbai",
    "assessmentData": [
      {
        "id": 1,
        "trait": "Gratitude",
        "score": 3,
        "feedback": "You have a strong sense of gratitude..."
      }
    ],
    "totalScore": 15,
    "finalAssessmentText": "Overall excellent performance...",
    "date": "2025-11-04T12:00:00.000Z"
  }'
```

#### Success Response

**Code**: `200 OK`

```json
{
  "success": true,
  "message": "Assessment submitted successfully",
  "data": {
    "id": "uuid-here",
    "created_at": "2025-11-04T12:00:00.000Z",
    "name": "John Doe",
    "total_score": 15,
    ...
  }
}
```

#### Error Responses

**Code**: `500 Internal Server Error`

```json
{
  "success": false,
  "error": "Failed to submit assessment",
  "details": "Supabase insert failed: ..."
}
```

**Code**: `500 Internal Server Error` (Missing credentials)

```json
{
  "success": false,
  "error": "Server configuration error",
  "details": "Missing required Supabase credentials"
}
```

#### Implementation Details

**Location**: `src/app/api/log/route.ts`

**Process**:
1. Receive and parse JSON body
2. Validate environment variables
3. Extract individual trait scores from `assessmentData`
4. Extract feedback comments into array
5. Insert into Supabase `assessment_submissions` table
6. Return inserted row or error

**Database Operations**:
- Uses Supabase client with service role key
- Inserts into `assessment_submissions` table
- Automatically generates `id` and `created_at`

---

### POST `/api/transliterate`

Transliterate English text to Hindi using Google Transliterate API.

#### Endpoint

```
POST https://your-domain.com/api/transliterate
```

#### Request Headers

```
Content-Type: application/json
```

#### Request Body

```typescript
{
  text: string;  // English text to transliterate
}
```

#### Example Request

```bash
curl -X POST https://your-domain.com/api/transliterate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Ramesh Kumar"
  }'
```

#### Success Response

**Code**: `200 OK`

```json
{
  "transliteratedText": "रमेश कुमार"
}
```

#### Error Response

**Code**: `500 Internal Server Error`

```json
{
  "error": "Transliteration failed",
  "details": "API error message",
  "originalText": "Ramesh Kumar"
}
```

**Note**: If transliteration fails, the API falls back to returning the original text.

#### Implementation Details

**Location**: `src/app/api/transliterate/route.ts`

**External API**: Google Transliterate API
- **URL**: `https://www.google.com/inputtools/request`
- **Method**: POST
- **Language**: English → Hindi (`hi`)

**Process**:
1. Receive English text
2. Call Google Transliterate API
3. Extract Hindi text from response
4. Return transliterated text
5. On error, return original text

**API Limits**:
- No authentication required
- No official rate limits documented
- Free to use

---

## External APIs

### Google Transliterate API

**Purpose**: Convert English text to Hindi script

**URL**: `https://www.google.com/inputtools/request`

**Method**: POST

**Request Body**:
```json
{
  "method": "t13n",
  "params": {
    "text": "english text",
    "itc": "hi-t-i0-und",
    "num": 5
  }
}
```

**Response**:
```json
{
  "result": [
    [
      ["hindi text", "alternative 1", "alternative 2", ...]
    ]
  ]
}
```

**Usage in Application**:
- Called when user types name in user info form
- Automatic transliteration on blur/change
- Used in `/api/transliterate` endpoint

**Error Handling**:
- Falls back to original text on failure
- Logs errors to console
- No retry logic

**Rate Limiting**: None (public API)

---

### Supabase API

**Purpose**: PostgreSQL database with RESTful API

**URL**: `https://your-project-id.supabase.co`

**Authentication**: Service Role Key (JWT)

**SDK**: `@supabase/supabase-js` (v2.78.0)

**Initialization**:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**Operations Used**:

#### Insert

```typescript
const { data, error } = await supabase
  .from('assessment_submissions')
  .insert([{ ...submissionData }])
  .select();
```

#### Query

```typescript
const { data, error } = await supabase
  .from('assessment_submissions')
  .select('*')
  .eq('state', 'Maharashtra')
  .order('created_at', { ascending: false })
  .limit(10);
```

**Row Level Security (RLS)**:
- Enabled on all tables
- Anonymous users: INSERT only
- Service role: Full access

**API Limits** (Free Tier):
- 500 MB database storage
- 1 GB bandwidth/month
- 50,000 monthly active users
- 2 GB file storage

---

### Genkit AI (Google)

**Purpose**: AI/ML framework for future features

**Package**: `genkit` (v1.13.0), `@genkit-ai/googleai` (v1.13.0)

**Current Status**: Configured but not actively used

**Configuration**: `src/ai/genkit.ts`

**Potential Use Cases**:
- AI-powered assessment insights
- Personalized feedback generation
- Question difficulty adjustment
- Anomaly detection in submissions

**API Key**: Requires Google AI API key (not currently used)

---

### Vercel Analytics

**Purpose**: Track page views and performance

**Package**: `@vercel/analytics` (v1.5.0)

**Implementation**: Automatically injected by Vercel

**Data Collected**:
- Page views
- Unique visitors
- Referrers
- Geographic data
- Device types

**Privacy**: Anonymized, GDPR compliant

---

### Vercel Speed Insights

**Purpose**: Monitor Core Web Vitals

**Package**: `@vercel/speed-insights` (v1.2.0)

**Metrics Tracked**:
- **LCP** (Largest Contentful Paint)
- **FID** (First Input Delay)
- **CLS** (Cumulative Layout Shift)
- **FCP** (First Contentful Paint)
- **TTFB** (Time to First Byte)

**Real User Monitoring (RUM)**: Yes

---

## Database API (Supabase)

### Tables

#### `assessment_submissions`

**Schema**: See [docs/supabase-setup.md](./supabase-setup.md#database-schema)

**Insert Example**:
```typescript
const { data, error } = await supabase
  .from('assessment_submissions')
  .insert([{
    name: "John Doe",
    name_hi: "जॉन डो",
    age: 25,
    gender: "Male",
    country_code: "+91",
    mobile: "9876543210",
    email: "john@example.com",
    state: "Maharashtra",
    district: "Mumbai",
    total_score: 15,
    final_assessment: "Excellent",
    gratitude_score: 3,
    resilience_score: 2,
    empathy_score: 3,
    sociability_score: 2,
    social_cognition_score: 3,
    courage_score: 2,
    assessment_data: [...],
    feedback_comments: [...]
  }])
  .select();
```

**Query Examples**:

```typescript
// Get all submissions from Maharashtra
const { data } = await supabase
  .from('assessment_submissions')
  .select('*')
  .eq('state', 'Maharashtra');

// Get top 10 scores
const { data } = await supabase
  .from('assessment_submissions')
  .select('name, total_score')
  .order('total_score', { ascending: false })
  .limit(10);

// Count submissions by gender
const { data } = await supabase
  .from('assessment_submissions')
  .select('gender', { count: 'exact' });

// Get submissions from last 7 days
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

const { data } = await supabase
  .from('assessment_submissions')
  .select('*')
  .gte('created_at', sevenDaysAgo.toISOString());
```

### Views

#### `assessment_analytics`

**Purpose**: Aggregated statistics

**Query**:
```typescript
const { data } = await supabase
  .from('assessment_analytics')
  .select('*')
  .order('submission_date', { ascending: false });
```

**Columns**:
- `submission_date`: Date (day-level)
- `state`: State name
- `district`: District name
- `gender`: Gender
- `avg_total_score`: Average total score
- `avg_gratitude`: Average gratitude score
- `avg_resilience`: Average resilience score
- `avg_empathy`: Average empathy score
- `avg_sociability`: Average sociability score
- `avg_social_cognition`: Average social cognition score
- `avg_courage`: Average courage score
- `submission_count`: Number of submissions

---

## Type Definitions

### AssessmentData

```typescript
interface AssessmentData {
  name: string;
  name_hi: string;
  age: number;
  gender: string;
  mobile?: string;
  email?: string;
  countryCode?: string;
  state: string;
  district: string;
  assessmentData: Array<{
    id: number;
    trait: string;
    score: number;
    feedback: string;
  }>;
  totalScore: number;
  finalAssessmentText: string;
  date: string;
}
```

### Question

```typescript
interface Question {
  id: number;
  trait: string;
  question: string;
  question_hi: string;
  options: Array<{
    text: string;
    text_hi: string;
    score: number;
  }>;
  feedback: string[];
}
```

### UserInfo

```typescript
interface UserInfo {
  name: string;
  age: number;
  gender: string;
  mobile: string;
  email: string;
  state: string;
  district: string;
  countryCode: string;
}
```

### TraitScore

```typescript
interface TraitScore {
  id: number;
  trait: string;
  score: number;
  feedback: string;
}
```

---

## Error Handling

### API Error Responses

All API routes follow this error format:

```typescript
{
  success: false,
  error: string,        // Human-readable error message
  details?: string      // Technical details (optional)
}
```

### Common Error Codes

| Code | Meaning | Cause |
|------|---------|-------|
| `400` | Bad Request | Invalid input data |
| `500` | Internal Server Error | Database/API failure |

### Error Handling Strategy

**Frontend**:
```typescript
try {
  const response = await fetch('/api/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  
  const result = await response.json();
  
  if (!response.ok) {
    throw new Error(result.error || 'Submission failed');
  }
  
  // Success
} catch (error) {
  console.error('Error:', error);
  toast({
    title: "Error",
    description: error.message,
    variant: "destructive"
  });
}
```

**Backend (API Routes)**:
```typescript
export async function POST(request: NextRequest) {
  try {
    // ... logic
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

---

## Rate Limits

### Internal APIs

**No rate limiting currently implemented**

Recommended for production:
- 100 requests/minute per IP
- 1000 requests/hour per IP

### External APIs

#### Google Transliterate API
- **Limit**: Unknown (unofficial API)
- **Recommended**: Cache results, debounce calls

#### Supabase (Free Tier)
- **Database**: 500 MB storage
- **Bandwidth**: 1 GB/month
- **Rows**: No hard limit (performance degrades after ~50k rows)
- **API Requests**: Unlimited (subject to fair use)

#### Vercel (Hobby Plan)
- **Bandwidth**: 100 GB/month
- **Function Executions**: Unlimited
- **Function Duration**: 10 seconds max
- **Function Size**: 50 MB max

---

## API Security

### Authentication

**Current**: No authentication required (public assessment)

**Future**: Consider adding:
- API keys for admin endpoints
- JWT tokens for user sessions
- reCAPTCHA for spam prevention

### Data Validation

**Client-side**: Zod schemas

**Server-side**: TypeScript types + runtime checks

**Database**: PostgreSQL constraints

### CORS

**Configuration**: Next.js default (same-origin)

**Headers**: Set in `next.config.ts` if needed

### HTTPS

**Required**: Yes (enforced by Vercel)

**Certificate**: Auto-managed by Vercel

---

## API Testing

### Manual Testing

**Using curl**:
```bash
# Test transliterate
curl -X POST http://localhost:9002/api/transliterate \
  -H "Content-Type: application/json" \
  -d '{"text": "Ramesh"}'

# Test log submission
curl -X POST http://localhost:9002/api/log \
  -H "Content-Type: application/json" \
  -d @test-submission.json
```

**Using Postman**:
1. Import endpoint URLs
2. Set method to POST
3. Add JSON body
4. Send request
5. Verify response

### Automated Testing

**Recommended tools**:
- Jest for unit tests
- Playwright for E2E tests
- Postman/Newman for API tests

**Example test** (Jest):
```typescript
describe('POST /api/log', () => {
  it('should save submission successfully', async () => {
    const response = await fetch('/api/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testData)
    });
    
    expect(response.status).toBe(200);
    const result = await response.json();
    expect(result.success).toBe(true);
  });
});
```

---

## API Versioning

**Current Version**: No versioning

**Future**: Consider API versioning for breaking changes:
- `/api/v1/log`
- `/api/v2/log`

---

## API Documentation Tools

### Recommended

- **Swagger/OpenAPI**: Generate interactive API docs
- **Postman Collections**: Share with team
- **API Blueprint**: Markdown-based documentation

### Example OpenAPI Spec

```yaml
openapi: 3.0.0
info:
  title: Assessment API
  version: 1.0.0
paths:
  /api/log:
    post:
      summary: Submit assessment
      requestBody:
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/AssessmentData'
      responses:
        200:
          description: Success
```

---

## Support & Resources

- **Supabase Docs**: [https://supabase.com/docs](https://supabase.com/docs)
- **Next.js API Routes**: [https://nextjs.org/docs/app/building-your-application/routing/route-handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- **Google Transliterate**: No official docs (community-driven)
- **Vercel Docs**: [https://vercel.com/docs](https://vercel.com/docs)

---

**Last Updated**: November 4, 2025  
**Version**: 2.0  
**API Status**: Production Ready ✅
