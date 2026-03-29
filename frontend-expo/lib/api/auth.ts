import apiClient from './client';

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post('/api/auth/login', { email, password }),

  register: (data: {
    fullName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
  }) => apiClient.post('/api/auth/register', data),

  requestReset: (email: string) =>
    apiClient.post('/api/auth/request', { email }),

  verifyCode: (email: string, code: string) =>
    apiClient.post('/api/auth/verify', { email, code }),

  resetPassword: (email: string, code: string, newPassword: string) =>
    apiClient.post('/api/auth/reset', { email, code, newPassword }),

  logout: () => apiClient.post('/api/auth/logout'),

  getMe: () => apiClient.get('/api/users/me'),
};
