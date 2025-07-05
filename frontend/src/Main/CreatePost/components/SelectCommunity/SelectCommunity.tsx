import { useState, useEffect, useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import CloseButton from '@/components/Interaction/CloseButton';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';

import handleSearchByName from '@/Main/CreatePost/components/SelectCommunity/api/handleSearchByName';
import handleGetCreationInfo from '@/Main/CreatePost/components/SelectCommunity/api/handleGetCreationInfo';

import { CommunitySearch } from '@/Main/CreatePost/components/SelectCommunity/api/searchByName';
import { CreationInfo } from '@/Main/CreatePost/components/SelectCommunity/api/getCreationInfo';

interface SelectCommunityProps {
  communityName: string | null;
  token: string;
  activeCommunity: CreationInfo | null;
  setActiveCommunity: React.Dispatch<React.SetStateAction<CreationInfo | null>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SelectCommunity({
  communityName,
  token,
  activeCommunity,
  setActiveCommunity,
  setIsLoading,
}: SelectCommunityProps) {
  const [search, setSearch] = useState(communityName ? communityName : '');
  const [foundCommunities, setFoundCommunities] = useState<CommunitySearch[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [loading, setLoading] = useState(false);

  const divRef = useClickOutside(() => {
    setIsSelecting(false);
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (isSelecting && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSelecting]);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (isSelecting && search.length > 0) {
        handleSearchByName(search, token, setFoundCommunities, setLoading, true);
      }
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [isSelecting, search, token]);

  useEffect(() => {
    if (communityName) {
      const separated = communityName.split('/')?.[0];
      handleGetCreationInfo(separated, token, true, setActiveCommunity, setIsLoading);
    }
  }, [communityName, token, setActiveCommunity, setIsLoading]);

  return (
    <div className="my-2">
      {activeCommunity ? (
        <div className="flex items-center gap-2">
          <button
            className="h-[38px] gap-[6px] !px-3 font-semibold df normal-bg-transition create-comm-btn"
            onClick={() => setActiveCommunity(null)}
          >
            <img
              src={
                activeCommunity?.profile_picture_url
                  ? activeCommunity.profile_picture_url
                  : '/community-default.svg'
              }
              alt="Community Profile picture"
              className="h-6 rounded-full border"
            />

            <span>r/{activeCommunity.name}</span>
          </button>

          <CloseButton
            customFunc={() => {
              setIsSelecting(false);
              setActiveCommunity(null);
            }}
          />
        </div>
      ) : isSelecting ? (
        <div ref={divRef} className="relative inline-block">
          <input
            className="h-[38px] bg-accent-gray create-comm-btn focus:outline-none focus:ring-2
              focus:ring-blue-500"
            placeholder="Select a community"
            type="text"
            ref={inputRef}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxLength={23}
          />

          <DropdownMenu className="!top-12 z-10 w-[215px] rounded-md">
            {loading ? (
              <div className="flex items-center justify-center p-4">
                <LogoLoading />
              </div>
            ) : foundCommunities.length === 0 ? (
              <span>No communities found</span>
            ) : (
              foundCommunities.map((community) => {
                return (
                  <DropdownButton
                    text={`r/${community.name}`}
                    show={true}
                    key={community.name}
                    src={
                      community.profile_picture_url
                        ? community.profile_picture_url
                        : '/community-default.svg'
                    }
                    imgClassName="h-8 w-8 border rounded-full"
                    alt="Community profile picture"
                    subText={`${community.total_members}`}
                    customFunc={() => {
                      handleGetCreationInfo(
                        community.name,
                        token,
                        true,
                        setActiveCommunity,
                        setIsLoading,
                      );
                    }}
                  />
                );
              })
            )}
          </DropdownMenu>
        </div>
      ) : (
        <button
          onClick={() => setIsSelecting(true)}
          className="h-[38px] font-semibold transition-colors df normal-bg-transition create-comm-btn"
        >
          Select a community
        </button>
      )}
    </div>
  );
}
