# Service Finder - Complete Pages Analysis

## Overview
This document provides a comprehensive analysis of all pages in the Service Finder application, their purposes, and recommendations for optimization.

---

## 📊 Pages Summary

**Total Pages**: 56 pages across 4 user roles
- **Admin Pages**: 11 pages
- **Company Pages**: 10 pages
- **Customer Pages**: 16 pages
- **Staff Pages**: 6 pages
- **Auth Pages**: 5 pages
- **Main Pages**: 2 pages (landing + error)

---

## 🔐 Authentication Pages (5 pages)

### 1. `/auth/login` ✅
**Purpose**: User login page for all roles
**Hook Usage**: `useAuth`
**Status**: Working
**API Endpoints**:
- `POST /api/auth/login`

### 2. `/auth/register` ✅
**Purpose**: New user registration
**Hook Usage**: `useAuth`
**Status**: Working
**API Endpoints**:
- `POST /api/auth/register`

### 3. `/auth/forgot-password` ✅
**Purpose**: Request password reset code
**Hook Usage**: `useAuth.requestReset`
**API Endpoints**:
- `POST /api/auth/request`

### 4. `/auth/reset-password` ✅
**Purpose**: Reset password with verification code
**Hook Usage**: `useAuth.resetPassword`
**API Endpoints**:
- `POST /api/auth/verify`
- `POST /api/auth/reset`

---

## 👨‍💼 Admin Pages (11 pages)

### 1. `/admin/dashboard` 📊
**Purpose**: Admin overview dashboard
**Recommended Hooks**: Custom analytics hook
**API Endpoints**: 
- Should have: `GET /api/admin/analytics`
- **Status**: ⚠️ Missing API endpoint

### 2. `/admin/users` & `/admin/users/[id]` 👥
**Purpose**: User management
**Hook Usage**: Should use enhanced `useUser`
**API Endpoints**:
- `GET /api/users`
- `GET /api/users/:id`
- `PATCH /api/users/:id/status`
- `DELETE /api/users/:id`

### 3. `admin/companies` & `/admin/companies/[id]` 🏢
**Purpose**: Company management and verification
**Hook Usage**: `useCompanies`
**API Endpoints**:
- `GET /api/companies`
- `GET /api/companies/:id`
- `PATCH /api/companies/:id/verify`
- `DELETE /api/companies/:id`

### 4. `/admin/companies/pending` ⏳
**Purpose**: Pending company verification
**Hook Usage**: `useCompanies` (filtered)
**API Endpoints**:
- `GET /api/companies?status=pending`

### 5. `/admin/categories` 🏷️
**Purpose**: Category management
**Hook Usage**: `useCategories`
**API Endpoints**:
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### 6. `/admin/verification` ✅
**Purpose**: Document verification
**Recommended**: Company verification queue
**API Endpoints**:
- `GET /api/companies?verificationStatus=pending`

### 7. `/admin/analytics` 📈
**Purpose**: Platform analytics
**API Endpoints**: 
- **Status**: ⚠️ Missing - Should create analytics endpoint

### 8. `/admin/messages` 💬
**Purpose**: Admin messaging system
**Hook Usage**: Should use `useChat`
**API Endpoints**:
- `GET /api/conversations`

### 9. `/admin/settings` ⚙️
**Purpose**: Platform settings
**API Endpoints**: 
- **Status**: ⚠️ Missing - Should create settings endpoint

---

## 🏢 Company Pages (10 pages)

### 1. `/company/dashboard` 📊
**Purpose**: Company overview
**Recommended Hooks**: Company analytics
**API Endpoints**:
- `GET /api/companies/:id/analytics`
- **Status**: ⚠️ Missing analytics endpoint

### 2. `/company/services` & `/company/services/[id]` 🛠️
**Purpose**: Service listing and details
**Hook Usage**: `useServices`
**API Endpoints**:
- `GET /api/services/company/:id`
- `GET /api/services/:id`

### 3. `/company/services/new` & `/company/services/[id]/edit` ✏️
**Purpose**: Create and edit services
**Hook Usage**: `useServices.createService`, `useServices.updateService`
**API Endpoints**:
- `POST /api/services`
- `PUT /api/services/:id`

### 4. `/company/bookings` & `/company/bookings/[id]` 📅
**Purpose**: Booking management
**Hook Usage**: `useBookings`
**API Endpoints**:
- `GET /api/bookings?companyId=:id`
- `GET /api/bookings/:id`
- `PATCH /api/bookings/:id/status`

