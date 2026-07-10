# PulsePass

**The Event Infrastructure Platform for Africa.**

PulsePass is a self-service event ticketing and management platform that enables anyone to create, promote, and monetize events with seamless ticketing, secure payments via Flutterwave, and QR-code-based check-in — built specifically for the African market.

**Live:** [pulsepass-phi.vercel.app](https://pulsepass-phi.vercel.app)

---

## Features

### For Event Organizers
- **Event Creation Wizard** — 3-step flow: basic info, date & media, tickets & publish
- **Event Management** — edit, publish, and manage events from the dashboard
- **Ticket Types** — create free and paid ticket tiers with custom pricing
- **Analytics Dashboard** — track revenue, bookings, tickets sold, and attendance with interactive charts
- **QR Ticket Scanner** — validate tickets at the door with instant check-in
- **Payout Management** — set up Nigerian bank account details for receiving payouts

### For Attendees
- **Event Discovery** — browse, search, and filter events by category
- **Secure Checkout** — pay with Flutterwave (cards, bank transfer, USSD)
- **My Tickets** — view tickets with QR codes, grouped by upcoming/past
- **Email Notifications** — receive verification emails, ticket confirmations, and receipts

### Platform
- **Rate Limiting** — on auth and payment endpoints
- **Email Integration** — transactional emails via Resend (verification, password reset, ticket confirmation)
- **Flutterwave Payments** — full payment lifecycle: initialize, confirm, webhook verification
- **Free Ticket Support** — zero-cost events and free ticket claiming

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (Neon serverless) |
| ORM | Prisma |
| Auth | JWT (jose) + bcryptjs + HTTP-only cookies |
| Payments | Flutterwave v3 |
| Email | Resend + React Email |
| Styling | CSS Modules + custom design tokens |
| Charts | Chart.js + react-chartjs-2 |
| Forms | react-hook-form + Zod |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Flutterwave](https://flutterwave.com) account (test or live keys)
- A [Resend](https://resend.com) account (for email)

### 1. Clone and install

```bash
git clone https://github.com/your-username/pulsepass.git
cd pulsepass
npm install
```

### 2. Set up environment variables

Copy the example and fill in your values:

```bash
cp .env.example .env
```

Or create `.env` manually:

```env
# Database
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# Auth
JWT_SECRET="your-random-secret-key"

# Flutterwave (https://dashboard.flutterwave.com)
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-..."
FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."
FLUTTERWAVE_ENCRYPTION_KEY="FLWSECK_TEST..."
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-..."
FLUTTERWAVE_WEBHOOK_HASH=""

# Resend (https://resend.com)
RESEND_API_KEY="re_..."
FROM_NAME="PulsePass"
FROM_EMAIL="noreply@yourdomain.com"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set up the database

```bash
npx prisma generate
npx prisma db push
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
pulsepass/
├── app/                        # Next.js App Router pages & API routes
│   ├── api/                    # REST API endpoints (auth, events, payments, tickets, payouts)
│   ├── create/                 # Event creation wizard
│   ├── dashboard/              # Dashboard (overview, events, bookings, tickets, revenue, scanner, account)
│   ├── events/                 # Event browse, detail, and checkout
│   ├── login/                  # Sign in
│   ├── register/               # Sign up (3-step)
│   └── ...                     # Other pages (about, blog, pricing, help, etc.)
├── components/                 # Shared React components
│   └── ui/                     # Design system (Button, Input, Card, Badge, Modal, Table)
├── lib/                        # Utility modules
│   ├── auth.ts                 # JWT authentication helpers
│   ├── email.tsx               # Email sending via Resend
│   ├── flutterwave.ts          # Flutterwave payment helpers
│   ├── rate-limit.ts           # In-memory rate limiter
│   ├── app-url.ts              # Dynamic app URL resolution
│   └── validations/            # Zod schemas
├── emails/                     # React Email templates
├── prisma/                     # Prisma schema and generated types
├── db/                         # Prisma client singleton
├── data/                       # Static data (blog posts)
└── public/                     # Static assets and uploads
```

---

## API Routes

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Sign in |
| `POST` | `/api/auth/logout` | Sign out |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/auth/refresh` | Refresh token |
| `GET` | `/api/auth/verify-email` | Verify email address |
| `POST` | `/api/auth/forgot-password` | Request password reset |
| `POST` | `/api/auth/reset-password` | Reset password with token |

### Events
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/events` | List published events |
| `POST` | `/api/events` | Create event (auth required) |
| `GET` | `/api/events/[id]` | Get event details |
| `PUT` | `/api/events/[id]` | Update event (owner only) |
| `DELETE` | `/api/events/[id]` | Delete event (owner only) |
| `POST` | `/api/events/[id]/rsvp` | RSVP to event |

### Payments & Tickets
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/payments/initialize` | Initialize Flutterwave payment |
| `POST` | `/api/payments/confirm` | Confirm payment and generate tickets |
| `POST` | `/api/tickets/validate` | Validate QR ticket (check-in) |
| `POST` | `/api/tickets/claim-free` | Claim a free ticket |

### Other
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics` | Aggregate analytics data |
| `GET/POST` | `/api/payouts` | Manage payout account |
| `POST` | `/api/upload` | Upload event images |
| `POST` | `/api/webhooks/flutterwave` | Flutterwave webhook |

---

## Database Schema

**9 models** — User, Event, TicketType, Order, Payment, TicketInstance, PayoutAccount, RSVP, Attendee, EmailVerificationToken, PasswordResetToken

Key relationships:
- **User** → creates Events, places Orders, attends as Attendee
- **Event** → has many TicketTypes, Orders, RSVPs
- **Order** → contains many TicketInstances, linked to Payments
- **TicketInstance** → unique QR code, validated at check-in

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import repository on [vercel.com](https://vercel.com)
3. Add all environment variables in **Settings → Environment Variables**
4. Deploy

### Environment Variables for Production

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string (Neon recommended) |
| `JWT_SECRET` | Yes | Secret for JWT signing |
| `FLUTTERWAVE_SECRET_KEY` | Yes | Flutterwave API secret key |
| `FLUTTERWAVE_PUBLIC_KEY` | Yes | Flutterwave API public key |
| `FLUTTERWAVE_ENCRYPTION_KEY` | Yes | Flutterwave encryption key |
| `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` | Yes | Flutterwave public key (client-side) |
| `RESEND_API_KEY` | Yes | Resend API key for sending emails |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL (e.g. `https://pulsepass-phi.vercel.app`) |
| `FROM_NAME` | No | Email sender name (default: "PulsePass") |
| `FROM_EMAIL` | No | Email sender address (default: "noreply@resend.dev") |
| `FLUTTERWAVE_WEBHOOK_HASH` | No | Webhook signature hash for verification |

### Email Setup

The default `FROM_EMAIL` uses Resend's sandbox domain (`noreply@resend.dev`), which only sends to verified email addresses. To send to real users:

1. Verify a custom domain on [resend.com/domains](https://resend.com/domains)
2. Set `FROM_EMAIL` to `noreply@yourdomain.com` in your environment variables

### Flutterwave Setup

1. Create an account on [flutterwave.com](https://flutterwave.com)
2. Get your API keys from the dashboard
3. Set up a webhook endpoint pointing to `https://your-domain.com/api/webhooks/flutterwave`
4. Select the `charge.completed` event for the webhook

---

## License

This project is proprietary software. All rights reserved.
