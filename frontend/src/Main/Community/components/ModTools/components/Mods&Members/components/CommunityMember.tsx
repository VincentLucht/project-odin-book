import { useState } from 'react';

import PFP from '@/components/PFP';
import Separator from '@/components/Separator';
import { Link } from 'react-router-dom';
import { BanIcon, LockOpenIcon, CircleMinus } from 'lucide-react';
import BanUserModal from '@/components/Modal/global/BanUserModal';
import UnbanUserModal from '@/components/Modal/global/UnbanUserModal';
import UserIndicators from '@/Main/Community/components/ModTools/components/Mods&Members/components/components/UserIndicators';

import dayjs from 'dayjs';

import { FetchedCommunityMember } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { MemberType } from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMembersApiFilters';
import UnapproveUserModal from '@/components/Modal/global/UnapproveUserModal';

interface CommunityMemberProps {
  member: FetchedCommunityMember;
  username: string;
  token: string;
  communityId: string;
  ownerName: string;
  type: MemberType;
  setMembers: React.Dispatch<React.SetStateAction<FetchedCommunityMember[]>>;
  searchResultsMembers: FetchedCommunityMember[];
  setSearchResultsMembers: React.Dispatch<
    React.SetStateAction<FetchedCommunityMember[]>
  >;
}

export default function CommunityMember({
  member,
  username,
  token,
  communityId,
  ownerName,
  type,
  setMembers,
  searchResultsMembers,
  setSearchResultsMembers,
}: CommunityMemberProps) {
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [showUnapproveModal, setShowUnapproveModal] = useState(false);

  const memberUsername = member.user.username;
  const removeMemberFromList = (username: string) => {
    searchResultsMembers.length > 0
      ? setSearchResultsMembers((prev) =>
          prev.filter((member) => member.user.username !== username),
        )
      : setMembers((prev) =>
          prev.filter((member) => member.user.username !== username),
        );
  };

  const isBanAllowed =
    type === 'users' || (type === 'moderators' && username === ownerName);
  const isUserSelf = memberUsername === username;
  const isOwner = memberUsername === ownerName;

  return (
    <>
      <Separator />

      <div
        className={`grid px-2 py-4
          ${type === 'banned' ? 'grid-cols-[2fr_6fr]' : 'grid-cols-[4fr_6fr] md:grid-cols-[10fr_6fr]'} `}
      >
        <Link
          to={`/user/${memberUsername}`}
          className="group flex w-fit items-center gap-1"
        >
          <div className="!h-[50px] !w-[50px] flex-shrink-0 df hover:bg-hover-transition">
            <PFP
              src={member.user.profile_picture_url}
              className="!h-10 !w-10"
              mode="user"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="break-all font-medium group-hover:underline">
              u/{memberUsername}
            </div>

            <UserIndicators
              isUserSelf={isUserSelf}
              isOwner={isOwner}
              isModerator={member.is_moderator ?? false}
              isApproved={typeof member.approved_at === 'string'}
            />
          </div>
        </Link>

        <div
          className={`grid gap-1 ${type === 'banned' ? 'grid-cols-[6fr_3fr_3fr]' : 'grid-cols-2'}`}
        >
          {type === 'users' ? (
            <div className="flex items-center break-all">{member?.role}</div>
          ) : (
            <div className="flex items-center break-all pr-2">{member.ban_reason}</div>
          )}

          {type === 'banned' && (
            <div className="flex items-center">
              {member.ban_duration
                ? dayjs(member.ban_duration).format('DD/MM/YYYY')
                : 'PERMANENT'}
            </div>
          )}

          <div className="mr-3 flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <div>
                {dayjs(type === 'banned' ? member.banned_at : member.joined_at).format(
                  'HH:MM',
                )}
              </div>

              <div>
                {dayjs(type === 'banned' ? member.banned_at : member.joined_at).format(
                  'MMM D, YYYY',
                )}
              </div>
            </div>

            {!isUserSelf && !isOwner && isBanAllowed && (
              <button
                onClick={() => setShowBanModal(true)}
                className="bg-hover-transition"
              >
                <BanIcon className="text-red-500" />
              </button>
            )}

            {type === 'banned' && (
              <button
                onClick={() => setShowUnbanModal(true)}
                className="bg-hover-transition"
              >
                <LockOpenIcon className="text-blue-500" />
              </button>
            )}

            {type === 'approved' && !isUserSelf && !isOwner && (
              <button
                onClick={() => setShowUnapproveModal(true)}
                className="bg-hover-transition"
              >
                <CircleMinus className="text-red-500" />
              </button>
            )}
          </div>
        </div>
      </div>

      {isBanAllowed && (
        <BanUserModal
          show={showBanModal}
          onClose={() => setShowBanModal(false)}
          memberUsername={memberUsername}
          token={token}
          communityId={communityId}
          onBan={() => removeMemberFromList(memberUsername)}
        />
      )}

      {type === 'banned' && (
        <UnbanUserModal
          show={showUnbanModal}
          onClose={() => setShowUnbanModal(false)}
          memberUsername={memberUsername}
          token={token}
          communityId={communityId}
          onUnban={() => removeMemberFromList(memberUsername)}
        />
      )}

      {type === 'approved' && (
        <UnapproveUserModal
          show={showUnapproveModal}
          onClose={() => setShowUnapproveModal(false)}
          memberUsername={memberUsername}
          token={token}
          communityId={communityId}
          onUnapprove={() => removeMemberFromList(memberUsername)}
        />
      )}
    </>
  );
}
