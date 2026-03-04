# Service Finder – Frontend Pages, API Usage & Backend Endpoints

## 1. Page structure by role

### 1.1 CUSTOMER (customer/*)

| Route | Page file | Purpose |
|-------|-----------|---------|
| `/customer` | (layout only) | Customer layout wrapper |
| `/customer/dashboard` | `app/customer/dashboard/page.tsx` | Dashboard: upcoming/completed bookings, reviews, payments |
| `/customer/services` | `app/customer/services/page.tsx` | Browse categories |
| `/customer/services/[category]` | `app/customer/services/[category]/page.tsx` | Service types in category |
| `/customer/services/[category]/[serviceType]` | `app/customer/services/[category]/[serviceType]/page.tsx` | Companies offering that service type |
| `/customer/services/.../company/[id]` | `app/customer/services/.../company/[id]/page.tsx` | Company detail + services + reviews |
| `/customer/services/.../company/[id]/booking` | `app/customer/services/.../company/[id]/booking/page.tsx` | Booking form (date, time, address, confirm) |
| `/customer/bookings` | `app/customer/bookings/page.tsx` | List my bookings |
| `/customer/bookings/[bookingId]` | `app/customer/bookings/[bookingId]/page.tsx` | Booking detail |
| `/customer/bookings/new` | `app/customer/bookings/new/page.tsx` | (if used) |
| `/customer/bookings/[bookingId]/payments` | `app/customer/bookings/[bookingId]/payments/page.tsx` | Payment / checkout |
| `/customer/bookings/[bookingId]/payments/success` | `.../payments/success/page.tsx` | Payment success |
| `/customer/bookings/[bookingId]/payments/cancelled` | `.../payments/cancelled/page.tsx` | Payment cancelled |
| `/customer/payments` | `app/customer/payments/page.tsx` | Payment history |
| `/customer/payments/[id]` | `app/customer/payments/[id]/page.tsx` | Payment detail |
| `/customer/reviews` | `app/customer/reviews/page.tsx` | My reviews |
| `/customer/reviews/new` | `app/customer/reviews/new/page.tsx` | Create review (bookingId) |
| `/customer/profile` | `app/customer/profile/page.tsx` | Profile (auth context) |
| `/customer/messages` | `app/customer/messages/page.tsx` | Conversations / chat |

### 1.2 COMPANY (company_admin) (company/*)

| Route | Page file | Purpose |
|-------|-----------|---------|
| `/company` | (layout) | Company layout |
| `/company/dashboard` | `app/company/dashboard/page.tsx` | Dashboard: revenue, bookings, staff, recent list |
| `/company/bookings` | `app/company/bookings/page.tsx` | List bookings; assign staff; status |
| `/company/bookings/calendar` | `app/company/bookings/calendar/page.tsx` | Calendar view |
| `/company/services` | `app/company/services/page.tsx` | List company services |
| `/company/services/new` | `app/company/services/new/page.tsx` | Create service |
| `/company/services/[id]` | `app/company/services/[id]/page.tsx` | Service detail |
| `/company/services/[id]/edit` | `app/company/services/[id]/edit/page.tsx` | Edit service |
| `/company/staff` | `app/company/staff/page.tsx` | List staff |
| `/company/staff/new` | `app/company/staff/new/page.tsx` | Add staff |
| `/company/staff/[id]` | `app/company/staff/[id]/page.tsx` | Staff detail (view / remove / reactivate) |
| `/company/payments` | `app/company/payments/page.tsx` | Payments list |
| `/company/reviews` | `app/company/reviews/page.tsx` | Company reviews |
| `/company/areas` | `app/company/areas/page.tsx` | Service areas (company) |
| `/company/settings` | `app/company/settings/page.tsx` | Company settings |
| `/company/messages` | `app/company/messages/page.tsx` | Messages / chat |

### 1.3 STAFF (staff/*)

