import { SnackbarProps } from '@mui/material';

export type ToastStyle = Omit<
  SnackbarProps,
  'TransitionProps' | 'onClose' | 'open' | 'children' | 'message'
>;

export type ToastProps = {
  message: ToastMessage;
  onExited: () => void;
} & ToastStyle;

export interface ToastMessage {
  message: string;
  severity: 'success' | 'error';
  key: number;
}
