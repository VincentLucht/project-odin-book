import { useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import ButtonWithImgAndCircle from '@/components/Interaction/ButtonWithImgAndCircle';
import { GlobeIcon, EyeIcon, LockIcon } from 'lucide-react';

import { updateCommunitySettings } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

interface ChangeCommunityTypeProps {
  show: boolean;
  onClose: () => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeCommunityType({
  show,
  onClose,
  submitting,
  setSubmitting,
}: ChangeCommunityTypeProps) {
  const { community, setCommunity, token } = useModToolsContext();
  const [selectedType, setSelectedType] = useState(community.type);

  if (!show) return;

  const handleClose = () => {
    setSelectedType(community.type);
    onClose();
  };

  const onSubmit = () => {
    if (selectedType === community.type) {
      toast.info('You did not select a different community type');
      return;
    }

    setSubmitting(true);

    void updateCommunitySettings(
      token,
      { community_name: community.name, community_type: selectedType },
      {
        loading: 'Updating community type...',
        success: 'Successfully updated community type',
        error: 'Failed to update community type',
      },
    ).then((success) => {
      setSubmitting(false);
      if (!success) return;

      onClose();
      setCommunity((prev) => {
        if (!prev) return prev;
        return { ...prev, type: selectedType };
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
        <div className="flex flex-col gap-2">
          <ButtonWithImgAndCircle
            icon={<GlobeIcon />}
            header="Public"
            subText="Anyone can view, post, and comment in this community"
            isSelected={selectedType === 'PUBLIC'}
            onClick={() => setSelectedType('PUBLIC')}
            type="button"
          />

          <ButtonWithImgAndCircle
            icon={<EyeIcon />}
            header="Restricted"
            subText="Anyone can view, but only approved users can contribute"
            isSelected={selectedType === 'RESTRICTED'}
            onClick={() => setSelectedType('RESTRICTED')}
            type="button"
          />

          <ButtonWithImgAndCircle
            icon={<LockIcon className="flex-shrink-0" />}
            header="Private"
            subText="Only approved users can view and contribute, Note: Private communities still show up in search, but are not accessible to non-members"
            isSelected={selectedType === 'PRIVATE'}
            onClick={() => setSelectedType('PRIVATE')}
            type="button"
          />
        </div>

        <ModalFooter onClose={handleClose} submitting={submitting} />
      </form>
    </Modal>
  );
}
