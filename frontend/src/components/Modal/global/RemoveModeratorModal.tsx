import { useState } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import { toast } from 'react-toastify';
import { removeMod } from '@/Main/Community/components/ModTools/api/communityModerationAPI';

interface RemoveModeratorModalProps {
  show: boolean;
  onClose: () => void;
  memberUsername: string;
  token: string;
  communityId: string;
  onRemoveModerator: () => void;
}

export default function RemoveModeratorModal({
  show,
  onClose,
  memberUsername,
  token,
  communityId,
  onRemoveModerator,
}: RemoveModeratorModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const handleRemoveModerator = () => {
    setSubmitting(true);

    void removeMod(
      token,
      { community_id: communityId, username: memberUsername },
      () => {
        setSubmitting(false);
        toast.success(`Successfully removed moderator status from u/${memberUsername}`);
        onRemoveModerator();
        onClose();
      },
    );
  };

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader
        headerName={`Remove moderator u/${memberUsername}`}
        onClose={onClose}
        description="Are you sure? They will lose their moderator privileges and will no longer be able to moderate this community."
      />

      <ModalFooter
        submitting={submitting}
        onClose={onClose}
        cancelButtonName="Cancel"
        confirmButtonName="Remove Moderator"
        onClick={handleRemoveModerator}
      />
    </Modal>
  );
}
