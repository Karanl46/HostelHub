# HOSTELHUB – USER ROLES & PERMISSION SPECIFICATION

**Project Title:** HostelHub – Smart Hostel Management System  
**Document Version:** 1.1.0  
**Phase:** Phase 1 – System Specification & Architecture  
**Status:** Authoritative User Roles & Permissions Baseline  
**Base Audit Reference:** [`docs/PROJECT_AUDIT.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_AUDIT.md)  
**Parent Requirements Document:** [`docs/PROJECT_REQUIREMENTS.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_REQUIREMENTS.md)  
**Feature Traceability Checklist:** [`docs/FEATURE_CHECKLIST.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/FEATURE_CHECKLIST.md)  
**Development Roadmap:** [`docs/DEVELOPMENT_ROADMAP.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/DEVELOPMENT_ROADMAP.md)  
**Date:** November 3, 2026  

---

## 1. Fixed Architectural Role Model

HostelHub operates under a **strictly bifurcated, two-role security architecture**. Every authenticated user in the system belongs exclusively to one of these two roles:

```
                      ┌─────────────────────────────────┐
                      │    HOSTELHUB AUTHENTICATION     │
                      │          (JWT Engine)           │
                      └────────────────┬────────────────┘
                                       │
                    ┌──────────────────┴──────────────────┐
                    ▼                                     ▼
        ┌───────────────────────┐             ┌───────────────────────┐
        │     STUDENT ROLE      │             │      ADMIN ROLE       │
        │ - Resident / Applicant│             │ - Chief Administrator │
        │ - Scoped Data Access  │             │ - Global Oversight    │
        │ - Self-Service Portal │             │ - Operational Control │
        └───────────────────────┘             └───────────────────────┘
```

There are **no secondary, delegated, or external authenticated roles**. Specifically:
- **No Warden Login or Role:** Warden duties (room allotment, discipline, approvals) are executed via the Admin Portal.
- **No Staff Login or Role (Staff Are Records Only):** Maintenance workers, electricians, plumbers, security guards, and cleaning crews **never have system login accounts or user roles**. Staff and contractors are managed **strictly as records** within the Admin Portal. The Admin schedules and assigns tasks to external staff and updates job completion.
- **No Parent Login or Portal:** Parents do not log in. Parent details and emergency contact numbers exist solely as data fields on the student profile.
- **No Guest / Visitor Role:** Unauthenticated access is restricted strictly to the public landing/login screen.

---

## 2. Role Specifications

### 2.1 The STUDENT Role

#### 2.1.1 Definition & Target Audience
Enrolled hostel residents and admitted students seeking residential accommodation at the institution.

#### 2.1.2 Scope & Capabilities
1. **Hostel Admissions & Registration:**
   - Register a personal student account using institutional credentials.
   - Fill out and submit hostel admission applications with block and room type preferences.
   - Track application review status (`Submitted`, `Under Review`, `Approved`, `Allocated`, `Rejected`).
2. **Room Discovery & Reservation:**
   - Browse public and residential room availability by block and floor.
   - View bed inventory and room occupancy status in real time.
   - Submit formal room booking requests for unoccupied beds.
   - View confirmed room and bed assignment details allocated via the unified `RoomAllocationService`.
   - Initiate room swap petitions with consenting peers.
3. **Maintenance & Support Services:**
   - Log maintenance complaints across specific categories (`Electrical`, `Plumbing`, `Wi-Fi`, `Cleaning`, `Furniture`, `Other`).
   - Attach digital photographic evidence URLs for damaged fixtures.
   - Monitor ticket progress, priority rating, and assigned maintenance updates.
4. **Residential Living:**
   - Review weekly hostel mess menu schedules and submit meal satisfaction ratings.
   - Access digital hostel facility directory and navigational campus map.
   - Submit leave and outpass requests (subject to strict non-overlapping validation); generate and display approved digital gate passes with verification tokens.
   - Trigger the one-click Emergency SOS distress alert in critical situations (monitored by Admin via periodic polling).
   - Review personal fee ledger (primary offline reconciliation; optional online payment as P2) and attendance percentages.

