# HOSTELHUB – FINAL REQUIREMENTS SPECIFICATION

**Project Title:** HostelHub – Smart Hostel Management System  
**Document Version:** 1.1.0  
**Phase:** Phase 1 – System Specification & Architecture  
**Status:** Approved Requirements Baseline (Corrected)  
**Base Audit Reference:** [`docs/PROJECT_AUDIT.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/PROJECT_AUDIT.md)  
**Authoritative Roles & Permissions:** [`docs/USER_ROLES.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/USER_ROLES.md)  
**Feature Traceability Checklist:** [`docs/FEATURE_CHECKLIST.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/FEATURE_CHECKLIST.md)  
**Development Roadmap:** [`docs/DEVELOPMENT_ROADMAP.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/DEVELOPMENT_ROADMAP.md)  
**Date:** November 3, 2026  

---

## 1. Project Identity & Overview

**HostelHub** is a full-stack web application engineered to streamline, digitize, and automate hostel administration, room allocation, maintenance management, and student residential services for educational institutions.

### 1.1 Technology Stack
- **Frontend:** React 19, Vite 8, JavaScript (ES modules), React Router DOM 7, Plain CSS (custom design system).
- **Backend:** Node.js, Express.js (RESTful API architecture).
- **Database:** MongoDB Atlas with Mongoose ODM.
- **Authentication & Security:** JSON Web Tokens (JWT) with HTTP Bearer authorization, bcrypt password hashing (minimum 10 salt rounds), secure role verification middleware.

### 1.2 Fixed Architecture Rules & Constraints
1. **Exactly Two Authenticated Roles:**
   - **`STUDENT`**: Enrolled hostel resident or prospective hostel applicant.
   - **`ADMIN`**: Hostel chief administrator, warden supervisor, and estate manager.
2. **Two Completely Separate Interfaces:**
   - **Student Portal**: Accessible exclusively to authenticated students (`/student/*`, `/rooms`, `/application`, `/complaints`).
   - **Admin Portal**: Accessible exclusively to authenticated administrators (`/admin/*`).
3. **Single Backend & Shared Database:** Both interfaces consume the same Express REST API and query a unified MongoDB Atlas database.
4. **Strict Role Boundary Enforcements:**
   - **NO Warden Login:** Warden operations are administrative and handled through the Admin Portal.
   - **NO Staff Login / Interface:** Maintenance workers, electricians, plumbers, security guards, and mess staff do **not** have system accounts, login credentials, or user roles. Staff and contractors are managed **strictly as records** within the Admin Portal. The Admin schedules, assigns, monitors, and marks staff tasks as completed.
   - **NO Parent Login / Portal:** Parents do not log in. Emergency contacts and parent details are managed as student profile attributes.
   - **Zero AI / Machine Learning:** No generative AI, natural language parsing APIs, predictive algorithms, or neural networks. All workflow transitions, bed counting, occupancy metrics, and complaint priority scoring use deterministic, rule-based programming logic.

---

## 2. Functional Requirements by Module

### Module A: Authentication, Account Provisioning & Security

#### A.1 Student Registration & Account Provisioning
- **Self-Registration:** Prospective students can register by providing: Full Name, Institutional Email, USN / Student ID, Phone Number, Password, Gender, and Emergency Contact Information.
- **Role Lock:** Student self-registration forcefully assigns `role: "student"`. Under no circumstances can a user register themselves with `role: "admin"`.
- **Validation:** Unique constraint enforcement on institutional email and USN. Password complexity rules: minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol.

#### A.2 Secure Admin Account Provisioning (No Public Registration)
- **No Public Admin Registration:** The registration interface does not allow selecting or registering as an Administrator.
- **Idempotent CLI Seed Script:** The initial Administrator account must be provisioned exclusively through a secure, idempotent database seed script (`npm run seed` executing `server/scripts/seed.js`). The script checks if an administrator record already exists; if not, it seeds the root admin using secure environment variables (`ADMIN_INITIAL_EMAIL`, `ADMIN_INITIAL_PASSWORD`) and hashes the password with bcrypt. Additional admin accounts can only be provisioned by an existing authenticated Admin from within the Admin Portal.

