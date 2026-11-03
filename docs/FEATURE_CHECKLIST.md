# HOSTELHUB – FEATURE TRACEABILITY MATRIX & CHECKLIST

**Project Title:** HostelHub – Smart Hostel Management System  
**Document Version:** 1.1.0  
**Phase:** Phase 1 – System Specification & Architecture  
**Status:** Feature Baseline Checklist (Corrected)  
**Base Audit Reference:** [`docs/PROJECT_AUDIT.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_AUDIT.md)  
**Parent Requirements Document:** [`docs/PROJECT_REQUIREMENTS.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_REQUIREMENTS.md)  
**Authoritative Roles & Permissions:** [`docs/USER_ROLES.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/USER_ROLES.md)  
**Development Roadmap:** [`docs/DEVELOPMENT_ROADMAP.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/DEVELOPMENT_ROADMAP.md)  
**Date:** November 3, 2026  

---

## 1. Feature Priority Definitions

- **`P0` (Essential Working Prototype):** Core mission-critical features required for authentication, room inventory, booking requests, application submission, complaint logging, and administrative approval flows.
- **`P1` (Required Full System Functionality):** Complete end-to-end operational capabilities including fee ledgers, manual payment verification, attendance registers, outpass/gate passes, emergency SOS polling, and staff attendance rosters.
- **`P2` (Additional Functionality & Polish):** Value-add resident experience modules including mess menu ratings, facility directory, room swap petitions, analytical reporting exports, optional online payment gateway, and UI enhancements.

---

## 2. Feature Traceability Matrix

### Module A: Authentication, Account Provisioning & Security

| Feature ID | Module | Feature Name | Role | Priority | Description | Acceptance Criteria |
|---|---|---|:---:|:---:|---|---|
| **AUTH-01** | Auth | Student Self-Registration | Student | **P0** | Prospective students register an account with name, institutional email, USN, and password. | Password must meet complexity rules; duplicate emails/USNs rejected; `role` is forcefully set to `student`. |
| **AUTH-02** | Auth | Student Login & Token Issuance | Student | **P0** | Authenticate student credentials via email and password. | Returns signed JWT containing `id`, `role: "student"`, and `usn`; stores token; redirects to `/student`. |
| **AUTH-03** | Auth | Secure Admin Provisioning | Admin | **P0** | Seed root admin account securely via an idempotent CLI seed script with environment variables. | Public registration endpoint strictly rejects `role: "admin"`; root admin seeded with bcrypt hash via idempotent script. |
| **AUTH-04** | Auth | Admin Login & Token Issuance | Admin | **P0** | Authenticate admin credentials and issue administrative token. | Validates credentials against DB; returns JWT with `role: "admin"`; redirects to `/admin`. |
| **AUTH-05** | Auth | Session Termination (Logout) | Both | **P0** | Clear client session, dispose of JWT, and redirect to public login page. | Purges token from client storage and `AuthContext`; redirects to `/`; note: stateless token remains valid until `exp`. |
| **AUTH-06** | Auth | Password Hashing Engine | Backend | **P0** | Deterministic password encryption using bcrypt. | Passwords hashed with salt rounds $\ge 10$; plain-text passwords never stored or logged. |
| **AUTH-07** | Auth | Role-Based Route Guards | Both | **P0** | Frontend and backend validation preventing unauthorized role navigation. | Students accessing `/admin/*` receive 403 or redirect; Admins accessing `/student/*` redirect to `/admin`. |
| **AUTH-08** | Auth | Profile Inspection & Update | Both | **P1** | View and update contact details and profile attributes. | `GET /api/auth/me` returns current user; students can edit phone/photo; academic fields are read-only. |
| **AUTH-09** | Auth | Secure Password Reset | Both | **P1** | Allow authenticated users to change their account password. | Requires valid current password; hashes new password with bcrypt; confirms successful change. |

---

### Module B: Student Portal Modules

