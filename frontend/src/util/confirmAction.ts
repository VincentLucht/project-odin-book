import Swal from 'sweetalert2';
import { swalDefaultPropsConfirm } from '@/util/swalDefaultProps';

export default async function confirmAction(title: string, confirmButtonText: string) {
  return Swal.fire({
    title,
    confirmButtonText,
    ...swalDefaultPropsConfirm,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#3b82f6',
  }).then((result) => {
    return result.isConfirmed;
  });
}
