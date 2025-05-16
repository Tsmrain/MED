import { Snackbar, Alert, AlertProps } from '@mui/material';
import { SyntheticEvent } from 'react';

interface ToastProps extends Omit<AlertProps, 'children'> {
  open: boolean;
  message: string;
  onClose: (event?: SyntheticEvent | Event, reason?: string) => void;
  autoHideDuration?: number;
}

export default function Toast({ 
  open, 
  message, 
  onClose, 
  severity = 'info',
  autoHideDuration = 3000,
  ...props 
}: ToastProps) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{ 
          minWidth: '200px',
          backgroundColor: severity === 'success' ? '#6200ea' : undefined
        }}
        {...props}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}