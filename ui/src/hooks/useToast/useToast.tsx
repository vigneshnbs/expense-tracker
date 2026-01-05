import { createContext, useContext } from 'react';
import { ToastMessage } from './interface';

export const ToastContext = createContext<{
  addMessage: (message: ToastMessage) => void;
}>({
  addMessage: () => {},
});

interface UseToast {
  addSuccessToast: (message: string) => void;
  addErrorToast: (message: string) => void;
}

const useToast = (): UseToast => {
  const { addMessage } = useContext(ToastContext);

  const show = (
    message: string,
    options: { severity: 'success' | 'error' },
  ) => {
    addMessage({ message, ...options, key: new Date().getTime() });
  };

  const addSuccessToast = (message: string) =>
    show(message, { severity: 'success' });

  const addErrorToast = (message: string) =>
    show(message, { severity: 'error' });

  return {
    addSuccessToast,
    addErrorToast,
  };
};

export default useToast;
