# Architecture: Counsellor Appointment Scheduler

**Date**: 2026-03-16  
**Project**: Counsellor Connect  
**Architect**: AI Architect  
**Status**: Draft

---

## Overview

A minimal web application for counselling appointment scheduling built with Next.js and Node.js API routes. The system uses JSON files for data persistence (no database), supports Gmail OAuth and guest login for clients, and provides an admin dashboard for the counsellor to manage availability and appointments. The architecture is intentionally simple to maximize AI code generation compatibility while maintaining proper authentication and server-side validation.

---

## Components

### 1. **Next.js Frontend (Client-Side)**

- **Responsibility**: User interface for both clients and admin
- **Tech Stack**: Next.js 14+, React, Tailwind CSS
- **Key Pages**:
  - `/` - Landing page with counsellor profile
  - `/login` - Login page (Gmail OAuth + Guest login)
  - `/dashboard` - Client dashboard (appointment history)
  - `/book` - Appointment booking calendar
  - `/admin/dashboard` - Admin overview
  - `/admin/appointments` - Admin appointment management
  - `/admin/slots` - Admin availability management
- **Owner Layer**: Presentation layer

### 2. **Next.js API Routes (Server-Side)**

- **Responsibility**: Business logic, authentication, and data persistence
- **Tech Stack**: Node.js runtime within Next.js
- **Key Routes**:
  - `/api/auth/google` - Gmail OAuth callback handler
  - `/api/auth/guest` - Guest login handler
  - `/api/auth/session` - Session validation
  - `/api/slots/available` - Get available slots
  - `/api/slots/manage` - Create/delete slots (admin only)
  - `/api/appointments/book` - Create appointment
  - `/api/appointments/cancel` - Cancel appointment
  - `/api/appointments/list` - List appointments (filtered by role)
- **Owner Layer**: Application layer

### 3. **Data Services (Server-Side)**

- **Responsibility**: JSON file I/O and in-memory state management
- **Tech Stack**: Node.js fs module
- **Services**:
  - `fileLoader.ts` - Load JSON files into memory on startup
  - `authService.ts` - Authentication logic
  - `appointmentService.ts` - Appointment CRUD
  - `slotService.ts` - Slot availability management
- **Owner Layer**: Service layer

### 4. **JSON Data Store**

- **Responsibility**: Persistent data storage
- **Tech Stack**: JSON files in `/data` directory
- **Files**:
  - `users.json` - User profiles (guest users)
  - `appointments.json` - All appointments
  - `slots.json` - Availability slots
  - `config.json` - App configuration (admin email)
- **Owner Layer**: Data layer

---

## Component Interactions

### Client Login Flow

```
Client Browser
    ↓ (GET /)
Next.js Page (/)
    ↓ (User clicks "Login with Google")
OAuth Redirect → Google OAuth
    ↓ (Authorization code)
API Route (/api/auth/google)
    ↓ (Verify token with Google)
    ↓ (Check if admin email)
Auth Service
    ↓ (Create session)
Set HTTP-only cookie
    ↓ (Redirect to /dashboard)
Client Dashboard
```

### Booking Flow

```
Client Browser (/book)
    ↓ (GET /api/slots/available?date=2026-03-16)
API Route
    ↓ (Read slots.json + appointments.json)
Slot Service
    ↓ (Filter available slots)
Return JSON
    ↓
Client renders calendar
    ↓ (User selects slot)
    ↓ (POST /api/appointments/book)
API Route
    ↓ (Validate slot availability)
Appointment Service
    ↓ (Create appointment)
    ↓ (Update slot status)
    ↓ (Write appointments.json)
File System
    ↓
Return confirmation
```

### Admin Slot Management

```
Admin Browser (/admin/slots)
    ↓ (POST /api/slots/manage)
API Route
    ↓ (Verify admin session)
Auth Service
    ↓ (Add/remove slot)
Slot Service
    ↓ (Write slots.json)
File System
    ↓
Return updated slots
```

---

## Data Flow

### Startup Flow

1. Next.js server starts
2. `fileLoader.ts` reads all JSON files from `/data`
3. Data is cached in memory (Node.js module-level variables)
4. Application serves requests

### Write Flow

1. API route receives mutation request
2. Service layer updates in-memory state
3. Service writes updated JSON to file system using `fs.writeFile`
4. Response returned to client

