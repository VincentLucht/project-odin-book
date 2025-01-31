import { toast } from 'react-toastify';

export default function catchError(error: any, customMessage?: string) {
  const userMessage =
    customMessage ??
    (error instanceof TypeError
      ? 'Connection error, please try again'
      : 'An unexpected error occurred');

  toast.error(userMessage);
}
