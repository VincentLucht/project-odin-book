import { useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import TextareaAutosize from 'react-textarea-autosize';
import MaxLengthIndicator from '@/components/MaxLengthIndicator';

import { updateCommunitySettings } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

interface ChangeCommunityDescriptionProps {
  show: boolean;
  onClose: () => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeCommunityDescription({
  show,
  onClose,
  submitting,
  setSubmitting,
}: ChangeCommunityDescriptionProps) {
  const { community, setCommunity, token } = useModToolsContext();
  const [description, setDescription] = useState(community.description ?? '');

  if (!show) return;

  const handleClose = () => {
    setDescription(community.description ?? '');
    onClose();
  };

  const onSubmit = () => {
    if (community.description === description) {
      toast.info('You did not change the description');
      return;
    }

    setSubmitting(true);

    void updateCommunitySettings(
      token,
      { community_name: community.name, description },
      {
        loading: 'Updating description...',
        success: 'Successfully updated description',
        error: 'Failed to update description',
      },
    ).then((success) => {
      setSubmitting(false);
      if (!success) return;

      onClose();
      setCommunity((prev) => {
        if (!prev) return prev;
        return { ...prev, description };
      });
    });
  };

  return (
    <Modal show={show} onClose={handleClose}>
      <ModalHeader
        headerName="Description"
        description="Descriptions help users discover and understand your community."
        onClose={handleClose}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <TextareaAutosize
          className="w-full rounded-2xl px-4 py-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          minRows={3}
          maxLength={500}
        />

        <MaxLengthIndicator length={description.length} maxLength={500} />

        <ModalFooter onClose={handleClose} submitting={submitting} />
      </form>
    </Modal>
  );
}
