import SpinnerDots from '@/components/SpinnerDots';

interface ModalFooterProps {
  onClose: () => void;
  submitting: boolean;
  onClick?: () => void;
  cancelButtonName?: string;
  confirmButtonName?: string;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  options?: {
    cancelButton: boolean;
    confirmButton: boolean;
  };
}

export default function ModalFooter({
  onClose,
  submitting,
  onClick,
  cancelButtonName,
  confirmButtonName,
  confirmButtonClassName = 'confirm-button',
  cancelButtonClassName = 'cancel-button',
  options = { cancelButton: true, confirmButton: true },
}: ModalFooterProps) {
  return (
    <div className="mt-4 flex items-center justify-end gap-2">
      {options.cancelButton && (
        <button className={` ${cancelButtonClassName}`} onClick={() => onClose()}>
          {cancelButtonName ? cancelButtonName : 'Cancel'}
        </button>
      )}

      {options.confirmButton && (
        <button
          className={` ${confirmButtonClassName}`}
          type="submit"
          onClick={() => onClick?.()}
        >
          {submitting ? (
            <SpinnerDots />
          ) : confirmButtonName ? (
            confirmButtonName
          ) : (
            'Save'
          )}
        </button>
      )}
    </div>
  );
}
