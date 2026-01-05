# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an **Expense Tracker** frontend application built with React + TypeScript + Vite. It provides comprehensive personal finance management including accounts, categories, transactions, and budget tracking. The project uses pnpm as its package manager and requires Node.js 20+.

**Backend API**: The application expects a backend API running at `http://localhost:8080/api`. See the API specification in the project documentation.

## Development Commands

```sh
# Install dependencies
pnpm install

# Start development server (runs on port 5173)
pnpm start

# Build for production
pnpm build

# Build and preview
pnpm bp

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage (for CI)
pnpm test:ci

# Run tests with coverage locally
pnpm test:cov

# Linting
pnpm lint

# Fix linting issues
pnpm lint:fix
```

## Architecture

### Application Structure

The application follows a modular feature-based architecture:

- **Entry Point**: `src/main.tsx` initializes i18n and renders the React app
- **Root Component**: `src/App.tsx` sets up global providers (QueryClientProvider, ToastProvider, RouterProvider)
- **Router Configuration**: `src/router.tsx` defines route structure using React Router v7 with lazy loading
- **Root Layout**: `src/modules/root.tsx` provides Material-UI AppBar with navigation to all expense tracker modules
- **API Layer**: `src/api/` contains all API client functions organized by resource (accounts, categories, transactions, budget)
- **Type System**: `src/types/` contains all TypeScript interfaces, enums, and models
- **Utilities**: `src/utils/` provides currency formatting (INR/₹) and date utilities

### Module Organization

The expense tracker is organized into 5 main feature modules in `src/modules/`:

1. **Dashboard** (`dashboard/`) - Overview with total balance, budget comparison, spending charts, and recent transactions
2. **Accounts** (`accounts/`) - CRUD operations for bank accounts, credit cards, cash, etc. (FULLY IMPLEMENTED - use as reference)
3. **Categories** (`categories/`) - Expense and income categories with hierarchical support (parent-child relationships)
4. **Transactions** (`transactions/`) - Create expense/income/transfer transactions with filtering by date, account, category
5. **Budget** (`budget/`) - Set monthly budget allocations per category and track budget vs actual spending

Each module follows this structure:
- `pages/` - Route components (lazy-loaded)
- `components/` - Feature-specific reusable components
- `*.router.tsx` - Module route configuration using React Router's `RouteObject`

Example: The **Accounts module** is fully implemented and serves as the reference pattern:
```
src/modules/accounts/
├── pages/
│   ├── AccountsListPage.tsx    # List with CRUD operations
│   ├── CreateAccountPage.tsx   # Create new account
│   ├── EditAccountPage.tsx     # Edit existing account
│   └── index.ts
├── components/
│   └── AccountForm.tsx          # Reusable form component
└── accounts.router.tsx          # Route definitions
```

### Key Technical Patterns

**Path Aliases**: Use `src/` prefix for imports (configured in vite.config.ts and tsconfig.json)
```typescript
import { visit } from 'src/testing-helpers';
```

**Routing**: Routes use lazy loading via React Router's `lazy` function
```typescript
{
  lazy: async () => {
    const { TodosPage } = await import('./pages');
    return { Component: TodosPage };
  }
}
```

**Data Fetching**: Uses @tanstack/react-query with centralized QueryClient configuration in App.tsx (refetchOnWindowFocus: false, retry: 0)
```typescript
// Query pattern
const { data, isLoading } = useQuery({
  queryKey: ['accounts'],
  queryFn: accountsApi.getAll,
});

// Mutation pattern
const mutation = useMutation({
  mutationFn: accountsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    addSuccessToast('Account created successfully');
    navigate('/accounts');
  },
});
```

**Form Handling**: React Hook Form with Controller pattern for all forms. See `AccountForm.tsx` for reference implementation with validation.

**Currency Formatting**: Use `formatCurrency(amount)` from `src/utils/currency.ts` to format numbers as INR (₹) throughout the app.

**Date Utilities**: Use utilities from `src/utils/date.ts`:
- `formatDate(isoString)` - Display formatted dates
- `getTodayISO()` - Get today's date in ISO format for API
- `getFirstDayOfMonth()` / `getLastDayOfMonth()` - Date range helpers

**Toast Notifications**: Custom `useToast` hook provides `addSuccessToast()` and `addErrorToast()` functions

**Internationalization**: i18next is initialized in main.tsx before app render. Translation keys are used directly in tests (stubbed globally in setupTests.ts)

## Testing Strategy

### Test Architecture

The project enforces **100% code coverage** across branches, functions, lines, and statements (configured in jest.config.ts).

**Two Testing Approaches**:

1. **Integration/Acceptance Tests** - Use `visit()` helper to test full page flows
2. **Unit Tests** - Use `renderProviderWrapper()` to test isolated components

### Test Helpers (src/testing-helpers/)