#### A.3 Authentication & Session Management
- **Login Flow:** Dedicated endpoint (`POST /api/auth/login`). Validates email and plain-text password against bcrypt hashed password.
- **Token Generation:** Issues a signed JWT containing payload `{ id, role, email, usn }` with a configurable expiration (default 24 hours).
- **Session Termination (Logout):** Client-side logout clears the stored JWT from client storage (`localStorage` / memory) and resets the `AuthContext` state, immediately redirecting to the public login page (`/`). *Note on stateless JWTs:* Client-side token removal terminates the active user session on the client; it does not by itself invalidate the cryptographic signature of the stateless token on the server before its expiration timestamp (`exp`).

#### A.4 Profile & Credential Management
- **Profile View:** Endpoint (`GET /api/auth/me`) returning the authenticated user's profile details.
- **Profile Update:** Students can update personal contact details, emergency phone numbers, and profile photos. USN, institutional email, and allocated room numbers are read-only for students and editable only by Admins.
- **Password Reset:** Deterministic password update requiring verification of current password, followed by bcrypt hashing of the new password.

---

### Module B: Student Portal Modules

```
┌────────────────────────────────────────────────────────────────────────┐
│                        STUDENT PORTAL WORKSPACE                        │
├─────────────────┬───────────────────┬──────────────────┬───────────────┤
│  ACCOMMODATION  │    MAINTENANCE    │    LIVING & MESS │ RESIDENT SVCS │
├─────────────────┼───────────────────┼──────────────────┼───────────────┤
│ • Dashboard     │ • Log Complaint   │ • Mess Menu      │ • Attendance  │
│ • Room Explorer │ • Upload Evidence │ • Meal Feedback  │ • Gate Passes │
│ • Book a Bed    │ • Track Tickets   │ • Map & Locator  │ • Fee History │
│ • Admission App │ • Status Updates  │ • Noticeboard    │ • SOS Alert   │
│ • Room Swap Req │                   │                  │               │
└─────────────────┴───────────────────┴──────────────────┴───────────────┘
```

#### B.1 Student Dashboard
- Summary widget displaying assigned Room Number, Block, and Bed ID (or "Pending Allocation").
- Real-time status cards: Latest Hostel Admission Application, Active Complaints count, Unpaid Fee Balance, and Current Gate Pass status.
- Recent activity timeline showing the 5 most recent timestamped actions (bookings, applications, complaints, gate pass approvals).
- Quick Action shortcuts to Room Explorer, Complaint Submission, Mess Menu, and Outpass Requests.

#### B.2 Hostel Admission Applications
- Comprehensive admission application form capturing: Full Name, USN, Department, Academic Year, Gender, Preferred Block (Block A, B, C, D), Preferred Room Type (Single, Double, Triple sharing), Dietary Preference, Guardian Contact, and Medical/Special Notes.
- Form validation preventing duplicate pending applications for the same academic term.
- Real-time status tracking widget: `Submitted` $\rightarrow$ `Under Review` $\rightarrow$ `Approved` $\rightarrow$ `Allocated` or `Rejected`.
- Automatic generation of unique application tracking codes (`HH-APP-XXXXXX`).

#### B.3 Room & Bed Exploration
- Interactive room directory filtered by Block, Floor, Room Sharing Type, and Availability status.
- Real-time bed availability indicators per room: displays total capacity, occupied beds, and available bed numbers (e.g., Bed 1, Bed 2).
- Visual occupancy bar chart per room with color-coded badges (`Available`, `Partially Occupied`, `Fully Occupied`).

#### B.4 Bed Booking Requests
- Explicit reservation request for an available bed in a chosen room.
- Form captures student ID, targeted room number, targeted bed index, and term duration.
- Atomic validation ensures booking requests can only be placed against rooms where `availableBeds > 0`.
- History list scoped strictly to the authenticated student's own requests.

