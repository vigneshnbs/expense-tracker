# Expense Tracker Frontend - Implementation Guide

## Overview

This document provides a comprehensive guide for implementing the remaining features of the expense tracker frontend application. The project has been scaffolded with a complete foundation including API integration, routing, and a fully functional Accounts module that serves as a reference implementation.

## What Has Been Implemented

### ✅ Core Infrastructure

1. **Type System** (`src/types/`)
   - All TypeScript interfaces and enums for the expense tracker
   - Complete type definitions for API requests and responses
   - Located in: `src/types/enums.ts` and `src/types/models.ts`

2. **API Client** (`src/api/`)
   - Complete API client with error handling
   - All endpoint functions for Accounts, Categories, Transactions, and Budget
   - Files: `client.ts`, `accounts.api.ts`, `categories.api.ts`, `transactions.api.ts`, `budget.api.ts`

3. **Utilities** (`src/utils/`)
   - Currency formatting for INR (₹)
   - Date formatting and utility functions
   - Files: `currency.ts`, `date.ts`

4. **Routing Structure** (`src/router.tsx`)
   - Complete routing setup with lazy loading
   - Navigation structure in root layout
   - All routes configured for Dashboard, Accounts, Categories, Transactions, and Budget

5. **Root Layout** (`src/modules/root.tsx`)
   - Material-UI AppBar with navigation links
   - Responsive container layout
   - Professional navigation UI

### ✅ Fully Implemented Modules

#### Dashboard Module (`src/modules/dashboard/`)
- **DashboardPage**: Complete implementation with:
  - Total balance display
  - Total budget display
  - Monthly spending summary
  - Budget vs Actual comparison with progress bars
  - Monthly spending chart
  - Recent transactions table
- **Components**:
  - `BudgetComparisonList`: Visual budget tracking with LinearProgress
  - `MonthlySpendingChart`: Bar chart visualization of spending
  - `RecentTransactions`: Table with formatted transactions

#### Accounts Module (`src/modules/accounts/`) - REFERENCE IMPLEMENTATION
This module is **fully implemented** and serves as the blueprint for other modules:
- **AccountsListPage**: Full CRUD operations
  - List all accounts with table view
  - Delete functionality with confirmation
  - Navigation to create/edit
  - Active/Inactive status chips
  - Formatted currency display
- **CreateAccountPage**: Form-based account creation
  - React Hook Form integration
  - Validation
  - Success/Error toasts
  - Navigation on success
- **EditAccountPage**: Update existing accounts
  - Load existing data
  - Pre-populate form
  - Update with validation
- **AccountForm Component**: Reusable form component
  - Controller-based form fields
  - Account type dropdown (all 5 types)
  - Balance input with validation
  - Active/Inactive toggle
  - Submit and Cancel buttons

### ⚠️ Partially Implemented Modules

The following modules have placeholder pages that need full implementation:

1. **Categories Module** (`src/modules/categories/`)
2. **Transactions Module** (`src/modules/transactions/`)
3. **Budget Module** (`src/modules/budget/`)

---

## Implementation Patterns

### Pattern 1: List Page with CRUD Operations

Follow the `AccountsListPage.tsx` pattern:

```typescript
1. Use useQuery to fetch list data
2. Use useMutation for delete operations
3. Include navigation buttons to create/edit pages
4. Display data in Material-UI Table
5. Add IconButtons for Edit/Delete actions
6. Show confirmation dialog for deletions
7. Display loading state with CircularProgress
8. Show empty state when no data
```

Key hooks used:
- `useQuery` with `queryKey` for data fetching
- `useMutation` for create/update/delete
- `useQueryClient` with `invalidateQueries` to refresh data
- `useToast` for success/error messages
- `useNavigate` for routing

### Pattern 2: Create/Edit Pages

Follow the `CreateAccountPage.tsx` and `EditAccountPage.tsx` pattern:

```typescript
1. Create a reusable Form component
2. Use React Hook Form with Controller
3. Use useMutation for API calls
4. Navigate back on success
5. Show toast notifications
6. Pass isSubmitting state to disable form during submission
```

### Pattern 3: Reusable Form Component

Follow the `AccountForm.tsx` pattern:

```typescript
1. Accept optional entity for edit mode
2. Use useForm with defaultValues
3. Use Controller for each field
4. Implement validation rules
5. Support both create and edit modes
6. Provide onSubmit and onCancel props
7. Show loading state on submit button
```

---

## Module Implementation Guide

### Categories Module

#### 1. CategoriesListPage Implementation

**Requirements:**
- Display categories grouped by type (EXPENSE/INCOME)
- Show parent-child relationship (hierarchical structure)
- Display color code as a colored chip or box
- Filter by category type
- Delete with subcategory handling

**API Calls Needed:**
- `categoriesApi.getAll()`
- `categoriesApi.getByType(type)`
- `categoriesApi.delete(id)`

**UI Components:**
- Accordion or TreeView for hierarchical display
- Color chips to show category colors
- Tabs or buttons to filter by EXPENSE/INCOME
- Warning when deleting category with subcategories

