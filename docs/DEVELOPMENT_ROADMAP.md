# HOSTELHUB – DEVELOPMENT ROADMAP & IMPLEMENTATION PLAN

**Project Title:** HostelHub – Smart Hostel Management System  
**Document Version:** 1.1.0  
**Phase:** Phase 1 – System Specification & Architecture  
**Status:** Approved Engineering Roadmap (Corrected)  
**Base Audit Reference:** [`docs/PROJECT_AUDIT.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_AUDIT.md)  
**Parent Requirements Document:** [`docs/PROJECT_REQUIREMENTS.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_REQUIREMENTS.md)  
**Authoritative Roles & Permissions:** [`docs/USER_ROLES.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/USER_ROLES.md)  
**Feature Traceability Checklist:** [`docs/FEATURE_CHECKLIST.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/FEATURE_CHECKLIST.md)  
**Date:** November 3, 2026  

---

## 1. Roadmap Overview & Milestones

This engineering roadmap defines the sequence of implementation phases for transforming HostelHub from its current frontend-only prototype into a secure, fully integrated, full-stack enterprise web system.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       HOSTELHUB IMPLEMENTATION PHASES                       │
└─────────────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PHASE 1    │ ──► │   PHASE 2    │ ──► │   PHASE 3    │ ──► │   PHASE 4    │ ──► [ PHASE 5: VERIFY ]
│ Requirements │     │ Backend Core │     │ REST APIs &  │     │ Frontend API │     │ - E2E Testing   │
│  & DB Design │     │ & Models     │     │ Rules Engine │     │ & Auth State │     │ - CSS Cleanup   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └─────────────────┘
```

---

## 2. Phase-by-Phase Implementation Plan

### Phase 1: Requirements Specification & Database Schema Design *(Current Phase)*
- **Objective:** Establish unambiguous functional, non-functional, security, and data architecture baselines before writing code.
- **Milestones & Deliverables:**
  1. Complete system requirements specification ([`docs/PROJECT_REQUIREMENTS.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_REQUIREMENTS.md)) – *Complete*.
  2. Define role boundaries and maintain the **single authoritative permission matrix** ([`docs/USER_ROLES.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/USER_ROLES.md)) – *Complete*.
  3. Formulate feature traceability checklist with all 74 items ([`docs/FEATURE_CHECKLIST.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/FEATURE_CHECKLIST.md)) – *Complete*.
  4. Formulate phased development roadmap ([`docs/DEVELOPMENT_ROADMAP.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/DEVELOPMENT_ROADMAP.md)) – *Complete*.
  5. *Next Step (Task 2 of Phase 1):* Produce comprehensive Database Schema Design Document detailing Mongoose collections, indexes, relationships, and validation rules (`docs/DATABASE_SCHEMA.md`).
- **Exit Criteria:** All specification documents reviewed and approved by user before creating backend files.

---

### Phase 2: Express Backend Foundation, Security & Database Setup
- **Objective:** Initialize the backend server environment, configure MongoDB Atlas connectivity, implement core Mongoose models, and set up database seeds.
- **Detailed Tasks:**
  1. Scaffold backend structure in `server/` with directories: `config`, `controllers`, `middleware`, `models`, `routes`, `utils`, `services`.
  2. Implement `config/db.js` using Mongoose with connection pooling and retry logic.
  3. Create `.env.example` documenting `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`.
  4. Build core Mongoose schemas with validation and indexing:
     - `User.js` (Strict role enum: `['student', 'admin']`, bcrypt password hashing pre-save hook).
     - `Block.js` (Hostel block metadata, gender designation, floor count).
     - `Room.js` (Room number, block, capacity, bedsAvailable, status).
     - `Bed.js` (Individual bed ID, status, assigned student reference).
     - `Booking.js` (Student reference, room, bed, status: `Pending`/`Approved`/`Rejected`).
     - `Application.js` (Student details, preferences, status lifecycle).
     - `Complaint.js` (Title, category, room, deterministic priority, SLA deadline, status).
     - `StaffRecord.js` (Maintenance/cleaning staff records only — zero login accounts).
     - `Fee.js`, `Payment.js`, `Attendance.js`, `GatePass.js`, `SOS.js`, `MessMenu.js`.
  5. Implement standalone **idempotent seed script** (`server/scripts/seed.js` executed via `npm run seed`) to safely populate initial blocks, rooms, and a secure root administrator account from environment variables without creating duplicate admin records.
- **Exit Criteria:** Backend boots cleanly, connects to MongoDB Atlas, and successfully seeds baseline data.

---

### Phase 3: REST API Development & Business Rules Engine
- **Objective:** Implement complete CRUD endpoints, authentication workflows, deterministic business rules, and security middleware.
- **Detailed Tasks:**
  1. **Authentication API (`/api/auth`):**
     - `POST /api/auth/register` (Restricted strictly to student self-registration; rejects any `role: "admin"`).
     - `POST /api/auth/login` (Validates bcrypt hash, issues signed JWT).
     - `GET /api/auth/me` (Protected profile retrieval).
     - `PUT /api/auth/profile` and `PUT /api/auth/change-password`.
  2. **Security Middleware:**
     - `auth.js`: Verifies HTTP Bearer JWT and extracts user payload.
     - `role.js`: Strict role validation (`requireRole('admin')`, `requireRole('student')`).
  3. **Authoritative Unified Room Allocation Service (`RoomAllocationService`):**
     - Implements `RoomAllocationService.allocateBed()` used jointly by application approvals (`ADM-06`), booking approvals (`ADM-09`), and direct allocations (`ADM-04`/`ADM-13`).
     - Enforces atomic database transactions to eliminate double-booking and prevent duplicate student allocations.
  4. **Admissions & Booking API (`/api/applications`, `/api/bookings`):**
     - Student submission endpoints; Admin review, approval, and allocation endpoints.
  5. **Complaint API (`/api/complaints`):**
     - Deterministic keyword priority calculation engine.
     - Configurable SLA resolution target calculation (defaults: 4h, 24h, 48h, 72h) and automated escalation tagging.
     - Worker assignment (staff as records only) and status transition endpoints.
  6. **Operational Endpoints:**
     - Student & Staff Attendance (`/api/attendance`) with staff tracked strictly as administrative records.
     - Fees & Payment Verification (`/api/fees`) with manual offline reconciliation (UTR/challan) as the baseline.
     - Outpass & Digital Gate Passes (`/api/gatepasses`) with strict overlapping active outpass prevention.
     - Emergency SOS Alert System (`/api/sos`) optimized for polling communication in the initial prototype.
     - Mess Menu & Ratings (`/api/mess`).
     - Broadcast Announcements (`/api/announcements`).
- **Exit Criteria:** All API endpoints respond with structured JSON, enforce RBAC, pass error handling checks, and satisfy Postman/cURL test suites.

---

### Phase 4: Frontend State Architecture, API Client & Route Protection
- **Objective:** Connect the React frontend to the backend REST API, replace mock in-memory context with live server queries, implement authentication state, and secure routing.
- **Detailed Tasks:**
  1. **API Client & Networking:**
     - Configure Axios or Fetch wrapper (`src/services/api.js`) with baseURL, timeout, and automatic Bearer JWT injection interceptors.
     - Centralized error response handling (401 triggers logout, 403 shows access denied).
  2. **Authentication State Management:**
     - Create `AuthContext` (`src/context/AuthContext.jsx`) managing: `user`, `token`, `isAuthenticated`, `role`, `login()`, `logout()`.
     - Client-side logout clears client token and resets state, terminating client session.
     - Persist token safely in client storage; auto-restore session on page refresh.
  3. **Emergency SOS Polling Integration:**
     - Implement periodic short-interval polling (5–10s) in the Admin Dashboard to fetch active distress signals without requiring WebSocket infrastructure for the initial prototype.
  4. **Route Security & Navigation Guards:**
     - Create `ProtectedRoute.jsx` component inspecting authentication and role.
     - Wrap `/student/*` routes with `requireRole="student"`.
     - Wrap `/admin/*` routes with `requireRole="admin"`.
     - Update [`src/App.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/App.jsx) to use protected route layout.
  5. **Fix Existing Linter Errors:**
     - Resolve ESLint fast refresh export in `HostelContext.jsx`.
     - Remove unused variable `rejectedBookings` in `AdminDashboard.jsx`.
  6. **Wire Authentication Views:**
     - Connect [`src/pages/Login.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/Login.jsx) to `POST /api/auth/login`.
     - Implement student registration view.
     - Connect [`Sidebar.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/components/Sidebar.jsx) sign-out action to `AuthContext.logout()`.
- **Exit Criteria:** Unauthenticated users cannot access portals; login successfully routes students to Student Portal and admins to Admin Portal; `npm run lint` passes with 0 errors.

---

### Phase 5: Portal-by-Portal Integration, UI Polish & System Verification
- **Objective:** Wire all individual frontend views to live endpoints, remove hardcoded data, clean up duplicate CSS, and verify system integrity.
- **Detailed Tasks:**
  1. **Student Portal Wiring:**
     - [`StudentDashboard.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/StudentDashboard.jsx): Remove hardcoded `"Karan"` / `"1JB24CS093"`; bind to live user profile, room assignment, active complaints, and live activity stream.
     - [`Rooms.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/Rooms.jsx): Bind room cards to backend inventory; bind booking requests to authenticated user ID.
     - [`Application.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/Application.jsx): Pre-populate student profile details; submit admission applications to backend; scope history to current user.
     - [`Complaints.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/Complaints.jsx): Remove hardcoded identity; submit complaints with evidence; display live status and priority badges.
     - Integrate remaining resident tools: Gate Pass generator with overlapping outpass validation, SOS panic button, Mess menu, Attendance view, Fee ledger with offline UTR submission.
  2. **Admin Portal Wiring:**
     - [`AdminDashboard.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/AdminDashboard.jsx): Connect KPI cards, occupancy meters, SOS polling monitor, and recent activity feeds to backend analytics endpoints.
     - Room Management in `Rooms.jsx`: Connect Add Room, Edit Capacity, and Delete Room actions to backend API.
     - [`Bookings.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/Bookings.jsx): Wire Approve (allocates bed via `RoomAllocationService`) and Reject actions to backend API.
     - [`ApplicationsAdmin.jsx`](file:///C:/Users/l46ka/hostel-management-frontend/src/pages/ApplicationsAdmin.jsx): Wire Approve (allocates bed via `RoomAllocationService`) and Reject actions to backend API.
     - Admin Complaints in `Complaints.jsx`: Wire status dropdowns, configurable SLA targets, and contractor assignments to backend API.
     - Integrate remaining admin tools: Student registry, Gate pass review, Fee manual reconciliation, Staff attendance roster (staff as records only).
  3. **Codebase & Asset Cleanup:**
     - Remove dead file `src/components/Navbar.jsx`.
     - Remove unused boilerplate file `src/App.css`.
     - Modernize and deduplicate [`src/index.css`](file:///C:/Users/l46ka/hostel-management-frontend/src/index.css) to eliminate duplicate rules and reduce bundle size.
     - Replace browser `alert()` and `confirm()` with non-blocking toast notifications.
  4. **System Verification & Audit Check:**
     - Verify zero AI/ML features across the entire repository.
     - Verify strictly two roles (`student`, `admin`) with zero warden/staff/parent logins.
     - Execute production build (`npm run build`) and lint verification (`npm run lint`).
- **Exit Criteria:** Fully functional, end-to-end verified hostel management platform satisfying all 74 features across Student and Admin portals.

---

## 3. Deliverables Summary by Phase

| Phase | Core Deliverables | Verification Milestone |
|---|---|---|
| **Phase 1** | Requirements Spec, Roles Spec (Authoritative Permissions), Feature Checklist, Roadmap, DB Schema Design | Documentation complete, approved, committed. |
| **Phase 2** | Express server, MongoDB connection, Mongoose models, Idempotent Admin Seed script | Server boots, connects to DB, seeds initial data. |
| **Phase 3** | REST APIs, Unified RoomAllocationService, Configurable SLAs, RBAC middleware | API routes pass functional validation tests. |
| **Phase 4** | API client, AuthContext, ProtectedRoute guards, SOS polling, Auth views | Login and role routing verified; lint passes with 0 errors. |
| **Phase 5** | All pages bound to APIs, CSS cleaned, dead code purged, E2E tested | Production build passes; zero AI; exactly 2 roles verified. |
