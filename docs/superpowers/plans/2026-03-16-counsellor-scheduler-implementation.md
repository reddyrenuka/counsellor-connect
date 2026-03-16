# Implementation Plan: Counsellor Appointment Scheduler

**Date**: 2026-03-16  
**Architecture Reference**: [2026-03-16-counsellor-scheduler-architecture.md](../specs/2026-03-16-counsellor-scheduler-architecture.md)  
**Estimated Time**: 3 weeks  
**Developer**: TBD

---

## Pre-Implementation Checklist

- [ ] Architecture document reviewed and approved
- [ ] Git worktree created: `feature/counsellor-scheduler`
- [ ] Baseline tests pass in worktree
- [ ] Environment variables template created (`.env.example`)

---

## Phase 1: Project Setup & Foundation (Days 1-2)

### Task Group 1.1: Initialize Next.js Project

- [ ] **Task 1.1.1**: Initialize Next.js project with TypeScript
  - **File**: `package.json`, `tsconfig.json`, `next.config.js`
  - **Action**: Run `npx create-next-app@latest counsellor-scheduler --typescript --tailwind --app --no-src-dir`
  - **Verification**: `npm run dev` starts successfully on port 3000

- [ ] **Task 1.1.2**: Install required dependencies
  - **File**: `package.json`
  - **Action**: Run `npm install zod googleapis iron-session uuid`
  - **Action**: Run `npm install -D @types/uuid`
  - **Verification**: All packages install without errors

- [ ] **Task 1.1.3**: Configure Tailwind CSS
  - **File**: `tailwind.config.js`
  - **Action**: Add custom colors and spacing for counsellor theme
  - **Verification**: Tailwind utilities work in test component

- [ ] **Task 1.1.4**: Create environment variables template
  - **File**: `.env.example`
  - **Action**: Add all required env vars with comments
  - **Verification**: File contains GOOGLE_CLIENT_ID, ADMIN_EMAIL, SESSION_SECRET

- [ ] **Task 1.1.5**: Add `.env.local` to `.gitignore`
  - **File**: `.gitignore`
  - **Action**: Ensure `.env.local` and `/data/*.json` are ignored
  - **Verification**: Git status does not show `.env.local` as untracked

### Task Group 1.2: Create Data Layer

- [ ] **Task 1.2.1**: Create TypeScript types
  - **File**: `src/types/user.ts`
  - **Action**: Define `User` interface with id, name, email, role
  - **Verification**: Type exports without errors

- [ ] **Task 1.2.2**: Create Appointment type
  - **File**: `src/types/appointment.ts`
  - **Action**: Define `Appointment` interface with id, clientEmail, date, time, status
  - **Verification**: Type exports without errors

- [ ] **Task 1.2.3**: Create Slot type
  - **File**: `src/types/slot.ts`
  - **Action**: Define `Slot` interface with slotId, date, time, status
  - **Verification**: Type exports without errors

- [ ] **Task 1.2.4**: Create data directory structure
  - **File**: `data/`
  - **Action**: Create `data/` folder at project root
  - **Verification**: Directory exists

- [ ] **Task 1.2.5**: Initialize empty JSON data files
  - **Files**: `data/users.json`, `data/appointments.json`, `data/slots.json`, `data/config.json`
  - **Action**: Create each file with empty array or empty object
  - **Verification**: All four files exist and contain valid JSON

- [ ] **Task 1.2.6**: Create file loader utility
  - **File**: `src/utils/fileLoader.ts`
  - **Action**: Implement `loadData()` function that reads all JSON files using `fs.readFileSync`
  - **Action**: Store in module-level variables (in-memory cache)
  - **Verification**: Function returns object with users, appointments, slots, config

- [ ] **Task 1.2.7**: Create file writer utility
  - **File**: `src/utils/fileLoader.ts` (add to existing)
  - **Action**: Implement `writeData(type, data)` function using `fs.writeFileSync`
  - **Action**: Add atomic write strategy (write to temp file, then rename)
  - **Verification**: Function writes JSON and updates in-memory cache

- [ ] **Task 1.2.8**: Test file loader on server startup
  - **File**: `src/app/layout.tsx`
  - **Action**: Call `loadData()` in root layout (server component)
  - **Verification**: Server logs show data loaded successfully

### Task Group 1.3: Create Service Layer