#### B.5 Room Swap Requests
- Allows allocated students to initiate a room swap request with another willing student.
- Form requires specifying: Current Room/Bed, Target Room/Bed, Target Student USN, and Reason for Swap.
- Deterministic validation: Both students must hold confirmed active room allocations, and both students must acknowledge before Admin review.

#### B.6 Roommate Preference Selection
- Optional roommate preference tagging during hostel admission application.
- Students can specify up to two preferred peers by USN. The system flags peer pairs for the Admin during manual or bulk room allocation.

#### B.7 Fee Management & Payment History
- **Baseline / Primary Flow (Manual / Offline Payment Verification):** Student reviews assigned fee ledger (Tuition/Mess/Room Rent/Caution Deposit). Student submits offline bank transfer details, challan numbers, or UTR transaction reference IDs with date and amount. Record is marked `Pending Verification` until verified manually by Admin.
- **Optional Secondary Flow (Online Gateway):** Direct online payment gateway integration (e.g., Razorpay/Stripe) is clearly demarcated as an optional future enhancement (P2), kept distinct from baseline manual reconciliation.
- Historical payment receipts table showing Transaction ID, Date, Amount, Payment Mode, and Verification Status (`Pending`, `Verified`, `Failed`).

#### B.8 Attendance Records
- Monthly student attendance log displaying daily status (`Present`, `Absent`, `On Leave / Outpass`).
- Cumulative attendance percentage calculation using rule: `(Days Present / Total Monitored Days) * 100`.
- Visual alert when attendance drops below the institutional threshold (e.g., 75%).

#### B.9 Complaint Submission & Tracking
- Support ticket creation with fields: Complaint Title, Room Number, Category (`Electrical`, `Plumbing`, `Wi-Fi`, `Cleaning`, `Furniture`, `Other`), Detailed Description.
- Evidence attachment support: File/image upload URL capture for damage documentation.
- Automated priority assignment using deterministic keyword heuristics:
  - Text matching `fire`, `shock`, `spark`, `electrical hazard`, `short circuit` $\rightarrow$ **Critical**.
  - Text matching `water leak`, `overflow`, `plumbing`, `sewage`, `door lock` $\rightarrow$ **High**.
  - Text matching `fan`, `light bulb`, `wifi`, `cleaning`, `geyser` $\rightarrow$ **Medium**.
  - All other inquiries and minor cosmetic defects $\rightarrow$ **Low**.
- Live ticket tracker showing status progression: `Submitted` $\rightarrow$ `In Progress` $\rightarrow$ `Resolved`.

#### B.10 Outpass & Digital Gate Passes
- Outpass request form capturing: Destination, Purpose, Departure Date/Time, Expected Return Date/Time, and Emergency Parent Contact.
- **Overlapping Request Prevention Rule:** System strictly blocks submission if the student currently has an active pending or approved outpass whose return date has not elapsed, or if the requested departure/return date range overlaps with any existing approved outpass for that student.
- Live Gate Pass screen with digital pass token and scannable verification code upon Admin approval.
- Automatic pass expiry calculation based on Expected Return Date/Time.

#### B.11 Emergency SOS Alert
- One-click Emergency SOS trigger on the student dashboard.
- Instantly logs an emergency event with Student Name, USN, Room Number, Timestamp, and Emergency Phone Number.
- **Initial Prototype Communication:** Admin portal monitors active alerts using short-interval **polling** (5–10s periodic API query). Full-duplex WebSocket-based real-time event streaming is reserved as a later enhancement.

#### B.12 Mess Menu & Meal Feedback
- Weekly dining schedule displaying Breakfast, Lunch, Snacks, and Dinner for Monday through Sunday.
- Daily meal rating and feedback form (1–5 stars with optional feedback text).

#### B.13 Hostel Map & Facility Locator
- Digital floor plans and directory of hostel facilities: Study Halls, Gym, Laundry Room, Medical Room, Cafeteria, Warden Office, and Security Post with operational timings.

#### B.14 Notifications & General Feedback
- Notification center for institutional broadcasts: maintenance shutdowns, inspection notices, fee deadlines, mess updates.
- General student feedback submission regarding hostel amenities.

---

### Module C: Admin Portal Modules