### 5. `/company/bookings/calendar` 📆
**Purpose**: Calendar view of bookings
**Hook Usage**: `useBookings`
**API Endpoints**:
- `GET /api/bookings?companyId=:id`

### 6. `/company/staff` & `/company/staff/new` 👷
**Purpose**: Staff management
**Hook Usage**: Should create `useCompanyStaff`
**API Endpoints**:
- `GET /api/companies/:id/staff`
- `POST /api/companies/:id/staff`
- **Status**: ⚠️ Missing company staff endpoints

### 7. `/company/areas` 🗺️
**Purpose**: Service area management
**Hook Usage**: Company areas hook
**API Endpoints**:
- **Status**: ⚠️ Missing areas endpoint

### 8. `/company/reviews` ⭐
**Purpose**: Company reviews
**Hook Usage**: `useReviews.fetchReviewsByCompany`
**API Endpoints**:
- `GET /api/reviews/company/:id`

### 9. `/company/payments` 💰
**Purpose**: Payment history
**Hook Usage**: `usePayments`
**API Endpoints**:
- `GET /api/payments?companyId=:id`

### 10. `/company/messages` 💬
**Purpose**: Company messaging
**Hook Usage**: Should use `useChat`
**API Endpoints**:
- `GET /api/conversations`

### 11. `/company/settings` ⚙️
**Purpose**: Company settings
**Hook Usage**: `useCompanies`
**API Endpoints**:
- `PUT /api/companies/:id`

---

## 👤 Customer Pages (16 pages)

### 1. `/customer/dashboard` 🏠
**Purpose**: Customer home
**Recommended**: Activity feed
**API Endpoints**:
- Should have dashboard summary

### 2. `/customer/services` 🔍
**Purpose**: Browse all service categories
**Hook Usage**: `useCategories`
**API Endpoints**:
- `GET /api/categories`

### 3. `/customer/services/[category]` 📂
**Purpose**: Browse service types in category
**Hook Usage**: `useServiceTypes`
**API Endpoints**:
- `GET /api/service-types/categories/:slug`

### 4. `/customer/services/[category]/[serviceType]` 🔍
**Purpose**: Browse companies offering service type
**Hook Usage**: `useCompaniesByServiceType`
**API Endpoints**:
- `GET /api/companies/categories/:category/service-types/:serviceType`

### 5. `/customer/services/[category]/[serviceType]/company/[id]` 🏢
**Purpose**: Company details page
**Hook Usage**: `useCompanies.getCompanyById`
**API Endpoints**:
- `GET /api/companies/:id`
- `GET /api/services/company/:id`
- `GET /api/reviews/company/:id`

### 6. `/customer/services/[category]/[serviceType]/company/[id]/booking` 📝
**Purpose**: Create new booking
**Hook Usage**: `useBookings.createBooking`
**API Endpoints**:
- `POST /api/bookings`

### 7. `/customer/bookings` 📋
**Purpose**: Customer booking list
**Hook Usage**: `useBookings`
**API Endpoints**:
- `GET /api/bookings?customerId=:id`

### 8. `/customer/bookings/new` ➕
**Purpose**: Quick booking creation
**Hook Usage**: `useBookings.createBooking`
**API Endpoints**:
- `POST /api/bookings`

### 9. `/customer/bookings/[bookingId]` 📄
**Purpose**: Booking details
**Hook Usage**: `useBookings.getBookingById`
**API Endpoints**:
- `GET /api/bookings/:id`

### 10. `/customer/bookings/[bookingId]/payments` 💳
**Purpose**: Payment selection
**Hook Usage**: `usePayments.createCheckoutSession`
**API Endpoints**:
- `POST /api/payments/checkout-session`
- `POST /api/payments/complete`

### 11. `/customer/bookings/[bookingId]/payments/success` ✅
**Purpose**: Payment success page
**Hook Usage**: `useBookings.updateBookingStatus`
**API Endpoints**:
- `PATCH /api/bookings/:id/status`

### 12. `/customer/bookings/[bookingId]/payments/cancelled` ❌
**Purpose**: Payment cancellation page
**API Endpoints**: None required

### 13. `/customer/payments` & `/customer/payments/[id]` 💰
**Purpose**: Payment history
**Hook Usage**: `usePayments`
**API Endpoints**:
- `GET /api/payments`
- `GET /api/payments/:id`

### 14. `/customer/reviews` & `/customer/reviews/new` ⭐
**Purpose**: Review management
**Hook Usage**: `useReviews`
**API Endpoints**:
- `GET /api/reviews/my`
- `POST /api/reviews`

