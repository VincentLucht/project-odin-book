import SpinnerDots from '@/components/SpinnerDots';

interface ModalFooterProps {
  onClose: () => void;
  submitting: boolean;
  onClick?: () => void;
  confirmButtonName?: string;
  confirmButtonClassName?: string;
}

export default function ModalFooter({
  onClose,
  submitting,
  onClick,
  confirmButtonName,
  confirmButtonClassName,
}: ModalFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      <button className="cancel-button" onClick={() => onClose()}>
        Cancel
      </button>

      <button
        className={`confirm-button ${confirmButtonClassName}`}
        type="submit"
        onClick={() => onClick?.()}
      >
        {submitting ? <SpinnerDots /> : confirmButtonName ? confirmButtonName : 'Save'}
      </button>
    </div>
  );
}
