import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';

interface SavedApiFiltersProps {
  typeFilter: 'posts' | 'comments';
  setTypeFilter: React.Dispatch<React.SetStateAction<'posts' | 'comments'>>;
}

export default function SavedApiFilters({
  typeFilter,
  setTypeFilter,
}: SavedApiFiltersProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useClickOutside(() => setShowDropdown(false));

  const getTypeButtonText = () => {
    return typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1);
  };

  const className = 'h-[32px] rounded-full px-[14px] bg-transition-hover font-semibold';

  return (
    <div className="mb-2 mt-4 flex items-center justify-between">
      <div className="flex items-center gap-1" ref={containerRef}>
        <div className="relative">
          <ChevronButton
            customFunc={() => setShowDropdown(!showDropdown)}
            text={getTypeButtonText()}
            className={`${className} !text-[16px]`}
          />

          <DropdownMenu
            className={`-mt-5 rounded-md transition-opacity
              ${showDropdown ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}
          >
            <DropdownButton
              text="Posts"
              show={showDropdown}
              isSelected={typeFilter === 'posts'}
              customFunc={() => {
                setShowDropdown(false);
                setTypeFilter('posts');
              }}
            />

            <DropdownButton
              text="Comments"
              show={showDropdown}
              isSelected={typeFilter === 'comments'}
              customFunc={() => {
                setShowDropdown(false);
                setTypeFilter('comments');
              }}
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
