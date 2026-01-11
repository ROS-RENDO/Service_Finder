import { useState, useEffect , useCallback} from 'react'

interface Payment {
  id: string
  amount: string
  method: string
  status: string
  paidAt: string
  booking: {
    id: string
    bookingDate: string
    time: string
    service: {
      name: string
    }
    company: {
      name: string
    }
  }
}

interface UsePaymentsOptions {
  autoFetch?: boolean
  status?: string
  page?: number
  limit?: number
}

export function usePayments(options: UsePaymentsOptions = {}) {
  const { autoFetch = true, status, page = 1, limit = 10 } = options
  const [payments, setPayments] = useState<Payment[]>([])
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
      fetchPayments()
    }
  }, [page, status])

  const fetchPayments = async () => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const params = new URLSearchParams()
      if (status) params.append('status', status)
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments?${params}`, {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}` , 
        'Content-Type': 'application/json'},
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.payments)
        setPagination(data.pagination)
      } else {
        setError('Failed to fetch payments')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createPayment = async (paymentData: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (response.ok) {
        const data = await response.json()
        fetchPayments()
        return { success: true, payment: data.payment }
      }
      const error = await response.json()
      return { success: false, error: error.error }
    } catch (err) {
      return { success: false, error: 'Failed to create payment' }
    } finally {
      setLoading(false)
    }
  }
  const getPaymentById = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payments/${id}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        return { success: true, payment: data.payment }
      }
      return { success: false, error: 'Payment not found' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }, [])


  return {
    payments,
    loading,
    error,
    pagination,
    fetchPayments,
    getPaymentById,
    createPayment,
  }
}