| Route | Page file | Purpose |
|-------|-----------|---------|
| `/staff` | (layout) | Staff layout |
| `/staff/dashboard` | `app/staff/dashboard/page.tsx` | Today’s jobs, pending requests, stats |
| `/staff/schedule` | `app/staff/schedule/page.tsx` | Calendar of assigned jobs |
| `/staff/bookings` | `app/staff/bookings/page.tsx` | List assigned bookings |
| `/staff/bookings/[id]` | `app/staff/bookings/[id]/page.tsx` | Job detail; start / complete |
| `/staff/services` | `app/staff/services/page.tsx` | Pending service requests; approve / reject |
| `/staff/availability` | `app/staff/availability/page.tsx` | Manage availability slots |
| `/staff/profile` | `app/staff/profile/page.tsx` | Profile + stats + reviews (staff/me) |
| `/staff/messages` | `app/staff/messages/page.tsx` | Messages |
| `/staff/measurement` | `app/staff/measurement/page.tsx` | AI analyze-wall (image upload) |

### 1.4 ADMIN (admin/*)

| Route | Page file | Purpose |
|-------|-----------|---------|
| `/admin` | (layout) | Admin layout |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Platform overview |
| `/admin/users` | `app/admin/users/page.tsx` | Users list |
| `/admin/users/[id]` | `app/admin/users/[id]/page.tsx` | User detail / edit |
| `/admin/companies` | `app/admin/companies/page.tsx` | Companies list |
| `/admin/companies/[id]` | `app/admin/companies/[id]/page.tsx` | Company detail / edit |
| `/admin/companies/pending` | `app/admin/companies/pending/page.tsx` | Pending companies |
| `/admin/verification` | `app/admin/verification/page.tsx` | Verification queue |
| `/admin/categories` | `app/admin/categories/page.tsx` | Categories CRUD |
| `/admin/service-types` | `app/admin/service-types/page.tsx` | Service types CRUD |
| `/admin/analytics` | `app/admin/analytics/page.tsx` | Analytics |
| `/admin/settings` | `app/admin/settings/page.tsx` | Settings |
| `/admin/messages` | `app/admin/messages/page.tsx` | Messages |

### 1.5 AUTH (shared)

| Route | Page file | Purpose |
|-------|-----------|---------|
| `/` | `app/page.tsx` | Landing / home |
| `/auth/login` | `app/auth/login/page.tsx` | Login |
| `/auth/register` | `app/auth/register/page.tsx` | Register |
| `/auth/forgot-password` | `app/auth/forgot-password/page.tsx` | Request reset |
| `/auth/reset-password` | `app/auth/reset-password/page.tsx` | Reset with code |

---

## 2. Each page → API endpoints used

### CUSTOMER

| Page | Endpoints used (via hooks or direct fetch) |
|------|--------------------------------------------|
| `customer/dashboard` | AuthContext (GET /api/auth/me); useBookings → GET /api/bookings; useReviews → GET /api/reviews/my; usePayments → GET /api/payments |
| `customer/services` | useCategories → GET /api/categories |
| `customer/services/[category]/[serviceType]` | useCompaniesByServiceType → GET /api/companies/categories/:slug/service-types/:slug |
| `customer/.../company/[id]` | useCompanies.getCompanyById → GET /api/companies/:id; useServices (company) → GET /api/services/company/:companyId; useReviews → GET /api/reviews/company/:companyId |
| `customer/.../company/[id]/booking` | useBookings.createBooking → POST /api/bookings; direct GET /api/services/:id |
| `customer/bookings` | useBookings → GET /api/bookings |
| `customer/bookings/[bookingId]` | useBookings.getBookingById → GET /api/bookings/:id |
| `customer/bookings/.../payments` | useBookings.getBookingById; usePayments.createCheckoutSession → POST /api/payments/checkout-session, completePayment → POST /api/payments/complete |
| `customer/bookings/.../payments/success` | useBookings.getBookingById |
| `customer/payments` | usePayments → GET /api/payments |
| `customer/payments/[id]` | usePayments.getPaymentById → GET /api/payments/:id |
| `customer/reviews` | useReviews → GET /api/reviews/my |
| `customer/reviews/new` | useBookings (completed); useReviews.createReview → POST /api/reviews |
| `customer/profile` | AuthContext (GET /api/auth/me) |
| `customer/messages` | useChat → GET /api/conversations, GET /api/conversations/:id/messages; POST /api/conversations/messages; direct GET /api/users/:id for user info |

