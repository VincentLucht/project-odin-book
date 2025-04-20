import { useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import ButtonWithImgAndCircle from '@/components/Interaction/ButtonWithImgAndCircle';
import { TagIcon, CircleHelpIcon } from 'lucide-react';

import { updateCommunitySettings } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

interface ChangeCommunityFlairRequiredProps {
  show: boolean;
  onClose: () => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeCommunityFlairRequired({
  show,
  onClose,
  submitting,
  setSubmitting,
}: ChangeCommunityFlairRequiredProps) {
  const { community, setCommunity, token } = useModToolsContext();
  const [isFlairRequired, setIsFlairRequired] = useState(
    community.is_post_flair_required,
  );

  if (!show) return null;

  const handleClose = () => {
    setIsFlairRequired(community.is_post_flair_required);
    onClose();
  };

  const onSubmit = () => {
    if (isFlairRequired === community.is_post_flair_required) {
      toast.info('You did not select a different flair requirement');
      return;
    }

    setSubmitting(true);
    void updateCommunitySettings(
      token,
      { community_name: community.name, is_post_flair_required: isFlairRequired },
      {
        loading: 'Updating flair requirement...',
        success: 'Successfully updated flair requirement',
        error: 'Failed to update flair requirement',
      },
    ).then((success) => {
      setSubmitting(false);
      if (!success) return;
      onClose();
      setCommunity((prev) => {
        if (!prev) return prev;
        return { ...prev, is_post_flair_required: isFlairRequired };
      });
    });
  };

  return (
    <Modal show={show} onClose={handleClose}>
      <ModalHeader headerName="Post Flair Requirement" onClose={handleClose} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <ButtonWithImgAndCircle
            icon={<CircleHelpIcon className="flex-shrink-0" />}
            header="Optional"
            subText="Users can submit posts without selecting a flair"
            isSelected={!isFlairRequired}
            onClick={() => setIsFlairRequired(false)}
            type="button"
          />
          <ButtonWithImgAndCircle
            icon={<TagIcon className="flex-shrink-0" />}
            header="Required"
            subText="Users must select a flair when submitting posts to your community"
            isSelected={isFlairRequired}
            onClick={() => setIsFlairRequired(true)}
            type="button"
          />
        </div>
        <ModalFooter onClose={handleClose} submitting={submitting} />
      </form>
    </Modal>
  );
}
