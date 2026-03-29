import apiClient from './client';

export const servicesApi = {
  getAll: (params?: Record<string, any>) =>
    apiClient.get('/api/services', { params }),

  getById: (id: string) =>
    apiClient.get(`/api/services/${id}`),

  getCategories: () =>
    apiClient.get('/api/categories'),

  getCategoryBySlug: (slug: string) =>
    apiClient.get(`/api/categories/${slug}`),

  getServiceTypes: (categorySlug?: string) =>
    categorySlug
      ? apiClient.get(`/api/categories/${categorySlug}/service-types`)
      : apiClient.get('/api/service-types'),
};