### COMPANY (company_admin)

| Page | Endpoints used |
|------|----------------|
| `company/dashboard` | useCompanyMe → GET /api/companies/me; fetch GET /api/companies/bookings; fetch GET /api/companies/staff; (onboarding) POST /api/companies |
| `company/bookings` | GET /api/companies/bookings; GET /api/companies/staff; POST /api/companies/assign-staff |
| `company/services` | useServices → GET /api/services |
| `company/services/new` | GET /api/auth/me; GET /api/categories; GET /api/service-types/categories/:slug; POST /api/services |
| `company/services/[id]`, `.../edit` | GET /api/services/:id; PUT /api/services/:id |
| `company/staff` | GET /api/companies/staff; DELETE /api/companies/staff/:id; POST /api/companies/staff/:id/reactivate |
| `company/staff/new` | POST /api/companies/staff; GET /api/companies/staff (list) |
| `company/staff/[id]` | useCompanies.getStaffMemberById → GET /api/companies/staff/:id; removeStaffMember → DELETE; reactivateStaffMember → POST .../reactivate |
| `company/payments` | usePayments → GET /api/payments |
| `company/reviews` | useReviews (company) → GET /api/reviews/company/:companyId |
| `company/areas` | useCompanies.getCompanyById → GET /api/companies/:id |
| `company/messages` | useChat (conversations, messages); GET /api/users/:id |

### STAFF

| Page | Endpoints used |
|------|----------------|
| `staff/dashboard` | useAuthContext; useStaffBookings → GET /api/staff/bookings; useStaffServiceRequests → GET /api/staff/services/pending |
| `staff/schedule` | useStaffBookings → GET /api/staff/bookings |
| `staff/bookings` | useStaffBookings → GET /api/staff/bookings |
| `staff/bookings/[id]` | useStaffBookings.getBookingById → GET /api/staff/bookings/:id; updateBookingStatus → PATCH /api/staff/bookings/:id/status |
| `staff/services` | useStaffServiceRequests → GET /api/staff/services/pending; PATCH .../approve; PATCH .../reject |
| `staff/availability` | useStaffAvailability → GET /api/staff/availability/me; POST /api/staff/availability |
| `staff/profile` | useAuthContext; useStaffMe → GET /api/staff/me; PUT /api/users/:id (profile save) |
| `staff/messages` | useChat; GET /api/users/:id |
| `staff/measurement` | POST /api/analyze-wall (multipart) |

### ADMIN

| Page | Endpoints used |
|------|----------------|
| `admin/users` | GET /api/users |
| `admin/categories` | GET /api/categories; POST /api/categories; PUT /api/categories/:id; DELETE /api/categories/:id |
| `admin/service-types` | GET /api/service-types; GET /api/categories; POST /api/service-types; PUT /api/service-types/:id; DELETE /api/service-types/:id |
| `admin/companies` | GET /api/companies |
| `admin/verification` | GET /api/companies?verificationStatus=pending; GET/PUT /api/companies/:id (note: verification page uses hardcoded `http://localhost:3000` base – should use NEXT_PUBLIC_API_URL) |
| `admin/companies/[id]`, `admin/companies/pending` | (typically GET /api/companies, GET /api/companies/:id) |

### AUTH & LAYOUTS

