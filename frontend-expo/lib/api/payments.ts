import apiClient from './client';

export const paymentsApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get('/api/payments', { params }),

  getById: (id: string) =>
    apiClient.get(`/api/payments/${id}`),

  create: (data: any) =>
    apiClient.post('/api/payments', data),

  getByBooking: (bookingId: string) =>
    apiClient.get(`/api/payments/booking/${bookingId}`),

  requestRefund: (paymentId: string, reason: string) =>
    apiClient.post(`/api/payments/${paymentId}/refund`, { reason }),

  getMyWallet: () =>
    apiClient.get('/api/payments/wallet'),

  topUpWallet: (amount: number, method: string) =>
    apiClient.post('/api/payments/wallet/topup', { amount, method }),
};
