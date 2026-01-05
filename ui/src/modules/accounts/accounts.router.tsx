import { Outlet, RouteObject } from 'react-router-dom';

export const AccountsRoutes: RouteObject = {
  path: 'accounts',
  element: <Outlet />,
  children: [
    {
      index: true,
      lazy: async () => {
        const { AccountsListPage } = await import('./pages');
        return { Component: AccountsListPage };
      },
    },
    {
      path: 'new',
      lazy: async () => {
        const { CreateAccountPage } = await import('./pages');
        return { Component: CreateAccountPage };
      },
    },
    {
      path: ':id/edit',
      lazy: async () => {
        const { EditAccountPage } = await import('./pages');
        return { Component: EditAccountPage };
      },
    },
  ],
};