- [ ] **Task 1.3.1**: Create ID generator utility
  - **File**: `src/utils/idGenerator.ts`
  - **Action**: Implement `generateId()` using `uuid.v4()`
  - **Verification**: Function returns unique string on each call

- [ ] **Task 1.3.2**: Create slot service
  - **File**: `src/services/slotService.ts`
  - **Action**: Implement `getAvailableSlots(date)` - reads from in-memory cache
  - **Verification**: Function returns array of slots for given date

- [ ] **Task 1.3.3**: Add slot creation to service
  - **File**: `src/services/slotService.ts` (add to existing)
  - **Action**: Implement `createSlot(date, time)` - adds to cache and writes to file
  - **Verification**: Function creates slot and persists to JSON

- [ ] **Task 1.3.4**: Add slot deletion to service
  - **File**: `src/services/slotService.ts` (add to existing)
  - **Action**: Implement `removeSlot(slotId)` - removes from cache and writes to file
  - **Verification**: Function deletes slot and persists to JSON

- [ ] **Task 1.3.5**: Create appointment service
  - **File**: `src/services/appointmentService.ts`
  - **Action**: Implement `bookAppointment(clientEmail, clientName, slotId, topic)` - creates appointment and marks slot as booked
  - **Action**: Add validation: check slot is available before booking
  - **Verification**: Function creates appointment or throws error if slot unavailable

- [ ] **Task 1.3.6**: Add appointment cancellation
  - **File**: `src/services/appointmentService.ts` (add to existing)
  - **Action**: Implement `cancelAppointment(appointmentId)` - marks appointment as cancelled and frees slot
  - **Verification**: Function cancels appointment and makes slot available again

- [ ] **Task 1.3.7**: Add appointment retrieval
  - **File**: `src/services/appointmentService.ts` (add to existing)
  - **Action**: Implement `getUserAppointments(email)` - returns appointments for given email
  - **Action**: Implement `getAllAppointments()` - returns all appointments (admin only)
  - **Verification**: Functions return filtered/all appointments

---

## Phase 2: Authentication & Session Management (Days 3-4)

### Task Group 2.1: Session Management

- [ ] **Task 2.1.1**: Create session manager utility
  - **File**: `src/utils/sessionManager.ts`
  - **Action**: Configure `iron-session` with session options (cookie name, secret, ttl)
  - **Verification**: Session config object exports successfully

- [ ] **Task 2.1.2**: Create session type
  - **File**: `src/types/session.ts`
  - **Action**: Define `SessionData` interface with user, isAdmin, expiresAt
  - **Verification**: Type exports without errors

- [ ] **Task 2.1.3**: Create session helper functions
  - **File**: `src/utils/sessionManager.ts` (add to existing)
  - **Action**: Implement `getSession(req, res)` using iron-session
  - **Action**: Implement `createSession(req, res, user)` - sets session cookie
  - **Action**: Implement `destroySession(req, res)` - clears session
  - **Verification**: Functions compile without errors

### Task Group 2.2: Guest Authentication

- [ ] **Task 2.2.1**: Create auth service
  - **File**: `src/services/authService.ts`
  - **Action**: Implement `loginAsGuest(name, email)` - creates user in memory
  - **Action**: Add to users.json if email not exists
  - **Verification**: Function creates guest user and returns user object

- [ ] **Task 2.2.2**: Create guest login API route
  - **File**: `src/pages/api/auth/guest.ts`
  - **Action**: Create POST endpoint that accepts name, email
  - **Action**: Call `loginAsGuest()` and create session
  - **Action**: Add Zod validation for input
  - **Verification**: curl POST returns success and sets cookie

- [ ] **Task 2.2.3**: Test guest login flow
  - **File**: N/A (manual test)
  - **Action**: POST to `/api/auth/guest` with valid data
  - **Verification**: Response includes user object and Set-Cookie header

### Task Group 2.3: Google OAuth

- [ ] **Task 2.3.1**: Configure Google OAuth client
  - **File**: `src/services/authService.ts` (add to existing)
  - **Action**: Import `google` from `googleapis`
  - **Action**: Create OAuth2 client with credentials from env vars
  - **Verification**: OAuth client initializes without errors

- [ ] **Task 2.3.2**: Create OAuth redirect API route
  - **File**: `src/pages/api/auth/google.ts`
  - **Action**: Create GET endpoint that redirects to Google OAuth consent screen
  - **Action**: Generate auth URL with proper scopes and redirect URI
  - **Verification**: GET request redirects to Google login page

