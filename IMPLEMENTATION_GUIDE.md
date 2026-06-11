# Trivela - Implementation Guide

This guide will help you set up and run the Trivela FIFA World Cup 2026 prediction platform.

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Supabase recommended)
- Git
- Email SMTP credentials (Gmail, SendGrid, or similar)

## 3-Day Setup Plan

### Day 1: Repository Setup & Database

#### Step 1: Clone and Install Dependencies

```bash
git clone <your-repo-url> trivela
cd trivela
npm install
```

#### Step 2: Setup Supabase PostgreSQL Database

1. Go to [supabase.com](https://supabase.com)
2. Create a new account and project
3. Once created, go to **Settings > Database > Connection String**
4. Copy the **Connection Pooler URL** (important: has `pgbouncer=true`)
5. Replace parameters: `user`, `password` with your credentials
6. Also get the **Direct Connection URL** for `DIRECT_URL`

#### Step 3: Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Database - Use pooler for DATABASE_URL
DATABASE_URL="postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:6543/postgres?schema=public&sslmode=require&pgbouncer=true"

# Direct connection for migrations
DIRECT_URL="postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres?schema=public&sslmode=require"

# NextAuth - Generate with: openssl rand -base64 32
NEXTAUTH_SECRET="your-32-char-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Email (Gmail example - use app-specific password)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
FROM_EMAIL="noreply@trivela.com"

# Public config
NEXT_PUBLIC_APP_NAME="Trivela"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

#### Step 4: Push Schema to Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

### Day 2: Run Development Server & Create Admin

```bash
# Start dev server
npm run dev

# Open http://localhost:3000 - you should see the homepage
```

#### Create Admin User:

```bash
# Seed database with admin user
npx prisma db seed

# Admin credentials:
# Email: admin@trivela.com
# Password: Admin@123
```

Now you can:
- Login at `/auth/login` with admin credentials
- Visit `/admin` to access Admin Panel

### Day 3: Populate Data & Test

#### Add Some Matches:

1. Go to http://localhost:3000/admin/matches
2. Click "Add Match"
3. Fill in:
   - Team A: Brazil
   - Team B: France
   - Stage: GROUP
   - Group: C
   - Kickoff Time: 2026-06-20 18:00 (future date)
   - Venue: Stadium Name
4. Save

Repeat for 3-4 matches to test.

#### Test User Registration:

1. Go to http://localhost:3000/auth/register
2. Fill form with test data
3. Should auto-login and redirect to `/matches`

#### Test Predictions:

1. Click any match card
2. Make a prediction
3. Submit and see confetti animation
4. View on `/predictions`

#### Test Admin Result Publishing:

1. Go to `/admin/results`
2. Edit a match status to COMPLETED
3. Enter actual score
4. Click "Publish Result"
5. Points should auto-calculate
6. Check user profile to see updated points

## Project Structure

```
trivela/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (dashboard)/
│   │   │   ├── matches/
│   │   │   ├── predictions/
│   │   │   ├── leaderboard/
│   │   │   ├── results/
│   │   │   ├── groups/
│   │   │   └── profile/
│   │   ├── admin/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── matches/
│   │   │   ├── predictions/
│   │   │   ├── leaderboard/
│   │   │   ├── stats/
│   │   │   ├── user/
│   │   │   └── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── not-found.tsx
│   │   └── [other routes]/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   └── SessionProvider.tsx
│   │   ├── ui/
│   │   │   ├── Skeleton.tsx
│   │   │   └── CountdownTimer.tsx
│   │   ├── match/
│   │   │   └── MatchCard.tsx
│   │   └── leaderboard/
│   │       └── LeaderboardTable.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   ├── scoring.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── auth.ts (NextAuth handlers)
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env.example
├── .env.local (created)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
└── README.md
```

## Key Files Reference

### Configuration

- **tailwind.config.ts** - Design tokens (colors, fonts, animations)
- **tsconfig.json** - TypeScript strict mode, path aliases
- **next.config.mjs** - Prisma client external packages config
- **prisma/schema.prisma** - Database models and enums

### Core Logic

- **src/lib/auth.ts** - NextAuth configuration with JWT strategy
- **src/lib/scoring.ts** - Points calculation engine
- **src/lib/utils.ts** - Shared utilities (date formatting, flags, etc)
- **src/lib/validation.ts** - Zod schemas for all inputs

### Database

- **src/lib/prisma.ts** - Singleton Prisma client
- **prisma/seed.ts** - Database seeding (admin user)

### API Routes (All in src/app/api/)

**Public:**
- `POST /api/auth/register` - User registration
- `GET /api/matches` - List all matches
- `GET /api/leaderboard` - Leaderboard rankings
- `GET /api/stats` - Platform statistics

**Protected (Auth Required):**
- `POST /api/predictions` - Create/update prediction
- `GET /api/predictions` - Get user predictions
- `GET /api/user/me` - Current user profile

**Admin Only:**
- `POST /api/admin/matches` - Create match
- `PUT/DELETE /api/admin/matches/[id]` - Update/delete match
- `POST /api/admin/results` - Publish match result & calculate points
- `PUT /api/admin/results` - Recalculate all points

### Pages (All in src/app/)

- `/` - Homepage with stats, leaderboard preview
- `/matches` - Browse all matches by status
- `/predictions` - User's predictions with stats
- `/leaderboard` - Full leaderboard with podium
- `/results` - Match results
- `/groups` - Group standings
- `/profile` - User profile
- `/admin` - Admin dashboard
- `/admin/matches` - Manage matches (CRUD)
- `/admin/results` - Publish results & calculate points
- `/auth/login` - Login page
- `/auth/register` - Registration page

## Database Schema

### Users Table
- id, username (unique), email (unique), password (hashed)
- fullName, year, department, mobile (unique), college
- totalPoints, role (USER/ADMIN)

### Matches Table
- id, teamA, teamB, teamAFlag?, teamBFlag?
- group?, stage, venue?, kickoffTime, status
- Relations: predictions (many), result (one)

### Predictions Table
- id, userId, matchId, resultPrediction, homeScore, awayScore
- cleanSheet, pointsEarned, isCalculated
- Unique constraint: (userId, matchId)

### Results Table
- id, matchId (unique), homeScore, awayScore
- winningTeam, cleanSheet, publishedAt

### PasswordResetToken Table
- id, email, token (unique), expires

## Points System

| Category | Points |
|----------|--------|
| Correct Result | 10 |
| Correct Score | 20 |
| Correct Clean Sheet | 5 |
| Perfect Bonus (all 3) | +10 |
| **Maximum per match** | **45** |

## Admin Workflow

### 1. Add Matches
- Navigate to Admin → Matches
- Click "Add Match"
- Select teams (auto-populate flags)
- Set stage and group
- Set kickoff time (ISO format)
- Click "Create"

### 2. Matches Lock Automatically
- Predictions lock when kickoff time passes
- "Edit Prediction" button disappears
- Status changes to LIVE/COMPLETED

### 3. Publish Results
- Go to Admin → Results
- For each completed match, enter final score
- Click "Publish Result"
- System calculates points for ALL predictions on that match
- User totalPoints updated automatically

### 4. View Leaderboard
- Public at `/leaderboard`
- Shows top 3 in podium view
- Full rankings below
- Current user highlighted in gold

## Common Tasks

### Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### Seed Database
```bash
npx prisma db seed
```

### View Database
```bash
npx prisma studio  # Opens interactive UI at http://localhost:5555
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Migrations (after schema changes)
```bash
npx prisma migrate dev --name add_feature_name
```

## Environment Variable Checklist

Before running `npm run dev`:

- [ ] DATABASE_URL set (Supabase pooler URL with pgbouncer=true)
- [ ] DIRECT_URL set (Supabase direct connection)
- [ ] NEXTAUTH_SECRET set (32+ chars, generate with openssl)
- [ ] NEXTAUTH_URL set (http://localhost:3000 for dev)
- [ ] SMTP credentials set if using password reset
- [ ] FROM_EMAIL set to valid email

## Troubleshooting

### "NEXTAUTH_SECRET is missing"
→ Generate with: `openssl rand -base64 32` and add to .env.local

### "Cannot connect to database"
→ Check DATABASE_URL format, credentials, and firewall rules on Supabase

### "Prisma client not generated"
→ Run: `npx prisma generate`

### "Predictions not calculating points"
→ Check admin is publishing results correctly
→ Verify Result record exists for the match

### "Leaderboard showing no users"
→ Users must have at least 1 prediction to appear
→ Check if predictions are saved correctly

## Deployment Checklist

Before deploying to production:

- [ ] Rename .env.local to .env.production.local
- [ ] Update NEXTAUTH_URL to production domain
- [ ] Update DIRECT_URL if needed
- [ ] Test admin workflow end-to-end
- [ ] Verify email sending works
- [ ] Run build: `npm run build`
- [ ] Test build locally: `npm start`

## Performance Tips

1. **Database Queries**
   - Most queries use Prisma include/select for efficient data fetching
   - Leaderboard limits to 100 entries by default

2. **Caching**
   - Stats are fetched fresh each page load (force-dynamic)
   - Consider adding ISR for leaderboard if needed

3. **API Rate Limiting**
   - Consider adding rate limiting for public endpoints
   - Use middleware for admin endpoints

## Next Steps

1. Customize organization name in layout.tsx footer
2. Add team logos/flags to storage
3. Configure email templates
4. Set up CI/CD pipeline
5. Add tournament bracket visualization
6. Add live score updates with WebSockets
7. Add social sharing for predictions

## Support

Refer to:
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Project Created:** June 2026  
**Version:** 1.0.0
