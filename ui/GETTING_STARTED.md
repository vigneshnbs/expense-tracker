# Getting Started with Expense Tracker Frontend

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **pnpm**: Version 9 or higher
- **Backend API**: Running at `http://localhost:8080/api`

### Installation & Setup

```bash
# 1. Install dependencies
pnpm install

# 2. Start the development server
pnpm start

# The app will be available at http://localhost:5173
```

### First Time Setup

1. **Verify Backend API is Running**
   - The backend API should be running at `http://localhost:8080/api`
   - Test by visiting: `http://localhost:8080/api/accounts`
   - If the backend is not running, you'll see connection errors

2. **Start the Frontend**
   ```bash
   pnpm start
   ```

3. **Access the Application**
   - Open your browser to `http://localhost:5173`
   - You should see the Expense Tracker with navigation

## What You'll See

### ✅ Working Features (Ready to Use)

1. **Dashboard** (`/dashboard`)
   - Total balance across all accounts
   - Budget summary
   - Monthly spending charts
   - Recent transactions
   - Budget vs actual comparison

2. **Accounts** (`/accounts`)
   - List all accounts
   - Create new accounts (5 types: SAVINGS, CHECKING, CREDIT_CARD, FIXED_DEPOSIT, CASH)
   - Edit existing accounts
   - Delete accounts
   - View account balances formatted in INR (₹)

### 🚧 In Progress (Placeholder Pages)

3. **Categories** (`/categories`)
   - Shows placeholder message
   - Navigation and routing work
   - Needs implementation (see IMPLEMENTATION_GUIDE.md)

4. **Transactions** (`/transactions`)
   - Shows placeholder message
   - Navigation and routing work
   - Needs implementation (see IMPLEMENTATION_GUIDE.md)

5. **Budget** (`/budget`)
   - Shows placeholder message
   - Navigation and routing work
   - Needs implementation (see IMPLEMENTATION_GUIDE.md)

## Testing the Accounts Module

The **Accounts module is fully functional**. Try these actions:

1. **Navigate to Accounts**
   - Click "Accounts" in the top navigation
   - You should see a list of accounts from the backend

2. **Create an Account**
   - Click "Add Account" button
   - Fill in the form:
     - Account Name (e.g., "My Savings")
     - Account Type (choose from dropdown)
     - Current Balance (e.g., 10000)
     - Active status (toggle on/off)
   - Click "Create Account"
   - You'll see a success toast and be redirected to the accounts list

3. **Edit an Account**
   - Click the edit icon (pencil) on any account
   - Update the details
   - Click "Update Account"
   - You'll see a success toast

4. **Delete an Account**
   - Click the delete icon (trash) on any account
   - Confirm the deletion
   - The account will be removed

## Development Workflow

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode (while developing)
pnpm test:watch

# Run tests with coverage
pnpm test:ci

# Run tests with coverage locally
pnpm test:cov
```

### Linting

```bash
# Check for linting errors
pnpm lint

# Fix linting errors automatically
pnpm lint:fix
```

### Building for Production

```bash
# Build the application
pnpm build

# Build and preview
pnpm bp
```

## Project Structure Overview

```
src/
├── api/                 # All API client functions (COMPLETE)
├── types/               # TypeScript types and enums (COMPLETE)
├── utils/               # Utility functions (currency, date) (COMPLETE)
├── modules/
│   ├── dashboard/       # Dashboard module (COMPLETE)
│   ├── accounts/        # Accounts module (COMPLETE) ← Study this!
│   ├── categories/      # Categories module (SKELETON)
│   ├── transactions/    # Transactions module (SKELETON)
│   └── budget/          # Budget module (SKELETON)
├── hooks/               # Custom React hooks
├── testing-helpers/     # Test utilities
└── router.tsx           # Routing configuration (COMPLETE)
```

## Common Issues & Solutions

### Issue: Cannot connect to backend API

**Error**: Network errors or "Failed to fetch"

**Solution**:
- Ensure backend API is running at `http://localhost:8080`
- Check backend logs for errors
- Verify the API base URL in `src/api/client.ts` (should be `http://localhost:8080/api`)

### Issue: pnpm command not found

**Solution**:
```bash
npm install -g pnpm
```

### Issue: Node version incompatible

**Solution**:
- Install Node.js 20 or higher from https://nodejs.org
- Or use nvm: `nvm install 20 && nvm use 20`

### Issue: Port 5173 already in use

**Solution**:
- Kill the process using port 5173
- Or modify the port in `vite.config.ts`

### Issue: TypeScript errors

**Solution**:
```bash
# Delete node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Next Steps

### For Learning

1. **Study the Accounts Module**
   - Open `src/modules/accounts/pages/AccountsListPage.tsx`
   - Study the patterns: useQuery, useMutation, navigation, toasts
   - Look at `src/modules/accounts/components/AccountForm.tsx` for form patterns
   - Examine `src/api/accounts.api.ts` for API integration

2. **Review the Dashboard**
   - Open `src/modules/dashboard/pages/DashboardPage.tsx`
   - See how multiple API calls are combined
   - Study the visualization components

3. **Check the Documentation**
   - Read [CLAUDE.md](CLAUDE.md) for architecture overview
   - Read [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) for step-by-step implementation guide
   - Read [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for project status

### For Implementation

Follow the [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) to implement the remaining modules:

1. **Start with Categories** (simplest)
   - Implement list, create, and edit pages
   - Add hierarchical category support
   - Add color picker

2. **Then Transactions** (most complex)
   - Implement list with filtering
   - Create transaction forms
   - Add transfer functionality

3. **Finally Budget** (medium complexity)
   - Budget allocation interface
   - Budget vs actual visualization

## Useful Commands Reference

```bash
# Development
pnpm install          # Install dependencies
pnpm start           # Start dev server
pnpm build           # Build for production
pnpm preview         # Preview production build

# Testing
pnpm test            # Run tests
pnpm test:watch      # Run tests in watch mode
pnpm test:ci         # Run tests with coverage
pnpm test:cov        # Run tests with coverage locally

# Code Quality
pnpm lint            # Check linting
pnpm lint:fix        # Fix linting errors

# Git
git status           # Check status
git add .            # Stage all changes
git commit -m "msg"  # Commit changes
```

## API Base URL Configuration

The API client is configured to use `http://localhost:8080/api` as the base URL.

To change this:
1. Open `src/api/client.ts`
2. Modify the `BASE_URL` constant:
   ```typescript
   const BASE_URL = 'http://localhost:8080/api'; // Change this
   ```

For production, you might want to use environment variables:
```typescript
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
```

## Browser Support

The application works on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Resources

- **React Documentation**: https://react.dev
- **Material-UI**: https://mui.com
- **React Query**: https://tanstack.com/query/latest
- **React Hook Form**: https://react-hook-form.com
- **React Router**: https://reactrouter.com

## Getting Help

1. Check the documentation files in this directory
2. Review the fully implemented Accounts module
3. Look at the implementation guide
4. Check the console for error messages
5. Review the network tab in browser dev tools

## Success Indicators

You'll know everything is working when:
- ✅ The dev server starts without errors
- ✅ You can navigate to all pages
- ✅ The Dashboard shows summary cards (even with zero data)
- ✅ You can create, edit, and delete accounts
- ✅ Toast notifications appear on actions
- ✅ Network requests appear in the browser dev tools
- ✅ No console errors (except expected API errors if backend is not running)

Happy coding! 🚀
