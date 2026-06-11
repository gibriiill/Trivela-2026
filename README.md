# Trivela - FIFA World Cup 2026 Prediction Contest Platform

A full-stack Next.js 14 application for predicting FIFA World Cup 2026 match results and competing on a leaderboard.

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework with App Router |
| TypeScript | Type safety |
| Tailwind CSS | Styling with custom design system |
| Prisma ORM | Database management |
| PostgreSQL | Database (Supabase) |
| NextAuth.js v4 | Authentication |
| bcryptjs | Password hashing |
| Zod | Schema validation |
| date-fns | Date utilities |
| Nodemailer | Email notifications |
| canvas-confetti | Celebration animations |
| Vercel Analytics | Usage analytics |

## Design System

**Colors:**
- Gold Accents: `#F0B429`, `#FFD166`, `#B8860B`
- Dark Navy Blues: `#050E1F`, `#0A1628`, `#0F2040`, `#0D1B35`, `#1A2F55`, `#1E4B99`

**Fonts:**
- Display (Headings): Bebas Neue
- UI Labels: Rajdhani
- Body Text: Inter

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
│   │   │   ├── page.tsx
│   │   │   ├── matches/
│   │   │   ├── results/
│   │   │   └── users/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── matches/
│   │   │   ├── predictions/
│   │   │   ├── leaderboard/
│   │   │   ├── admin/
│   │   │   └── stats/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   ├── ui/
│   │   ├── match/
│   │   └── leaderboard/
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── utils.ts
│   │   ├── scoring.ts
│   │   └── validation.ts
│   ├── types/
│   │   └── index.ts
│   └── auth.ts
├── prisma/
│   └── schema.prisma
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
└── postcss.config.js
```

## Points System

| Category | Points |
|----------|--------|
| Correct Result | 10 pts |
| Correct Score | 20 pts |
| Correct Clean Sheet | 5 pts |
| Perfect Bonus (all 3) | +10 pts |
| **Maximum per Match** | **45 pts** |

## Setup Guide (3 Days)

### Day 1: Initial Setup

```bash
# Clone and install
git clone <repo>
cd trivela
npm install

# Setup Supabase PostgreSQL database
# 1. Create account at supabase.com
# 2. Create new project
# 3. Go to Settings > Database > URI
# 4. Copy Connection String (use pooler with pgbouncer=true for DATABASE_URL)
# 5. Copy Direct Connection URL for DIRECT_URL

# Copy environment variables
cp .env.example .env.local

# Fill in your database URLs and NEXTAUTH_SECRET
# Generate secret: openssl rand -base64 32
```

### Day 2: Database & Auth

```bash
# Push Prisma schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# Create initial admin user
npx prisma db seed
```

### Day 3: Run & Populate

```bash
# Start development server
npm run dev

# Visit http://localhost:3000
# Login with admin credentials from seed
# Add matches via Admin Panel > Matches
```

## Environment Variables

```env
DATABASE_URL="postgresql://user:password@host:5432/trivela?schema=public&sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/trivela"
NEXTAUTH_SECRET="your-secret-key-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"

SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
FROM_EMAIL="noreply@trivela.com"

NEXT_PUBLIC_APP_NAME="Trivela"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## API Routes

### Public Endpoints

- `GET /api/matches` - List all matches
- `GET /api/matches/[id]` - Get single match
- `GET /api/leaderboard` - Get leaderboard entries
- `GET /api/stats` - Get platform statistics
- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Protected Endpoints (Auth Required)

- `GET /api/predictions` - Get user predictions
- `POST /api/predictions` - Create/update prediction
- `GET /api/user/me` - Get current user profile

### Admin Endpoints

- `GET /api/admin/matches` - List all matches with predictions count
- `POST /api/admin/matches` - Create match
- `PUT /api/admin/matches/[id]` - Update match
- `DELETE /api/admin/matches/[id]` - Delete match
- `GET /api/admin/predictions` - List all predictions
- `GET /api/admin/users` - List all users
- `POST /api/admin/results` - Publish match result & calculate points
- `PUT /api/admin/results` - Recalculate all points

## Admin Workflow

1. **Add Matches**: Admin Panel → Matches → Add Match
   - Select both teams with flags
   - Set stage and group
   - Set kickoff time (matches auto-lock at kickoff)

2. **Make Predictions**: Users visit Match cards → Make Prediction
   - Input predicted score (0-20 each)
   - Confirm result prediction (auto-derived)
   - Toggle clean sheet if needed
   - See potential points before submitting

3. **Publish Results**: Admin Panel → Results
   - Enter actual final score
   - Click "Publish Result"
   - Points auto-calculated for all predictions on that match
   - User totalPoints updated in real-time

4. **View Leaderboard**: Any user can visit /leaderboard
   - Real-time rankings by totalPoints
   - Shows only users with predictions
   - Current user highlighted in gold

## Key Features

✅ **FIFA 2026 Teams** - All 48 teams with emoji flags organized into 12 groups  
✅ **Live Scoring** - Green pulsing badges and auto-countdown timers  
✅ **Points System** - Accurate calculation with bonus multipliers  
✅ **Real-time Leaderboard** - Top 3 with trophy/medal/award icons  
✅ **Password Reset** - Email-based token system  
✅ **Mobile Responsive** - Works on all screen sizes  
✅ **Dark Theme** - Navy/gold design system  
✅ **Admin Dashboard** - Manage matches, results, users  

## Leaderboard Logic

Only **USER role** with at least **one prediction** appear on leaderboard.
Sorted by `totalPoints DESC` then `username ASC`.
Current user always highlighted in gold.

## Notes

- All passwords are hashed with bcrypt (12 rounds)
- Predictions lock once match kickoff time passes
- Token-based password reset with 1-hour expiry
- All form inputs validated with Zod
- Email notifications use nodemailer SMTP
- Confetti animation on successful prediction