```
┌────────────────────────────────────────────────────────────────────────┐
│                         ADMIN PORTAL WORKSPACE                         │
├─────────────────┬───────────────────┬──────────────────┬───────────────┤
│  ESTATE & ROOMS │    ADMISSIONS     │    MAINTENANCE   │  MANAGEMENT   │
├─────────────────┼───────────────────┼──────────────────┼───────────────┤
│ • Block Mgmt    │ • Student Records │ • Tickets & SLAs │ • Fee Mgmt    │
│ • Room CRUD     │ • Review Apps     │ • Task Assign    │ • Attendance  │
│ • Bed Inventory │ • Allocation Eng  │ • Escalations    │ • Gate Passes │
│ • Occupancy KPI │ • Swap Approvals  │ • Housekeeping   │ • Mess & SOS  │
└─────────────────┴───────────────────┴──────────────────┴───────────────┘
```

#### C.1 Admin Dashboard & Analytics
- Core KPI grid: Total Rooms, Total Beds, Available Beds, Occupied Beds, Live Occupancy Percentage, Pending Applications, Pending Bookings, Open Complaints, and Active Outpasses.
- Visual occupancy progress bar and bed availability distribution by Block.
- Critical Alert Panel: Displays unresolved Critical complaints and active Emergency SOS alerts via periodic dashboard polling.

#### C.2 Student Account & Record Management
- Student master registry: view, search, filter, and inspect enrolled student profiles.
- Ability to manually activate/deactivate accounts, update contact records, or assign disciplinary flags.
- Comprehensive student profile modal detailing: Academic details, room allocation history, fee payment status, complaint history, and outpass logs.

#### C.3 Hostel Block, Room & Bed Management
- **Block Configuration:** Create and manage blocks (Block A, Block B, Block C, Block D) with gender designations and capacity limits.
- **Room CRUD:** Add new rooms, specify block, floor, total bed capacity, room type (Single, Double, Triple), and maintenance status. Edit room attributes and safely delete unoccupied rooms.
- **Individual Bed Inventory:** Explicit tracking of bed identifiers within each room (e.g., Bed A, Bed B). Allows marking individual beds as `Available`, `Occupied`, or `Under Maintenance`.

#### C.4 Admission Application Review & Allocation
- Filterable admissions table sorted by submission date, block preference, or status (`Pending`, `Approved`, `Rejected`).
- Application detail drawer with applicant profile, USN, preference match indicators, and notes.
- Action controls: `Approve`, `Reject`, or `Allocate Room Directly`.
- Executes room allocation exclusively via the authoritative **Unified Room Allocation Service** (Section 3.1).

#### C.5 Booking Review & Bed Allocation
- Table of student bed booking requests with student name, requested room, block, and submission timestamp.
- Atomic `Approve & Allocate` action executing exclusively via the authoritative **Unified Room Allocation Service** (Section 3.1).
- `Reject` button with mandatory rejection reason text.

#### C.6 Room Swap Review & Approval
- Dedicated interface for pending student room swap petitions.
- Displays both students, their current room/bed numbers, and requested destinations.
- One-click `Approve Swap`: atomically swaps the room and bed assignments of both students in the database and updates both booking/allocation logs.

#### C.7 Fee Structure & Manual Payment Verification
- Fee structure builder: configure term fees per room type (e.g., Single Sharing: ₹80,000; Double: ₹60,000; Triple: ₹45,000).
- Student fee ledger: assign fees to students individually or in bulk by block/room type.
- **Manual Payment Verification:** Review student offline payment submissions, verify bank transaction UTR/challan references, approve payment receipts, and adjust due balances. (Online gateway integration optional as P2).

#### C.8 Student & Staff Attendance Record Management
- **Student Attendance:** Admin daily attendance register. Allows batch marking of student attendance (`Present`, `Absent`, `Excused`) by block and floor.
- **Staff Attendance Records (Strictly Records Only — No Staff Accounts):** Administrative roster for recording presence and shifts of maintenance workers, security guards, and cleaning personnel. Staff members have no login accounts.

