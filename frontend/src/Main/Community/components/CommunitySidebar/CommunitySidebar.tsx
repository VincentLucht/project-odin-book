import { useState } from 'react';

import MemberShipButton from '@/Main/Global/MemberShipButton';
import DisplayCommunityType from '@/components/sidebar/DisplayCommunityType';
import DisplayCreationDate from '@/components/sidebar/DisplayCreationDate';
import DisplayMemberCount from '@/components/sidebar/DisplayMemberCount.tsx/DisplayMemberCount';
import Separator from '@/components/Separator';
import RuleTab from '@/Main/CreatePost/components/CreatePostSidebar/components/RuleTab';
import UserCard from '@/components/user/UserCard';

import MessageMods from '@/Main/Community/components/CommunitySidebar/components/MessageMods';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import VirtualizedCommunityModerators from '@/Main/Community/components/CommunitySidebar/components/VirtualizedCommunityModerators';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { FetchedModerator } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { NavigateFunction } from 'react-router-dom';

interface CommunitySidebarProps {
  token: string | null;
  community: FetchedCommunity;
  isMod?: boolean;
  navigate: NavigateFunction;
  showMembership?: {
    show: boolean;
    isMember: boolean;
    toggleMembership: () => void;
  };
  className?: string;
}

export default function CommunitySidebar({
  token,
  community,
  isMod,
  navigate,
  showMembership,
  className = '',
}: CommunitySidebarProps) {
  const [showModal, setShowModal] = useState(false);
  const [moderators, setModerators] = useState<FetchedModerator[]>([]);

  return (
    <div
      className={`!gap-0 overflow-y-auto rounded-md bg-neutral-950 px-4 py-2 pb-3 sidebar ${className}`}
    >
      {showMembership ? (
        <div className="mb-2 flex items-center justify-between">
          <h2 className="break-all text-lg font-semibold">r/{community.name}</h2>

          {isMod ? (
            <button
              className="min-h-[30px] cursor-pointer text-sm !font-medium df prm-button-blue"
              onClick={() => navigate(`/r/${community.name}/mod/queue`)}
            >
              Mod tools
            </button>
          ) : (
            <MemberShipButton
              isMember={showMembership.isMember}
              onClick={showMembership.toggleMembership}
              classNameMember="!h-7"
              classNameNotMember="!h-7"
            />
          )}
        </div>
      ) : (
        <div className="font-medium">{community.name}</div>
      )}

      <div className="break-words font-light">{community.description}</div>

      <div className="flex flex-col gap-1 py-2">
        <DisplayCreationDate creationDate={community.created_at} />
        <DisplayCommunityType communityType={community.type} />
      </div>

      <DisplayMemberCount memberCount={community.total_members} />

      {community.community_rules.length !== 0 && (
        <>
          <Separator className="my-4" />

          <div>
            <h3 className="sidebar-subheading">RULES</h3>

            {community.community_rules.map((rule, index) => (
              <RuleTab rule={rule} key={index} />
            ))}
          </div>
        </>
      )}

      <Separator className="my-4" />

      <div className="flex flex-col gap-2">
        <h3 className="sidebar-subheading">MODERATORS</h3>

        <MessageMods community_id={community.id} token={token} />

        {community.community_moderators.map(({ is_active, user }, index) => {
          if (!is_active) return;

          const userFlair = user?.user_assigned_flair?.[0]?.community_flair;
          return (
            <UserCard
              key={index}
              profile_picture_url={user.profile_picture_url}
              username={user.username}
              navigate={navigate}
              {...(userFlair && {
                userFlair: {
                  name: userFlair.name,
                  emoji: userFlair.emoji,
                  textColor: userFlair.textColor,
                  color: userFlair.color,
                },
              })}
            />
          );
        })}

        <button className="sidebar-btn-stone" onClick={() => setShowModal(true)}>
          View all moderators
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader
          headerName={`r/${community.name} Moderators`}
          onClose={() => setShowModal(false)}
        />

        <VirtualizedCommunityModerators
          show={showModal}
          communityId={community.id}
          moderators={moderators}
          setModerators={setModerators}
        />

        <ModalFooter
          onClose={() => setShowModal(false)}
          submitting={false}
          cancelButtonName="Close"
          cancelButtonClassName="mt-6 cancel-button"
          options={{ cancelButton: true, confirmButton: false }}
        />
      </Modal>
    </div>
  );
}
