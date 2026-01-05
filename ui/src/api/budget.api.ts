import {
  BudgetAllocation,
  CreateBudgetAllocationRequest,
  BudgetComparisonDTO,
} from 'src/types/models';
import { apiClient } from './client';

export const budgetApi = {
  getAll: () => apiClient.get<BudgetAllocation[]>('/budget-allocations'),

  getById: (id: number) =>
    apiClient.get<BudgetAllocation>(`/budget-allocations/${id}`),

  getByCategory: (categoryId: number) =>
    apiClient.get<BudgetAllocation>(`/budget-allocations/category/${categoryId}`),

  create: (data: CreateBudgetAllocationRequest) =>
    apiClient.post<BudgetAllocation>('/budget-allocations', data),

  update: (id: number, data: CreateBudgetAllocationRequest) =>
    apiClient.put<BudgetAllocation>(`/budget-allocations/${id}`, data),

  updateByCategory: (categoryId: number, allocatedAmount: number) =>
    apiClient.put<BudgetAllocation>(
      `/budget-allocations/category/${categoryId}?allocatedAmount=${allocatedAmount}`,
    ),

  delete: (id: number) => apiClient.delete<void>(`/budget-allocations/${id}`),

  getComparison: () =>
    apiClient.get<BudgetComparisonDTO[]>('/budget-allocations/comparison'),

  getComparisonByDateRange: (startDate: string, endDate: string) =>
    apiClient.get<BudgetComparisonDTO[]>(
      `/budget-allocations/comparison/date-range?startDate=${startDate}&endDate=${endDate}`,
    ),

  getTotal: () => apiClient.get<number>('/budget-allocations/total'),
};