#### C.9 Complaint Management, Configurable SLAs & Task Assignment
- Comprehensive complaint queue filterable by status (`Submitted`, `In Progress`, `Resolved`), priority (`Critical`, `High`, `Medium`, `Low`), category, and block.
- **Configurable SLA Tracking:** Resolution targets configured per priority tier (defaults: Critical = 4h, High = 24h, Medium = 48h, Low = 72h; configurable via system settings or environment variables).
- **Rule-Based Deadline Escalation:** If current time exceeds the configured SLA target and status is not `Resolved`, the ticket is automatically tagged as `ESCALATED / OVERDUE` and highlighted in red on the dashboard.
- Staff Task Assignment: Admin assigns an external maintenance worker/contractor name and scheduled appointment time to the ticket.

#### C.10 Housekeeping & Facility Management
- Housekeeping schedule manager: set cleaning schedules for common areas, corridors, washrooms, and student rooms.
- Hostel facility directory manager: update timings, rules, and contact persons for hostel amenities.

#### C.11 Gate-Pass Review & Approvals
- Queue of student outpass requests showing student details, destination, dates, and parent contact.
- One-click `Approve Gate Pass` or `Reject Request`.
- Security verification portal view: allows Admin to search active gate passes by USN to verify checkout/checkin at the hostel gate.

#### C.12 Emergency Alert Monitoring
- Dedicated SOS monitoring panel on the Admin Dashboard displaying active distress alerts fetched via periodic polling (5–10s).
- Action controls: `Acknowledge SOS`, `Dispatch Assistance`, and `Resolve Alert` with required incident log notes.

#### C.13 Mess Menu & Dining Administration
- Weekly menu editor: configure breakfast, lunch, tea, and dinner dishes for every day of the week.
- Feedback analytics: view average meal ratings and student food quality comments.

#### C.14 Broadcast Notifications & Feedback
- Compose and broadcast priority hostel announcements (`General`, `Urgent`, `Fee Reminder`, `Maintenance Alert`).
- Student feedback review inbox: review general student suggestions.

#### C.15 Reports, Analytics & System Settings
- Exportable reports (CSV / PDF layout): Room Occupancy & Vacancy Report, Fee Defaulters & Dues Report, Maintenance SLA Compliance Report, Daily In/Out Gate Activity Report.
- System settings: configure term dates, currency symbol, notification banners, emergency contact numbers, and **configurable SLA hour thresholds by complaint priority**.

---

## 3. Deterministic Business Rules & Domain Logic

```
┌────────────────────────────────────────────────────────────────────────┐
│                DETERMINISTIC BUSINESS LOGIC & CONSTRAINTS              │
├──────────────────────────┬─────────────────────────────────────────────┤
│ Unified Allocation Svc   │ One shared service for all room allocations │
│ Zero Overbooking         │ availableBeds = capacity - occupiedBeds     │
│ Single Active Allocation │ Exactly 1 active room allocation per student│
│ Overlapping Outpass Block│ Rejects overlapping/active concurrent leave │
│ Configurable SLA Target  │ Escalates when now > createdAt + SLA_Hours  │
│ Zero Staff Accounts      │ Staff are records only, zero login credentials│
│ Zero External Roles      │ RBAC strictly accepts role: student | admin │
└──────────────────────────┴─────────────────────────────────────────────┘
```

### 3.1 Authoritative Unified Room Allocation Service
To guarantee data integrity and completely prevent double-booking or duplicate student allocations, all room allocations across the application—whether triggered by **Application Approval** (`ADM-06`), **Booking Approval** (`ADM-09`), or **Direct Admin Allocation** (`ADM-04` / `ADM-13`)—must execute strictly through a single authoritative backend service: `RoomAllocationService.allocateBed()`.

