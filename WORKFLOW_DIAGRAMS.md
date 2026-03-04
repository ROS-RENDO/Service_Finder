# 📊 Service Finder - Visual Workflow Diagrams

## Complete User Journey Flowchart

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        🏠 CUSTOMER JOURNEY                               │
└─────────────────────────────────────────────────────────────────────────┘

[Customer] → Browse Services
     │
     ├─→ View Companies
     │    └─→ See Reviews (Company + Staff ratings)
     │
     ├─→ Select Company & Service
     │    └─→ Choose Date/Time
     │
     ├─→ CREATE BOOKING
     │    ├─ Input: Service details, address, date/time
     │    └─ Output: Booking created
     │         └─ Status: "pending"
     │         └─ Payment: null
     │
     ├─→ PAYMENT PAGE
     │    ├─ Option 1: 💳 Card
     │    │    └─→ Stripe Checkout
     │    │         └─→ Webhook
     │    │              └─→ Status: "confirmed", Payment: "paid"
     │    │
     │    ├─ Option 2: 📱 Wallet
     │    │    └─→ completePayment()
     │    │         └─→ Status: "confirmed", Payment: "paid"
     │    │
     │    └─ Option 3: 💵 Cash
     │         └─→ completePayment()
     │              └─→ Status: "confirmed", Payment: "pending"
     │
     ├─→ BOOKING CONFIRMED
     │    └─→ Notification: "Booking confirmed!"
     │
     ├─→ STAFF ASSIGNED (by company admin)
     │    └─→ Notification: "John Doe assigned to your booking"
     │         └─→ View Staff Profile
     │
     ├─→ SERVICE DAY
     │    ├─→ Staff Arrives
     │    │    └─→ Notification: "Service has started"
     │    │         └─→ Status: "in_progress"
     │    │
     │    ├─→ Progress Updates
     │    │    └─→ Notification: "Service is 50% complete"
     │    │         └─→ Progress Bar: ████████▒▒▒▒▒▒▒▒ 50%
     │    │
     │    └─→ Service Completed
     │         └─→ Notification: "Service completed! Please review"
     │              └─→ Status: "completed"
     │              └─→ Cash Payment: "pending" → "paid"
     │
     └─→ LEAVE REVIEW
          ├─→ Rate Company (1-5 ⭐)
          ├─→ Rate Staff (1-5 ⭐)
          └─→ Submit
               └─→ Company & Staff ratings updated


┌─────────────────────────────────────────────────────────────────────────┐
│                     🏢 COMPANY ADMIN JOURNEY                             │
└─────────────────────────────────────────────────────────────────────────┘

[Company Admin] → Dashboard
     │
     ├─→ View "Confirmed Bookings"
     │    └─→ Filter: "Needs Staff Assignment"
     │         └─→ List of bookings waiting for staff
     │
     ├─→ SELECT BOOKING
     │    └─→ View booking details
     │         └─→ Customer info
     │         └─→ Service details
     │         └─→ Date/Time/Address
     │
     ├─→ ASSIGN STAFF
     │    ├─→ Select available staff member
     │    ├─→ API: POST /bookings/:id/assign-staff
     │    └─→ Result:
     │         ├─→ Booking.assignedStaffId = staffId
     │         ├─→ Notification sent to staff
     │         └─→ Notification sent to customer
     │
     ├─→ MONITOR PROGRESS
     │    └─→ View bookings in progress
     │         └─→ Real-time progress updates
     │
     └─→ VIEW REVIEWS
          └─→ Company ratings & feedback


┌─────────────────────────────────────────────────────────────────────────┐
│                        👷 STAFF JOURNEY                                  │
└─────────────────────────────────────────────────────────────────────────┘

