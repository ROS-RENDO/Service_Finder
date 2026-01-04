import { useState, useEffect } from 'react'

interface Booking {
  id: string
  status: string
  bookingDate: string
  startTime: string
  endTime: string
  totalPrice: string
  service: {
    name: string
  }
  company: {
    name: string
  }
}

interface UseBookingsOptions {
  autoFetch?: boolean
  status?: string
  companyId?: string
  customerId?: string
  page?: number
  limit?: number
}

export function useBookings(options: UseBookingsOptions = {}) {
  const { autoFetch = true, status, companyId, customerId, page = 1, limit = 10 } = options
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  })

  useEffect(() => {
    if (autoFetch) {
      fetchBookings()
    }
  }, [page, status, companyId, customerId])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      if (companyId) params.append('companyId', companyId)
      if (customerId) params.append('customerId', customerId)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings)
        setPagination(data.pagination)
      } else {
        setError('Failed to fetch bookings')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getBookingById = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        return { success: true, booking: data.booking }
      }
      return { success: false, error: 'Booking not found' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const createBooking = async (bookingData: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      if (response.ok) {
        const data = await response.json()
        fetchBookings()
        return { success: true, booking: data.booking }
      }
      const error = await response.json()
      return { success: false, error: error.error }
    } catch (err) {
      return { success: false, error: 'Failed to create booking' }
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (id: string, status: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchBookings()
        return { success: true }
      }
      return { success: false, error: 'Failed to update status' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const cancelBooking = async (id: string, reason: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reason })
      })

      if (response.ok) {
        fetchBookings()
        return { success: true }
      }
      return { success: false, error: 'Failed to cancel booking' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    pagination,
    fetchBookings,
    getBookingById,
    createBooking,
    updateBookingStatus,
    cancelBooking
  }
}