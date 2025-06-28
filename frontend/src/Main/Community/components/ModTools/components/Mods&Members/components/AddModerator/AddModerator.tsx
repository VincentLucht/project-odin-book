import { useState, useEffect } from 'react';

import { Modal } from '@/components/Modal/Modal';
import ModalHeader from '@/components/Modal/components/ModalHeader';
import ModalFooter from '@/components/Modal/components/ModalFooter';
import { PlusIcon } from 'lucide-react';
import UserIndicators from '@/Main/Community/components/ModTools/components/Mods&Members/components/components/UserIndicators';
import PFP from '@/components/PFP';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import SearchField from '@/Main/Global/SearchField';

import { getMembersByName } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { makeMod } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { toast } from 'react-toastify';

import { FetchedCommunityMember } from '@/Main/Community/components/ModTools/api/communityModerationAPI';

interface AddModeratorProps {
  token: string;
  communityId: string;
  ownerName: string;
  username: string;
  addMemberToList: (member: FetchedCommunityMember) => void;
}

export default function AddModerator({
  token,
  communityId,
  ownerName,
  username,
  addMemberToList,
}: AddModeratorProps) {
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResultsMembers, setSearchResultsMembers] = useState<
    FetchedCommunityMember[]
  >([]);
  const [chosenUser, setChosenUser] = useState<{
    username: string;
    profile_picture_url: string | undefined;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!searchUsername) {
      setSearchResultsMembers([]);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);

      void getMembersByName(
        token,
        communityId,
        searchUsername,
        'users',
        (members) => {
          setLoading(false);
          setSearchResultsMembers(members);
        },
        5,
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [searchUsername, setSearchResultsMembers, communityId, setLoading, token]);

  return (
    <>
      <button
        className="flex h-10 items-center gap-2 !font-semibold prm-button-blue"
        onClick={() => setShowModal(true)}
      >
        <PlusIcon strokeWidth={2.5} />
        <span>Add moderator</span>
      </button>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ModalHeader
          headerName="Add moderator"
          description="Moderators can manage content and users. Only choose trusted people."
          onClose={() => setShowModal(false)}
        />

        <SearchField
          id="add-moderator-input"
          value={searchUsername}
          setValue={setSearchUsername}
          onClose={() => {
            setSearchUsername('');
            setSearchResultsMembers([]);
          }}
          placeholder="Search users to add as moderator"
        />

        <div className="flex h-full flex-col gap-4">
          {loading ? (
            <LogoLoading />
          ) : (
            searchResultsMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <PFP src={member.user.profile_picture_url} mode="user" size="large" />

                  <div className="font-medium">u/{member.user.username}</div>
                </div>

                <UserIndicators
                  isUserSelf={member.user.username === username}
                  isOwner={member.user.username === ownerName}
                  isModerator={member.is_moderator ?? false}
                  isApproved={typeof member.approved_at === 'string'}
                />

                <button
                  type="button"
                  className={`ml-auto bg-hover-transition
                    ${member.is_moderator ? '!cursor-not-allowed' : '!cursor-pointer'}`}
                  onClick={() => {
                    if (member.is_moderator) {
                      const toastId = 'toast-user-already-moderator';
                      if (!toast.isActive(toastId)) {
                        toast.info(`u/${member.user.username} is already a moderator`, {
                          toastId,
                        });
                      }
                      return;
                    }

                    setChosenUser((prev) =>
                      member.user.username === prev?.username ? null : member.user,
                    );
                  }}
                >
                  <input
                    type="checkbox"
                    className="pointer-events-none"
                    checked={chosenUser?.username === member.user.username}
                    readOnly
                  />
                </button>
              </div>
            ))
          )}
        </div>

        <ModalFooter
          submitting={submitting}
          onClose={() => setShowModal(false)}
          confirmButtonName="Add"
          confirmButtonClassName={
            chosenUser ? 'confirm-button' : 'confirm-button !bg-gray-inactive'
          }
          onClick={() => {
            if (!chosenUser) {
              const toastId = 'toast-add-moderator';
              if (!toast.isActive(toastId)) {
                toast.info('You need to choose a user to add as moderator', {
                  toastId,
                });
              }
              return;
            }

            setSubmitting(true);

            void makeMod(
              token,
              { community_id: communityId, username: chosenUser.username },
              () => {
                addMemberToList({
                  id: `${new Date().toISOString()}-${chosenUser.username}`,
                  joined_at: new Date().toISOString(),
                  is_moderator: true,
                  user: chosenUser,
                });
                setSubmitting(false);
                setShowModal(false);
                setChosenUser(null);
                setSearchUsername('');
                setSearchResultsMembers([]);
                toast.success(`Successfully made u/${chosenUser.username} a moderator`);
              },
            );
          }}
        />
      </Modal>
    </>
  );
}