#### 2.1.3 Access Boundaries & Data Scoping Rules
- **Strict Data Isolation:** A student can **only** view, edit, or track their own personal data records (applications, bookings, complaints, attendance, outpass passes, and fee records).
- **No Access to Admin Endpoints:** Any HTTP request originating from a student user targeting `/api/admin/*` or administrative actions is intercepted by backend role middleware and rejected with `403 Forbidden`.
- **Read-Only System Fields:** Students cannot alter room capacities, bed numbers, application statuses, complaint priorities, attendance records, or fee structures.

---

### 2.2 The ADMIN Role

#### 2.2.1 Definition & Target Audience
Hostel Chief Wardens, Resident Administrators, Estate Managers, and Accounts Personnel responsible for campus residential operations.

#### 2.2.2 Scope & Capabilities
1. **Estate, Inventory & Capacity Management:**
   - Create, configure, update, and manage hostel blocks (A, B, C, D) and floors.
   - Full CRUD operations on room inventory (room number, block, floor, capacity, room type, status).
   - Track individual bed states (`Available`, `Occupied`, `Under Maintenance`).
   - Monitor real-time occupancy metrics and bed availability across all blocks.
2. **Admissions, Bookings & Allocation Control:**
   - Review, approve, or reject student hostel admission applications.
   - Review, approve, or reject student room booking requests.
   - Allocate rooms and beds exclusively via the authoritative **Unified Room Allocation Service** (`RoomAllocationService.allocateBed()`).
   - Evaluate and approve or reject inter-student room swap petitions.
3. **Maintenance, SLA & Work Order Oversight:**
   - Triage, review, and track all student maintenance complaints.
   - Monitor automatic rule-based complaint priority classifications (`Critical`, `High`, `Medium`, `Low`).
   - Configure SLA resolution target hours per priority tier (defaults: 4h, 24h, 48h, 72h).
   - Assign maintenance jobs to external maintenance staff/contractors with scheduled appointments.
   - Track SLA deadlines and respond to deterministic overdue escalations.
   - Transition complaint states: `Submitted` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`.
4. **Residential Operations & Staff Record Management:**
   - Record and track daily student attendance registers.
   - Maintain administrative attendance rosters for non-login maintenance and security staff (staff are records only).
   - Review and approve/reject student outpass and gate pass requests with overlapping request guards.
   - Monitor live Emergency SOS alerts via periodic dashboard polling (5–10s), dispatch assistance, and log incident resolutions.
   - Configure the weekly mess menu and review dining feedback.
   - Manage fee structures, assign fees, verify offline payment receipts (manual reconciliation baseline), and track defaulters.
   - Broadcast high-priority announcements and manage general student feedback.
   - Export executive audit reports (occupancy, finances, maintenance SLA compliance).

#### 2.2.3 Administrative Provisioning Guard (No Public Registration)
- **No Self-Registration:** Administrator accounts cannot be created through public registration interfaces. The registration controller rejects any payload specifying `role: "admin"`.
- **Controlled Seed Provisioning:** The initial root administrator account is created exclusively via an **idempotent CLI seed script** (`npm run seed` running `server/scripts/seed.js`), reading credentials from environment variables (`ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`). If an administrator record already exists, the script safely exits without duplication. Additional administrator accounts can only be created by an authenticated active Administrator from inside the Admin Portal.

---

## 3. Strict Handling of Non-Authenticated Roles

To maintain absolute architectural simplicity and eliminate security attack vectors, HostelHub strictly prohibits the creation of accounts or portals for Wardens, Staff, and Parents:

| Operational Entity | Why No Separate Role? | How Handled in HostelHub |
|---|---|---|
| **Hostel Warden** | Wardens possess administrative authority over rooms, allocations, and discipline. Creating a separate role introduces redundant permission layers. | Wardens operate using the **ADMIN** role and portal, with complete access to rooms, applications, and discipline logs. |
| **Maintenance & Mess Staff** | External contractors, plumbers, electricians, and cleaning staff have transient duties and limited device access. Granting accounts introduces credential leak risks. | **Staff are records only.** They have zero login credentials and zero user accounts. Admins record staff details, assign tasks to workers by name, schedule appointments, record shift attendance, and update task completion. |
| **Parents & Guardians** | Parents require notification rather than direct data entry. A dedicated parent portal increases complexity without operational benefit. | Parent contact information, home addresses, and phone numbers are stored as attributes within the **Student Profile**. Outpass emergency contacts reference these records directly. |

---

## 4. Session & Authentication Lifecycle

```
[ Client Login ] ──► POST /api/auth/login ──► [ Verify bcrypt Password ]
                                                        │
                      ┌─────────────────────────────────┴─────────────────────────────────┐
                      ▼                                                                   ▼
              (Credentials Valid)                                                 (Credentials Invalid)
                      │                                                                   │
          [ Generate Signed JWT ]                                                [ Return 401 Unauthorized ]
      { id, role, email, usn, exp }
                      │
     ┌────────────────┴────────────────┐
     ▼                                 ▼
