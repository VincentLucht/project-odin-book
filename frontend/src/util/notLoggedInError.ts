import { toast } from 'react-toastify';

export default function notLoggedInError(message = 'Please log in to continue') {
  toast.isActive('not-logged-in') || toast.error(message, { toastId: 'not-logged-in' });
}
