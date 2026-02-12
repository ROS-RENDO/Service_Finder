import { useState, useEffect } from 'react'

interface ServiceType {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  status?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
    slug: string;
    description?: string;
    icon?: string;
    status?: string;
    displayOrder?: number;
    createdAt?: string;
    updatedAt?: string;
  };
}

interface Service {
  id: string;
  companyId: string;
  serviceTypeId: string;
  name: string;
  image?: string;
  description?: string;
  basePrice?: string | number;
  features?: string[];
  durationMin?: number;
  durationMax?: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  serviceType?: ServiceType;
}


interface UseServicesOptions {
  autoFetch?: boolean
  companyId?: string
  categoryId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export function useServices(options: UseServicesOptions = {}) {
  const { autoFetch = true, companyId, categoryId, isActive, page = 1, limit = 10 } = options
  const [services, setServices] = useState<Service[]>([])
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
      fetchServices()
    }
  }, [page, companyId, categoryId, isActive])

  const fetchServices = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (companyId) params.append('companyId', companyId)
      if (categoryId) params.append('categoryId', categoryId)
      if (isActive !== undefined) params.append('isActive', isActive.toString())
      params.append('page', page.toString())
      params.append('limit', limit.toString())

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services?${params}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
        setPagination(data.pagination)
      } else {
        setError('Failed to fetch services')
      }
    } catch (err) {
      setError('An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const getServiceById = async (id: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`)
      if (response.ok) {
        const data = await response.json()
        return { success: true, service: data.service }
      }
      return { success: false, error: 'Service not found' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const createService = async (serviceData: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      })

      if (response.ok) {
        const data = await response.json()
        fetchServices()
        return { success: true, service: data.service }
      }
      const error = await response.json()
      return { success: false, error: error.error }
    } catch (err) {
      return { success: false, error: 'Failed to create service' }
    } finally {
      setLoading(false)
    }
  }

  const updateService = async (id: string, serviceData: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(serviceData)
      })

      if (response.ok) {
        fetchServices()
        return { success: true }
      }
      return { success: false, error: 'Failed to update service' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const deleteService = async (id: string) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchServices()
        return { success: true }
      }
      return { success: false, error: 'Failed to delete service' }
    } catch (err) {
      return { success: false, error: 'An error occurred' }
    } finally {
      setLoading(false)
    }
  }

  const fetchServicesByCompany = async (companyId: string) => {
  setLoading(true)
  setError(null)

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/services/company/${companyId}`
    )

    if (!response.ok) {
      setError('Failed to fetch company services')
      return
    }

    const data = await response.json()
    setServices(data.data)
  } catch (err) {
    setError('An error occurred')
  } finally {
    setLoading(false)
  }
}

  return {
    services,
    loading,
    error,
    pagination,
    fetchServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    fetchServicesByCompany
  }
}