**`visit({ route: '/path' })`**: Renders the full application at a specific route with all providers (QueryClient, ToastProvider, RouterProvider). Use for smoke tests and integration tests that verify major functionality.

**`renderProviderWrapper()`**: Returns a wrapper function that provides context to individual components. Use with React Testing Library's render for isolated component testing.

### Mock Server Setup

- **Mock Server**: MSW (Mock Service Worker) is configured in `src/testing-helpers/mock-server.ts`
- **Mock Data**: Place mock objects in `src/testing-helpers/mocks/`
- **Important**: Always add API handlers to mock-server.ts. Do NOT stub query hooks directly
- Happy path flows should be mocked globally; error flows can be mocked in individual tests

### Test Expectations

**Translation Testing**: The `useTranslation` hook is globally stubbed in setupTests.ts to return the translation key instead of translated text. Assert against the key:
```typescript
expect(screen.getByTestId('submit-button')).toHaveTextContent('common.submit');
```

**Fake Timers**: Jest uses fake timers globally (`jest.useFakeTimers()` in setupTests.ts)

**Console Failures**: Tests fail on console errors (configured via jest-fail-on-console)

**Accessibility**: jest-axe is configured for accessibility testing

### Test File Location

Place test files alongside the component being tested with `.test.tsx` or `.test.ts` extension.

## Git Workflow

- **Pre-commit hooks**: Husky runs lint-staged on commit
- **Lint-staged**: Runs eslint --fix on JS/TS files and prettier on all files
- **Commit conventions**: Uses commitlint with conventional commit format

## Key Dependencies

- **UI Framework**: React 18 with Material-UI (@mui/material)
- **Styling**: styled-components (configured to work with MUI via @mui/styled-engine-sc)
- **State Management**: @tanstack/react-query for server state
- **Form Handling**: react-hook-form
- **Routing**: react-router and react-router-dom v7
- **i18n**: i18next and react-i18next
- **Testing**: Jest, React Testing Library, MSW, jest-axe

## Docker Support

A Dockerfile is provided for containerized development. It uses Node 20-bullseye, enables pnpm via corepack, and exposes port 5173.

## TypeScript Configuration

- **Strict mode enabled**: All strict TypeScript checks are on
- **Module resolution**: "bundler" mode
- **Base URL**: Set to `./` for absolute imports
- **Path alias**: `src/*` maps to `./src/*`

## Expense Tracker Specific Implementation Patterns

### API Integration Layer (`src/api/`)

All API calls go through the centralized `apiClient` in `src/api/client.ts` which handles:
- Error handling with custom `ApiError` class
- Automatic JSON parsing
- Proper HTTP methods (GET, POST, PUT, PATCH, DELETE)

Resource-specific API files:
- `accounts.api.ts` - Account management (getAll, getById, create, update, delete, getTotalBalance, etc.)
- `categories.api.ts` - Category management with hierarchical support
- `transactions.api.ts` - Transaction CRUD, transfers, monthly spending reports
- `budget.api.ts` - Budget allocations and budget vs actual comparisons

### Type System (`src/types/`)

**Enums** (`enums.ts`):
- `AccountType`: SAVINGS, CHECKING, CREDIT_CARD, FIXED_DEPOSIT, CASH
- `CategoryType`: EXPENSE, INCOME
- `TransactionType`: EXPENSE, INCOME, TRANSFER

**Models** (`models.ts`):
- Core entities: `Account`, `Category`, `Transaction`, `BudgetAllocation`
- DTOs: `MonthlySpendingDTO`, `BudgetComparisonDTO`
- Request types: `CreateAccountRequest`, `CreateTransactionRequest`, `TransferRequest`, etc.

### Reference Implementation: Accounts Module

The Accounts module is **fully implemented** and should be used as the blueprint for implementing other modules:

1. **List Page Pattern** (`AccountsListPage.tsx`):
   - useQuery to fetch data
   - Table display with Material-UI Table component
   - IconButtons for Edit/Delete actions
   - useMutation for delete with confirmation dialog
   - Loading and empty states

2. **Form Component Pattern** (`AccountForm.tsx`):
   - React Hook Form with Controller
   - Reusable for both create and edit
   - Validation rules inline
   - Material-UI form components (TextField, Select, Switch)
   - Proper TypeScript typing

3. **Create Page Pattern** (`CreateAccountPage.tsx`):
   - Use the form component
   - useMutation for API call
   - Navigate on success
   - Toast notifications

4. **Edit Page Pattern** (`EditAccountPage.tsx`):
   - Load existing data with useQuery
   - Pre-populate form
   - useMutation for update
   - Query invalidation to refresh data

### Implementation Guide

See [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for detailed instructions on implementing the remaining Categories, Transactions, and Budget modules. This guide includes:
- Complete patterns and examples
- API integration examples
- UI component patterns
- Testing strategies
- Mock server setup instructions
