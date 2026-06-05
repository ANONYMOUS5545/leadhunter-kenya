# LeadHunter KE

**Kenya's #1 B2B Lead Intelligence Platform** — built for web designers, digital marketers, and graphic designers who sell to Kenyan businesses.

## What It Does

LeadHunter KE scrapes publicly available data from Google Maps, Facebook, Instagram, and TikTok to surface businesses in Kenya's 5 major cities that need web design, digital marketing, or graphic design services.

For each business, it automatically:
- **Scores online presence** (0–100) based on website quality, social media activity, and Google presence
- **Identifies weaknesses** (no website, no SSL, low followers, missing Google Maps listing, etc.)
- **Generates cold call scripts** tailored to the specific business, industry, and identified pain points

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 (App Router, React 19) |
| Styling | Tailwind CSS v4 + custom CSS design system |
| Backend | Next.js API Routes (Node.js) |
| Database | PostgreSQL via Neon (serverless) |
| ORM | Drizzle ORM |
| Auth | JWT (jose) + bcrypt |
| Charts | Recharts |
| Export | SheetJS (xlsx) |
| Scraping | Axios + Cheerio |
| Deployment | Vercel |

---

## Project Structure

```
leadhunter-ke/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── pricing/page.tsx            # Pricing page
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard shell + sidebar
│   │   ├── page.tsx                # Dashboard overview
│   │   ├── leads/page.tsx          # Full leads browser
│   │   ├── export/page.tsx         # Excel export
│   │   └── settings/page.tsx       # Account + subscription
│   ├── admin/
│   │   ├── layout.tsx              # Admin shell
│   │   ├── page.tsx                # Admin overview + charts
│   │   ├── industries/page.tsx     # Industry CRUD
│   │   ├── users/page.tsx          # User management
│   │   └── jobs/page.tsx           # Scrape job runner
│   └── api/
│       ├── leads/route.ts
│       ├── scrape/route.ts
│       ├── export/route.ts
│       ├── auth/{login,register,logout,me}/
│       └── admin/{industries,users,jobs}/
├── components/
│   ├── ui/
│   │   ├── index.tsx               # Badge, Button, Input, Card, etc.
│   │   └── ScoreRing.tsx           # Animated presence score ring
│   └── dashboard/
│       ├── BusinessCard.tsx        # Lead card with weakness/scripts
│       ├── Sidebar.tsx             # Navigation sidebar
│       └── FilterBar.tsx           # City/industry/search filters
├── lib/
│   ├── schema.ts                   # Drizzle ORM schema + types
│   ├── db.ts                       # Neon DB connection
│   ├── auth.ts                     # JWT + session helpers
│   ├── scraper.ts                  # Scraping + analysis engine
│   ├── export.ts                   # Excel export generator
│   └── utils.ts                    # Constants + helpers
├── scripts/
│   └── seed.ts                     # DB seed script
├── drizzle/
│   └── 0000_initial.sql            # Full schema SQL (run this first)
├── .env.example                    # Environment variables template
├── drizzle.config.ts
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/your-org/leadhunter-ke.git
cd leadhunter-ke
npm install
```

### 2. Set Up Database (Neon)

1. Create a free database at [neon.tech](https://neon.tech)
2. Run `drizzle/0000_initial.sql` in the Neon SQL editor
3. Or push the schema via: `npm run db:push`

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://user:pass@host.neon.tech/dbname?sslmode=require
JWT_SECRET=your-minimum-32-character-random-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a secure JWT secret:
```bash
openssl rand -base64 32
```

### 4. Seed the Database

```bash
npm run db:seed
```

Creates:
- 15 default industries
- 5 Kenyan cities  
- Admin user: `admin@leadhunter.ke` / `Admin1234!`
- 5 demo business leads

### 5. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

---

## Deployment to Vercel

1. Push your repo to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your production domain)
4. Deploy

The `vercel.json` is pre-configured. Zero additional setup needed.

---

## Subscription Tiers

| Tier       | Price/mo   | Leads  | Export  | Cold Call | Admin |
|------------|-----------|--------|---------|-----------|-------|
| Free Demo  | KES 0     | 5      | No      | Preview   | No    |
| Starter    | KES 2,900 | 100    | CSV     | Full      | No    |
| Pro        | KES 6,900 | 500    | Excel   | Full      | No    |
| Enterprise | KES 18,900| Unlimited | Excel | Full   | Yes   |

---

## Admin Panel

Navigate to `/admin` — requires admin role.

- **Overview**: platform stats, charts (leads by city, users by tier), recent jobs
- **Industries**: add / enable / disable / delete industry categories
- **Users**: view all users, upgrade/downgrade subscription tiers
- **Scrape Jobs**: trigger new scraping runs, monitor status in real time

---

## Scaling the Scraper

The scraper in `lib/scraper.ts` is modular. To add real data sources:

**Real Google Places data:**
```env
SERPAPI_KEY=your-serpapi-key
```
Integrate into the `scrapeBusinessListKe()` function using SerpAPI's Google Maps endpoint.

**Social media stats (Apify):**
```env
APIFY_TOKEN=your-apify-token
```
Use Apify's Instagram Scraper / Facebook Pages Scraper actors.

**Background job queue (production):**
```bash
npm install bullmq ioredis
```
Replace the inline `runScrapeJob()` async call with a BullMQ queue.

---

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # ESLint check
npm run db:push      # Push schema to database
npm run db:seed      # Seed initial data
npm run db:studio    # Open Drizzle Studio (DB GUI)
npm run db:generate  # Generate migration files
```

---

## Security

- Passwords hashed with bcrypt (factor 12)
- Sessions via HTTP-only cookies (JWT, 7-day expiry)
- All admin routes verify role server-side
- Security headers set in `next.config.js` (X-Frame-Options, CSP, etc.)
- Zod input validation on every API route

---

## License

Built for commercial use. All rights reserved.
