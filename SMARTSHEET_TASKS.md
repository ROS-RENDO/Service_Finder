# Service Finder – Project Tasks for Smartsheet (Project Management)

Use this list to build your Smartsheet project. Each **Task** is a parent row; each **Subtask** is a child row under that task. You can add columns: Owner, Start Date, End Date, % Complete, Status, Priority.

---

## 1. DATABASE & DATA MODEL

| Task | Subtask |
|------|---------|
| **1.1 Database schema design** | Define Prisma datasource (MySQL) and generator |
| | Create enums: UserRole, UserStatus, StaffRole, StaffStatus, VerificationStatus, CategoryStatus, BookingStatus, PaymentMethod, PaymentStatus, ServiceRequestStatus |
| | Document entity relationships and indexes |
| **1.2 Core domain models** | User model (auth, role, profile, relations) |
| | Company model (owner, verification, contact, relations) |
| | CompanyStaff model (companyId, userId, role, status) – staff tied to one company |
| | Category and ServiceType models (hierarchy for services) |
| **1.3 Service & booking models** | Service model (companyId, serviceTypeId, pricing, duration) |
| | ServiceArea model (company coverage by city) |
| | Booking model (customer, company, service, assignedStaffId, status, pricing) |
| | BookingStatusLog model (audit trail) |
| **1.4 Payment & review models** | Payment model (bookingId, userId, method, status, Stripe ref) |
| | Review model (bookingId, customerId, companyRating, staffId, staffRating) |
| | CompanyRatingSummary model (aggregate ratings) |
| **1.5 Supporting models** | ServiceRequest model (customer, company, service, assignedStaff) |
| | AvailabilitySlot model (companyId, staffId, date, times) |
| | Cancellation, Notification, Conversation, Message, Invoice |
| | AuditLog, PasswordReset, SystemSetting |
| **1.6 Migrations & seed data** | Create and run Prisma migrations |
| | Seed: categories, service types, sample users (customer, company_admin, staff, admin) |
| | Seed: companies, staff, services, bookings, payments, reviews |

---

## 2. BACKEND – INFRASTRUCTURE

| Task | Subtask |
|------|---------|
| **2.1 App setup** | Express app, CORS, helmet, cookie-parser, rate limiting |
| | JSON body parser; Stripe webhook raw body route |
| | BigInt serialization for JSON responses |
| | Health check endpoint GET /health |
| **2.2 Configuration** | Database config (Prisma client, connect/disconnect) |
| | JWT config (utils/jwt.js) |
| | Auth middleware (authenticate, authorize by role) |
| | Error handler middleware |
| **2.3 Auth & email** | Email config and templates (password reset, etc.) |
| | Bcrypt utilities for password hashing |

---

## 3. BACKEND – API ROUTES & CONTROLLERS