| Page / component | Endpoints used |
|------------------|-----------------|
| `auth/login` | AuthContext.login → POST /api/auth/login |
| `auth/register` | AuthContext.register → POST /api/auth/register |
| `auth/forgot-password` | useAuth.requestReset → POST /api/auth/request |
| `auth/reset-password` | useAuth.verifyCode, resetPassword → POST /api/auth/verify, POST /api/auth/reset |
| CustomerHeader, CompanyHeader, StaffHeader, AdminHeader | POST /api/auth/logout (via apiClient) |
| AuthContext (global) | GET /api/auth/me (checkAuth) |

---

## 3. All backend API endpoints (by route file)

### Auth (`/api/auth`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| POST | /api/auth/register | Yes (register page) |
| POST | /api/auth/login | Yes (login page) |
| GET | /api/auth/me | Yes (AuthContext, company services/new) |
| POST | /api/auth/logout | Yes (all headers) |
| POST | /api/auth/request | Yes (forgot-password) |
| POST | /api/auth/verify | Yes (reset-password) |
| POST | /api/auth/reset | Yes (reset-password) |

### Users (`/api/users`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/users | Yes (admin users) |
| GET | /api/users/:id | Yes (profile save, messages user info) |
| PUT | /api/users/:id | Yes (staff profile, customer profile if implemented) |
| PATCH | /api/users/:id | Yes (if any) |
| PATCH | /api/users/:id/status | **Not used** (admin user status) |
| DELETE | /api/users/:id | **Not used** (admin delete user) |

### Companies (`/api/companies`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/companies | Yes (admin companies, verification) |
| POST | /api/companies | Yes (company dashboard onboarding) |
| GET | /api/companies/me | Yes (company dashboard, useCompanyMe) |
| GET | /api/companies/categories/:cat/service-types/:st | Yes (customer browse) |
| GET | /api/companies/staff | Yes (company staff list, dashboard, bookings) |
| POST | /api/companies/staff | Yes (company staff new) |
| GET | /api/companies/staff/:id | Yes (company staff detail, useCompanies) |
| PUT | /api/companies/staff/:id | Yes (useCompanies – update staff) |
| DELETE | /api/companies/staff/:id | Yes (company staff list, detail) |
| POST | /api/companies/staff/:id/reactivate | Yes (company staff list) |
| POST | /api/companies/assign-staff | Yes (company bookings) |
| GET | /api/companies/bookings | Yes (company dashboard, bookings) |
| GET | /api/companies/:id | Yes (company detail, areas, useCompanies) |
| PUT | /api/companies/:id | **Not used** (company settings – frontend has settings page but no PUT call in scan) |
| DELETE | /api/companies/:id | **Not used** (admin delete company) |
| GET | /api/companies/:id/details | Yes (via getCompanyById or details – used in customer company detail flow) |

### Services (`/api/services`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/services | Yes (company services list, useServices) |
| GET | /api/services/:id | Yes (company service edit, customer booking page) |
| POST | /api/services | Yes (company services new) |
| PUT | /api/services/:id | Yes (company service edit) |
| DELETE | /api/services/:id | **Not used** (company delete service – no delete in scanned pages) |
| GET | /api/services/company/:companyId | Yes (company detail page) |

### Bookings (`/api/bookings`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/bookings | Yes (customer bookings, dashboard; filters) |
| GET | /api/bookings/:id | Yes (customer booking detail, payments) |
| POST | /api/bookings | Yes (customer create booking) |
| PATCH | /api/bookings/:id/status | Yes (company bookings – status; staff use staff API instead) |
| DELETE | /api/bookings/:id | **Not used** (cancel booking – no cancel in scanned flow) |
| POST | /api/bookings/:id/assign-staff | Yes (company bookings – useBookings.assignStaff) |
| GET | /api/bookings/staff/assigned | **Not used** (frontend staff uses GET /api/staff/bookings instead) |
| POST | /api/bookings/:id/start | **Not used** (frontend staff uses PATCH /api/staff/bookings/:id/status) |
| PATCH | /api/bookings/:id/progress | **Not used** (staff uses status only) |
| POST | /api/bookings/:id/complete | **Not used** (staff uses PATCH staff/bookings/:id/status) |

