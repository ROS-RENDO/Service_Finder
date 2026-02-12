import { User } from './user.types'
import { Booking } from './booking.types'

export interface Review {
  id: string
  bookingId: string
  customerId: string
  rating: number
  comment: string | null
  createdAt: string

  customer: Pick<User, 'id' | 'fullName'>
  booking: Pick<
    Booking,
    'id' | 'bookingDate'
  > & {
    service: {
      name: string
    }
    company: {
      id: string
      name: string
    }
  }
}

export interface ReviewsResponse {
  reviews: Review[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