| Task | Subtask |
|------|---------|
| **3.1 Auth API** | POST /api/auth/register, /login, /logout |
| | GET /api/auth/me |
| | POST /api/auth/request (forgot password), /verify, /reset |
| **3.2 Users API** | GET /api/users (admin), GET /api/users/:id |
| | PUT /api/users/:id, PATCH /api/users/:id/status |
| | DELETE /api/users/:id (admin) |
| **3.3 Companies API** | GET /api/companies, POST /api/companies |
| | GET /api/companies/me (current company for company_admin) |
| | GET/PUT/DELETE /api/companies/:id, GET /api/companies/:id/details |
| | GET /api/companies/categories/:slug/service-types/:slug (browse) |
| | GET /api/companies/staff, POST /api/companies/staff |
| | GET/PUT/DELETE /api/companies/staff/:id, POST .../reactivate |
| | POST /api/companies/assign-staff, GET /api/companies/bookings |
| **3.4 Services API** | GET /api/services (filter by companyId, serviceTypeId) |
| | GET /api/services/:id, POST /api/services, PUT /api/services/:id, DELETE |
| | GET /api/services/company/:companyId |
| **3.5 Bookings API** | GET /api/bookings (filters, pagination) |
| | GET /api/bookings/:id |
| | POST /api/bookings (create booking) |
| | PATCH /api/bookings/:id/status |
| | POST /api/bookings/:id/assign-staff (bookings.routes or companies) |
| | GET /api/bookings/staff/assigned; POST .../start, PATCH .../progress, POST .../complete |
| **3.6 Payments API** | GET /api/payments, GET /api/payments/:id |
| | POST /api/payments/checkout-session, POST /api/payments/complete |
| | POST /api/payments/webhook (Stripe) |
| **3.7 Reviews API** | GET /api/reviews (admin), GET /api/reviews/my (customer) |
| | GET /api/reviews/:id, GET /api/reviews/company/:companyId, GET /api/reviews/staff/:staffId |
| | POST /api/reviews, PUT /api/reviews/:id, DELETE /api/reviews/:id |
| **3.8 Staff API** | GET /api/staff/me (profile + stats) |
| | GET/POST/PATCH/DELETE /api/staff/availability, GET /api/staff/availability/me |
| | GET /api/staff/services/pending, PATCH .../approve, .../reject |
| | GET /api/staff/bookings, GET /api/staff/bookings/:id, PATCH .../status |
| **3.9 Categories & service types** | GET/POST/PUT/DELETE /api/categories |
| | GET/POST/PUT/DELETE /api/service-types |
| **3.10 Conversations API** | GET /api/conversations, GET /api/conversations/:id/messages |
| | POST create conversation, POST send message |
| **3.11 Business logic services** | BookingService (assignStaff, startJob, updateProgress, completeJob, status transitions) |
| | ReviewService (createReview, updateReview, updateCompanyRating, updateStaffRating, getCompanyReviews, getStaffReviews) |
| **3.12 Utilities** | statusTransitions.js (validate booking status changes) |

---

## 4. FRONTEND – CORE SETUP

| Task | Subtask |
|------|---------|
| **4.1 Project setup** | Next.js app (App Router), TypeScript, Tailwind CSS |
| | Global layout, globals.css, error boundary |
| **4.2 API & auth context** | lib/api/client.ts (base URL, axios/fetch) |
| | AuthContext (login, logout, checkAuth, user state) |
| | Protected routes / role-based redirects |
| **4.3 Shared UI components** | Button, Card, Badge, Avatar, Input, Label, Select, Textarea |
| | Dialog, Tabs, Dropdown, Table, ScrollArea, Switch, Progress |
| | Toast, StatCard, DashboardCard, PageHeader, LoadingCard, ErrorMessage, EmptyState |
| **4.4 Layouts & navigation** | Navbar, Footer |
| | CustomerSidebar, CustomerHeader |
| | CompanySidebar, CompanyHeader |
| | StaffSidebar, StaffHeader |
| | AdminSidebar, AdminHeader |

---

## 5. FRONTEND – AUTH PAGES

| Task | Subtask |
|------|---------|
| **5.1 Auth layout & pages** | app/auth/layout.tsx |
| | app/auth/login/page.tsx |
| | app/auth/register/page.tsx |
| | app/auth/forgot-password/page.tsx |
| | app/auth/reset-password/page.tsx |
| **5.2 Auth hooks** | useAuth (login, register, logout, requestReset, verifyCode, resetPassword) |
| | Integrate with AuthContext and cookie/token |

---

## 6. FRONTEND – CUSTOMER

