export type ServiceStatus = 'active' | 'inactive'

export interface ServiceCategory {
  id: string
  name: string
  status: ServiceStatus
}

export type VerificationStatus = 'pending' | 'verified' | 'rejected'

export interface ServiceCompany {
  id: string
  name: string
  city: string
  verificationStatus: VerificationStatus
}

export interface Service {
  id: string
  companyId: string
  categoryId: string
  name: string
  description: string
  basePrice: string
  durationMinutes: number
  isActive: boolean
  createdAt: string
  updatedAt: string
  company: ServiceCompany
  category: ServiceCategory
}

export interface ServicesResponse {
  services: Service[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
