import { RouteObject } from 'react-router-dom';

export const BudgetRoutes: RouteObject = {
  path: 'budget',
  lazy: async () => {
    const { BudgetPage } = await import('./pages');
    return { Component: BudgetPage };
  },
};