| Task | Subtask |
|------|---------|
| **6.1 Customer layout** | app/customer/layout.tsx (sidebar + header) |
| **6.2 Browse & discovery** | app/customer/services/page.tsx (categories) |
| | app/customer/services/[category]/page.tsx |
| | app/customer/services/[category]/[serviceType]/page.tsx (companies list) |
| | app/customer/services/[category]/[serviceType]/company/[id]/page.tsx (company detail) |
| | app/customer/services/.../company/[id]/booking/page.tsx (booking form) |
| **6.3 Bookings** | app/customer/bookings/page.tsx (list) |
| | app/customer/bookings/[bookingId]/page.tsx (detail) |
| | app/customer/bookings/new/page.tsx (if used) |
| | app/customer/bookings/[bookingId]/payments/page.tsx |
| | app/customer/bookings/[bookingId]/payments/success/page.tsx |
| | app/customer/bookings/[bookingId]/payments/cancelled/page.tsx |
| **6.4 Payments & reviews** | app/customer/payments/page.tsx, app/customer/payments/[id]/page.tsx |
| | app/customer/reviews/page.tsx, app/customer/reviews/new/page.tsx |
| **6.5 Profile & other** | app/customer/dashboard/page.tsx |
| | app/customer/profile/page.tsx |
| | app/customer/messages/page.tsx |
| **6.6 Customer hooks & types** | useBookings, useCategories, useCompanies, usePayments, useReviews |
| | useCompaniesByServiceType |
| | booking.types, company.types, etc. |

---

## 7. FRONTEND – COMPANY (BUSINESS)

| Task | Subtask |
|------|---------|
| **7.1 Company layout** | app/company/layout.tsx |
| **7.2 Dashboard & operations** | app/company/dashboard/page.tsx (stats, recent bookings, staff) |
| | app/company/bookings/page.tsx (list, assign staff, status) |
| | app/company/bookings/calendar/page.tsx |
| **7.3 Services management** | app/company/services/page.tsx |
| | app/company/services/new/page.tsx |
| | app/company/services/[id]/page.tsx, .../edit/page.tsx |
| **7.4 Staff management** | app/company/staff/page.tsx (list, add, remove, reactivate) |
| | app/company/staff/new/page.tsx |
| | app/company/staff/[id]/page.tsx (view staff detail) |
| **7.5 Other company pages** | app/company/payments/page.tsx |
| | app/company/reviews/page.tsx |
| | app/company/areas/page.tsx (service areas) |
| | app/company/settings/page.tsx |
| | app/company/messages/page.tsx |
| **7.6 Company hooks** | useCompanyMe, useCompanies (getCompanyById, getStaffMemberById, CRUD staff) |

---

## 8. FRONTEND – STAFF

| Task | Subtask |
|------|---------|
| **8.1 Staff layout** | app/staff/layout.tsx |
| **8.2 Dashboard & schedule** | app/staff/dashboard/page.tsx (today’s jobs, pending requests) |
| | app/staff/schedule/page.tsx (calendar) |
| **8.3 Bookings & jobs** | app/staff/bookings/page.tsx (list, filters) |
| | app/staff/bookings/[id]/page.tsx (detail, start/complete job) |
| **8.4 Services & availability** | app/staff/services/page.tsx (pending requests, approve/reject) |
| | app/staff/availability/page.tsx (slots) |
| **8.5 Profile & other** | app/staff/profile/page.tsx |
| | app/staff/messages/page.tsx |
| | app/staff/measurement/page.tsx (if used) |
| **8.6 Staff hooks** | useStaffBookings, useStaffAvailability, useStaffServiceRequests, useStaffMe |
| | formatStaffTime, formatDuration, durationMinutes |

---

## 9. FRONTEND – ADMIN

| Task | Subtask |
|------|---------|
| **9.1 Admin layout** | app/admin/layout.tsx |
| **9.2 Admin pages** | app/admin/dashboard/page.tsx |
| | app/admin/users/page.tsx, app/admin/users/[id]/page.tsx |
| | app/admin/companies/page.tsx, app/admin/companies/[id]/page.tsx |
| | app/admin/companies/pending/page.tsx |
| | app/admin/verification/page.tsx |
| | app/admin/categories/page.tsx |
| | app/admin/service-types/page.tsx |
| | app/admin/analytics/page.tsx |
| | app/admin/settings/page.tsx |
| | app/admin/messages/page.tsx |
| **9.3 Admin hooks** | useUser, useCompanies, useCategories, useServiceTypes (as needed) |

---

## 10. INTEGRATION & FLOWS

