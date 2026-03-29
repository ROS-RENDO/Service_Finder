import apiClient from './client';

export const companiesApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get('/api/companies', { params }),

  getById: (id: string) =>
    apiClient.get(`/api/companies/${id}`),

  getMe: () =>
    apiClient.get('/api/companies/me'),

  update: (data: any) =>
    apiClient.put('/api/companies/me', data),

  getByCategory: (categorySlug: string, params?: Record<string, any>) =>
    apiClient.get(`/api/companies/categories/${categorySlug}`, { params }),

  getByServiceType: (categorySlug: string, serviceTypeSlug: string, params?: Record<string, any>) =>
    apiClient.get(`/api/companies/categories/${categorySlug}/service-types/${serviceTypeSlug}`, { params }),

  getStaff: () =>
    apiClient.get('/api/companies/staff'),

  addStaff: (data: any) =>
    apiClient.post('/api/companies/staff', data),

  getStaffById: (staffId: string) =>
    apiClient.get(`/api/companies/staff/${staffId}`),

  updateStaff: (staffId: string, data: any) =>
    apiClient.put(`/api/companies/staff/${staffId}`, data),

  removeStaff: (staffId: string) =>
    apiClient.delete(`/api/companies/staff/${staffId}`),

  reactivateStaff: (staffId: string) =>
    apiClient.post(`/api/companies/staff/${staffId}/reactivate`),

  getDashboard: () =>
    apiClient.get('/api/companies/dashboard'),

  getRevenue: (params?: Record<string, any>) =>
    apiClient.get('/api/companies/revenue', { params }),

  getServices: () =>
    apiClient.get('/api/companies/services'),

  createService: (data: any) =>
    apiClient.post('/api/companies/services', data),

  updateService: (id: string, data: any) =>
    apiClient.patch(`/api/companies/services/${id}`, data),

  deleteService: (id: string) =>
    apiClient.delete(`/api/companies/services/${id}`),

  getBookings: (params?: Record<string, any>) =>
    apiClient.get('/api/companies/bookings', { params }),
};
