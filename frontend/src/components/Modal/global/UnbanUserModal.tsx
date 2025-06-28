import { useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import { toast } from 'react-toastify';

import { unbanUser } from '@/Main/Pages/Homepage/api/userCommunityAPI';

interface UnbanUserModalProps {
  show: boolean;
  onClose: () => void;
  memberUsername: string;
  token: string;
  communityId: string;
  onUnban: () => void;
}

export default function UnbanUserModal({
  show,
  onClose,
  memberUsername,
  token,
  communityId,
  onUnban,
}: UnbanUserModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleUnbanUser = () => {
    setSubmitting(true);

    void unbanUser(
      token,
      { community_id: communityId, username: memberUsername },
      () => {
        setSubmitting(false);
        toast.success(`Successfully unbanned u/${memberUsername}`);
        onUnban();
        onClose();
      },
    );
  };

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader
        headerName={`Unban u/${memberUsername}`}
        onClose={onClose}
        description="Are you sure? They will be able to participate in your community again. Unbanning will not restore a previous moderator role or membership."
      />

      <ModalFooter
        submitting={submitting}
        onClose={onClose}
        cancelButtonName="Cancel"
        confirmButtonName="Unban"
        onClick={handleUnbanUser}
      />
    </Modal>
  );
}
