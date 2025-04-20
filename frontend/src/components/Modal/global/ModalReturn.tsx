import { useState } from 'react';
import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

interface ModalReturnProps {
  show: boolean;
  setShow: (show: boolean) => void;
  onUrlSelected: (url: string) => void;
}

export default function ModalReturn({
  show,
  setShow,
  onUrlSelected,
}: ModalReturnProps) {
  const [value, setValue] = useState('');

  if (!show) return null;

  const onClose = () => {
    setValue('');
    setShow(false);
  };

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader headerName="Enter the image URL" onClose={onClose} />

      <input
        className="rounded-2xl p-3"
        type="text"
        placeholder="Paste your image URL here..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      <ModalFooter
        submitting={false}
        onClose={onClose}
        onClick={() => {
          onUrlSelected(value);
          onClose();
        }}
      />
    </Modal>
  );
}