### Payments (`/api/payments`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/payments | Yes (customer, company payments) |
| GET | /api/payments/:id | Yes (customer payment detail, usePayments) |
| POST | /api/payments | Yes (usePayments – create payment) |
| POST | /api/payments/checkout-session | Yes (customer checkout) |
| POST | /api/payments/complete | Yes (customer success page) |
| PUT | /api/payments/:id | **Not used** (company_admin/admin update payment) |
| (webhook) | POST /api/payments/webhook | Backend only (Stripe) |

### Reviews (`/api/reviews`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/reviews | **Not used** (admin list all reviews) |
| GET | /api/reviews/my | Yes (customer reviews) |
| GET | /api/reviews/:id | **Not used** (single review detail) |
| POST | /api/reviews | Yes (customer create review) |
| PUT | /api/reviews/:id | **Not used** (customer edit review) |
| DELETE | /api/reviews/:id | **Not used** (customer/admin delete review) |
| GET | /api/reviews/company/:companyId | Yes (company detail, company reviews page) |
| GET | /api/reviews/staff/:staffId | Yes (useReviews – staff reviews; company staff list may use) |

### Staff (`/api/staff`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/staff/me | Yes (staff profile) |
| GET | /api/staff/availability/me | Yes (staff availability) |
| POST | /api/staff/availability | Yes (staff availability) |
| PATCH | /api/staff/availability/:id | Yes (useStaffAvailability) |
| DELETE | /api/staff/availability/:id | Yes (useStaffAvailability) |
| GET | /api/staff/services/pending | Yes (staff services) |
| PATCH | /api/staff/services/:id/approve | Yes (staff services) |
| PATCH | /api/staff/services/:id/reject | Yes (staff services) |
| GET | /api/staff/bookings | Yes (staff dashboard, schedule, bookings) |
| GET | /api/staff/bookings/:id | Yes (staff booking detail) |
| PATCH | /api/staff/bookings/:id/status | Yes (staff start/complete job) |

### Categories (`/api/categories`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/categories | Yes (customer services, company new service, admin) |
| GET | /api/categories/:slug | Yes (useCategories) |
| POST | /api/categories | Yes (admin) |
| PUT | /api/categories/:id | Yes (admin) |
| DELETE | /api/categories/:id | Yes (admin) |

### Service types (`/api/service-types`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/service-types | Yes (admin) |
| GET | /api/service-types/categories/:slug | Yes (company new service) |
| GET | /api/service-types/:slug | **Not used** (by slug) |
| POST | /api/service-types | Yes (admin) |
| PUT | /api/service-types/:id | Yes (admin) |
| DELETE | /api/service-types/:id | Yes (admin) |

### Conversations (`/api/conversations`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| GET | /api/conversations | Yes (customer, company, staff messages) |
| GET | /api/conversations/:id/messages | Yes (useChat) |
| POST | /api/conversations/messages | Yes (send message) |

### AI (`/api/analyze-wall`)

| Method | Path | Used by frontend? |
|--------|------|-------------------|
| POST | /api/analyze-wall | Yes (staff measurement page, multipart) |

---

## 4. Backend endpoints NOT used (or barely used) by frontend

- **Users:** PATCH /api/users/:id/status, DELETE /api/users/:id  
- **Companies:** PUT /api/companies/:id (settings), DELETE /api/companies/:id  
- **Services:** DELETE /api/services/:id  
- **Bookings:** DELETE /api/bookings/:id (cancel); GET /api/bookings/staff/assigned; POST /api/bookings/:id/start; PATCH /api/bookings/:id/progress; POST /api/bookings/:id/complete (frontend uses staff booking status instead)  
- **Payments:** PUT /api/payments/:id  
- **Reviews:** GET /api/reviews (all); GET /api/reviews/:id; PUT /api/reviews/:id; DELETE /api/reviews/:id  
- **Service types:** GET /api/service-types/:slug (by slug)  

