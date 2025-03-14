import { toast } from 'react-toastify';

interface ErrorWithMessage {
  message?: string;
  error?: string;
}

export default function catchError(error: unknown, customMessage?: string) {
  const errorMessage =
    typeof error === 'object' && error
      ? ((error as ErrorWithMessage).message ?? (error as ErrorWithMessage).error)
      : null;

  const userMessage =
    customMessage ??
    (errorMessage === 'Load failed'
      ? 'Connection error - please try again later'
      : errorMessage) ??
    'An unexpected error occurred';

  // Use consistent ID to avoid notification spam
  const toastId = 'error-toast';
  if (toast.isActive(toastId)) {
    toast.update(toastId, { render: userMessage });
  } else {
    toast.error(userMessage, { toastId });
  }
}
