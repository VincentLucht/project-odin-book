import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import UserSettingsOption from '@/Main/user/UserSettings/components/UserSettingsOption';

import ChangeCommunityDescription from '@/Main/Community/components/ModTools/components/CommunitySettings/settings/ChangeCommunityDescription';
import ChangeCommunityType from '@/Main/Community/components/ModTools/components/CommunitySettings/settings/ChangeCommunityType';
import ChangeCommunityMature from '@/Main/Community/components/ModTools/components/CommunitySettings/settings/ChangeCommunityMature';
import ChangeCommunityAllowBasicUser from '@/Main/Community/components/ModTools/components/CommunitySettings/settings/ChangeCommunityAllowBasicUser';

import ChangeCommunityFlairRequired from '@/Main/Community/components/ModTools/components/CommunitySettings/settings/ChangeCommunityFlairRequired';
import ChangeCommunityStyling from '@/Main/Community/components/ModTools/components/CommunitySettings/settings/ChangeCommunityStyling';

export default function CommunitySettings() {
  const [modals, setModals] = useState({
    description: false,
    communityType: false,
    isMature: false,
    allowBasicUserPost: false,
    postFlairRequired: false,
    styling: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const { community } = useModToolsContext();

  const navigate = useNavigate();

  const openModal = (modalId: string) => {
    setModals({
      ...modals,
      [modalId]: true,
    });
  };

  const closeModal = (modalId: string) => {
    setModals({
      ...modals,
      [modalId]: false,
    });
  };

  return (
    <div className="p-4 center-main">
      <div className="w-full max-w-[900px]">
        <h2 className="mb-4 text-3xl font-bold">Community Settings</h2>

        <div className="flex flex-col">
          {/* GENERAL */}
          <h3 className="sub-header">General</h3>
          <div className="flex flex-col gap-1">
            <UserSettingsOption
              name="Description"
              onClick={() => openModal('description')}
            />

            <UserSettingsOption
              name="Community Type"
              onClick={() => openModal('communityType')}
              additionalName={
                community.type.charAt(0).toUpperCase() +
                community.type.toLowerCase().slice(1)
              }
            />

            {(community.type === 'RESTRICTED' || community.type === 'PRIVATE') && (
              <UserSettingsOption
                name="Allow basic users to post"
                additionalName={community.allow_basic_user_posts ? 'On' : 'Off'}
                onClick={() => openModal('allowBasicUserPost')}
              />
            )}

            <UserSettingsOption
              name="Mature (18+)"
              additionalName={community.is_mature ? 'On' : 'Off'}
              onClick={() => openModal('isMature')}
            />

            <UserSettingsOption
              name="Require post flair"
              additionalName={community.is_post_flair_required ? 'On' : 'Off'}
              onClick={() => openModal('postFlairRequired')}
            />
          </div>

          {/* APPEARANCE */}
          <h3 className="mt-3 sub-header">Appearance</h3>
          <div className="flex flex-col gap-1">
            <UserSettingsOption
              name="Change community styling"
              onClick={() => openModal('styling')}
            />

            <UserSettingsOption
              name="Edit post flair"
              onClick={() => navigate('post-flair')}
            />

            <UserSettingsOption
              name="Edit user flair"
              onClick={() => navigate('user-flair')}
            />
          </div>
        </div>

        <ChangeCommunityDescription
          show={modals.description}
          onClose={() => closeModal('description')}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />

        <ChangeCommunityType
          show={modals.communityType}
          onClose={() => closeModal('communityType')}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />

        <ChangeCommunityMature
          show={modals.isMature}
          onClose={() => closeModal('isMature')}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />

        <ChangeCommunityAllowBasicUser
          show={modals.allowBasicUserPost}
          onClose={() => closeModal('allowBasicUserPost')}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />

        <ChangeCommunityFlairRequired
          show={modals.postFlairRequired}
          onClose={() => closeModal('postFlairRequired')}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />

        <ChangeCommunityStyling
          show={modals.styling}
          onClose={() => closeModal('styling')}
          submitting={submitting}
          setSubmitting={setSubmitting}
        />
      </div>
    </div>
  );
}
