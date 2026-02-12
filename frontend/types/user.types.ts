export type UserRole = 'customer' | 'company' | 'admin'
export type UserStatus = 'active' | 'inactive' | 'suspended'

export interface User {
  id: string
  fullName: string
  email: string
  phone: string | null
  role: UserRole
  status: UserStatus
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}


export interface UserResponse {
  user: User
}
