import { useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import { unapproveUser } from '@/Main/Community/components/ModTools/components/Mods&Members/components/AddApprovedUser/api/approvedUserAPI';
import { toast } from 'react-toastify';

interface UnapproveUserModalProps {
  show: boolean;
  onClose: () => void;
  memberUsername: string;
  token: string;
  communityId: string;
  onUnapprove: () => void;
}

export default function UnapproveUserModal({
  show,
  onClose,
  memberUsername,
  token,
  communityId,
  onUnapprove,
}: UnapproveUserModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleUnapproveUser = () => {
    setSubmitting(true);

    void unapproveUser(token, communityId, memberUsername, () => {
      setSubmitting(false);
      toast.success(`Successfully unapproved u/${memberUsername}`);
      onUnapprove();
      onClose();
    });
  };

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader
        headerName={`Unapprove u/${memberUsername}`}
        onClose={onClose}
        description="Are you sure? They will no longer be an approved member and may need to request approval again to participate in your community."
      />
      <ModalFooter
        submitting={submitting}
        onClose={onClose}
        cancelButtonName="Cancel"
        confirmButtonName="Unapprove"
        onClick={handleUnapproveUser}
      />
    </Modal>
  );
}