[Staff] → Dashboard
     │
     ├─→ View "My Assigned Jobs"
     │    ├─→ Filter: Upcoming
     │    ├─→ Filter: In Progress
     │    └─→ Filter: Completed
     │
     ├─→ SELECT JOB
     │    └─→ View job details
     │         ├─→ Customer contact
     │         ├─→ Service address (with map)
     │         ├─→ Service details
     │         └─→ Scheduled time
     │
     ├─→ SERVICE DAY - ARRIVE
     │    └─→ Click "Start Job"
     │         ├─→ API: POST /bookings/:id/start
     │         └─→ Result:
     │              ├─→ Status: "in_progress"
     │              ├─→ actualStartTime: NOW
     │              ├─→ progressPercent: 0
     │              └─→ Customer notified
     │
     ├─→ DURING SERVICE
     │    └─→ Update Progress
     │         ├─→ Move slider: 0% → 25% → 50% → 75% → 100%
     │         ├─→ Add notes: "Cleaned living room, starting bedroom"
     │         ├─→ API: PATCH /bookings/:id/progress
     │         └─→ Result:
     │              ├─→ progressPercent updated
     │              ├─→ staffNotes saved
     │              └─→ Customer notified at milestones (25%, 50%, 75%)
     │
     ├─→ SERVICE COMPLETE
     │    └─→ Click "Complete Job"
     │         ├─→ API: POST /bookings/:id/complete
     │         └─→ Result:
     │              ├─→ Status: "completed"
     │              ├─→ actualEndTime: NOW
     │              ├─→ progressPercent: 100
     │              ├─→ Cash payment auto-paid
     │              └─→ Customer notified to review
     │
     └─→ VIEW MY REVIEWS
          └─→ See ratings from customers


┌─────────────────────────────────────────────────────────────────────────┐
│                    🎯 STATUS TRANSITION DIAGRAM                          │
└─────────────────────────────────────────────────────────────────────────┘

                         BOOKING STATUS FLOW
                                 
    ┌─────────┐                                                            
    │ CREATED │  ← Customer creates booking                               
    └────┬────┘                                                            
         │                                                                 
         ▼                                                                 
    ┌─────────┐                                                            
    │ pending │  Payment not yet completed                                
    └────┬────┘                                                            
         │                                                                 
         ├─────────────┐                                                  
         │             │                                                   
         ▼             ▼                                                   
    Payment      Can cancel                                               
    completed     anytime                                                 
         │             │                                                   
         ▼             ▼                                                   
    ┌──────────┐  ┌──────────┐                                           
    │confirmed │  │cancelled │ (Terminal)                                
    └────┬─────┘  └──────────┘                                           
         │                                                                 
         │ Staff assigned                                                 
         │ (no status change)                                             
         │                                                                 
         ├─────────────┐                                                  
         │             │                                                   
         ▼             ▼                                                   
    Staff starts  Can still                                               
       job        cancel                                                  
         │             │                                                   
         ▼             ▼                                                   
    ┌────────────┐ ┌──────────┐                                          
    │in_progress │ │cancelled │ (Terminal)                               
    └─────┬──────┘ └──────────┘                                          
          │                                                                
          │ Progress: 0% → 25% → 50% → 75% → 100%                       
          │ (no status change during progress updates)                   
          │                                                                
          ▼                                                                
     Staff clicks                                                         
     "Complete"                                                           
          │                                                                
          ▼                                                                
    ┌──────────┐                                                          
    │completed │ (Terminal)                                              
    └────┬─────┘                                                          
         │                                                                 
         ▼                                                                 
    Review unlocked                                                       
         │                                                                 
         ▼                                                                 
    Customer can                                                          
    leave review                                                          


┌─────────────────────────────────────────────────────────────────────────┐
│                  💳 PAYMENT STATUS FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

    ┌─────────┐
    │ pending │  ← Payment record created with booking                   
    └────┬────┘                                                            
         │                                                                 
         ├────────────┬────────────┬────────────┐                        
         │            │            │            │                         
    Card/Wallet     Cash      Cancelled   Failed                         
         │            │            │            │                         
         ▼            │            ▼            ▼                         
    Stripe/API       │       ┌────────┐   ┌────────┐                    
    Success          │       │n/a     │   │ failed │                    
         │           │       └────────┘   └────────┘                    
         ▼           │                                                    
    ┌────────┐      │                                                    
    │  paid  │ ◄────┘ (When job completed)                              
    └────────┘        for cash payments                                  
   (Terminal)                                                             


