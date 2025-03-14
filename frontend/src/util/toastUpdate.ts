import { toast, TypeOptions, Id } from 'react-toastify';

export default function toastUpdate(toastId: Id, type: TypeOptions, message: string) {
  toast.update(toastId, { type, render: message, isLoading: false, autoClose: 3000 });
}