The service executes an atomic database transaction enforcing the following sequence:
1. **Student Allocation Pre-check:** Queries existing confirmed allocations. If the student already holds an active confirmed allocation (`status === "Allocated"` or active confirmed booking), the transaction immediately aborts with: `409 Conflict: Student already holds an active room allocation`.
2. **Bed & Room Pre-check:** Queries target room and bed. Validates that `room.bedsAvailable > 0` and `bed.status === "Available"`. If either condition fails, the transaction immediately aborts with: `409 Conflict: Selected bed is no longer available`.
3. **Atomic Execution:** Within a single MongoDB transaction:
   - Sets target `bed.status = "Occupied"` and `bed.assignedStudent = studentId`.
   - Decrements `room.bedsAvailable = room.bedsAvailable - 1`.
   - Updates student profile record with `currentRoom = roomNumber` and `currentBed = bedId`.
   - Transitions corresponding Application or Booking document status to `Approved` / `Allocated`.

### 3.2 Admission Application Lifecycle
1. A student may submit only **one** pending application per academic term.
2. An approved application must be paired with an actual available room/bed through the `RoomAllocationService` before transitioning to `Allocated`.
3. If an application is `Rejected`, the student may submit a revised application with updated preferences.

### 3.3 Room Swap Validation State Machine
1. Both students involved in a room swap must have confirmed `Allocated` status.
2. Neither student may have pending disciplinary actions or pending fee dues exceeding the allowed threshold.
3. Upon Admin approval, the swap executes atomically in a single database transaction swapping the student references in the respective `Bed` and `Booking` documents.

### 3.4 Complaint Lifecycle, Configurable SLAs & Deterministic Priority Engine
1. **State Machine:**
   $$\text{Submitted} \longrightarrow \text{In Progress} \longrightarrow \text{Resolved}$$
2. Reopening is permitted within 48 hours of resolution if the student marks the issue as unsatisfied.
3. **Deterministic Priority Heuristic:** Evaluated immediately upon submission via normalized case-insensitive string parsing:
   - Contains any of: `["fire", "shock", "spark", "short circuit", "gas", "smoke", "collapse"]` $\rightarrow$ **Critical** (Default SLA: 4 hours).
   - Contains any of: `["water leak", "no water", "overflow", "plumbing", "sewage", "door lock", "broken window"]` $\rightarrow$ **High** (Default SLA: 24 hours).
   - Contains any of: `["fan", "light", "tube light", "wifi", "internet", "cleaning", "geyser", "switch"]` $\rightarrow$ **Medium** (Default SLA: 48 hours).
   - All other categories and general inquiries $\rightarrow$ **Low** (Default SLA: 72 hours).
4. **Configurable SLA Hours:** SLA target thresholds are configurable via administrative settings (`ADM-32`) or environment variables, allowing institutions to adjust response windows.
5. **Deterministic Escalation:**
   $$\text{isEscalated} = (\text{status} \ne \text{"Resolved"}) \land (\text{currentTime} > \text{createdAt} + \text{configuredSLAHours}[\text{priority}])$$

### 3.5 Gate Pass & Outpass Validation Rules
1. Outpass departure date/time must be strictly in the future (`departureDate > now`).
2. Return date/time must be strictly after departure date/time (`returnDate > departureDate`).
3. Maximum single outpass duration is capped at 14 days without administrative override.
4. **Overlapping Outpass Prevention Invariant:** A student cannot submit a new outpass request if:
   - They have an active outpass currently in `Pending` or `Approved` state where `returnDate \ge now`.
   - The requested `[departureDate, returnDate]` overlaps with any existing approved outpass date interval for that student.
5. An outpass is valid for gate passage only after Admin status reaches `Approved`.

### 3.6 Strict Access & Role Isolation Rules
1. **Forbidden Role Registration:** The backend explicitly rejects any registration payload containing `role: "admin"`.
2. **Endpoint RBAC:** Every protected endpoint verifies the decoded JWT `role`. If an authenticated student requests an `/api/admin/*` route, the server returns `403 Forbidden`.
3. **Student Data Scoping:** Every student data retrieval query automatically binds to `studentId: req.user.id` to prevent cross-account data leaks.

---

## 4. Non-Functional Requirements

