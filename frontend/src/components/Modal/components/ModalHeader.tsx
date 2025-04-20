import CloseButton from '@/components/Interaction/CloseButton';

interface ModalHeaderProps {
  headerName: string;
  description?: string;
  className?: string;
  onClose: () => void;
}

export default function ModalHeader({
  headerName,
  description,
  className,
  onClose,
}: ModalHeaderProps) {
  return (
    <>
      <div className="modal-header-wrapper">
        <h2 className={`modal-header ${className}`}>{headerName}</h2>

        <CloseButton customFunc={onClose} />
      </div>

      {description && <div className="modal-description">{description}</div>}
    </>
  );
}
