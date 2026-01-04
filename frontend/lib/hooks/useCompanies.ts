import { useState, useEffect } from 'react'

interface Company {
  id: string
  name: string
  description: string
  city: string
  phone: string
  email: string
  verificationStatus: string
  ratingSummary?: {
    averageRating: string
    totalReviews: number
  }
}

interface UseCompaniesOptions {
  autoFetch?: boolean
  city?: string
  status?: string
  page?: number
  limit?: number
}

export function useCompanies(options: UseCompaniesOptions = {}) {
  const { autoFetch = true, city, status, page = 1, limit = 10 } = options
  const [companies, setCompanies] = useState<Company[]>([])
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
      fetchCompanies()
    }
  }, [page, city, status])

  const fetchCompanies = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (city) params.append('city', city)
      if (status) params.append('status', status)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies?${params}`)
      if (response.ok) {
        const data = await response.json()
        setCompanies(data.companies)
        setPagination(data.pagination)
      } else {
        setError('Failed to fetch companies')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getCompanyById = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/companies/${id}`)
      if (response.ok) {
        const data = await response.json()
        return { success: true, company: data.company }
      }
      return { success: false, error: 'Company not found' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  return {
    companies,
    loading,
    error,
    pagination,
    fetchCompanies,
    getCompanyById
  }
}
