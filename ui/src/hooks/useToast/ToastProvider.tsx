import { Alert, Snackbar } from '@mui/material';
import * as React from 'react';
import { FC, ReactNode, useState } from 'react';
import { ToastMessage, ToastProps, ToastStyle } from './interface';
import { ToastContext } from './useToast';

const CLICK_AWAY = 'clickaway';
const AUTO_HIDE_DURATION = 2000;

// https://mui.com/material-ui/react-snackbar/#consecutive-snackbars
const Toast: FC<ToastProps> = ({ message, onExited, ...props }) => {
  const [open, setOpen] = React.useState(true);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === CLICK_AWAY) {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      key={message.key}
      open={open}
      onClose={handleClose}
      TransitionProps={{ onExited }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      autoHideDuration={AUTO_HIDE_DURATION}
      {...props}
    >
      <Alert severity={message.severity}>{message.message}</Alert>
    </Snackbar>
  );
};

export const ToastProvider: FC<{ children: ReactNode } & ToastStyle> = ({
  children,
  ...props
}) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const removeMessage = (key: number) =>
    setMessages((arr) => arr.filter((m) => m.key !== key));

  const addMessage = (message: ToastMessage) =>
    setMessages((arr) => [...arr, message]);

  return (
    <ToastContext.Provider
      value={{
        addMessage,
      }}
    >
      {children}
      {messages.map((m) => (
        <Toast
          key={m.key}
          message={m}
          onExited={() => removeMessage(m.key)}
          {...props}
        />
      ))}
    </ToastContext.Provider>
  );
};
