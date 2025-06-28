import { useCallback } from 'react';

import { Virtuoso } from 'react-virtuoso';
import CommunityMember from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMember';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';

import { FetchedCommunityMember } from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { Pagination } from '@/interface/backendTypes';
import { MemberType } from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMembersApiFilters';

interface VirtualizedCommunityMembersProps {
  username: string;
  token: string;
  ownerName: string;
  communityId: string;
  members: FetchedCommunityMember[];
  loading: boolean;
  pagination: Pagination;
  loadMore: (cursorId: string, isInitialFetch?: boolean) => void;
  type: MemberType;
  setMembers: React.Dispatch<React.SetStateAction<FetchedCommunityMember[]>>;
  searchResultsMembers: FetchedCommunityMember[];
  setSearchResultsMembers: React.Dispatch<
    React.SetStateAction<FetchedCommunityMember[]>
  >;
}

export default function VirtualizedCommunityMembers({
  username,
  token,
  ownerName,
  communityId,
  members,
  loading,
  pagination,
  loadMore,
  type,
  setMembers,
  searchResultsMembers,
  setSearchResultsMembers,
}: VirtualizedCommunityMembersProps) {
  const itemRenderer = useCallback(
    (index: number) => {
      const member = members[index];
      if (!member) return null;

      return (
        <CommunityMember
          member={member}
          username={username}
          token={token}
          ownerName={ownerName}
          communityId={communityId}
          type={type}
          setMembers={setMembers}
          searchResultsMembers={searchResultsMembers}
          setSearchResultsMembers={setSearchResultsMembers}
        />
      );
    },
    [
      members,
      ownerName,
      username,
      token,
      communityId,
      type,
      setMembers,
      searchResultsMembers,
      setSearchResultsMembers,
    ],
  );

  const message: Record<MemberType, string> = {
    moderators: 'These are all the moderators!',
    users: 'These are all the users!',
    banned: 'These are all banned users!',
    approved: 'These are all approved users!',
  };
  const endMessage = message[type] || 'These are all the members!';

  return (
    <div>
      <Virtuoso
        data={members}
        itemContent={(index) => itemRenderer(index)}
        overscan={200}
        computeItemKey={(index) => members[index]?.id || index.toString()}
        endReached={() => {
          if (!loading && pagination.hasMore) {
            loadMore(pagination.nextCursor);
          }
        }}
        components={{
          Footer: () => (
            <EndMessageHandler
              loading={loading}
              hasMorePages={pagination.hasMore}
              dataLength={members.length}
              endMessage={endMessage}
            />
          ),
        }}
      />
    </div>
  );
}
