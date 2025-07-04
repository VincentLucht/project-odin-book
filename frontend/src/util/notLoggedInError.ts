import { toast } from 'react-toastify';

export default function notLoggedInError(message = 'Please log in to continue') {
  const toastId = 'not-logged-in';

  if (toast.isActive(toastId)) {
    toast.update(toastId, {
      render: message,
      type: 'error',
      isLoading: false,
      autoClose: 5000,
    });
  } else {
    toast.error(message, { toastId });
  }
}