| Task | Subtask |
|------|---------|
| **10.1 Customer booking flow** | Browse category → service type → company → book → pay → track |
| | Ensure booking creates with companyId, serviceId; payment confirms booking |
| **10.2 Company flow** | Company sees bookings; assign staff (assignedStaffId); staff sees only their company’s assigned jobs |
| | Staff list and detail scoped to company (GET /api/companies/staff) |
| **10.3 Staff flow** | Staff sees only bookings where assignedStaffId = their CompanyStaff.id |
| | Start job, progress, complete (booking service + status log) |
| | Pending service requests (ServiceRequest) approve/reject |
| **10.4 Payments** | Stripe checkout session and webhook; complete payment updates booking and payment record |
| **10.5 Reviews** | After completion, customer can leave review (company + optional staff rating); update company/staff rating summaries |

---

## 11. TESTING & QUALITY

| Task | Subtask |
|------|---------|
| **11.1 Backend** | Unit tests for services (booking, review) |
| | API tests for auth, bookings, payments (Postman/collection) |
| **11.2 Frontend** | Smoke test each role: customer, company_admin, staff, admin |
| | Test booking creation, payment, assign staff, staff start/complete |
| **11.3 Data & security** | Ensure staff only see their company’s data and their assigned jobs |
| | Ensure company only sees own bookings, staff, payments |

---

## 12. DOCUMENTATION & DEPLOYMENT

| Task | Subtask |
|------|---------|
| **12.1 Documentation** | README: setup, env vars, run backend/frontend |
| | API overview or Postman collection |
| | Application flow guide (customer, company, staff, admin) |
| **12.2 Deployment prep** | Environment variables (DATABASE_URL, JWT_SECRET, Stripe keys, NEXT_PUBLIC_API_URL) |
| | Build and run scripts; production error handling |

---

## Smartsheet import tips

- **Parent row** = Task (e.g. "1. DATABASE & DATA MODEL").
- **Child rows** = Subtasks (e.g. "Define Prisma datasource (MySQL) and generator").
- Add columns: **Owner**, **Start Date**, **End Date**, **% Complete**, **Status** (Not Started / In Progress / Complete), **Priority** (High / Medium / Low), **Phase** (Database / Backend / Frontend / Integration / Testing / Docs).
- You can map: Section 1 → Phase "Database", Sections 2–3 → "Backend", Sections 4–9 → "Frontend", Section 10 → "Integration", Section 11 → "Testing", Section 12 → "Documentation & Deployment".
- For Gantt view: set Start/End dates per task; subtasks can inherit or have their own dates.

---

## Quick reference: Backend files (36 files)

| Area | Files |
|------|--------|
| Routes | auth, users, companies, services, bookings, payments, reviews, conversations, category, serviceType, staff, ai |
| Controllers | auth, users, companies, services, bookings, payments, reviews, conversations, category, serviceType, staff |
| Services | booking.service.js, review.service.js |
| Middleware | auth.js, errorHandler.js |
| Config/Utils | database.js, jwt.js, bcrypt.js, statusTransitions.js, email config, emailTemplates |

---

## Quick reference: Database (22 models)

User, Company, CompanyStaff, Category, ServiceType, Service, ServiceArea, ServiceRequest, AvailabilitySlot, Booking, BookingStatusLog, Payment, Review, Cancellation, CompanyRatingSummary, Notification, Conversation, ConversationParticipant, Message, Invoice, SystemSetting, AuditLog, PasswordReset

---

## Quick reference: Frontend app pages (68 files)

| Role | Count | Examples |
|------|-------|----------|
| Customer | ~20 | services, bookings, payments, reviews, profile, messages |
| Company | ~16 | dashboard, bookings, services, staff, payments, reviews, areas, settings |
| Staff | ~10 | dashboard, schedule, bookings, services, availability, profile, messages |
| Admin | ~14 | dashboard, users, companies, categories, service-types, verification, analytics |
| Auth | 5 | login, register, forgot-password, reset-password |
| Shared | layout, page, error, globals.css |
