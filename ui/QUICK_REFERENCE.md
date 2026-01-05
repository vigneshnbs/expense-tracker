# Expense Tracker - Quick Reference Guide

## 🚀 Application Status

✅ **The application is now running successfully at http://localhost:5173**

### Build Status
- ✅ TypeScript compilation: **PASSED**
- ✅ Production build: **SUCCESSFUL**
- ✅ Development server: **RUNNING**
- ✅ All dependencies: **INSTALLED**

---

## 📊 What's Working Right Now

### 1. Dashboard (http://localhost:5173/dashboard)
Navigate to see:
- Total balance summary card
- Total budget summary card
- Monthly spending card
- Budget vs Actual comparison with progress bars
- Monthly spending chart
- Recent transactions table

**Note**: Will show zero/empty data if backend is not running.

### 2. Accounts Module (http://localhost:5173/accounts) - FULLY FUNCTIONAL
This is your **reference implementation** for all other modules!

**Features you can test:**
- ✅ List all accounts in a table
- ✅ Create new account (`/accounts/new`)
- ✅ Edit existing account (`/accounts/:id/edit`)
- ✅ Delete account with confirmation
- ✅ View formatted balances in INR (₹)
- ✅ Toggle active/inactive status
- ✅ Success/error toast notifications
- ✅ Loading states
- ✅ Empty states

**Test the Accounts module to understand all patterns:**
1. Click "Accounts" in navigation
2. Click "Add Account" button
3. Fill form and submit
4. See success toast
5. Try editing and deleting