| Feature ID | Module | Feature Name | Role | Priority | Description | Acceptance Criteria |
|---|---|---|:---:|:---:|---|---|
| **STUD-01** | Student | Student Dashboard | Student | **P0** | Centralized resident overview with room status, pending actions, and activity. | Dynamically displays allocated room/bed, application status, active complaint count, and recent events. |
| **STUD-02** | Student | Hostel Admission Application | Student | **P0** | Multi-step form to apply for hostel residency with block and room preferences. | Validates required fields; prevents duplicate pending applications; generates reference ID `HH-APP-XXXXXX`. |
| **STUD-03** | Student | Application Status Tracker | Student | **P0** | Real-time status widget displaying application review progress. | Accurately reflects state (`Submitted`, `Under Review`, `Approved`, `Allocated`, `Rejected`). |
| **STUD-04** | Student | Room & Bed Explorer | Student | **P0** | Browse all hostel blocks, rooms, available bed counts, and occupancy rates. | Filterable by block and sharing type; shows available bed count per room; visual progress bar. |
| **STUD-05** | Student | Room Booking Request | Student | **P0** | Submit a reservation request for an unoccupied bed in a specific room. | Only allowed if room has available beds (`bedsAvailable > 0`); creates request record scoped to student. |
| **STUD-06** | Student | Booking History Scoping | Student | **P0** | View previously submitted room reservation requests. | History displays only the authenticated student's own requests; shows status badge. |
| **STUD-07** | Student | Complaint Submission Form | Student | **P0** | Log a maintenance complaint with category, title, room, and description. | Required field validation; form reset upon submission; shows confirmation notification. |
| **STUD-08** | Student | Complaint Evidence Upload | Student | **P1** | Attach digital image or URL documenting maintenance damage. | Stores evidence reference with complaint document; renders thumbnail in ticket view. |
| **STUD-09** | Student | Complaint Ticket Tracker | Student | **P0** | Track lifecycle of submitted maintenance tickets with priority badge. | Displays status (`Submitted`, `In Progress`, `Resolved`) and auto-calculated priority badge. |
| **STUD-10** | Student | Room Allocation Status Card | Student | **P0** | View confirmed room number, block, and assigned bed index. | Displays "Pending" if unallocated; displays room, block, and bed allocated via `RoomAllocationService`. |
| **STUD-11** | Student | Room Swap Request Form | Student | **P2** | Initiate a formal room swap request with another allocated student. | Requires target student USN; validates both hold confirmed allocations; submits for Admin review. |
| **STUD-12** | Student | Roommate Preference Tagging| Student | **P2** | Specify preferred peer USNs during hostel application. | Captures up to two preferred peer USNs; stores preferences in application document for Admin review. |
| **STUD-13** | Student | Fee Ledger & Dues Breakdown | Student | **P1** | View itemized hostel fees, payment deadlines, and balance dues. | Displays room rent, mess fee, caution deposit, total amount paid, and net balance; baseline offline flow. |
| **STUD-14** | Student | Payment History & Receipts | Student | **P1** | Access offline transaction proofs, verification statuses, and receipts. | Lists transaction date, amount, mode, UTR ID, and verification status (`Pending`, `Verified`, `Failed`). |
| **STUD-15** | Student | Attendance Percentage Widget| Student | **P1** | Monthly attendance calendar and calculated attendance percentage. | Displays daily attendance states; highlights percentage; alerts if below 75% threshold. |
| **STUD-16** | Student | Outpass & Gate Pass Request | Student | **P1** | Submit an electronic leave request with destination, dates, and parent info. | Validates future dates, departure < return, and rejects if student has active or overlapping outpasses. |
| **STUD-17** | Student | Digital Gate Pass Display | Student | **P1** | Display approved digital gate pass with verification code for security check. | Renders approved pass with student photo, room, departure/return times, and unique pass token. |
| **STUD-18** | Student | Emergency SOS Distress Button| Student | **P1** | Instant one-click panic button alerting hostel administration. | Logs emergency event; Admin dashboard detects distress via periodic short-interval polling (5–10s). |
| **STUD-19** | Student | Mess Menu Weekly Schedule | Student | **P1** | Interactive calendar showing daily 4-meal hostel dining menu. | Displays breakfast, lunch, snacks, and dinner dishes for Monday through Sunday. |
| **STUD-20** | Student | Daily Meal Feedback Rating | Student | **P2** | Submit star ratings (1–5) and written feedback on mess food quality. | Scoped to authenticated student; prevents multiple ratings for the same meal date. |
| **STUD-21** | Student | Hostel Campus Map & Directory| Student | **P2** | Interactive directory of hostel facilities, wardens' office, and gym. | Lists operational hours, contact persons, and locations for campus amenities. |
| **STUD-22** | Student | Institutional Announcements | Student | **P1** | In-app feed of hostel notices, maintenance shutdowns, and deadlines. | Displays announcements sorted by date with priority indicators (`Urgent`, `General`, `Fee`). |
| **STUD-23** | Student | General Suggestion Box | Student | **P2** | Submit feedback or suggestions regarding hostel residential life. | Simple text feedback submission; routed to Admin feedback inbox. |

