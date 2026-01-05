import { createBrowserRouter, Navigate } from 'react-router-dom';
import RootPage from './modules/root';
import { DashboardRoutes } from './modules/dashboard/dashboard.router';
import { AccountsRoutes } from './modules/accounts/accounts.router';
import { CategoriesRoutes } from './modules/categories/categories.router';
import { TransactionsRoutes } from './modules/transactions/transactions.router';
import { BudgetRoutes } from './modules/budget/budget.router';

export const routerConfig = [
  {
    path: '/',
    element: <RootPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      DashboardRoutes,
      AccountsRoutes,
      CategoriesRoutes,
      TransactionsRoutes,
      BudgetRoutes,
    ],
    hydrateFallbackElement: <div>Loading...</div>,
  },
];

const routes = () =>
  createBrowserRouter(routerConfig, {
    basename: '/',
  });

export default routes;
