import { useEffect } from 'react';

import SearchField from '@/Main/Global/SearchField';

import {
  getMembersByName,
  FetchedCommunityMember,
} from '@/Main/Community/components/ModTools/api/communityModerationAPI';
import { MemberType } from '@/Main/Community/components/ModTools/components/Mods&Members/components/CommunityMembersApiFilters';

interface SearchCommunityMembersProps {
  token: string;
  communityId: string;
  setSearchResultsMembers: React.Dispatch<
    React.SetStateAction<FetchedCommunityMember[]>
  >;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  searchUsername: string;
  setSearchUsername: React.Dispatch<React.SetStateAction<string>>;
  selectedMemberType: MemberType;
}

export default function SearchCommunityMembers({
  token,
  communityId,
  setSearchResultsMembers,
  setLoading,
  searchUsername,
  setSearchUsername,
  selectedMemberType,
}: SearchCommunityMembersProps) {
  useEffect(() => {
    if (!searchUsername) {
      setSearchResultsMembers([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      void getMembersByName(
        token,
        communityId,
        searchUsername,
        selectedMemberType,
        (members) => {
          setLoading(false);
          setSearchResultsMembers(members);
        },
        30,
      );
    }, 300);

    return () => clearTimeout(timer);
  }, [
    searchUsername,
    setSearchResultsMembers,
    communityId,
    setLoading,
    token,
    selectedMemberType,
  ]);

  return (
    <SearchField
      id="search-user-input"
      value={searchUsername}
      setValue={setSearchUsername}
      onClose={() => {
        setSearchUsername('');
        setSearchResultsMembers([]);
      }}
      placeholder="Search users"
      className="max-w-[320px]"
    />
  );
}
