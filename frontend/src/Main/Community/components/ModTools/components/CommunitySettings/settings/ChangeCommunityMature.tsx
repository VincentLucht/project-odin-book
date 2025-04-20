import { useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import ButtonWithImgAndCircle from '@/components/Interaction/ButtonWithImgAndCircle';
import { GlobeIcon, GlobeLockIcon } from 'lucide-react';

import { updateCommunitySettings } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

interface ChangeCommunityMatureProps {
  show: boolean;
  onClose: () => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeCommunityMature({
  show,
  onClose,
  submitting,
  setSubmitting,
}: ChangeCommunityMatureProps) {
  const { community, setCommunity, token } = useModToolsContext();
  const [isMature, setIsMature] = useState(community.is_mature);

  if (!show) return;

  const handleClose = () => {
    setIsMature(community.is_mature);
    onClose();
  };

  const onSubmit = () => {
    if (isMature === community.is_mature) {
      toast.info('You did not select a different community type');
      return;
    }

    setSubmitting(true);

    void updateCommunitySettings(
      token,
      { community_name: community.name, is_mature: isMature },
      {
        loading: 'Updating maturity level...',
        success: 'Successfully updated maturity level',
        error: 'Failed to update maturity level',
      },
    ).then((success) => {
      setSubmitting(false);
      if (!success) return;

      onClose();
      setCommunity((prev) => {
        if (!prev) return prev;
        return { ...prev, is_mature: isMature };
      });
    });
  };

  return (
    <Modal show={show} onClose={handleClose}>
      <ModalHeader headerName="Community Maturity Type" onClose={handleClose} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <ButtonWithImgAndCircle
            icon={<GlobeIcon />}
            header="All Ages"
            subText=""
            isSelected={!isMature}
            onClick={() => setIsMature(false)}
            type="button"
          />

          <ButtonWithImgAndCircle
            icon={<GlobeLockIcon className="flex-shrink-0" />}
            header="Mature (18+)"
            subText="Prevents people who have not confirmed that they are over 18 from seeing your community"
            isSelected={isMature}
            onClick={() => setIsMature(true)}
            type="button"
          />
        </div>

        <ModalFooter onClose={handleClose} submitting={submitting} />
      </form>
    </Modal>
  );
}
