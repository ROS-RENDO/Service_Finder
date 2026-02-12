import { Booking } from './booking.types'
import { User } from './user.types'

export type PaymentStatus = 'pending' | 'completed' | 'failed'

export interface Payment {
  id: string
  bookingId: string
  userId: string
  method: string
  amount: string
  currency: string
  status: PaymentStatus
  transactionRef: string
  paidAt: string | null

  booking: Pick<
    Booking,
    | 'id'
    | 'customerId'
    | 'companyId'
    | 'serviceId'
    | 'bookingDate'
    | 'startTime'
    | 'endTime'
    | 'serviceAddress'
    | 'latitude'
    | 'longitude'
    | 'status'
    | 'totalPrice'
    | 'createdAt'
    | 'updatedAt'
  > & {
    service: {
      name: string
    }
    company: {
      name: string
    }
  }

  user: Pick<User, 'id' | 'fullName' | 'email'>
}

export interface PaymentsResponse {
  payments: Payment[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}

