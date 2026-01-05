import {
  Transaction,
  CreateTransactionRequest,
  TransferRequest,
  MonthlySpendingDTO,
} from 'src/types/models';
import { apiClient } from './client';

export const transactionsApi = {
  getAll: () => apiClient.get<Transaction[]>('/transactions'),

  getById: (id: number) => apiClient.get<Transaction>(`/transactions/${id}`),

  getByAccount: (accountId: number) =>
    apiClient.get<Transaction[]>(`/transactions/account/${accountId}`),

  getByCategory: (categoryId: number) =>
    apiClient.get<Transaction[]>(`/transactions/category/${categoryId}`),

  getByDateRange: (startDate: string, endDate: string) =>
    apiClient.get<Transaction[]>(
      `/transactions/date-range?startDate=${startDate}&endDate=${endDate}`,
    ),

  create: (data: CreateTransactionRequest) =>
    apiClient.post<Transaction>('/transactions', data),

  update: (id: number, data: CreateTransactionRequest) =>
    apiClient.put<Transaction>(`/transactions/${id}`, data),

  delete: (id: number) => apiClient.delete<void>(`/transactions/${id}`),

  createTransfer: (data: TransferRequest) =>
    apiClient.post<Transaction[]>('/transactions/transfer', data),

  getMonthlySpending: () =>
    apiClient.get<MonthlySpendingDTO[]>('/transactions/monthly-spending'),

  getMonthlySpendingByDateRange: (startDate: string, endDate: string) =>
    apiClient.get<MonthlySpendingDTO[]>(
      `/transactions/monthly-spending/date-range?startDate=${startDate}&endDate=${endDate}`,
    ),
};