- [ ] **Task 2.3.3**: Create OAuth callback API route
  - **File**: `src/pages/api/auth/google/callback.ts`
  - **Action**: Create GET endpoint that handles OAuth callback with code
  - **Action**: Exchange code for tokens using OAuth client
  - **Action**: Fetch user info (email, name) from Google
  - **Action**: Check if email matches ADMIN_EMAIL from env
  - **Action**: Create session with isAdmin flag
  - **Action**: Redirect to /dashboard or /admin/dashboard based on role
  - **Verification**: OAuth callback creates session and redirects correctly

- [ ] **Task 2.3.4**: Test Google OAuth flow
  - **File**: N/A (manual test)
  - **Action**: Navigate to `/api/auth/google`, complete OAuth flow
  - **Verification**: User is redirected back and session cookie is set

### Task Group 2.4: Session Validation

- [ ] **Task 2.4.1**: Create session validation API route
  - **File**: `src/pages/api/auth/session.ts`
  - **Action**: Create GET endpoint that returns current session user
  - **Action**: Return 401 if no session
  - **Verification**: curl GET returns user or 401

- [ ] **Task 2.4.2**: Create middleware for protected routes
  - **File**: `src/utils/authMiddleware.ts`
  - **Action**: Implement `requireAuth()` - checks session exists
  - **Action**: Implement `requireAdmin()` - checks isAdmin flag
  - **Verification**: Functions return 401/403 when conditions not met

- [ ] **Task 2.4.3**: Apply auth middleware to admin routes
  - **File**: All `/src/pages/api/admin/*` routes (will be created later)
  - **Action**: Add `requireAdmin()` check at start of each handler
  - **Verification**: Admin routes return 403 for non-admin users

---

## Phase 3: API Routes (Days 5-7)

### Task Group 3.1: Slot Management APIs

- [ ] **Task 3.1.1**: Create available slots API
  - **File**: `src/pages/api/slots/available.ts`
  - **Action**: Create GET endpoint with query param `date`
  - **Action**: Call `slotService.getAvailableSlots(date)`
  - **Action**: Add Zod validation for date format
  - **Verification**: curl GET returns array of available slots

- [ ] **Task 3.1.2**: Create slot management API
  - **File**: `src/pages/api/slots/manage.ts`
  - **Action**: Create POST endpoint (requires admin)
  - **Action**: Support two operations: "create" and "remove"
  - **Action**: Call appropriate slotService function
  - **Action**: Add Zod validation for input
  - **Verification**: curl POST creates/removes slot when authenticated as admin

- [ ] **Task 3.1.3**: Test slot APIs
  - **File**: N/A (manual test)
  - **Action**: Create slots via POST, fetch via GET
  - **Verification**: Slots persist to JSON and appear in GET response

### Task Group 3.2: Appointment APIs

- [ ] **Task 3.2.1**: Create booking API
  - **File**: `src/pages/api/appointments/book.ts`
  - **Action**: Create POST endpoint (requires auth)
  - **Action**: Accept clientEmail, clientName, slotId, topic
  - **Action**: Call `appointmentService.bookAppointment()`
  - **Action**: Add Zod validation
  - **Action**: Return 409 if slot already booked
  - **Verification**: curl POST creates appointment or returns 409

- [ ] **Task 3.2.2**: Create cancellation API
  - **File**: `src/pages/api/appointments/cancel.ts`
  - **Action**: Create POST endpoint (requires auth)
  - **Action**: Accept appointmentId
  - **Action**: Verify user owns appointment (unless admin)
  - **Action**: Call `appointmentService.cancelAppointment()`
  - **Verification**: curl POST cancels appointment and frees slot

- [ ] **Task 3.2.3**: Create appointment list API
  - **File**: `src/pages/api/appointments/list.ts`
  - **Action**: Create GET endpoint (requires auth)
  - **Action**: If admin, return all appointments
  - **Action**: If client, return only their appointments
  - **Verification**: curl GET returns filtered appointments based on role

- [ ] **Task 3.2.4**: Test appointment APIs end-to-end
  - **File**: N/A (manual test)
  - **Action**: Book appointment, list appointments, cancel appointment
  - **Verification**: Full flow works and data persists

---

## Phase 4: Frontend Components (Days 8-10)

### Task Group 4.1: Shared Components

