import { Outlet, RouteObject } from 'react-router-dom';

export const TodosRoutes: RouteObject = {
  path: 'todos',
  element: <Outlet />,
  children: [
    {
      index: true,
      lazy: async () => {
        const { TodosPage } = await import('./pages');
        return { Component: TodosPage };
      },
    },
    {
      path: 'new',
      lazy: async () => {
        const { NewPage } = await import('./pages');
        return { Component: NewPage };
      },
    },
    {
      path: ':id',
      lazy: async () => {
        const { DetailPage } = await import('./pages');
        return { Component: DetailPage };
      },
    },
  ],
};
