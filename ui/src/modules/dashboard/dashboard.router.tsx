import { RouteObject } from 'react-router-dom';

export const DashboardRoutes: RouteObject = {
  path: 'dashboard',
  lazy: async () => {
    const { DashboardPage } = await import('./pages');
    return { Component: DashboardPage };
  },
};
