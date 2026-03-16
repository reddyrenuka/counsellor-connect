# Counsellor Appointment Scheduler

A Next.js-based appointment scheduling system for counselling sessions.

## Features

- ✅ Guest login (no registration required)
- ✅ Password-protected admin access
- ✅ JSON file-based data storage (no database needed)
- ✅ Session management with HTTP-only cookies
- ✅ Slot management (admin)
- ✅ Appointment booking and cancellation
- ✅ UTC timezone support with local display
- ✅ Responsive Tailwind CSS design

## Tech Stack

- Next.js 16 with App Router
- TypeScript
- Tailwind CSS
- Zod (validation)
- iron-session (session management)
- JSON file storage

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

**Important:** Update these variables:
- `ADMIN_EMAIL`: The email used for admin login
- `ADMIN_PASSWORD`: Strong password for admin access
- `SESSION_SECRET`: Generate a random 32+ character string

### 3. Initialize Data Files

The `data/` directory contains JSON files for storage:
- `users.json` - User accounts
- `appointments.json` - All appointments
- `slots.json` - Available time slots
- `config.json` - App configuration

These are already initialized with empty data.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Usage

### For Clients

1. Visit the homepage
2. Click "Book an Appointment"
3. Login as guest (provide name and email)
4. View available slots and book appointments
5. Manage your appointments from the dashboard

### For Admin (Counsellor)

1. Navigate to `/login`
2. Switch to "Admin Login" tab
3. Enter admin email and password (from `.env.local`)
4. Access admin dashboard to:
   - Create/remove availability slots
   - View all appointments
   - Cancel appointments

## API Endpoints

### Authentication
- `POST /api/auth/guest` - Guest login
- `POST /api/auth/admin` - Admin login
- `GET /api/auth/session` - Get current session
- `POST /api/auth/logout` - Logout

### Slots
- `GET /api/slots/available?date=YYYY-MM-DD` - Get available slots
- `POST /api/slots/manage` - Create/remove slots (admin only)

### Appointments
- `POST /api/appointments/book` - Book appointment
- `POST /api/appointments/cancel` - Cancel appointment
- `GET /api/appointments/list` - List appointments

## Project Structure

```
counsellor-scheduler/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   └── login/             # Login page
├── pages/api/             # API routes
│   ├── auth/              # Authentication endpoints
│   ├── slots/             # Slot management
│   └── appointments/      # Appointment management
├── services/              # Business logic
│   ├── authService.ts
│   ├── slotService.ts
│   └── appointmentService.ts
├── utils/                 # Utilities
│   ├── fileLoader.ts      # JSON file I/O
│   ├── sessionManager.ts  # Session handling
│   ├── validation.ts      # Zod schemas
│   └── errorHandler.ts    # Error management
├── types/                 # TypeScript types
│   ├── user.ts
│   ├── appointment.ts
│   ├── slot.ts
│   └── session.ts
└── data/                  # JSON storage
    ├── users.json
    ├── appointments.json
    ├── slots.json
    └── config.json
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Important:** Ensure the `data/` directory is writable or use a different persistence strategy for production.

## Development Status

### ✅ Completed - Full MVP Ready!
- ✅ Backend API layer (auth, slots, appointments)
- ✅ Session management with HTTP-only cookies
- ✅ Data persistence with JSON files
- ✅ TypeScript types and validation
- ✅ Home and login pages
- ✅ Client dashboard with appointment history
- ✅ Booking interface with date/time selection
- ✅ Admin dashboard with overview
- ✅ Admin slot management UI
- ✅ Admin appointments view with filtering

**Status**: Production-ready MVP - all core features implemented and tested

## Architecture Decisions

See `/docs/superpowers/specs/2026-03-16-counsellor-scheduler-architecture.md` for detailed architecture documentation.

Key decisions:
- **No Google OAuth** - Guest login with password-based admin access
- **1-day session expiry** - For security
- **UTC storage** - All times stored in UTC, displayed in local timezone
- **Email notifications** - Mock initially, SMTP integration later
- **Vercel deployment** - Free tier with auto-deployments

## Security Notes

- Sessions use HTTP-only cookies (secure in production)
- Admin password should be strong and stored in environment variables
- JSON files should have appropriate file permissions
- HTTPS required for production deployment

## License

Private project for counselling services.
