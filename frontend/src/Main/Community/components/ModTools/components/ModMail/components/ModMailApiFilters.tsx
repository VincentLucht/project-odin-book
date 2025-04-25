import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';
import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';

interface ModMailApiFiltersProps {
  apiFilters: {
    onlyArchived: boolean;
    getArchived: boolean;
    getReplied: boolean;
  };
  setApiFilters: React.Dispatch<
    React.SetStateAction<{
      onlyArchived: boolean;
      getArchived: boolean;
      getReplied: boolean;
    }>
  >;
}

export default function ModMailApiFilters({
  apiFilters,
  setApiFilters,
}: ModMailApiFiltersProps) {
  const [showDropdown, setShowDropdown] = useState<'archive' | 'reply' | null>(null);
  const containerRef = useClickOutside(() => setShowDropdown(null));

  return (
    <div className="flex w-fit items-center gap-2" ref={containerRef}>
      <div className="relative">
        <ChevronButton
          customFunc={() =>
            setShowDropdown(showDropdown === 'archive' ? null : 'archive')
          }
          text={
            apiFilters.onlyArchived
              ? 'Only archived'
              : apiFilters.getArchived
                ? 'Include archived'
                : 'Exclude archived'
          }
        />

        <DropdownMenu
          className={`-mt-5 rounded-md transition-opacity
            ${showDropdown === 'archive' ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
        >
          <DropdownButton
            text="Only archived modmail"
            show={showDropdown === 'archive'}
            isSelected={apiFilters.onlyArchived}
            customFunc={() => {
              setShowDropdown(null);
              setApiFilters((prev) => ({
                ...prev,
                onlyArchived: true,
                getArchived: true,
              }));
            }}
          />

          <DropdownButton
            text="Include archived modmail"
            show={showDropdown === 'archive'}
            isSelected={apiFilters.getArchived && !apiFilters.onlyArchived}
            customFunc={() => {
              setShowDropdown(null);
              setApiFilters((prev) => ({
                ...prev,
                onlyArchived: false,
                getArchived: true,
              }));
            }}
          />

          <DropdownButton
            text="Exclude archived modmail"
            show={showDropdown === 'archive'}
            isSelected={!apiFilters.getArchived}
            customFunc={() => {
              setShowDropdown(null);
              setApiFilters((prev) => ({
                ...prev,
                onlyArchived: false,
                getArchived: false,
              }));
            }}
          />
        </DropdownMenu>
      </div>

      <div className="relative">
        <ChevronButton
          customFunc={() => setShowDropdown(showDropdown === 'reply' ? null : 'reply')}
          text={
            apiFilters.getReplied ? 'Include replied posts' : 'Exclude replied posts'
          }
        />

        <DropdownMenu
          className={`-mt-5 rounded-md transition-opacity
            ${showDropdown === 'reply' ? 'z-10 opacity-100' : 'z-0 opacity-0'}`}
        >
          <DropdownButton
            text="Include replied posts"
            show={showDropdown === 'reply'}
            isSelected={apiFilters.getReplied}
            customFunc={() => {
              setShowDropdown(null);
              setApiFilters((prev) => ({
                ...prev,
                getReplied: true,
              }));
            }}
          />

          <DropdownButton
            text="Exclude replied posts"
            show={showDropdown === 'reply'}
            isSelected={!apiFilters.getReplied}
            customFunc={() => {
              setShowDropdown(null);
              setApiFilters((prev) => ({
                ...prev,
                getReplied: false,
              }));
            }}
          />
        </DropdownMenu>
      </div>
    </div>
  );
}