---

### Module C: Admin Portal Modules

| Feature ID | Module | Feature Name | Role | Priority | Description | Acceptance Criteria |
|---|---|---|:---:|:---:|---|---|
| **ADM-01** | Admin | Admin Dashboard & KPIs | Admin | **P0** | Executive dashboard displaying occupancy, bed availability, and pending queues. | Real-time calculations of total rooms, total beds, occupied beds, pending bookings, and open issues. |
| **ADM-02** | Admin | Hostel Block Management | Admin | **P0** | Configure and maintain residential blocks (Block A, B, C, D). | Create and edit blocks with gender designations, floor counts, and target capacities. |
| **ADM-03** | Admin | Room Inventory CRUD | Admin | **P0** | Add new rooms, edit capacity and beds, or safely delete unoccupied rooms. | Validates capacity $\ge 1$, beds $\ge 0$, beds $\le$ capacity, unique room number; deletes only if empty. |
| **ADM-04** | Admin | Individual Bed Inventory | Admin | **P1** | Explicitly track bed identifiers (Bed A, Bed B) and maintenance states. | Bed state toggle (`Available`, `Occupied`, `Under Maintenance`); reflects in room availability totals. |
| **ADM-05** | Admin | Application Review Queue | Admin | **P0** | Filter, search, and inspect student admission applications. | Search by name or USN; filter by status; review full applicant preferences and notes. |
| **ADM-06** | Admin | Application Approval & Alloc | Admin | **P0** | Approve admission and pair student with an available room/bed. | Executes atomically via unified `RoomAllocationService` to prevent double-booking and duplicate allocation. |
| **ADM-07** | Admin | Application Rejection Flow | Admin | **P0** | Reject student admission application with mandatory reason note. | Updates status to `Rejected`; records reason; notifies applicant on their portal. |
| **ADM-08** | Admin | Booking Review Queue | Admin | **P0** | View student room reservation requests with room and student details. | Filter by status (`Pending`, `Approved`, `Rejected`); search by student or room number. |
| **ADM-09** | Admin | Booking Approval & Allocation| Admin | **P0** | Confirm booking request and allocate bed. | Executes atomically via unified `RoomAllocationService` to allocate bed and update room inventory. |
| **ADM-10** | Admin | Booking Rejection Flow | Admin | **P0** | Decline student room reservation request. | Updates status to `Rejected`; does not decrement bed count; notifies student. |
| **ADM-11** | Admin | Room Swap Approval Engine | Admin | **P2** | Review and authorize mutual student room swap petitions. | Atomically exchanges room/bed records between two students in a single database transaction. |
| **ADM-12** | Admin | Student Master Registry | Admin | **P1** | Centralized directory of all enrolled students with search and filter. | View full student profile, current room, fee status, attendance percentage, and history. |
| **ADM-13** | Admin | Student Account Control | Admin | **P1** | Activate, suspend, or update student administrative profile data. | Admin can update room allocation, disciplinary status, or deactivate rogue accounts. |
| **ADM-14** | Admin | Fee Structure Configuration | Admin | **P1** | Define hostel fee packages based on room type and academic term. | Set fee components (tuition, room rent, mess deposit); assign to student cohorts. |
| **ADM-15** | Admin | Payment Verification & Record| Admin | **P1** | Reconcile manual offline fee payments and verify bank transaction proofs. | Verify offline bank challans/UTR references; update student fee ledger; mark payment `Verified`. |
| **ADM-16** | Admin | Student Attendance Register | Admin | **P1** | Daily student attendance marker tool by block, floor, and room. | Batch mark `Present`, `Absent`, `Outpass`; records timestamp and marking admin ID. |
| **ADM-17** | Admin | Staff Attendance Roster | Admin | **P1** | Track daily duty shifts of non-login maintenance and security personnel. | Staff are records only (no accounts); admin logs duty shifts to monitor on-campus coverage. |
| **ADM-18** | Admin | Maintenance Complaint Queue | Admin | **P0** | Triage, search, and manage all reported maintenance tickets. | Filter by category, priority, status; search by room/student; display critical notices. |
| **ADM-19** | Admin | Complaint Status Progression | Admin | **P0** | Transition complaint states through workflow stages. | Update status: `Submitted` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`; records resolution notes. |
| **ADM-20** | Admin | Maintenance Worker Assignment| Admin | **P1** | Assign external worker/technician name and appointment to ticket. | Records assigned contractor name, trade, phone, and scheduled maintenance window. |
| **ADM-21** | Admin | SLA Tracking & Escalation | Admin | **P1** | Track resolution deadlines with configurable SLA hours by priority. | Computes remaining time based on configurable priority targets; auto-flags `OVERDUE` past SLA. |
| **ADM-22** | Admin | Housekeeping Scheduler | Admin | **P2** | Schedule and monitor cleaning routines for hostel common areas and rooms. | Define daily/weekly cleaning tasks; log completion notes. |
| **ADM-23** | Admin | Gate Pass Review & Approval | Admin | **P1** | Review student outpass requests and issue digital clearance tokens. | Approve or reject with notes; approved passes immediately generate active digital pass for student. |
| **ADM-24** | Admin | Gate Security Verification View| Admin | **P1** | Search and verify student gate passes at hostel security checkpoint. | Search by USN or pass token; displays validity, photo, return deadline; marks `Checked Out`/`In`. |
| **ADM-25** | Admin | Emergency SOS Live Monitoring| Admin | **P1** | Distress alert center monitoring active signals via short-interval polling. | Periodic polling (5–10s) fetches active distress signals; shows room/name/phone; logs resolution. |
| **ADM-26** | Admin | Mess Menu Administration | Admin | **P1** | Weekly menu editor for all meals across seven days. | Add, edit, or remove menu items for breakfast, lunch, snacks, and dinner. |
| **ADM-27** | Admin | Dining Feedback Analytics | Admin | **P2** | Aggregate student meal satisfaction ratings and read student comments. | Computes average star ratings per meal; highlights low-rated dishes for contractor review. |
| **ADM-28** | Admin | Broadcast Announcement Pub | Admin | **P1** | Publish notices with priority tags to all student portals. | Compose notice with title, message, category, and expiry date; instantly visible to students. |
| **ADM-29** | Admin | Student Feedback Review Inbox| Admin | **P2** | Review and archive general student suggestions and complaints. | Filter feedback by date and topic; mark as reviewed or actioned. |
| **ADM-30** | Admin | Occupancy Analytics & Reports | Admin | **P1** | Detailed statistical breakdown of bed utilization and vacancy rates. | Aggregates occupancy by block, floor, and room category; exportable summary view. |
| **ADM-31** | Admin | Financial & Dues Summary | Admin | **P1** | Financial reporting on total billed fees, collected revenue, and arrears. | Generates list of fee defaulters with outstanding amounts and contact details. |
| **ADM-32** | Admin | System Settings Configuration | Admin | **P2** | Configure institutional parameters, academic terms, and SLA thresholds. | Update hostel name, term dates, warden contact numbers, and configurable SLA hours per priority. |

---

### Module D: Deterministic Business Rules Engine

| Feature ID | Module | Feature Name | Role | Priority | Description | Acceptance Criteria |
|---|---|---|:---:|:---:|---|---|
| **RULE-01** | Rules | Unified Allocation Concurrency | Backend | **P0** | Prevent double allocation of beds via authoritative unified allocation service. | Unique index on active bed allocation; conditional update requires bed available; fails if occupied. |
| **RULE-02** | Rules | Capacity Invariant Enforcement| Backend | **P0** | Enforce that available bed count never drops below zero or exceeds room capacity. | Invariant validation: $0 \le \text{bedsAvailable} \le \text{capacity}$; rejects updates violating bounds. |
| **RULE-03** | Rules | Deterministic Priority Engine | Backend | **P0** | Compute complaint priority automatically from keyword match rules. | String matching assigns `Critical` (fire/shock), `High` (water/leak), `Medium` (fan/wifi), or `Low`. |
| **RULE-04** | Rules | Deterministic Configurable SLA | Backend | **P1** | Automatically flag open complaints exceeding configurable SLA target hours. | Flagged `isEscalated = true` when `now > createdAt + configuredSLAHours[priority]` and not `Resolved`. |
| **RULE-05** | Rules | Single Active Allocation Guard | Backend | **P0** | Prevent a student from holding multiple confirmed room allocations simultaneously. | Unified allocation service rejects second booking or application approval if student already allocated. |
| **RULE-06** | Rules | Atomic Room Swap Validation | Backend | **P2** | Ensure both students hold active allocations before executing swap. | Both students verified; database transaction exchanges both room assignments atomically. |
| **RULE-07** | Rules | Overlapping Outpass Guard | Backend | **P1** | Prevent overlapping active or approved outpass requests for the same student. | Rejects requests where `departureDate < now`, `returnDate \le departureDate`, or dates overlap active pass. |
| **RULE-08** | Rules | Role Registration Barrier | Backend | **P0** | Reject any client-submitted payload attempting to register as administrator. | Registration controller explicitly overrides `req.body.role` with `"student"`. |
| **RULE-09** | Rules | Zero External Role Barrier | Backend | **P0** | Enforce strict RBAC permitting only `"student"` or `"admin"` in database and JWT. | Schema enum validation restricts `role` strictly to `["student", "admin"]`. |
| **RULE-10** | Rules | Student Data Scoping Invariant | Backend | **P0** | Automatically bind all student data queries to `req.user.id`. | Controllers enforce `studentId = req.user.id`; students cannot query records of other students. |

---

## 3. Summary of Feature Counts

- **Module A (Authentication & Security):** 9 Features (7 $\times$ P0, 2 $\times$ P1)
- **Module B (Student Portal):** 23 Features (8 $\times$ P0, 10 $\times$ P1, 5 $\times$ P2)
- **Module C (Admin Portal):** 32 Features (9 $\times$ P0, 18 $\times$ P1, 5 $\times$ P2)
- **Module D (Deterministic Rules Engine):** 10 Features (7 $\times$ P0, 2 $\times$ P1, 1 $\times$ P2)
- **Total Documented Features:** **74 Features**
  - **Priority 0 (P0 - Prototype Core):** **31 Features** (41.9%)
  - **Priority 1 (P1 - Full System):** **32 Features** (43.2%)
  - **Priority 2 (P2 - Value-Add & Polish):** **11 Features** (14.9%)