- [ ] **Task 4.1.1**: Create Navbar component
  - **File**: `src/components/Navbar.tsx`
  - **Action**: Display app name, navigation links, logout button
  - **Action**: Show different links based on user role (client vs admin)
  - **Verification**: Component renders with proper links

- [ ] **Task 4.1.2**: Create LoginButton component
  - **File**: `src/components/LoginButton.tsx`
  - **Action**: Button that redirects to `/api/auth/google`
  - **Verification**: Clicking button starts OAuth flow

- [ ] **Task 4.1.3**: Create AppointmentCard component
  - **File**: `src/components/AppointmentCard.tsx`
  - **Action**: Display appointment details (date, time, status)
  - **Action**: Show cancel button if status is "confirmed"
  - **Verification**: Component renders appointment data

- [ ] **Task 4.1.4**: Create SlotPicker component
  - **File**: `src/components/SlotPicker.tsx`
  - **Action**: Display list of time slots for selected date
  - **Action**: Disable booked/past slots
  - **Action**: Emit selected slot via callback
  - **Verification**: Component allows slot selection

- [ ] **Task 4.1.5**: Create Calendar component
  - **File**: `src/components/Calendar.tsx`
  - **Action**: Calendar grid showing dates
  - **Action**: Highlight dates with available slots
  - **Action**: Emit selected date via callback
  - **Verification**: Component allows date selection

### Task Group 4.2: Client Pages

- [ ] **Task 4.2.1**: Create landing page
  - **File**: `src/app/page.tsx`
  - **Action**: Display counsellor profile, description, call-to-action
  - **Action**: Add "Book Appointment" button that links to `/login`
  - **Verification**: Page renders with proper content

- [ ] **Task 4.2.2**: Create login page
  - **File**: `src/app/login/page.tsx`
  - **Action**: Display two options: "Login with Google" and "Continue as Guest"
  - **Action**: Guest option shows form for name + email
  - **Action**: Submit guest form calls `/api/auth/guest`
  - **Action**: Google button redirects to `/api/auth/google`
  - **Verification**: Both login methods work

- [ ] **Task 4.2.3**: Create client dashboard page
  - **File**: `src/app/dashboard/page.tsx`
  - **Action**: Fetch appointments from `/api/appointments/list`
  - **Action**: Display upcoming and past appointments
  - **Action**: Add "Book New Appointment" button
  - **Verification**: Page shows user's appointments

- [ ] **Task 4.2.4**: Create booking page
  - **File**: `src/app/book/page.tsx`
  - **Action**: Use Calendar component for date selection
  - **Action**: Use SlotPicker component for time selection
  - **Action**: Show booking form (topic, client info pre-filled if logged in)
  - **Action**: Submit form calls `/api/appointments/book`
  - **Action**: Redirect to dashboard on success
  - **Verification**: User can book appointment through UI

- [ ] **Task 4.2.5**: Add cancellation to AppointmentCard
  - **File**: `src/components/AppointmentCard.tsx` (update)
  - **Action**: Add cancel button that calls `/api/appointments/cancel`
  - **Action**: Show confirmation dialog before cancelling
  - **Action**: Refresh appointment list after success
  - **Verification**: User can cancel appointment from dashboard

### Task Group 4.3: Admin Pages

- [ ] **Task 4.3.1**: Create admin dashboard page
  - **File**: `src/app/admin/dashboard/page.tsx`
  - **Action**: Fetch all appointments from `/api/appointments/list`
  - **Action**: Display today's appointments prominently
  - **Action**: Show upcoming appointments count
  - **Action**: Add links to slots management and all appointments
  - **Verification**: Page shows admin overview

- [ ] **Task 4.3.2**: Create admin appointments page
  - **File**: `src/app/admin/appointments/page.tsx`
  - **Action**: Fetch all appointments
  - **Action**: Display in table or list format
  - **Action**: Show filters: upcoming, past, cancelled
  - **Action**: Add cancel button for each appointment
  - **Verification**: Admin can view and manage all appointments

- [ ] **Task 4.3.3**: Create admin slots page
  - **File**: `src/app/admin/slots/page.tsx`
  - **Action**: Use Calendar component for date selection
  - **Action**: Show slots for selected date
  - **Action**: Add form to create new slot (time input)
  - **Action**: Add delete button for each slot
  - **Action**: Submit calls `/api/slots/manage`
  - **Verification**: Admin can add/remove slots

### Task Group 4.4: Root Layout & Routing

