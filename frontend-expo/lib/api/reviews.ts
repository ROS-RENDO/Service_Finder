import apiClient from './client';

export const reviewsApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get('/api/reviews', { params }),

  create: (data: any) =>
    apiClient.post('/api/reviews', data),

  getByCompany: (companyId: string) =>
    apiClient.get(`/api/reviews/company/${companyId}`),

  getByBooking: (bookingId: string) =>
    apiClient.get(`/api/reviews/booking/${bookingId}`),
};
