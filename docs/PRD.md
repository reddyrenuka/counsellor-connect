# AI-Buildable PRD

# Counsellor Appointment Scheduler

## 1. Product Summary

A minimal web platform where clients can schedule counselling
appointments.\
The counsellor manages appointments via an admin dashboard.

Design goals:

-   Extremely simple architecture
-   No database
-   No APIs
-   JSON file storage in memory
-   Built so AI coding tools can generate most of the code automatically

------------------------------------------------------------------------

# 2. Core Features

## Client

-   Gmail login OR guest login
-   View available appointment slots
-   Book appointment
-   Cancel appointment
-   View appointment history

## Counsellor (Admin)

-   Gmail login only
-   Dashboard with appointment overview
-   Manage slots
-   View client bookings
-   Cancel or reschedule appointments

------------------------------------------------------------------------

# 3. Tech Stack

Recommended stack optimized for AI coding tools.

Frontend - React - Next.js - Tailwind CSS

Backend Runtime - Node.js - Next.js API routes or simple server runtime

State - In‑memory objects loaded from JSON

Storage

    /data
       users.json
       appointments.json
       slots.json

No database.

------------------------------------------------------------------------

# 4. Authentication Model

## Client Login

Option 1: Gmail login\
Option 2: Guest login

Guest login requires:

    name
    email

## Counsellor Login

Only Gmail login allowed.

Allowed admin email defined in config:

    ADMIN_EMAIL=counsellor@gmail.com

------------------------------------------------------------------------

# 5. System Architecture

High Level Flow

Client ↓ React Frontend ↓ Next.js Server Runtime ↓ JSON Files (Loaded
into Memory)

Startup Flow

    server start
    ↓
    load JSON files
    ↓
    store in memory objects
    ↓
    serve application

------------------------------------------------------------------------

# 6. Project Folder Structure

    counsellor-scheduler/

    app/
       page.tsx
       login/
       dashboard/
       book/
       appointments/

    admin/
       dashboard/
       appointments/
       slots/

    components/
       calendar/
       slot-picker/
       appointment-card/
       login-button/

    services/
       authService.ts
       appointmentService.ts
       slotService.ts

    data/
       users.json
       appointments.json
       slots.json

    types/
       user.ts
       appointment.ts
       slot.ts

    utils/
       fileLoader.ts
       idGenerator.ts

------------------------------------------------------------------------

# 7. Data Schemas

## User

    {
     id: string
     name: string
     email: string
     role: "client" | "admin"
    }

------------------------------------------------------------------------

## Slot

    {
     slotId: string
     date: string
     time: string
     status: "available" | "booked"
    }

------------------------------------------------------------------------

## Appointment

    {
     appointmentId: string
     clientEmail: string
     clientName: string
     date: string
     time: string
     reason: string
     status: "confirmed" | "cancelled"
    }

------------------------------------------------------------------------

# 8. Core Services

## Auth Service

Responsibilities:

-   Gmail login verification
-   Guest login creation
-   Session handling

Functions

    loginWithGoogle()
    loginAsGuest(name,email)
    isAdmin(email)
    logout()

------------------------------------------------------------------------

## Slot Service

Responsibilities:

-   Manage slot availability

Functions

    getAvailableSlots()
    createSlot()
    removeSlot()
    blockSlot()

------------------------------------------------------------------------

## Appointment Service

Responsibilities:

-   Booking logic

Functions

    bookAppointment()
    cancelAppointment()
    getUserAppointments()
    getAllAppointments()

------------------------------------------------------------------------

# 9. Client User Flow

    User opens website
    ↓
    Login with Gmail OR Guest
    ↓
    Dashboard loads
    ↓
    User clicks "Book Appointment"
    ↓
    Calendar view opens
    ↓
    User selects available slot
    ↓
    User submits booking
    ↓
    Confirmation page

------------------------------------------------------------------------

# 10. Admin User Flow

    Counsellor logs in with Gmail
    ↓
    Admin Dashboard
    ↓
    View today's sessions
    ↓
    Manage slots
    ↓
    View all appointments

------------------------------------------------------------------------

# 11. UI Pages

Public Pages

    /
    /login
    /about
    /book

Client Pages

    /dashboard
    /my-appointments
    /book

Admin Pages

    /admin/dashboard
    /admin/appointments
    /admin/slots

------------------------------------------------------------------------

# 12. Calendar UI Behavior

Calendar displays:

-   Available slots
-   Booked slots
-   Past slots disabled

Slot states:

    available
    booked
    past
    blocked

------------------------------------------------------------------------

# 13. Booking Logic

Booking Process

    select slot
    ↓
    check slot status
    ↓
    if available
    ↓
    create appointment
    ↓
    update slot status = booked

Cancellation

    cancel appointment
    ↓
    slot status = available

------------------------------------------------------------------------

# 14. Error Handling

System must handle:

-   Slot already booked
-   Invalid login
-   Unauthorized admin access
-   Missing session

------------------------------------------------------------------------

# 15. Security

Minimal security model

Rules:

-   Only configured Gmail can access admin dashboard
-   No persistent sessions
-   Session resets on browser close

------------------------------------------------------------------------

# 16. Future Enhancements

Potential upgrades

-   Payments
-   Google Calendar integration
-   Email reminders
-   Video sessions
-   Persistent database

------------------------------------------------------------------------

# 17. AI Coding Instructions

When generating code:

1.  Generate the full folder structure first.
2.  Implement JSON loading service.
3.  Create slot management service.
4.  Implement booking logic.
5.  Build React pages.
6.  Implement admin dashboard.

Goal: Generate an MVP that runs locally with:

    npm install
    npm run dev

and works immediately.
