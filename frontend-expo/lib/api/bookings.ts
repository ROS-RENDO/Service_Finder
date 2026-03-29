import apiClient from './client';

export const bookingsApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get('/api/bookings', { params }),

  getById: (id: string) =>
    apiClient.get(`/api/bookings/${id}`),

  create: (data: any) =>
    apiClient.post('/api/bookings', data),

  updateStatus: (id: string, status: string) =>
    apiClient.patch(`/api/bookings/${id}/status`, { status }),

  cancel: (id: string, reason: string) =>
    apiClient.delete(`/api/bookings/${id}`, { data: { reason } }),

  assignStaff: (bookingId: string, staffId: string) =>
    apiClient.post(`/api/bookings/${bookingId}/assign-staff`, { staffId }),

  getAssigned: (params?: Record<string, any>) =>
    apiClient.get('/api/bookings/staff/assigned', { params }),

  startJob: (id: string) =>
    apiClient.post(`/api/bookings/${id}/start`),

  completeJob: (id: string) =>
    apiClient.post(`/api/bookings/${id}/complete`),

  updateProgress: (id: string, progressPercent: number, staffNotes?: string) =>
    apiClient.patch(`/api/bookings/${id}/progress`, { progressPercent, staffNotes }),
};
