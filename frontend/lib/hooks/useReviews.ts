import { useState, useEffect } from 'react'
import { Review } from '@/types/review.types'

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
      fetchMyReviews();
    }
  }, [autoFetch]);

    const fetchMyReviews = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/my`, {
          method: 'GET',
          credentials: 'include', // for cookie-based auth
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${token}` // if using JWT
          },
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data: Review[] = await res.json();
        setReviews(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


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
        credentials: 'include',
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

    const fetchReviewsByCompany = async (compId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/company/${compId}?page=${page}&limit=${limit}`
      )

      if (!response.ok) {
        setError('Failed to fetch reviews')
        return
      }

      const data = await response.json()
      setReviews(data.data || data.reviews || [])
      if (data.pagination) {
        setPagination(data.pagination)
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  

  return {
    reviews,
    loading,
    error,
    pagination,
    fetchMyReviews,
    fetchReviews,
    createReview,
    updateReview,
    deleteReview,
    fetchReviewsByCompany
  }
}