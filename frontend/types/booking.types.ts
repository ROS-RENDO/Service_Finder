import { User } from './user.types'
import { Company } from './company.types'
import { Service } from './service.types'
import { Payment } from './payment.type'
import { Review } from './review.types'

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Booking {
  id: string
  customerId: string
  companyId: string
  serviceId: string
  bookingDate: string
  startTime: string
  endTime: string
  serviceAddress: string
  latitude: string
  longitude: string
  status: BookingStatus
  totalPrice: string
  createdAt: string
  updatedAt: string

  customer: User
  company: Pick<Company, 'id' | 'name' | 'phone' | 'email'>
  service: Pick<Service, 'id' | 'name' | 'basePrice' | 'durationMinutes'>
  payment: Payment | null
  review: Review | null
}

export interface BookingsResponse {
  bookings: Booking[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
