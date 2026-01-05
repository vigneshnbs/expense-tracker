import { Account, CreateAccountRequest } from 'src/types/models';
import { AccountType } from 'src/types/enums';
import { apiClient } from './client';

export const accountsApi = {
  getAll: () => apiClient.get<Account[]>('/accounts'),

  getActive: () => apiClient.get<Account[]>('/accounts/active'),

  getById: (id: number) => apiClient.get<Account>(`/accounts/${id}`),

  getByType: (accountType: AccountType) =>
    apiClient.get<Account[]>(`/accounts/type/${accountType}`),

  create: (data: CreateAccountRequest) =>
    apiClient.post<Account>('/accounts', data),

  update: (id: number, data: CreateAccountRequest) =>
    apiClient.put<Account>(`/accounts/${id}`, data),

  updateBalance: (id: number, balance: number) =>
    apiClient.patch<Account>(`/accounts/${id}/balance?balance=${balance}`),

  deactivate: (id: number) =>
    apiClient.patch<void>(`/accounts/${id}/deactivate`),

  delete: (id: number) => apiClient.delete<void>(`/accounts/${id}`),

  getTotalBalance: () => apiClient.get<number>('/accounts/total-balance'),
};
