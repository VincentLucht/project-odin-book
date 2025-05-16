import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';

import { SortByUser } from '@/interface/backendTypes';
import { UserProfileFilters } from '@/Main/user/UserProfile/UserProfile';

interface UserProfileFiltersProps {
  sortBy: SortByUser;
  setSortBy: React.Dispatch<React.SetStateAction<SortByUser>>;
  typeFilter: UserProfileFilters;
  setTypeFilter: React.Dispatch<React.SetStateAction<UserProfileFilters>>;
}

export default function UserProfileApiFilters({
  sortBy,
  setSortBy,
  typeFilter,
  setTypeFilter,
}: UserProfileFiltersProps) {
  const [showDropdown, setShowDropdown] = useState<'type' | 'sortBy' | null>(null);
  const containerRef = useClickOutside(() => setShowDropdown(null));
  const { isMobile } = useGetScreenSize();

  const getTypeButtonText = () => {
    if (typeFilter === 'both') {
      return 'Posts and comments';
    } else {
      return typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1);
    }
  };

  const className = 'h-[32px] rounded-full px-[14px] bg-transition-hover font-semibold';

  return (
    <div className="mb-2 mt-4 flex items-center justify-between">
      <div className="flex items-center gap-1" ref={containerRef}>
        <div className="relative">
          <ChevronButton
            customFunc={() => setShowDropdown(showDropdown === 'type' ? null : 'type')}
            text={getTypeButtonText()}
            className={`${className} !text-[16px]`}
          />

          <DropdownMenu
            className={`-mt-5 rounded-md transition-opacity
              ${showDropdown === 'type' ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}
          >
            <DropdownButton
              text="Posts and comments"
              show={showDropdown === 'type'}
              isSelected={typeFilter === 'both'}
              customFunc={() => {
                setShowDropdown(null);
                setTypeFilter('both');
              }}
            />

            <DropdownButton
              text="Posts only"
              show={showDropdown === 'type'}
              isSelected={typeFilter === 'posts'}
              customFunc={() => {
                setShowDropdown(null);
                setTypeFilter('posts');
              }}
            />

            <DropdownButton
              text="Comments only"
              show={showDropdown === 'type'}
              isSelected={typeFilter === 'comments'}
              customFunc={() => {
                setShowDropdown(null);
                setTypeFilter('comments');
              }}
            />
          </DropdownMenu>
        </div>

        <div className="relative">
          <ChevronButton
            customFunc={() =>
              setShowDropdown(showDropdown === 'sortBy' ? null : 'sortBy')
            }
            text={sortBy === 'new' ? 'Newest' : 'Top'}
            className={`${className} !text-[16px]`}
          />

          <DropdownMenu
            className={`-mt-5 rounded-md transition-opacity ${isMobile && 'max-w-[90px]'}
              ${showDropdown === 'sortBy' ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}
          >
            <DropdownButton
              text="Newest"
              show={showDropdown === 'sortBy'}
              isSelected={sortBy === 'new'}
              customFunc={() => {
                setShowDropdown(null);
                setSortBy('new');
              }}
            />

            <DropdownButton
              text="Top"
              show={showDropdown === 'sortBy'}
              isSelected={sortBy === 'top'}
              customFunc={() => {
                setShowDropdown(null);
                setSortBy('top');
              }}
              classNameText=""
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
