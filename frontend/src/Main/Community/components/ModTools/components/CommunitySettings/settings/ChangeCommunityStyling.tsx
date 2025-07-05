import { useState } from 'react';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import AddOrRemove from '@/Main/Community/components/CreateCommunity/Levels/Level2/AddOrRemove';
import ModalReturn from '@/components/Modal/global/ModalReturn';

import { updateCommunitySettings } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

interface ChangeCommunityStylingProps {
  show: boolean;
  onClose: () => void;
  submitting: boolean;
  setSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChangeCommunityStyling({
  show,
  onClose,
  submitting,
  setSubmitting,
}: ChangeCommunityStylingProps) {
  const { community, setCommunity, token } = useModToolsContext();
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    community.profile_picture_url,
  );
  const [bannerUrlDesktop, setBannerUrlDesktop] = useState(
    community.banner_url_desktop,
  );
  const [bannerUrlMobile, setBannerUrlMobile] = useState(community.banner_url_mobile);
  const [showMobile, setShowMobile] = useState(false);
  const bannerSrc = showMobile ? bannerUrlMobile : bannerUrlDesktop;

  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [currentImageType, setCurrentImageType] = useState<
    'banner' | 'mobile' | 'icon' | null
  >(null);

  if (!show) return;

  const handleClose = () => {
    setProfilePictureUrl(community.profile_picture_url);
    setBannerUrlDesktop(community.banner_url_desktop);
    setBannerUrlMobile(community.banner_url_mobile);
    onClose();
  };

  const handleOpenModal = (type: 'banner' | 'mobile' | 'icon') => {
    setCurrentImageType(type);
    setShowSelectionModal(true);
  };

  const handleUrlSelected = (url: string) => {
    if (currentImageType === 'banner') {
      setBannerUrlDesktop(url);
    } else if (currentImageType === 'mobile') {
      setBannerUrlMobile(url);
    } else if (currentImageType === 'icon') {
      setProfilePictureUrl(url);
    }
    setShowSelectionModal(false);
  };

  const onSubmit = () => {
    if (
      profilePictureUrl === community.profile_picture_url &&
      bannerUrlDesktop === community.banner_url_desktop &&
      bannerUrlMobile === community.banner_url_mobile
    ) {
      toast.info('You did not change any URLs');
      return;
    }

    setSubmitting(true);

    void updateCommunitySettings(
      token,
      {
        community_name: community.name,
        profile_picture_url: profilePictureUrl ?? '',
        banner_url_desktop: bannerUrlDesktop ?? '',
        banner_url_mobile: bannerUrlMobile ?? '',
      },
      {
        loading: 'Updating community appearance...',
        success: 'Successfully updated community appearance',
        error: 'Failed to update community appearance',
      },
    ).then((success) => {
      setSubmitting(false);
      if (!success) return;

      onClose();
      setCommunity((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          profile_picture_url: profilePictureUrl,
          banner_url_desktop: bannerUrlDesktop,
          banner_url_mobile: bannerUrlMobile,
        };
      });
    });
  };

  return (
    <Modal
      show={show}
      onClose={handleClose}
      className="!h-fit !max-h-[800px] !w-full !max-w-[1072px]"
    >
      <ModalHeader
        headerName="Community Styling"
        className="!text-2xl"
        onClose={handleClose}
      />

      <div className="flex items-center justify-end">
        <button
          onClick={() => setShowMobile(!showMobile)}
          className="-mb-2 h-9 w-fit prm-button-blue"
        >
          {showMobile ? 'Show desktop banner' : 'Show mobile banner'}
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <div className="mb-3">
          <div
            className={`my-2 max-h-[128px] min-h-[128px] max-w-[1072px] overflow-hidden rounded-lg df
              ${bannerSrc ? '' : 'bg-neutral-200'} ${showMobile ? '!max-w-[500px]' : ''}`}
          >
            {bannerSrc ? (
              <img
                className="h-auto w-full rounded-lg object-contain"
                src={bannerSrc ?? ''}
                alt="Community Banner"
              />
            ) : (
              <div className="min-h-[128px] text-2xl font-semibold df text-bg-gray">
                {showMobile ? 'Mobile Banner Preview' : 'Banner Preview'}
              </div>
            )}
          </div>

          <div className="ml-4 flex">
            <div className="z-10 -mt-10 h-[88px] w-[88px] rounded-full border-4 bg-gray-400 df border-bg-gray">
              {profilePictureUrl ? (
                <img
                  className="rounded-full"
                  src={profilePictureUrl}
                  alt="Community Icon"
                />
              ) : (
                <div>Icon</div>
              )}
            </div>

            <div className="flex w-full justify-between">
              <h3 className="ml-2 text-3xl font-bold">r/{community.name}</h3>

              <div className="text-sm text-gray-secondary">
                {showMobile
                  ? '(Currently mobile banner)'
                  : '(Currently desktop banner)'}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <AddOrRemove
            value={bannerUrlDesktop}
            setterFunc={setBannerUrlDesktop}
            name="Banner"
            onAdd={() => handleOpenModal('banner')}
            subText="For good results, the image should be 1072 x 128px."
            type="button"
          />

          <AddOrRemove
            value={bannerUrlMobile}
            setterFunc={setBannerUrlMobile}
            name="Banner (mobile)"
            onAdd={() => handleOpenModal('mobile')}
            subText={
              <div className="flex flex-col">
                <span>
                  <b>Mobile banner:</b> Optional fallback for mobile devices.
                </span>

                <span>
                  <b>Note:</b> Default banner typically works well on mobile.
                </span>
              </div>
            }
            type="button"
          />

          <AddOrRemove
            value={profilePictureUrl}
            setterFunc={setProfilePictureUrl}
            name="Icon"
            onAdd={() => handleOpenModal('icon')}
            subText="Icons are 88 x 88px."
            type="button"
          />
        </div>

        <ModalFooter onClose={handleClose} submitting={submitting} />
      </form>

      <ModalReturn
        show={showSelectionModal}
        setShow={setShowSelectionModal}
        onUrlSelected={handleUrlSelected}
      />
    </Modal>
  );
}