**Reference Files:**
- Pattern: Similar to `AccountsListPage.tsx`
- API: `src/api/categories.api.ts`
- Types: `Category`, `CreateCategoryRequest` from `src/types/models.ts`

#### 2. CategoryForm Component

**Fields:**
- Category Name (text input)
- Type (dropdown: EXPENSE/INCOME)
- Parent Category (dropdown, optional, filtered by type)
- Color Code (color picker or predefined colors)

**Validation:**
- Name is required
- Type is required
- Parent category must be same type
- Color code format validation

**Reference:** `AccountForm.tsx`

---

### Transactions Module

#### 1. TransactionsListPage Implementation

**Requirements:**
- List all transactions in a table
- Show transaction type with colored chips (EXPENSE=red, INCOME=green, TRANSFER=blue)
- Display account name and category name (requires joins/lookups)
- Add filtering by:
  - Date range (start date, end date)
  - Account (dropdown)
  - Category (dropdown)
  - Transaction type
- Pagination if needed
- Export functionality (optional)

**API Calls:**
- `transactionsApi.getAll()`
- `transactionsApi.getByDateRange(start, end)`
- `transactionsApi.getByAccount(accountId)`
- `transactionsApi.getByCategory(categoryId)`
- `accountsApi.getAll()` - for dropdown
- `categoriesApi.getAll()` - for dropdown

**UI Components:**
- Material-UI Table with sorting
- Date range picker
- Account and Category dropdowns
- Transaction type filter buttons/chips
- Format dates with `formatDate()` utility
- Format amounts with `formatCurrency()` utility

**Reference Pattern:** `AccountsListPage.tsx` + Dashboard's `RecentTransactions.tsx`

#### 2. CreateTransactionPage & TransactionForm

**Fields:**
- Account (dropdown of active accounts)
- Category (dropdown filtered by transaction type)
- Amount (number input, positive only)
- Transaction Type (radio buttons: EXPENSE/INCOME/TRANSFER)
- Transaction Date (date picker, default to today)
- Description (text input, required)
- Notes (textarea, optional)

**Special Logic:**
- When type changes, filter categories accordingly
- Validate amount > 0
- Default date to today using `getTodayISO()` utility

**API Calls:**
- `transactionsApi.create(data)`
- `accountsApi.getActive()` - for dropdown
- `categoriesApi.getByType(type)` - for filtered dropdown

#### 3. TransferPage - Special Form

**Purpose:** Transfer money between two accounts

**Fields:**
- From Account (dropdown)
- To Account (dropdown, excluding selected From Account)
- Category (dropdown, typically "Transfer" category)
- Amount (number input)
- Transaction Date (date picker)
- Description (text input)
- Notes (textarea, optional)

**Validation:**
- From and To accounts must be different
- Amount must be positive
- From account must have sufficient balance (client-side check)

**API Call:**
- `transactionsApi.createTransfer(data)`

**Note:** This creates TWO transactions linked by `transferReferenceId`

---

### Budget Module

#### 1. BudgetPage Implementation

**Requirements:**
- Display all budget allocations in a table
- Show category name with allocated amount
- Add "Set Budget" or "Update Budget" inline editing
- Show budget comparison (actual vs budgeted)
- Visual progress bars for each category
- Highlight over-budget categories in red
- Add date range selector for historical comparison
- Show total budget at top

**API Calls:**
- `budgetApi.getAll()`
- `budgetApi.getComparison()` - for current month
- `budgetApi.getComparisonByDateRange(start, end)` - for custom dates
- `budgetApi.create(data)`
- `budgetApi.updateByCategory(categoryId, amount)`
- `categoriesApi.getByType(CategoryType.EXPENSE)` - only expense categories

**UI Components:**
- Table with inline editing (use TextField + IconButton)
- LinearProgress bars for each category
- Color coding: green (<80%), yellow (80-100%), red (>100%)
- Date range picker for historical view
- Summary cards at top (Total Budget, Total Spent, Remaining)

**Reference:**
- Use Dashboard's `BudgetComparisonList.tsx` as starting point
- Extend with inline editing capability
- Pattern: `AccountsListPage.tsx` for CRUD operations

---

## Testing Strategy

### Mock Server Updates Needed

Update `src/testing-helpers/mock-server.ts` with handlers for all expense tracker endpoints:

```typescript
// Add handlers for:
- GET/POST/PUT/DELETE /accounts/*
- GET/POST/PUT/DELETE /categories/*
- GET/POST/PUT/DELETE /transactions/*
- GET/POST/PUT/DELETE /budget-allocations/*
- GET /accounts/total-balance
- GET /transactions/monthly-spending
- GET /budget-allocations/comparison
```

### Mock Data Files

Create in `src/testing-helpers/mocks/`:
- `accounts.mock.ts` - Sample accounts
- `categories.mock.ts` - Sample expense/income categories with hierarchy
- `transactions.mock.ts` - Sample transactions
- `budget.mock.ts` - Sample budget allocations