### Read Flow

1. API route receives read request
2. Service layer reads from in-memory cache
3. Data filtered by user role/permissions
4. JSON response returned

**Note**: In-memory cache is the source of truth during runtime. JSON files are only read on startup and written on mutation.

---

## External Dependencies

### Google OAuth 2.0

- **Purpose**: Gmail login for clients and admin
- **Required Credentials**:
  - `GOOGLE_CLIENT_ID`
  - `GOOGLE_CLIENT_SECRET`
  - `GOOGLE_REDIRECT_URI`
- **Provider**: Google Cloud Console
- **Scope**: `openid email profile`

### Environment Variables

All stored in `.env.local`:

```
GOOGLE_CLIENT_ID=xxxxx
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
ADMIN_EMAIL=counsellor@example.com
SESSION_SECRET=random-secret-string
NODE_ENV=development
```

---

## Non-Functional Considerations

### Performance

- **Target**: Page load < 1s, API response < 200ms
- **Strategy**:
  - In-memory data cache (no database latency)
  - Static page generation for landing page
  - Minimal JavaScript bundle with Tailwind CSS

### Security

- **Authentication**: HTTP-only cookies with signed session tokens
- **Authorization**: Server-side role check on all admin routes
- **CSRF Protection**: Next.js built-in CSRF tokens
- **Input Validation**: Zod schemas for all API inputs
- **Constraints**:
  - Only configured admin email can access `/admin/*` routes
  - Guest users can only view/cancel their own appointments
  - Gmail users can view/cancel appointments linked to their email

### Observability

- **Logging**: Console logs for API requests (stdout)
- **Error Handling**: Centralized error middleware returns consistent JSON error format
- **Metrics**: None (minimal system, monitor via process logs)

### Error Handling Strategy

All API routes use try-catch with standard error responses:

```json
{
  "error": "User-friendly message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

Common error scenarios:
- Slot already booked → 409 Conflict
- Unauthorized access → 401 Unauthorized
- Invalid input → 400 Bad Request
- Server error → 500 Internal Server Error

### Scalability

**Current Limitations** (acceptable for v1):
- Single server instance (no horizontal scaling)
- No concurrent write locking (JSON file writes are atomic but not transactional)
- Memory-limited to JSON file size
- No caching layer

**Future Scaling Path** (out of scope):
- Migrate to PostgreSQL or SQLite
- Add Redis for session storage
- Implement optimistic locking for appointments

---

## ADR Compliance

No ADRs exist yet in this project. This architecture document serves as the foundational design.

**Recommended ADRs to create**:
1. **ADR-001**: JSON file storage vs database (accepted: JSON for v1 simplicity)
2. **ADR-002**: Next.js framework choice (accepted: Next.js for API routes + SSR)
3. **ADR-003**: Session management strategy (accepted: HTTP-only cookies)
4. **ADR-004**: Gmail OAuth vs custom auth (accepted: Gmail OAuth + guest fallback)

---

## Open Questions

### For Engineering Manager:

1. **OAuth Consent Screen**: ✅ **DECIDED - Skip Gmail OAuth, use guest login only**

2. **Admin Email Configuration**: ✅ **DECIDED - Use password field on login. Admin enters email + password, validated against `.env` credentials**

3. **Session Expiry**: ✅ **DECIDED - 1 day (24 hours) for all users**

4. **Guest User Management**: ✅ **DECIDED - Send email confirmations. Use dummy/mock email service initially (logs to console/file), swap for real SMTP when credentials provided**

5. **Concurrent Booking Conflicts**: ✅ **DECIDED - Use basic check-then-write validation (verify slot availability immediately before writing)**

6. **Time Zone Handling**: ✅ **DECIDED - Store all times in UTC, display in user's local timezone. Include timezone indicator in UI**

7. **Deployment Target**: ✅ **DECIDED - Vercel (free tier, automatic deployments from Git)**

---

## File Structure

```
counsellor-scheduler/
├── .env.local                    # Environment variables (not committed)
├── .env.example                  # Template for required env vars
├── package.json
├── next.config.js
├── tsconfig.json
├── tailwind.config.js
│
├── data/                         # JSON storage (gitignored)
│   ├── users.json
│   ├── appointments.json
│   ├── slots.json
│   └── config.json
│
├── src/
│   ├── app/                      # Next.js 14+ App Router
│   │   ├── page.tsx              # Landing page
│   │   ├── layout.tsx            # Root layout
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── book/
│   │   │   └── page.tsx
│   │   └── admin/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── appointments/
│   │       │   └── page.tsx
│   │       └── slots/
│   │           └── page.tsx
│   │
│   ├── pages/api/                # API routes (Next.js Pages Router)
│   │   ├── auth/
│   │   │   ├── google.ts
│   │   │   ├── guest.ts
│   │   │   └── session.ts
│   │   ├── slots/
│   │   │   ├── available.ts
│   │   │   └── manage.ts
│   │   └── appointments/
│   │       ├── book.ts
│   │       ├── cancel.ts
│   │       └── list.ts
│   │
│   ├── components/               # React components
│   │   ├── Calendar.tsx
│   │   ├── SlotPicker.tsx
│   │   ├── AppointmentCard.tsx
│   │   ├── LoginButton.tsx
│   │   └── Navbar.tsx
│   │
│   ├── services/                 # Business logic
│   │   ├── authService.ts
│   │   ├── appointmentService.ts
│   │   └── slotService.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── user.ts
│   │   ├── appointment.ts
│   │   └── slot.ts
│   │
│   └── utils/                    # Utilities
│       ├── fileLoader.ts
│       ├── idGenerator.ts
│       └── sessionManager.ts
│
├── public/                       # Static assets
│   └── images/
│
└── docs/
    └── superpowers/
        ├── specs/
        │   └── 2026-03-16-counsellor-scheduler-architecture.md (this file)
        └── plans/
            └── (implementation plans will go here)
