const swalDefaultProps = {
  showCancelButton: true,
  showClass: { popup: '' },
  hideClass: { popup: '' },
  background: '#333',
  color: '#fff',
  confirmButtonColor: '#3b82f6',
  cancelButtonColor: '#ef4444',
  reverseButtons: true,
};

export const swalDefaultPropsConfirm = {
  ...swalDefaultProps,
  customClass: {
    title: 'text-2xl',
  },
};

export default swalDefaultProps;
