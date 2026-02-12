export interface CompanyOwner {
  id: string
  fullName: string
  email: string
  phone: string
}

export interface CompanyRatingSummary {
  companyId: string
  averageRating: string
  totalReviews: number
  lastUpdated: string
}

export interface CompanyCount {
  services: number
  bookings: number
}

export interface Company {
  id: string
  name: string
  description: string
  registrationNumber: string
  address: string
  city: string
  latitude: string
  longitude: string
  phone: string
  email: string
  ownerId: string
  verificationStatus: 'pending' | 'verified' | 'rejected'
  createdAt: string
  updatedAt: string

  owner: CompanyOwner
  ratingSummary: CompanyRatingSummary | null
  _count: CompanyCount
}

export interface CompaniesResponse {
  companies: Company[]
  pagination: {
    total: number
    page: number
    limit: number
    pages: number
  }
}
