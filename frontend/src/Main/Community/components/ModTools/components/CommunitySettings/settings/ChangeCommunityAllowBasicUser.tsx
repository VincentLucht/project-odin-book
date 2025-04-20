import { useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';

import ButtonWithImgAndCircle from '@/components/Interaction/ButtonWithImgAndCircle';
import { UserMinusIcon, UserCheckIcon } from 'lucide-react';

import { updateCommunitySettings } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

interface ChangeCommunityAllowBasicUserProps {
  show: boolean;
  onClose: () => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeCommunityAllowBasicUser({
  show,
  onClose,
  submitting,
  setSubmitting,
}: ChangeCommunityAllowBasicUserProps) {
  const { community, setCommunity, token } = useModToolsContext();
  const [allowBasicUserPosts, setAllowBasicUserPosts] = useState(
    community.allow_basic_user_posts,
  );

  if (!show) return;

  const handleClose = () => {
    setAllowBasicUserPosts(community.is_mature);
    onClose();
  };

  const onSubmit = () => {
    if (allowBasicUserPosts === community.allow_basic_user_posts) {
      toast.info('You did not select a different community type');
      return;
    }

    setSubmitting(true);

    void updateCommunitySettings(
      token,
      { community_name: community.name, allow_basic_user_posts: allowBasicUserPosts },
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
        return { ...prev, allow_basic_user_posts: allowBasicUserPosts };
      });
    });
  };

  return (
    <Modal show={show} onClose={onClose}>
      <ModalHeader
        headerName="Allow basic users to post"
        description="Control who can publish content in your community."
        onClose={onClose}
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="flex flex-col gap-2">
          <ButtonWithImgAndCircle
            icon={<UserMinusIcon className="flex-shrink-0" />}
            header="Off"
            subText="Only contributors can create posts"
            isSelected={!allowBasicUserPosts}
            onClick={() => setAllowBasicUserPosts(false)}
            type="button"
          />

          <ButtonWithImgAndCircle
            icon={<UserCheckIcon className="flex-shrink-0" />}
            header="On"
            subText="All users can create posts"
            isSelected={allowBasicUserPosts}
            onClick={() => setAllowBasicUserPosts(true)}
            type="button"
          />
        </div>

        <ModalFooter onClose={handleClose} submitting={submitting} />
      </form>
    </Modal>
  );
}