- [ ] **Task 4.4.1**: Update root layout
  - **File**: `src/app/layout.tsx`
  - **Action**: Include Navbar component
  - **Action**: Add session provider context if needed
  - **Action**: Add global styles and Tailwind imports
  - **Verification**: Layout renders on all pages

- [ ] **Task 4.4.2**: Add route protection client-side
  - **File**: Create `src/components/ProtectedRoute.tsx`
  - **Action**: Component that checks session via `/api/auth/session`
  - **Action**: Redirect to `/login` if not authenticated
  - **Verification**: Protected pages redirect when not logged in

- [ ] **Task 4.4.3**: Wrap client pages with ProtectedRoute
  - **Files**: `src/app/dashboard/page.tsx`, `src/app/book/page.tsx`
  - **Action**: Use ProtectedRoute wrapper or check session in component
  - **Verification**: Pages require authentication

- [ ] **Task 4.4.4**: Wrap admin pages with admin check
  - **Files**: All `src/app/admin/*/page.tsx`
  - **Action**: Check `isAdmin` flag from session
  - **Action**: Show 403 error if not admin
  - **Verification**: Admin pages only accessible to admin

---

## Phase 5: Error Handling & Validation (Days 11-12)

### Task Group 5.1: Input Validation

- [ ] **Task 5.1.1**: Create Zod schemas
  - **File**: `src/utils/validation.ts`
  - **Action**: Define schema for appointment booking
  - **Action**: Define schema for slot creation
  - **Action**: Define schema for guest login
  - **Verification**: Schemas export successfully

- [ ] **Task 5.1.2**: Apply validation to all API routes
  - **Files**: All `src/pages/api/**/*.ts`
  - **Action**: Add schema.parse() at start of each handler
  - **Action**: Return 400 with error details if validation fails
  - **Verification**: Invalid requests return 400 with helpful error message

### Task Group 5.2: Error Handling

- [ ] **Task 5.2.1**: Create error response utility
  - **File**: `src/utils/errorHandler.ts`
  - **Action**: Implement `sendError(res, statusCode, message, code)`
  - **Action**: Return consistent JSON error format
  - **Verification**: Utility returns standardized error responses

- [ ] **Task 5.2.2**: Add try-catch to all API routes
  - **Files**: All `src/pages/api/**/*.ts`
  - **Action**: Wrap handler logic in try-catch
  - **Action**: Use errorHandler for all errors
  - **Action**: Log errors to console with stack trace
  - **Verification**: API errors return 500 with generic message

- [ ] **Task 5.2.3**: Add error boundaries to frontend
  - **File**: `src/components/ErrorBoundary.tsx`
  - **Action**: Create React error boundary component
  - **Action**: Display user-friendly error message
  - **Verification**: Frontend errors don't crash the app

- [ ] **Task 5.2.4**: Add loading and error states to pages
  - **Files**: All page components
  - **Action**: Show loading spinner while fetching data
  - **Action**: Show error message if fetch fails
  - **Verification**: UI handles loading and error states gracefully

### Task Group 5.3: Edge Cases

- [ ] **Task 5.3.1**: Handle concurrent booking attempts
  - **File**: `src/services/appointmentService.ts` (update)
  - **Action**: Add mutex/lock to bookAppointment function
  - **Action**: Return 409 if slot booked between check and write
  - **Verification**: Concurrent requests handled correctly

- [ ] **Task 5.3.2**: Handle missing JSON files
  - **File**: `src/utils/fileLoader.ts` (update)
  - **Action**: Check if files exist before reading
  - **Action**: Create files with defaults if missing
  - **Verification**: App initializes even if data/ folder is empty

- [ ] **Task 5.3.3**: Handle JSON file corruption
  - **File**: `src/utils/fileLoader.ts` (update)
  - **Action**: Add try-catch around JSON.parse
  - **Action**: Log error and use empty default if parse fails
  - **Verification**: App doesn't crash on invalid JSON

---

## Phase 6: Testing & Polish (Days 13-15)

### Task Group 6.1: Manual Testing

- [ ] **Task 6.1.1**: Test full client booking flow
  - **Action**: Guest login → Book appointment → View dashboard → Cancel appointment
  - **Verification**: Flow works end-to-end without errors

- [ ] **Task 6.1.2**: Test full admin flow
  - **Action**: Gmail login → Add slots → View appointments → Cancel appointment
  - **Verification**: Admin can manage appointments and slots

