import { Outlet, RouteObject } from 'react-router-dom';

export const CategoriesRoutes: RouteObject = {
  path: 'categories',
  element: <Outlet />,
  children: [
    {
      index: true,
      lazy: async () => {
        const { CategoriesListPage } = await import('./pages');
        return { Component: CategoriesListPage };
      },
    },
    {
      path: 'new',
      lazy: async () => {
        const { CreateCategoryPage } = await import('./pages');
        return { Component: CreateCategoryPage };
      },
    },
    {
      path: ':id/edit',
      lazy: async () => {
        const { EditCategoryPage } = await import('./pages');
        return { Component: EditCategoryPage };
      },
    },
  ],
};
