import { renderHook } from '@testing-library/react';
import React, { act } from 'react';
import useToast, { ToastContext } from './useToast';

describe('useToast', () => {
  const addMessage = jest.fn();

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ToastContext.Provider value={{ addMessage }}>
      {children}
    </ToastContext.Provider>
  );

  it('should add a success toast message', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addSuccessToast('Success message');
    });

    expect(addMessage).toHaveBeenCalledWith({
      message: 'Success message',
      severity: 'success',
      key: expect.any(Number),
    });
  });

  it('should add an error toast message', () => {
    const { result } = renderHook(() => useToast(), { wrapper });

    act(() => {
      result.current.addErrorToast('Error message');
    });

    expect(addMessage).toHaveBeenCalledWith({
      message: 'Error message',
      severity: 'error',
      key: expect.any(Number),
    });
  });
});
