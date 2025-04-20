import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';

interface ModalConfirmProps {
  show: boolean;
  headerName: string;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  modalClassName?: string;
  description?: string;
  buttonWrapperClassName?: string;
  cancelButtonName?: string;
  confirmButtonName?: string;
}

export default function ModalConfirm({
  show,
  headerName,
  onClose,
  onConfirm,
  loading,
  modalClassName,
  description,
  buttonWrapperClassName,
  cancelButtonName,
  confirmButtonName,
}: ModalConfirmProps) {
  return (
    <Modal show={show} onClose={onClose} className={modalClassName}>
      <ModalHeader headerName={headerName} onClose={onClose} />

      <div className="modal-description">{description}</div>

      <div
        className={`flex h-10 items-center justify-end gap-2 ${buttonWrapperClassName}`}
      >
        <button
          className="h-10 !font-medium prm-button-red !normal-bg-transition"
          onClick={onClose}
        >
          {cancelButtonName ? cancelButtonName : 'Cancel'}
        </button>

        <button className="h-10 !font-medium prm-button-red" onClick={onConfirm}>
          {loading ? (
            <div className="df">
              <div className="spinner-dots scale-75"></div>
            </div>
          ) : confirmButtonName ? (
            confirmButtonName
          ) : (
            'Confirm'
          )}
        </button>
      </div>
    </Modal>
  );
}
