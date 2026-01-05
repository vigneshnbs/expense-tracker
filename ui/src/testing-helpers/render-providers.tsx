import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { PropsWithChildren, StrictMode } from 'react';
import { RouterProvider } from 'react-router';
import { ToastProvider } from '../hooks/useToast';
import routes from '../router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export const visit = async ({ route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);

  render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <RouterProvider router={routes()} />
        </ToastProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
  await screen.findByTestId('page-wrapper', {}, { timeout: 10000 });
};

export const renderProviderWrapper =
  () =>
  ({ children }: PropsWithChildren) => (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    </StrictMode>
  );
