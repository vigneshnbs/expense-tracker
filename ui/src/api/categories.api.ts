import { Category, CreateCategoryRequest } from 'src/types/models';
import { CategoryType } from 'src/types/enums';
import { apiClient } from './client';

export const categoriesApi = {
  getAll: () => apiClient.get<Category[]>('/categories'),

  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),

  getByType: (type: CategoryType) =>
    apiClient.get<Category[]>(`/categories/type/${type}`),

  getTopLevel: () => apiClient.get<Category[]>('/categories/top-level'),

  getSubcategories: (id: number) =>
    apiClient.get<Category[]>(`/categories/${id}/subcategories`),

  create: (data: CreateCategoryRequest) =>
    apiClient.post<Category>('/categories', data),

  update: (id: number, data: CreateCategoryRequest) =>
    apiClient.put<Category>(`/categories/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/categories/${id}`),
};