```

---

## Technology Decisions Summary

| Category | Technology | Rationale |
|----------|------------|-----------|
| **Framework** | Next.js 14+ | Server-side rendering, API routes, optimized for AI code generation |
| **Runtime** | Node.js | Required for Next.js, handles file I/O |
| **Language** | TypeScript | Type safety, better AI code completion |
| **Styling** | Tailwind CSS | Utility-first, fast iteration, AI-friendly |
| **Authentication** | Google OAuth + Custom Guest | Secure Gmail login, flexible guest access |
| **Session Management** | HTTP-only cookies | Secure, no XSS attack surface |
| **Data Storage** | JSON files | No database complexity, perfect for v1 scope |
| **State Management** | React useState + API calls | No Redux needed for simple app |
| **Validation** | Zod | Runtime type checking for API inputs |

---

## Implementation Phases

### Phase 1: Core MVP (Week 1)
- JSON file loader and in-memory cache
- Guest login
- Available slots API
- Booking flow (client view)
- Admin slot management

### Phase 2: Admin Features (Week 2)
- Gmail OAuth integration
- Admin dashboard
- Appointment management (cancel/reschedule)
- Role-based access control

### Phase 3: Polish (Week 3)
- UI/UX refinements
- Error handling improvements
- Input validation
- Edge case testing

---

## Success Criteria

1. ✅ User can book an appointment as guest in < 2 minutes
2. ✅ Admin can add/remove availability slots in < 30 seconds
3. ✅ System prevents double-booking (same slot cannot be booked twice)
4. ✅ Gmail OAuth works for both clients and admin
5. ✅ Application runs locally with `npm install && npm run dev`
6. ✅ All data persists across server restarts (via JSON files)
7. ✅ API responses follow consistent JSON structure

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Concurrent booking race condition** | Medium | Add mutex lock or read-modify-write transaction |
| **JSON file corruption** | High | Implement atomic writes with temp files + rename |
| **OAuth credential exposure** | High | Store in `.env.local`, never commit, use secrets manager for production |
| **Session hijacking** | Medium | Use HTTP-only cookies, HTTPS in production, short session expiry for admin |
| **File system permission errors** | Low | Document required permissions, handle errors gracefully |
| **Gmail OAuth quota limits** | Low | Use Google Cloud project with proper quota, implement rate limiting |

---

## Next Steps

1. ✅ Architecture document approved (this document)
2. ⏳ Create implementation plan (next task)
3. ⏳ Set up Git worktree
4. ⏳ Hand off to Developer agent (@Developer)
5. ⏳ Begin TDD implementation

---

**Document Status**: Ready for review  
**Approval Required From**: Engineering Manager  
**Target Start Date**: 2026-03-17