### 4.1 Security
- **Credential Storage:** Passwords hashed using bcrypt with salt factor $\ge 10$. Plain-text passwords never stored or logged.
- **JWT Protection:** Signed using a cryptographically secure 256-bit secret key (`JWT_SECRET`) with token expiration.
- **Input Sanitization & Injection Prevention:** All inputs validated and sanitized against NoSQL injection and Cross-Site Scripting (XSS).
- **CORS Configuration:** Backend explicitly whitelists only trusted client origins.
- **Rate Limiting:** Authentication routes protected against brute-force attacks via express rate limiters (e.g., maximum 5 failed attempts per 15 minutes per IP).

### 4.2 Performance & Responsiveness
- **API Response Latency:** 95% of API requests resolved within $\le 200\text{ ms}$ under standard operational load.
- **Frontend Page Load:** First Contentful Paint (FCP) $\le 1.2\text{ s}$; Time to Interactive (TTI) $\le 1.8\text{ s}$ over broadband connections.
- **Database Query Indexing:** Compound indexes applied to frequently queried fields: `email`, `usn`, `roomNumber`, `status`, `studentId`.

### 4.3 Usability & Design System
- **Dual Portal Design Integrity:** Professional, cohesive enterprise aesthetic with distinct branding tags for Student and Admin portals.
- **Clear Feedback Mechanisms:** Elimination of native blocking `alert()` and `confirm()` dialogs in favor of modern toast notifications and modal confirmations.
- **Accessibility:** Semantic HTML5 elements, high contrast text ratios ($\ge 4.5:1$), and complete keyboard accessibility.

### 4.4 Responsive Design & Cross-Device Compatibility
- **Fluid Layouts:** Responsive grid and flexbox architectures supporting viewport widths from 360px (mobile) to 1920px+ (desktop).
- **Breakpoints:** Mobile: $\le 600\text{ px}$, Tablet: $601\text{ px} - 1024\text{ px}$, Desktop: $\ge 1025\text{ px}$.
- **Cross-Browser Support:** Verified compatibility on modern Chromium (Chrome, Edge), Firefox, and WebKit (Safari).

### 4.5 Reliability & Availability
- **Graceful Error Recovery:** Frontend error boundaries catch rendering crashes and offer a recovery action without full session loss.
- **Atomic Operations:** Database updates modifying room bed counts execute atomically using Mongoose conditional updates and transactions to eliminate race conditions.
- **Connection Health Checks:** Backend includes `/api/health` endpoint reporting database and server uptime.

### 4.6 Data Integrity & Validation
- **Schema Validation:** Strict Mongoose schemas enforcing required fields, data types, enum values, and string lengths.
- **Referential Integrity:** Foreign keys (`studentId`, `roomId`, `bookingId`) verified before creating subordinate records.
- **Audit Logging:** Critical administrative actions (room deletion, application approval, bed reallocation) recorded with admin ID and timestamp.

### 4.7 Maintainability & Documentation
- **Clean Architecture:** Strict separation of concerns on backend: Routes $\rightarrow$ Controllers $\rightarrow$ Services $\rightarrow$ Models.
- **Frontend Organization:** Dedicated directories for `pages`, `components`, `context`, `services`, and `utils`.
- **Preservation of Documentation:** All specifications, architecture decisions, and audit notes maintained under `docs/`.

### 4.8 Backup, Recovery & Operational Continuity
- **Automated Snapshots:** Continuous daily backups via MongoDB Atlas cloud backup retention.
- **Idempotent Database Seeding:** Standalone idempotent seed script (`npm run seed`) capable of reconstituting baseline rooms, blocks, and initial administrator records without duplicate entries.

---

## 5. User Permission Matrix Reference

To maintain a **single authoritative source of truth** across all project documentation and eliminate synchronization discrepancies, the complete User Permission Matrix is maintained exclusively in [`docs/USER_ROLES.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/USER_ROLES.md#5-comprehensive-user-permission-matrix).

Please refer directly to Section 5 of [`docs/USER_ROLES.md`](file:///C:/Users/l46ka/hostel-management-frontend/docs/USER_ROLES.md#5-comprehensive-user-permission-matrix) for the authoritative matrix governing View, Create, Update, Approve, Reject, and Delete permissions across all system modules.