### 15. `/customer/profile` 👤
**Purpose**: Customer profile
**Hook Usage**: `useUser`
**API Endpoints**:
- `GET /api/auth/me`
- `PATCH /api/users/:id`

### 16. `/customer/messages` 💬
**Purpose**: Customer messaging
**Hook Usage**: Should use `useChat`
**API Endpoints**:
- `GET /api/conversations`
- `POST /api/conversations/messages`

---

## 👷 Staff Pages (6 pages)

### 1. `/staff/dashboard` 📊
**Purpose**: Staff overview
**Hook Usage**: `useStaffBookings`
**API Endpoints**:
- `GET /api/staff/bookings`

### 2. `/staff/availability` 📅
**Purpose**: Manage availability
**Hook Usage**: `useStaffAvailability`
**API Endpoints**:
- `GET /api/staff/availability/me`
- `POST /api/staff/availability`
- `PATCH /api/staff/availability/:id`
- `DELETE /api/staff/availability/:id`

### 3. `/staff/bookings` & `/staff/bookings/[id]` 📋
**Purpose**: Staff booking management
**Hook Usage**: `useStaffBookings`
**API Endpoints**:
- `GET /api/staff/bookings`
- `GET /api/staff/bookings/:id`
- `PATCH /api/staff/bookings/:id/status`

### 4. `/staff/messages` 💬
**Purpose**: Staff messaging
**Hook Usage**: Should use `useChat`
**API Endpoints**:
- `GET /api/conversations`

### 5. `/staff/profile` 👤
**Purpose**: Staff profile
**Hook Usage**: `useUser`
**API Endpoints**:
- `GET /api/auth/me`
- `PATCH /api/users/:id`

### 6. `/staff/reviews` ⭐
**Purpose**: Staff reviews
**Hook Usage**: `useReviews.fetchReviewsByStaff`
**API Endpoints**:
- `GET /api/reviews/staff/:id`

---

## 🎯 Main Pages (2 pages)

### 1. `/` (Landing Page) 
**Purpose**: Application landing page
**Hook Usage**: `useCategories`, `useServiceTypes`

### 2. `/error.tsx` ⚠️
**Purpose**: Global error boundary
**API Endpoints**: None

---

## 🚨 Issues Identified and Recommendations

### Critical Issues

1. **Missing Chat/Messaging Hook** ⚠️
   - **Problem**: Multiple pages reference messaging but no `useChat` hook exists
   - **Solution**: Create `useChat` hook for conversations API
   - **Affected Pages**: All message pages (admin, company, customer, staff)

2. **Missing Admin Analytics Endpoint** ⚠️
   - **Problem**: Admin analytics page has no backend support
   - **Solution**: Create `/api/admin/analytics` endpoint

3. **Missing Company Staff Management** ⚠️
   - **Problem**: Company staff endpoints not implemented
   - **Solution**: Add staff CRUD to companies controller

4. **Missing Service Areas Management** ⚠️
   - **Problem**: Company areas page has no backend
   - **Solution**: Create service areas endpoints

### Hook Issues to Fix

1. **`useAuth`** - Missing auto-fetch user on mount
2. **`useCategories`** - Inconsistent API path (missing `/api`)
3. **`usePayments`** - Wrong URL in getPaymentById
4. **Hook consistency** - Some hooks haven't proper error handling

---

## ✅ Recommendations

### 1. Create Missing Hooks
```typescript
- useChat.ts (for conversations/messages)
- useCompanyStaff.ts (for staff management)
- useServiceAreas.ts (for service area management)
- useAdminAnalytics.ts (for admin dashboard)
```

### 2. Standardize Hook Patterns
All hooks should follow:
- Auto-fetch option
- Consistent error handling
- Proper loading states
- Pagination support where applicable

### 3. Add Missing Backend Endpoints
```
POST   /api/companies/:id/staff
GET    /api/companies/:id/staff
DELETE /api/companies/:id/staff/:staffId
GET    /api/admin/analytics
GET    /api/companies/:id/areas
POST   /api/companies/:id/areas
```

### 4. Create Unified Error Handling
Implement consistent error handling across all pages using:
- Error boundaries
- Toast notifications
- Proper error states in UI

---

## 📝 Next Steps

1. ✅ Create comprehensive Postman collection (in progress)
2. ⚙️ Fix all identified hook issues
3. 🔧 Create missing hooks
4. 📡 Add missing backend endpoints
5. 🧪 Test all pages end-to-end
6. 📚 Create page-specific documentation

---

*Document generated: 2026-02-13*
*Last updated: 2026-02-13*