**Note:** Admin verification page uses a hardcoded `http://localhost:3000` for API base; it should use `process.env.NEXT_PUBLIC_API_URL` for /api/companies.

---

## 5. Summary: page structure (tree)

```
/ ................................. landing (auth context)
/auth
  /login .......................... POST /api/auth/login
  /register ....................... POST /api/auth/register
  /forgot-password ................ POST /api/auth/request
  /reset-password ................. POST /api/auth/verify, /reset

/customer
  /dashboard ...................... GET /auth/me, /bookings, /reviews/my, /payments
  /services ........................ GET /categories
  /services/[category] ............. (category page)
  /services/[category]/[serviceType]  GET /companies/.../categories/.../service-types/...
  /services/.../company/[id] ....... GET /companies/:id, /services/company/:id, /reviews/company/:id
  /services/.../company/[id]/booking  GET /services/:id, POST /bookings
  /bookings ........................ GET /bookings
  /bookings/[id] ................... GET /bookings/:id
  /bookings/[id]/payments ........... GET /bookings/:id, POST /payments/checkout-session, /complete
  /bookings/[id]/payments/success ... GET /bookings/:id
  /payments ........................ GET /payments
  /payments/[id] ................... GET /payments/:id
  /reviews ......................... GET /reviews/my
  /reviews/new ..................... GET /bookings, POST /reviews
  /profile ......................... GET /auth/me
  /messages ........................ GET /conversations, /conversations/:id/messages, POST /conversations/messages, GET /users/:id

/company
  /dashboard ....................... GET /companies/me, /companies/bookings, /companies/staff; POST /companies (onboarding)
  /bookings ........................ GET /companies/bookings, /companies/staff; POST /companies/assign-staff
  /bookings/calendar ............... (calendar)
  /services ........................ GET /services
  /services/new .................... GET /auth/me, /categories, /service-types/categories/:slug, POST /services
  /services/[id] ................... GET /services/:id
  /services/[id]/edit .............. GET/PUT /services/:id
  /staff .......................... GET /companies/staff; DELETE /companies/staff/:id; POST .../reactivate
  /staff/new ...................... POST /companies/staff
  /staff/[id] ...................... GET /companies/staff/:id; DELETE; POST reactivate
  /payments ........................ GET /payments
  /reviews ......................... GET /reviews/company/:companyId
  /areas ........................... GET /companies/:id
  /settings ........................ (page exists; PUT /companies/:id not wired in scan)
  /messages ........................ GET /conversations, /conversations/:id/messages, POST messages, GET /users/:id

/staff
  /dashboard ....................... GET /staff/bookings, /staff/services/pending
  /schedule ........................ GET /staff/bookings
  /bookings ........................ GET /staff/bookings
  /bookings/[id] ................... GET /staff/bookings/:id; PATCH /staff/bookings/:id/status
  /services ........................ GET /staff/services/pending; PATCH approve/reject
  /availability .................... GET /staff/availability/me; POST /staff/availability
  /profile ......................... GET /staff/me; PUT /users/:id
  /messages ........................ GET /conversations, messages; GET /users/:id
  /measurement ..................... POST /api/analyze-wall

/admin
  /dashboard ....................... (overview)
  /users ........................... GET /users
  /users/[id] ...................... GET /users/:id; PUT; PATCH status; DELETE (not all wired)
  /companies ....................... GET /companies
  /companies/[id] .................. GET /companies/:id; PUT; DELETE (not all wired)
  /companies/pending ............... GET /companies?...
  /verification .................... GET /companies?verificationStatus=pending; GET/PUT /companies/:id (fix base URL)
  /categories ...................... GET/POST/PUT/DELETE /categories
  /service-types ................... GET/POST/PUT/DELETE /service-types; GET /categories
  /analytics ....................... (page exists)
  /settings ........................ (page exists)
  /messages ........................ (page exists)
```

This document gives you a single place to see: **page structure per role**, **which API each page uses**, and **which backend endpoints are still unused** by the frontend.
