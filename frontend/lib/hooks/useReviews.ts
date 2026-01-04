import { useState, useEffect } from 'react'

interface Review {
  id: string
  rating: number
  comment: string
  createdAt: string
  customer: {
    fullName: string
  }
  booking: {
    service: {
      name: string
    }
    company: {
      name: string
    }
  }
}

interface UseReviewsOptions {
  autoFetch?: boolean
  companyId?: string
  customerId?: string
  page?: number
  limit?: number
}

export function useReviews(options: UseReviewsOptions = {}) {
  const { autoFetch = true, companyId, customerId, page = 1, limit = 10 } = options
  const [reviews, setReviews] = useState<Review[]>([])
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
      fetchReviews()
    }
  }, [page, companyId, customerId])

  const fetchReviews = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (companyId) params.append('companyId', companyId)
      if (customerId) params.append('customerId', customerId)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews?${params}`)
      if (response.ok) {
        const data = await response.json()
        setReviews(data.reviews)
        setPagination(data.pagination)
      } else {
        setError('Failed to fetch reviews')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createReview = async (reviewData: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        const data = await response.json()
        fetchReviews()
        return { success: true, review: data.review }
      }
      const error = await response.json()
      return { success: false, error: error.error }
    } catch (err) {
      return { success: false, error: 'Failed to create review' }
    } finally {
      setLoading(false)
    }
  }

  const updateReview = async (id: string, reviewData: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(reviewData)
      })

      if (response.ok) {
        fetchReviews()
        return { success: true }
      }
      return { success: false, error: 'Failed to update review' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const deleteReview = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchReviews()
        return { success: true }
      }
      return { success: false, error: 'Failed to delete review' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  return {
    reviews,
    loading,
    error,
    pagination,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview
  }
}