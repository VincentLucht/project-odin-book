import SpinnerDots from '@/components/SpinnerDots';

interface ModalFooterProps {
  onClose: () => void;
  submitting: boolean;
  onClick?: () => void;
  confirmButtonName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
}

export default function ModalFooter({
  onClose,
  submitting,
  onClick,
  confirmButtonName,
  confirmButtonClassName = 'confirm-button',
  cancelButtonClassName = 'cancel-button',
}: ModalFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button className={` ${cancelButtonClassName}`} onClick={() => onClose()}>
        Cancel
      </button>

      <button
        className={` ${confirmButtonClassName}`}
        type="submit"
        onClick={() => onClick?.()}
      >
        {submitting ? <SpinnerDots /> : confirmButtonName ? confirmButtonName : 'Save'}
      </button>
    </div>
  );
}