- [ ] **Task 6.1.3**: Test edge cases
  - **Action**: Try booking same slot twice, cancel non-existent appointment, access admin as guest
  - **Verification**: Errors handled gracefully

- [ ] **Task 6.1.4**: Test in multiple browsers
  - **Action**: Test in Chrome, Firefox, Safari
  - **Verification**: App works consistently across browsers

### Task Group 6.2: UI/UX Polish

- [ ] **Task 6.2.1**: Add loading spinners
  - **Files**: All pages with async operations
  - **Action**: Show spinner during API calls
  - **Verification**: User sees loading state

- [ ] **Task 6.2.2**: Add success toasts/notifications
  - **File**: Create `src/components/Toast.tsx`
  - **Action**: Show success message after booking, cancellation, slot creation
  - **Verification**: User receives confirmation feedback

- [ ] **Task 6.2.3**: Improve mobile responsiveness
  - **Files**: All components and pages
  - **Action**: Test on mobile viewport, adjust styles with Tailwind
  - **Verification**: App is usable on mobile devices

- [ ] **Task 6.2.4**: Add accessibility features
  - **Files**: All interactive components
  - **Action**: Add ARIA labels, keyboard navigation
  - **Verification**: App meets basic accessibility standards

### Task Group 6.3: Documentation

- [ ] **Task 6.3.1**: Update README
  - **File**: `README.md`
  - **Action**: Add setup instructions, environment variables, usage guide
  - **Verification**: New developer can follow README and run app

- [ ] **Task 6.3.2**: Document API endpoints
  - **File**: `docs/api/README.md`
  - **Action**: List all endpoints with request/response examples
  - **Verification**: API documentation is complete

- [ ] **Task 6.3.3**: Create deployment guide
  - **File**: `docs/DEPLOYMENT.md`
  - **Action**: Document how to deploy to Vercel or other platforms
  - **Verification**: Deployment steps are clear

---

## Phase 7: Git & Handoff (Day 16)

### Task Group 7.1: Code Quality

- [ ] **Task 7.1.1**: Run linter
  - **Action**: Run `npm run lint` and fix all errors
  - **Verification**: No linting errors

- [ ] **Task 7.1.2**: Format code
  - **Action**: Run `npm run format` (if Prettier configured)
  - **Verification**: Code style is consistent

- [ ] **Task 7.1.3**: Remove console.logs
  - **Files**: All source files
  - **Action**: Remove or replace debug console.logs with proper logging
  - **Verification**: No debug logs in production code

### Task Group 7.2: Git Workflow

- [ ] **Task 7.2.1**: Commit all changes
  - **Action**: `git add . && git commit -m "feat: implement counsellor appointment scheduler"`
  - **Verification**: All changes committed

- [ ] **Task 7.2.2**: Push to remote
  - **Action**: `git push origin feature/counsellor-scheduler`
  - **Verification**: Branch pushed successfully

- [ ] **Task 7.2.3**: Create pull request
  - **Action**: Open PR on GitHub with description linking to architecture doc
  - **Verification**: PR created and ready for review

- [ ] **Task 7.2.4**: Request code review
  - **Action**: Assign reviewer and add labels
  - **Verification**: PR assigned to @QA agent or engineering manager

---

## Verification Checklist (Final)

Before marking implementation complete, verify:

- [ ] All environment variables documented in `.env.example`
- [ ] `npm install && npm run dev` starts app successfully
- [ ] Guest login flow works
- [ ] Google OAuth login flow works
- [ ] Client can book appointment
- [ ] Client can view their appointments
- [ ] Client can cancel appointment
- [ ] Admin can add/remove slots
- [ ] Admin can view all appointments
- [ ] Admin can cancel any appointment
- [ ] Data persists across server restarts (JSON files written correctly)
- [ ] Concurrent booking race condition handled
- [ ] All API errors return consistent format
- [ ] UI is responsive on mobile
- [ ] README is accurate and complete
- [ ] No linting errors
- [ ] All tests pass (if tests written)

---

## Post-Implementation

Once all tasks complete and verification passes:

1. Merge PR to main branch
2. Deploy to staging environment
3. Run smoke tests in staging
4. Deploy to production
5. Monitor logs for errors
6. Collect user feedback

---

**Total Estimated Tasks**: 131  
**Average Time per Task**: 5-10 minutes  
**Buffer Time**: 20% for unexpected issues

