import { Outlet, RouteObject } from 'react-router-dom';

export const TransactionsRoutes: RouteObject = {
  path: 'transactions',
  element: <Outlet />,
  children: [
    {
      index: true,
      lazy: async () => {
        const { TransactionsListPage } = await import('./pages');
        return { Component: TransactionsListPage };
      },
    },
    {
      path: 'new',
      lazy: async () => {
        const { CreateTransactionPage } = await import('./pages');
        return { Component: CreateTransactionPage };
      },
    },
    {
      path: 'transfer',
      lazy: async () => {
        const { TransferPage } = await import('./pages');
        return { Component: TransferPage };
      },
    },
    {
      path: ':id/edit',
      lazy: async () => {
        const { EditTransactionPage } = await import('./pages');
        return { Component: EditTransactionPage };
      },
    },
  ],
};
