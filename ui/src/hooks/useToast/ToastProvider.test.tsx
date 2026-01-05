import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React, { act } from 'react';
import { ToastProvider } from './ToastProvider';
import { ToastContext } from './useToast';

describe('ToastProvider', () => {
  it('should render children correctly', () => {
    render(
      <ToastProvider>
        <div>Child Component</div>
      </ToastProvider>,
    );

    expect(screen.getByText('Child Component')).toBeInTheDocument();
  });

  it('should add and display toast message', async () => {
    const TestComponent = () => {
      const { addMessage } = React.useContext(ToastContext);
      return (
        <button
          onClick={() =>
            addMessage({ message: 'Error message', severity: 'error', key: 2 })
          }
        >
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>,
    );

    fireEvent.click(screen.getByText('Show Toast'));

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('should remove toast message on close', async () => {
    const TestComponent = () => {
      const { addMessage } = React.useContext(ToastContext);
      return (
        <button
          onClick={() =>
            addMessage({
              message: 'Closable message',
              severity: 'success',
              key: 3,
            })
          }
        >
          Show Toast
        </button>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
        <div>Click outside</div>
      </ToastProvider>,
    );

    await act(async () => {
      fireEvent.click(screen.getByText('Show Toast'));
    });

    await waitFor(() => {
      expect(screen.getByText('Closable message')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Click outside'));

    screen.getByText('Closable message');

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(screen.queryByText('Closable message')).not.toBeInTheDocument();
    });
  });
});
