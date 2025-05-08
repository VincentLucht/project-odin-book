import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';

interface NotificationApiFiltersProps {
  sortByType: 'all' | 'read' | 'unread';
  setSortByType: React.Dispatch<React.SetStateAction<'all' | 'read' | 'unread'>>;
  includeHidden: boolean;
  setIncludeHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function NotificationApiFilters({
  sortByType,
  setSortByType,
  includeHidden,
  setIncludeHidden,
}: NotificationApiFiltersProps) {
  const [showDropdown, setShowDropdown] = useState<'type' | 'hidden' | null>(null);
  const containerRef = useClickOutside(() => setShowDropdown(null));

  return (
    <div className="flex w-fit items-center" ref={containerRef}>
      <div className="relative">
        <ChevronButton
          customFunc={() => setShowDropdown(showDropdown === 'type' ? null : 'type')}
          text={
            sortByType === 'all'
              ? 'All notifications'
              : sortByType === 'read'
                ? 'Read notifications'
                : 'Unread notifications'
          }
        />

        <DropdownMenu
          className={`-mt-5 rounded-md transition-opacity
            ${showDropdown === 'type' ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
        >
          <DropdownButton
            text="All notifications"
            show={showDropdown === 'type'}
            isSelected={sortByType === 'all'}
            customFunc={() => {
              setShowDropdown(null);
              setSortByType('all');
            }}
          />

          <DropdownButton
            text="Read notifications"
            show={showDropdown === 'type'}
            isSelected={sortByType === 'read'}
            customFunc={() => {
              setShowDropdown(null);
              setSortByType('read');
            }}
          />

          <DropdownButton
            text="Unread notifications"
            show={showDropdown === 'type'}
            isSelected={sortByType === 'unread'}
            customFunc={() => {
              setShowDropdown(null);
              setSortByType('unread');
            }}
          />
        </DropdownMenu>
      </div>

      <div className="relative">
        <ChevronButton
          customFunc={() =>
            setShowDropdown(showDropdown === 'hidden' ? null : 'hidden')
          }
          text={includeHidden ? 'Include hidden' : 'Exclude hidden'}
        />
        <DropdownMenu
          className={`-mt-5 rounded-md transition-opacity
            ${showDropdown === 'hidden' ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
        >
          <DropdownButton
            text="Include hidden notifications"
            show={showDropdown === 'hidden'}
            isSelected={includeHidden}
            customFunc={() => {
              setShowDropdown(null);
              setIncludeHidden(true);
            }}
          />
          <DropdownButton
            text="Exclude hidden notifications"
            show={showDropdown === 'hidden'}
            isSelected={!includeHidden}
            customFunc={() => {
              setShowDropdown(null);
              setIncludeHidden(false);
            }}
          />
        </DropdownMenu>
      </div>
    </div>
  );
}
