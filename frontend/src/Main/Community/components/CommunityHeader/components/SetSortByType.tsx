import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';

import getTimeframeText from '@/Main/Community/components/CommunityHeader/components/util/getTimeframeText';

import { SortByType } from '@/Main/Community/Community';
import { TimeFrame } from '@/Main/Community/Community';

interface SetSortByTypeProps {
  sortByType: SortByType | 'relevance';
  setSortByType: (sortBy: SortByType) => void;
  timeframe: TimeFrame;
  setTimeframe: React.Dispatch<React.SetStateAction<TimeFrame>>;
  excludeSortOptions?: boolean;
  mode?: 'community' | 'search' | 'comments';
  safeSearch?: boolean;
  setSafeSearch?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SetSortByType({
  sortByType,
  setSortByType,
  timeframe,
  setTimeframe,
  excludeSortOptions = false,
  mode = 'community',
  safeSearch,
  setSafeSearch,
}: SetSortByTypeProps) {
  const [showDropdown, setShowDropdown] = useState<
    'sortBy' | 'timeframe' | 'safeSearch' | null
  >(null);

  const containerRef = useClickOutside(() => {
    setShowDropdown(null);
  });

  const onSortByClick = (sortBy: SortByType | 'relevance') => {
    setSortByType(sortBy as SortByType);
    setShowDropdown(null);
  };

  const onTimeframeClick = (newTimeframe: TimeFrame) => {
    setTimeframe(newTimeframe);
    setShowDropdown(null);
  };

  const onSafeSearchClick = (safeSearch: boolean) => {
    setSafeSearch && setSafeSearch(safeSearch);
    setShowDropdown(null);
  };

  const sortByDisplay = sortByType.charAt(0).toUpperCase() + sortByType.slice(1);

  const showSortBy = showDropdown === 'sortBy';
  const showTimeframe = showDropdown === 'timeframe';

  return (
    <div ref={containerRef} className={'mb-2 flex w-fit'}>
      {!excludeSortOptions && (
        <div>
          <ChevronButton
            customFunc={() =>
              setShowDropdown((prev) => (prev === 'sortBy' ? null : 'sortBy'))
            }
            text={sortByDisplay}
            className={`${showDropdown === 'sortBy' && 'bg-accent-gray'}`}
          />
          <DropdownMenu
            className={`-mt-5 ${mode === 'community' ? 'w-20' : 'w-[106px]'} rounded-md transition-opacity
            duration-300 df ${showDropdown === 'sortBy' ? 'z-10 opacity-100' : '-z-10 opacity-0'} `}
          >
            <span className="mb-1 cursor-default select-none">Sort by</span>

            {mode === 'community' ? (
              <DropdownButton
                text="Hot"
                show={showSortBy}
                isSelected={sortByType === 'hot'}
                customFunc={() => onSortByClick('hot')}
              />
            ) : mode === 'search' ? (
              <DropdownButton
                text="Relevance"
                show={showSortBy}
                isSelected={sortByType === 'relevance'}
                customFunc={() => onSortByClick('relevance')}
              />
            ) : (
              <></>
            )}

            <DropdownButton
              text="New"
              show={showSortBy}
              isSelected={sortByType === 'new'}
              customFunc={() => onSortByClick('new')}
            />

            <DropdownButton
              text="Top"
              show={showSortBy}
              isSelected={sortByType === 'top'}
              customFunc={() => onSortByClick('top')}
            />
          </DropdownMenu>
        </div>
      )}

      {!excludeSortOptions && (sortByType === 'top' || sortByType === 'relevance') && (
        <div>
          <ChevronButton
            customFunc={() =>
              setShowDropdown((prev) => (prev === 'timeframe' ? null : 'timeframe'))
            }
            text={getTimeframeText(timeframe)}
            className={`!w-fit ${showDropdown === 'timeframe' && 'bg-accent-gray'}`}
          />
          <DropdownMenu
            className={`-mt-5 w-[112px] rounded-md transition-opacity duration-300 df
            ${showDropdown === 'timeframe' ? 'z-10 opacity-100' : '-z-10 opacity-0'} `}
          >
            <span className="mb-1 cursor-default select-none">Sort by</span>

            <DropdownButton
              text="Today"
              show={showTimeframe}
              isSelected={timeframe === 'day'}
              customFunc={() => onTimeframeClick('day')}
            />

            <DropdownButton
              text="This Week"
              show={showTimeframe}
              isSelected={timeframe === 'week'}
              customFunc={() => onTimeframeClick('week')}
            />

            <DropdownButton
              text="This Month"
              show={showTimeframe}
              isSelected={timeframe === 'month'}
              customFunc={() => onTimeframeClick('month')}
            />

            <DropdownButton
              text="This Year"
              show={showTimeframe}
              isSelected={timeframe === 'year'}
              customFunc={() => onTimeframeClick('year')}
            />

            <DropdownButton
              text="All time"
              show={showTimeframe}
              isSelected={timeframe === 'all'}
              customFunc={() => onTimeframeClick('all')}
            />
          </DropdownMenu>
        </div>
      )}

      {mode === 'search' && (
        <div>
          <ChevronButton
            customFunc={() =>
              setShowDropdown((prev) => (prev === 'safeSearch' ? null : 'safeSearch'))
            }
            text={`Safe Search ${safeSearch ? 'On' : 'Off'}`}
            className={`!w-fit ${showDropdown === 'safeSearch' && 'bg-accent-gray'}`}
          />
          <DropdownMenu
            className={`-mt-5 w-[112px] rounded-md transition-opacity duration-300 df
            ${showDropdown === 'safeSearch' ? 'z-10 opacity-100' : '-z-10 opacity-0'} `}
          >
            <DropdownButton
              text="On"
              show={mode === 'search'}
              isSelected={safeSearch}
              customFunc={() => onSafeSearchClick(true)}
            />

            <DropdownButton
              text="Off"
              show={mode === 'search'}
              isSelected={!safeSearch}
              customFunc={() => onSafeSearchClick(false)}
            />
          </DropdownMenu>
        </div>
      )}
    </div>
  );
}