(role === "student")             (role === "admin")
     │                                 │
[ Store in AuthContext ]        [ Store in AuthContext ]
     │                                 │
[ Redirect: /student ]          [ Redirect: /admin ]
```

### 4.1 Token Specifications
- **Format:** Standard JSON Web Token (RFC 7519).
- **Algorithm:** HMAC SHA-256 (`HS256`).
- **Signature Secret:** Configured via `JWT_SECRET` environment variable.
- **Payload Schema:**
  ```json
  {
    "id": "672728f3a8b4c901e4f91234",
    "role": "student",
    "email": "karan@institution.edu",
    "usn": "1JB24CS093",
    "iat": 1793740800,
    "exp": 1793827200
  }
  ```
- **Lifespan:** 24 hours from generation.
- **Transmission:** Standard HTTP Header: `Authorization: Bearer <token>`.

### 4.2 Security Guards & Logout Clarification
1. **No Client-Side Role Tampering:** Client-side storage of the token does not determine backend access. Every API endpoint verifies the cryptographically signed role inside the JWT signature.
2. **Zero Role Switching:** A student cannot elevate their privileges or switch to the Admin interface during an active session. Attempting to access `/admin/*` redirects to `/student` or displays an access denied barrier.
3. **Session Termination (Logout):** Logging out removes the token from client-side storage (`localStorage` / memory) and resets the `AuthContext` state, terminating the client session and redirecting to `/`. *Important stateless token clarification:* Because JWTs are stateless, client-side logout clears the client session, but does not by itself cryptographically revoke or invalidate an already issued token on the server before its expiration timestamp (`exp`).

---

## 5. Comprehensive User Permission Matrix

> [!IMPORTANT]
> **Authoritative Specification:** This matrix is the single authoritative definition of role-based permissions across all HostelHub documentation.

| Module / Entity | Action | Student | Admin | Backend Security Enforcement |
|---|---|:---:|:---:|---|
| **Authentication** | Self-Register Account | ✅ (Student only) | ❌ | Forced `role = "student"` in register controller |
| | Login / Logout | ✅ | ✅ | Public login endpoint; client token clearance |
| | Provision Initial Admin | ❌ | ❌ | Idempotent CLI seed script only (`npm run seed`) |
| | Provision Sub-Admin | ❌ | ✅ | Restricted to active `req.user.role === "admin"` |
| | Reset Own Password | ✅ | ✅ | Validates current password via bcrypt |
| **Student Profiles** | View Own Profile | ✅ | ✅ | Scoped to `req.user.id` |
| | View All Student Profiles | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Edit Own Contact Details | ✅ | ✅ | Students edit contact info; Admins edit all |
| | Modify USN / Room Assignment | ❌ | ✅ | Administrative lock on academic fields |
| **Block & Room Inventory** | View Rooms & Availability | ✅ | ✅ | Read-only inventory endpoint |
| | Create New Room / Block | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Edit Room Capacity & Beds | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Delete Room | ❌ | ✅ | Allowed only if room has 0 occupied beds |
| **Bed Allocations** | Submit Booking Request | ✅ | ❌ | Authenticated students without existing allocation |
| | View Own Booking Requests | ✅ | ✅ | Student sees own; Admin sees all |
| | Cancel Pending Booking | ✅ | ❌ | Allowed only if booking status is `Pending` |
| | Approve / Reject Booking | ❌ | ✅ | Executes via unified `RoomAllocationService` |
| | Request Room Swap | ✅ | ❌ | Authenticated allocated students only |
| | Approve / Reject Room Swap | ❌ | ✅ | Swaps assignments atomically in database |
| **Admission Applications** | Submit Application | ✅ | ❌ | Authenticated students only (1 pending limit) |
| | View Own Application | ✅ | ✅ | Scoped query |
| | Approve / Reject Application| ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Allocate Room to Applicant | ❌ | ✅ | Executes via unified `RoomAllocationService` |
| **Complaints & Maintenance** | Submit Complaint | ✅ | ❌ | Form submission with deterministic priority |
| | Upload Evidence Image | ✅ | ❌ | URL/file reference attached to ticket |
| | View Complaints | ✅ (Own) | ✅ (All) | Scoped query |
| | Update Complaint Status | ❌ | ✅ | Status progression: Submitted $\rightarrow$ Progress $\rightarrow$ Resolved |
| | Configure SLA Hour Thresholds| ❌ | ✅ | System settings parameter update |
| | Assign Maintenance Staff | ❌ | ✅ | Staff assigned as records (no staff login) |
| **Fee Management** | View Fee Breakdown & Dues | ✅ (Own) | ✅ (All) | Scoped query |
| | Create / Edit Fee Structures| ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Submit Offline Payment UTR | ✅ | ❌ | Scoped to student ledger |
| | Verify Payment Receipts | ❌ | ✅ | Manual verification; marks payment `Verified` |
| **Attendance Records** | View Own Attendance Log | ✅ | ❌ | Scoped query |
| | Mark Student Daily Attendance| ❌ | ✅ | Batch attendance marker tool |
| | Log Staff Attendance Shifts | ❌ | ✅ | Staff shift roster (staff are records only) |
| **Gate Passes / Outpass** | Submit Outpass Request | ✅ | ❌ | Validates departure/return & non-overlapping |
| | View Digital Gate Pass Token | ✅ (Own) | ✅ (All) | Scoped query |
| | Approve / Reject Outpass | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Gate Check-in/Check-out Scan | ❌ | ✅ | Admin gate security verification tool |
| **Emergency SOS** | Trigger Emergency Distress | ✅ | ❌ | Instant event broadcast with room and USN |
| | Monitor SOS (via Polling) | ❌ | ✅ | High-priority admin alert dashboard (5–10s poll) |
| | Resolve SOS Alert | ❌ | ✅ | Requires incident resolution notes |
| **Mess & Dining** | View Weekly Mess Menu | ✅ | ✅ | Public/authenticated schedule endpoint |
| | Submit Daily Meal Rating | ✅ | ❌ | Scoped to authenticated resident |
| | Edit Weekly Mess Schedule | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| **Announcements & Feedback**| View Announcements | ✅ | ✅ | Authenticated broadcast feed |
| | Publish Announcement | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| | Submit General Feedback | ✅ | ❌ | Authenticated student only |
| | Review Feedback Inbox | ❌ | ✅ | Restricted to `req.user.role === "admin"` |
| **Reporting & Audit** | Generate Occupancy Reports | ❌ | ✅ | Administrative aggregation query |
| | Generate Financial Reports | ❌ | ✅ | Administrative aggregation query |
| | Generate SLA Compliance Logs| ❌ | ✅ | Administrative aggregation query |
