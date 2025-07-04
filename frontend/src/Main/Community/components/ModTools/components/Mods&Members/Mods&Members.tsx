import { useCallback, useEffect, useState } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';
import useModToolsContext from '@/Main/Community/components/ModTools/hooks/useModToolsContext';

import CommunityMembersApiFilters from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMembersApiFilters';
import Separator from '@/components/Separator';
import VirtualizedCommunityMembers from '@/Main/Community/components/ModTools/components/Mods&Members/components/VirtualizedCommunityMembers';
import SearchCommunityMembers from '@/Main/Community/components/ModTools/components/Mods&Members/components/SearchCommunityMembers';
import CommunityMember from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMember';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import AddModerator from '@/Main/Community/components/ModTools/components/Mods&Members/components/AddModerator/AddModerator';
import AddApprovedUser from '@/Main/Community/components/ModTools/components/Mods&Members/components/AddApprovedUser/AddApprovedUser';

import {
  FetchedCommunityMember,
  getMembers,
} from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { Pagination } from '@/interface/backendTypes';
import { MemberType } from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMembersApiFilters';

export default function ModMembers() {
  const [members, setMembers] = useState<FetchedCommunityMember[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResultsMembers, setSearchResultsMembers] = useState<
    FetchedCommunityMember[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pagination, setPagination] = useState<Pagination>({
    nextCursor: '',
    hasMore: true,
  });
  const [selectedMemberType, setSelectedMemberType] = useState<MemberType>('users');

  const { community } = useModToolsContext();
  const { user, token } = useAuthGuard();

  const addMemberToList = (member: FetchedCommunityMember) => {
    searchResultsMembers.length > 0
      ? setSearchResultsMembers((prev) => [member, ...prev])
      : setMembers((prev) => [member, ...prev]);
  };

  const loadMore = useCallback(
    (cursorId: string, isInitialFetch = false) => {
      setLoading(true);

      void getMembers(
        token,
        community.id,
        cursorId,
        selectedMemberType,
        (members, pagination) => {
          isInitialFetch
            ? setMembers(members)
            : setMembers((prev) => [...prev, ...members]);

          setPagination(pagination);
          setLoading(false);
        },
      );
    },
    [community.id, token, selectedMemberType],
  );

  useEffect(() => {
    loadMore('', true);
  }, [loadMore]);

  if (!token || !user) return;

  return (
    <div className="h-[calc(100dvh-56px)] p-4 center-main">
      <div
        className={`grid w-full max-w-[900px] grid-rows-[auto_1fr] ${searchLoading ? 'h-fit' : ''}`}
      >
        <div>
          <h2 className="mb-4 text-3xl font-bold">Mods & Members</h2>

          <CommunityMembersApiFilters
            selectedMemberType={selectedMemberType}
            setSelectedMemberType={setSelectedMemberType}
          />

          <div className="my-3 flex items-center justify-between">
            <SearchCommunityMembers
              token={token}
              communityId={community.id}
              setSearchResultsMembers={setSearchResultsMembers}
              setLoading={setSearchLoading}
              searchUsername={searchUsername}
              setSearchUsername={setSearchUsername}
              selectedMemberType={selectedMemberType}
            />

            {selectedMemberType === 'moderators' &&
              community.owner.username === user.username && (
                <AddModerator
                  token={token}
                  communityId={community.id}
                  ownerName={community.owner.username}
                  username={user.username}
                  addMemberToList={addMemberToList}
                />
              )}

            {selectedMemberType === 'approved' && (
              <AddApprovedUser
                token={token}
                communityId={community.id}
                ownerName={community.owner.username}
                username={user.username}
                addMemberToList={addMemberToList}
              />
            )}
          </div>

          <Separator />

          <div
            className={`grid px-2 py-4 font-semibold
              ${selectedMemberType === 'banned' ? 'grid-cols-[2fr_6fr]' : 'grid-cols-[4fr_6fr] md:grid-cols-[10fr_6fr]'} `}
          >
            <div>USERNAME</div>

            <div
              className={`grid gap-1
                ${selectedMemberType === 'banned' ? 'grid-cols-[6fr_3fr_3fr]' : 'grid-cols-2'}`}
            >
              {selectedMemberType === 'banned' && (
                <>
                  <div>BAN REASON</div>

                  <div>BAN DURATION</div>

                  <div>BAN DATE</div>
                </>
              )}

              {selectedMemberType !== 'banned' && (
                <>
                  <div>{selectedMemberType === 'users' && 'Role'}</div>

                  <div>JOINED</div>
                </>
              )}
            </div>
          </div>
        </div>

        {searchLoading ? (
          <LogoLoading />
        ) : (
          <>
            {searchUsername ? (
              searchResultsMembers.length > 0 ? (
                <div>
                  {searchResultsMembers.map((member, index) => (
                    <CommunityMember
                      key={index}
                      member={member}
                      username={user.username}
                      token={token}
                      communityId={community.id}
                      ownerName={community.owner.username}
                      type={selectedMemberType}
                      setMembers={setMembers}
                      searchResultsMembers={searchResultsMembers}
                      setSearchResultsMembers={setSearchResultsMembers}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-1 flex flex-col items-center gap-1">
                  <div>No community members with this username found.</div>

                  <div>
                    Are you sure this is the correct username or that the user is a
                    member?
                  </div>
                </div>
              )
            ) : (
              <VirtualizedCommunityMembers
                username={user.username}
                token={token}
                ownerName={community.owner.username}
                communityId={community.id}
                members={members}
                loading={loading}
                pagination={pagination}
                loadMore={loadMore}
                type={selectedMemberType}
                setMembers={setMembers}
                searchResultsMembers={searchResultsMembers}
                setSearchResultsMembers={setSearchResultsMembers}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