### Testing Each Module

Follow the existing test pattern from the old todos module:

1. **Page Tests** - Integration tests using `visit()`
   - Test navigation and page rendering
   - Test data loading and display
   - Test user interactions (buttons, forms)

2. **Component Tests** - Unit tests using `renderProviderWrapper()`
   - Test form validation
   - Test component rendering with different props
   - Test user interactions isolated

3. **Coverage Requirement**: 100% as configured in `jest.config.ts`

---

## Quick Start Commands

```bash
# Install dependencies
pnpm install

# Start dev server (runs on http://localhost:5173)
pnpm start

# Start backend API (should run on http://localhost:8080)
# Make sure the backend is running!

# Run tests
pnpm test

# Run tests with coverage
pnpm test:ci

# Lint and fix
pnpm lint:fix
```

---

## Implementation Checklist

### Categories Module
- [ ] Implement `CategoriesListPage` with hierarchical display
- [ ] Create `CategoryForm` component with color picker
- [ ] Implement `CreateCategoryPage`
- [ ] Implement `EditCategoryPage`
- [ ] Add parent category filtering logic
- [ ] Add tests for all components and pages

### Transactions Module
- [ ] Implement `TransactionsListPage` with filtering
- [ ] Create `TransactionForm` component
- [ ] Implement `CreateTransactionPage`
- [ ] Implement `EditTransactionPage`
- [ ] Implement `TransferPage` with account transfer logic
- [ ] Add date range filtering
- [ ] Add account/category dropdowns
- [ ] Add tests for all components and pages

### Budget Module
- [ ] Implement `BudgetPage` with inline editing
- [ ] Create budget allocation form components
- [ ] Add budget comparison visualization
- [ ] Add date range selector for historical data
- [ ] Implement over-budget alerts/indicators
- [ ] Add tests for all components and pages

### Testing & QA
- [ ] Update mock server with all API endpoints
- [ ] Create mock data for all entities
- [ ] Write integration tests using `visit()`
- [ ] Write unit tests for all components
- [ ] Ensure 100% test coverage
- [ ] Test with actual backend API

### Final Polish
- [ ] Add loading states everywhere
- [ ] Add error boundaries
- [ ] Add empty states with helpful messages
- [ ] Ensure responsive design (mobile-friendly)
- [ ] Add confirmation dialogs for destructive actions
- [ ] Add form validation error messages
- [ ] Update CLAUDE.md with final architecture

---

## Common Patterns Cheat Sheet

### Query for Data
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['keyName', id],
  queryFn: () => apiFunction(id),
});
```

### Mutation for Create/Update/Delete
```typescript
const mutation = useMutation({
  mutationFn: apiFunction,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['keyName'] });
    addSuccessToast('Success message');
    navigate('/path');
  },
  onError: () => {
    addErrorToast('Error message');
  },
});
```

### React Hook Form with Controller
```typescript
const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: { field: value }
});

<Controller
  name="field"
  control={control}
  rules={{ required: 'Field is required' }}
  render={({ field }) => (
    <TextField {...field} error={!!errors.field} />
  )}
/>
```

### Navigation
```typescript
const navigate = useNavigate();
navigate('/path'); // Go to route
navigate(-1); // Go back
```

### Toast Notifications
```typescript
const { addSuccessToast, addErrorToast } = useToast();
addSuccessToast('Operation successful!');
addErrorToast('An error occurred.');
```

---

## Tips for Success

1. **Start with Accounts Module**: Review the fully implemented Accounts module to understand patterns
2. **Reuse Components**: Extract reusable components (date pickers, dropdowns, etc.)
3. **Test as You Go**: Write tests immediately after implementing features
4. **Use Mock Server**: Set up mock API handlers before implementing pages
5. **Follow Material-UI Patterns**: Use MUI components consistently
6. **Format Data**: Always use `formatCurrency()` and `formatDate()` utilities
7. **Handle Loading States**: Show CircularProgress during data fetching
8. **Handle Errors**: Use try-catch and show error toasts
9. **Invalidate Queries**: Always invalidate relevant queries after mutations
10. **TypeScript Strict**: Fix all type errors before committing

---

## Resources

- **Material-UI Documentation**: https://mui.com/material-ui/getting-started/
- **React Hook Form**: https://react-hook-form.com/
- **TanStack Query (React Query)**: https://tanstack.com/query/latest
- **React Router v7**: https://reactrouter.com/

---

## Getting Help

- Review the existing Accounts module for patterns
- Check the API specification provided initially
- Look at TypeScript types in `src/types/` for data structures
- Run the app and inspect browser network tab for API calls
- Check console for errors and warnings

---

## Next Steps

1. Review the fully implemented Dashboard and Accounts modules
2. Set up the mock server with test data
3. Start with Categories module (simplest of remaining)
4. Then implement Transactions module (most complex)
5. Finish with Budget module
6. Write comprehensive tests
7. Test with actual backend API
8. Polish UI/UX

Good luck! The foundation is solid - now it's time to build amazing features! 🚀