┌─────────────────────────────────────────────────────────────────────────┐
│                      ⭐ REVIEW FLOW                                      │
└─────────────────────────────────────────────────────────────────────────┘

Booking Completed
       │
       ▼
Customer receives notification
       │
       ▼
Goes to Review Page
       │
       ├─────────────────────┬─────────────────────┐
       ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Rate Company   │  │   Rate Staff    │  │  Write Comments │
│   (Required)    │  │   (Optional)    │  │   (Optional)    │
│   ⭐⭐⭐⭐⭐      │  │   ⭐⭐⭐⭐⭐      │  │                 │
│   1-5 stars     │  │   1-5 stars     │  │ Company comment │
│                 │  │                 │  │ Staff comment   │
└─────────┬───────┘  └─────────┬───────┘  └────────┬────────┘
          │                    │                    │
          └────────────────────┴────────────────────┘
                              │
                              ▼
                      Submit Review
                              │
                              ▼
                    ┌──────────────────────┐
                    │  Save to Database    │
                    │  - companyRating     │
                    │  - companyComment    │
                    │  - staffRating       │
                    │  - staffComment      │
                    └──────────┬───────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
    Update Company Rating         Update Staff Rating
      (avg of all reviews)         (avg of all reviews)
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    Review Saved Successfully
                               │
                               ▼
                    Displayed on:
                    - Company profile
                    - Staff profile
                    - Booking history


┌─────────────────────────────────────────────────────────────────────────┐
│                 🔔 NOTIFICATION FLOW                                     │
└─────────────────────────────────────────────────────────────────────────┘

EVENT                           WHO GETS NOTIFIED         MESSAGE
────────────────────────────────────────────────────────────────────────
Booking Created                 Company Admin             "New booking received"
Payment Completed               Customer                  "Payment confirmed"
Staff Assigned                  ├─ Staff                  "New job assigned"
                               └─ Customer                "Staff assigned: John"
Job Started                     Customer                  "Service has started"
Progress 25%/50%/75%            Customer                  "Service is X% complete"
Job Completed                   Customer                  "Service completed! Review?"
Review Submitted                ├─ Company Admin          "New review received"
                               └─ Staff                   "Customer left you review"
Booking Cancelled               ├─ Company Admin          "Booking cancelled"
                               └─ Staff (if assigned)     "Your job was cancelled"


┌─────────────────────────────────────────────────────────────────────────┐
│               💻 API CALL SEQUENCE                                       │
└─────────────────────────────────────────────────────────────────────────┘

COMPLETE WORKFLOW API CALLS:

1️⃣ Customer Creates Booking
   POST /api/bookings
   Body: { companyId, serviceId, bookingDate, ... }
   Response: { booking } with status="pending"

2️⃣ Customer Completes Payment
   POST /api/payments/complete
   Body: { bookingId, method: "cash" }
   Response: { success: true, booking.status="confirmed" }

3️⃣ Company Admin Assigns Staff
   POST /api/bookings/:id/assign-staff
   Body: { staffId }
   Response: { success: true, booking with assignedStaffId }

4️⃣ Staff Views Assigned Jobs
   GET /api/bookings/staff/assigned
   Response: { bookings: [...] }

5️⃣ Staff Starts Job
   POST /api/bookings/:id/start
   Response: { booking.status="in_progress", actualStartTime }

6️⃣ Staff Updates Progress
   PATCH /api/bookings/:id/progress
   Body: { progressPercent: 50, staffNotes: "..." }
   Response: { booking with updated progress }

7️⃣ Staff Completes Job
   POST /api/bookings/:id/complete
   Response: { booking.status="completed", actualEndTime }

8️⃣ Customer Leaves Review
   POST /api/reviews
   Body: { bookingId, companyRating, staffRating, comments }
   Response: { review created, ratings updated }

────────────────────────────────────────────────────────────────────────

## Summary

✅ **8 distinct stages** in the complete workflow
✅ **Status changes** validated and logged at each step
✅ **Notifications** sent to relevant parties automatically
✅ **Progress tracking** with real-time updates
✅ **Separate reviews** for company and staff performance
✅ **Clean API** with logical endpoint structure