### 3. Placeholder Modules (Navigation Works)
- Categories (http://localhost:5173/categories)
- Transactions (http://localhost:5173/transactions)
- Budget (http://localhost:5173/budget)

These show placeholder pages with messages. Ready for implementation!

---

## 🏗️ Project Architecture

### File Organization

```
src/
├── api/                          # ✅ COMPLETE - All API functions
│   ├── client.ts                 # Base HTTP client
│   ├── accounts.api.ts           # Account endpoints
│   ├── categories.api.ts         # Category endpoints
│   ├── transactions.api.ts       # Transaction endpoints
│   └── budget.api.ts             # Budget endpoints
│
├── types/                        # ✅ COMPLETE - Type definitions
│   ├── enums.ts                  # AccountType, CategoryType, TransactionType
│   └── models.ts                 # All interfaces
│
├── utils/                        # ✅ COMPLETE - Utilities
│   ├── currency.ts               # formatCurrency() for INR
│   └── date.ts                   # Date formatting utilities
│
└── modules/                      # Feature modules
    ├── dashboard/                # ✅ COMPLETE
    │   ├── pages/
    │   │   └── DashboardPage.tsx
    │   ├── components/
    │   │   ├── BudgetComparisonList.tsx
    │   │   ├── MonthlySpendingChart.tsx
    │   │   └── RecentTransactions.tsx
    │   └── dashboard.router.tsx
    │
    ├── accounts/                 # ✅ COMPLETE - REFERENCE!
    │   ├── pages/
    │   │   ├── AccountsListPage.tsx      # List + CRUD
    │   │   ├── CreateAccountPage.tsx     # Create form
    │   │   └── EditAccountPage.tsx       # Edit form
    │   ├── components/
    │   │   └── AccountForm.tsx           # Reusable form
    │   └── accounts.router.tsx
    │
    ├── categories/               # 🚧 SKELETON
    ├── transactions/             # 🚧 SKELETON
    └── budget/                   # 🚧 SKELETON
```

---

## 🎯 Key Patterns (Study Accounts Module)

### Pattern 1: List Page with Table
**File**: `src/modules/accounts/pages/AccountsListPage.tsx`

```typescript
// 1. Fetch data
const { data: accounts, isLoading } = useQuery({
  queryKey: ['accounts'],
  queryFn: accountsApi.getAll,
});

// 2. Delete mutation
const deleteMutation = useMutation({
  mutationFn: accountsApi.delete,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    addSuccessToast('Deleted successfully');
  },
});

// 3. Render table with edit/delete buttons
```

### Pattern 2: Reusable Form Component
**File**: `src/modules/accounts/components/AccountForm.tsx`

```typescript
// 1. React Hook Form setup
const { control, handleSubmit, formState: { errors } } = useForm({
  defaultValues: { /* from props or empty */ }
});

// 2. Controller for each field
<Controller
  name="accountName"
  control={control}
  rules={{ required: 'Required' }}
  render={({ field }) => (
    <TextField {...field} error={!!errors.accountName} />
  )}
/>

// 3. Works for both create and edit modes
```

### Pattern 3: Create Page
**File**: `src/modules/accounts/pages/CreateAccountPage.tsx`

```typescript
// 1. Setup mutation
const createMutation = useMutation({
  mutationFn: accountsApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    addSuccessToast('Created!');
    navigate('/accounts');
  },
});

// 2. Use the form component
<AccountForm
  onSubmit={(data) => createMutation.mutate(data)}
  isSubmitting={createMutation.isPending}
/>
```

### Pattern 4: Edit Page
**File**: `src/modules/accounts/pages/EditAccountPage.tsx`

```typescript
// 1. Load existing data
const { data: account, isLoading } = useQuery({
  queryKey: ['account', id],
  queryFn: () => accountsApi.getById(Number(id)),
});

// 2. Update mutation
const updateMutation = useMutation({
  mutationFn: (data) => accountsApi.update(Number(id), data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['accounts'] });
    navigate('/accounts');
  },
});

// 3. Pre-populate form with existing data
<AccountForm
  account={account}
  onSubmit={(data) => updateMutation.mutate(data)}
/>
```

---

## 🔧 Common Code Snippets

### Import Pattern
```typescript
// API
import { accountsApi } from 'src/api';

// Types
import { Account, CreateAccountRequest } from 'src/types/models';
import { AccountType } from 'src/types/enums';

// Utilities
import { formatCurrency } from 'src/utils/currency';
import { formatDate, getTodayISO } from 'src/utils/date';

// Hooks
import useToast from 'src/hooks/useToast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
```

### Query Pattern
```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ['resourceName', id],  // unique key
  queryFn: () => api.getById(id),  // fetch function
  enabled: !!id,                   // conditional execution
});
```

### Mutation Pattern
```typescript
const mutation = useMutation({
  mutationFn: api.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['resourceName'] });
    addSuccessToast('Success!');
    navigate('/path');
  },
  onError: () => {
    addErrorToast('Error!');
  },
});

// Use it
mutation.mutate(data);
```

### Form Field Pattern
```typescript
<Controller
  name="fieldName"
  control={control}
  rules={{
    required: 'This field is required',
    min: { value: 0, message: 'Must be positive' }
  }}
  render={({ field }) => (
    <TextField
      {...field}
      label="Field Label"
      error={!!errors.fieldName}
      helperText={errors.fieldName?.message}
    />
  )}
/>
```

---

## 📝 Implementation Checklist for Remaining Modules

### To Implement Categories Module
1. Copy structure from `accounts/`
2. Create `CategoryForm` component
3. Implement list page with parent-child display
4. Add color picker for category colors
5. Filter by EXPENSE/INCOME type
6. Handle hierarchical categories

### To Implement Transactions Module
1. Create transaction list with filtering
2. Add date range picker
3. Create transaction form with account/category dropdowns
4. Implement transfer form (special case)
5. Show transaction type with colored chips

### To Implement Budget Module
1. Create budget allocation table
2. Add inline editing for amounts
3. Show budget vs actual with progress bars
4. Add date range selector
5. Highlight over-budget categories

---

## 🧪 Testing Commands

```bash
# Run all tests
pnpm test

# Watch mode (while developing)
pnpm test:watch

# With coverage (must be 100%)
pnpm test:ci
```

---

## 🐛 Troubleshooting

### Backend API Connection
If you see network errors:
1. Ensure backend is running at `http://localhost:8080`
2. Check `src/api/client.ts` for correct BASE_URL
3. Look at browser Network tab for failed requests

### TypeScript Errors
```bash
# Rebuild
rm -rf dist
pnpm run build
```

### Dev Server Issues
```bash
# Restart server
# Kill the current process and run:
pnpm start
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📚 Documentation Files

1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Setup and first steps
2. **[IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)** - Detailed implementation guide for remaining modules
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Overall project status
4. **[CLAUDE.md](CLAUDE.md)** - Architecture documentation
5. **[README.md](README.md)** - Original project documentation

---

## 🎓 Learning Path

### Step 1: Understand the Working Code
1. Open `src/modules/accounts/pages/AccountsListPage.tsx`
2. Read through the code with comments
3. Understand the query and mutation patterns
4. See how navigation works

### Step 2: Study the Form
1. Open `src/modules/accounts/components/AccountForm.tsx`
2. Understand React Hook Form with Controller
3. See validation patterns
4. Note how it works for both create/edit

### Step 3: Trace API Calls
1. Open `src/api/accounts.api.ts`
2. See how endpoints are defined
3. Look at `src/api/client.ts` for HTTP handling
4. Check `src/types/models.ts` for type definitions

### Step 4: Test the Application
1. Visit http://localhost:5173/accounts
2. Create a new account
3. Edit an existing account
4. Delete an account
5. Watch the Network tab in DevTools

### Step 5: Implement New Features
1. Start with Categories (simplest)
2. Follow the patterns from Accounts
3. Use the implementation guide
4. Write tests as you go

---

## 🎯 Success Metrics

You're ready to continue when:
- ✅ Dev server is running (http://localhost:5173)
- ✅ You can navigate to all pages
- ✅ Accounts module works end-to-end
- ✅ You understand the patterns in AccountsListPage
- ✅ You understand the form patterns in AccountForm
- ✅ You can trace an API call from UI to backend

---

## 💡 Pro Tips

1. **Always follow the Accounts pattern** - It's battle-tested
2. **Use TypeScript** - Types are your friend
3. **Invalidate queries** - After mutations, always invalidate related queries
4. **Test incrementally** - Don't write everything before testing
5. **Use the utilities** - `formatCurrency()` and `formatDate()` everywhere
6. **Material-UI components** - Browse https://mui.com for components
7. **Check console** - React Query DevTools are very helpful
8. **Read error messages** - TypeScript errors guide you to solutions

---

## 🚀 Quick Commands Reference

```bash
pnpm install          # Install dependencies
pnpm start           # Start dev server (http://localhost:5173)
pnpm build           # Build for production
pnpm test            # Run tests
pnpm test:watch      # Test watch mode
pnpm lint            # Check code
pnpm lint:fix        # Fix linting issues
```

---

## 📧 Next Steps

1. ✅ **Test the running application** at http://localhost:5173
2. ✅ **Study the Accounts module** - it's your template
3. ✅ **Read the IMPLEMENTATION_GUIDE.md** - detailed steps
4. 🔨 **Implement Categories module** - start here
5. 🔨 **Implement Transactions module** - most complex
6. 🔨 **Implement Budget module** - finish strong
7. ✅ **Write tests** - aim for 100% coverage
8. 🎉 **Celebrate!** - You've built an expense tracker!

**You're all set!** The foundation is solid, patterns are clear, and you have working code to learn from. Happy coding! 🚀
