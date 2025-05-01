import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';
import useGetScreenSize from '@/context/screen/hook/useGetScreenSize';

import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import ToggleButton from '@/components/Interaction/ToggleButton';

import { ModQueueApiFilterProps } from '@/Main/Community/components/ModTools/components/ModQueue/ModQueue';
import { ModQueueStatus } from '@/Main/Community/components/ModTools/components/ModQueue/ModQueue';

interface ModQueueApiFiltersProps {
  apiFilters: ModQueueApiFilterProps;
  setApiFilters: React.Dispatch<React.SetStateAction<ModQueueApiFilterProps>>;
}

export default function ModQueueApiFilters({
  apiFilters,
  setApiFilters,
}: ModQueueApiFiltersProps) {
  const [showDropdown, setShowDropdown] = useState<'type' | 'sortByType' | null>(null);
  const containerRef = useClickOutside(() => setShowDropdown(null));
  const { isMobile } = useGetScreenSize();

  const getTypeButtonText = () => {
    const type = apiFilters.type;

    if (type === 'all') {
      return 'Posts and comments';
    } else {
      return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  const setStatus = (status: ModQueueStatus) => {
    setApiFilters((prev) => ({ ...prev, status }));
  };

  const isActive = (currentStatus: ModQueueStatus, statusName: ModQueueStatus) =>
    currentStatus === statusName;
  const className = 'h-[46px] rounded-full px-[14px] bg-transition-hover font-semibold';

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-wrap items-center gap-1">
        <ToggleButton
          buttonName="Pending"
          onClick={() => setStatus('pending')}
          className={className}
          isActive={isActive(apiFilters.status, 'pending')}
        />

        <ToggleButton
          buttonName="Moderated"
          onClick={() => setStatus('moderated')}
          className={className}
          isActive={isActive(apiFilters.status, 'moderated')}
        />

        <ToggleButton
          buttonName="Approved"
          onClick={() => setStatus('approved')}
          className={className}
          isActive={isActive(apiFilters.status, 'approved')}
        />

        <ToggleButton
          buttonName="Dismissed"
          onClick={() => setStatus('dismissed')}
          className={className}
          isActive={isActive(apiFilters.status, 'dismissed')}
        />
      </div>

      <div className="flex items-center gap-1" ref={containerRef}>
        <div className="relative">
          <ChevronButton
            customFunc={() => setShowDropdown(showDropdown === 'type' ? null : 'type')}
            text={getTypeButtonText()}
            className={`${className} !text-[16px]`}
          />

          <DropdownMenu
            className={`-mt-1 rounded-md transition-opacity
              ${showDropdown === 'type' ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}
          >
            <DropdownButton
              text="Posts and comments"
              show={showDropdown === 'type'}
              isSelected={apiFilters.type === 'all'}
              customFunc={() => {
                setShowDropdown(null);
                setApiFilters((prev) => ({ ...prev, type: 'all' }));
              }}
            />

            <DropdownButton
              text="Posts only"
              show={showDropdown === 'type'}
              isSelected={apiFilters.type === 'posts'}
              customFunc={() => {
                setShowDropdown(null);
                setApiFilters((prev) => ({ ...prev, type: 'posts' }));
              }}
            />

            <DropdownButton
              text="Comments only"
              show={showDropdown === 'type'}
              isSelected={apiFilters.type === 'comments'}
              customFunc={() => {
                setShowDropdown(null);
                setApiFilters((prev) => ({ ...prev, type: 'comments' }));
              }}
            />
          </DropdownMenu>
        </div>

        <div className="relative">
          <ChevronButton
            customFunc={() =>
              setShowDropdown(showDropdown === 'sortByType' ? null : 'sortByType')
            }
            text={`${apiFilters.sortByType === 'new' ? 'Newest' : 'Most reported'}`}
            className={`${className} !text-[16px]`}
          />

          <DropdownMenu
            className={`white -mt-1 rounded-md transition-opacity ${isMobile && 'max-w-[90px]'}
              ${showDropdown === 'sortByType' ? 'z-10 opacity-100' : '-z-10 opacity-0'}`}
          >
            <DropdownButton
              text="Newest"
              show={showDropdown === 'sortByType'}
              isSelected={apiFilters.sortByType === 'new'}
              customFunc={() => {
                setShowDropdown(null);
                setApiFilters((prev) => ({ ...prev, sortByType: 'new' }));
              }}
            />

            <DropdownButton
              text="Most reported"
              show={showDropdown === 'sortByType'}
              isSelected={apiFilters.sortByType === 'top'}
              customFunc={() => {
                setShowDropdown(null);
                setApiFilters((prev) => ({ ...prev, sortByType: 'top' }));
              }}
              classNameText=""
            />
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
