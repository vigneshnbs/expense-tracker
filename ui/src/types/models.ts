import { AccountType, CategoryType, TransactionType } from './enums';

export interface Account {
  id: number;
  accountName: string;
  accountType: AccountType;
  currentBalance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  parentCategoryId: number | null;
  colorCode: string | null;
  createdAt: string;
}

export interface Transaction {
  id: number;
  accountId: number;
  categoryId: number;
  amount: number;
  transactionType: TransactionType;
  transactionDate: string;
  description: string;
  notes: string | null;
  transferReferenceId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAllocation {
  id: number;
  categoryId: number;
  allocatedAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySpendingDTO {
  categoryId: number;
  categoryName: string;
  totalSpent: number;
}

export interface BudgetComparisonDTO {
  categoryId: number;
  categoryName: string;
  budgetedAmount: number;
  actualSpent: number;
  remaining: number;
  percentageUsed: number;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  categoryId: number;
  amount: number;
  transactionDate: string;
  description: string;
  notes?: string;
}

export interface CreateAccountRequest {
  accountName: string;
  accountType: AccountType;
  currentBalance: number;
  isActive: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  type: CategoryType;
  parentCategoryId: number | null;
  colorCode: string | null;
}

export interface CreateTransactionRequest {
  accountId: number;
  categoryId: number;
  amount: number;
  transactionType: TransactionType;
  transactionDate: string;
  description: string;
  notes?: string;
}

export interface CreateBudgetAllocationRequest {
  categoryId: number;
  allocatedAmount: number;
}
