import { useState } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import ChevronButton from '@/Main/Community/components/CommunityHeader/components/components/ChevronButton';

import getTimeframeText from '@/Main/Community/components/CommunityHeader/components/util/getTimeframeText';

import { SortByType } from '@/Main/Community/Community';
import { TimeFrame } from '@/Main/Community/Community';

interface SetSortByTypeProps {
  sortByType: SortByType;
  setSortByType: React.Dispatch<React.SetStateAction<SortByType>>;
  timeframe: TimeFrame;
  setTimeframe: React.Dispatch<React.SetStateAction<TimeFrame>>;
}

export default function SetSortByType({
  sortByType,
  setSortByType,
  timeframe,
  setTimeframe,
}: SetSortByTypeProps) {
  const [showDropdown, setShowDropdown] = useState<'sortBy' | 'timeframe' | null>(null);

  const containerRef = useClickOutside(() => {
    setShowDropdown(null);
  });

  const onSortByClick = (sortBy: SortByType) => {
    setSortByType(sortBy);
    setShowDropdown(null);
  };

  const onTimeframeClick = (newTimeframe: TimeFrame) => {
    setTimeframe(newTimeframe);
    setShowDropdown(null);
  };

  const sortByDisplay = sortByType.charAt(0).toUpperCase() + sortByType.slice(1);

  const showSortBy = showDropdown === 'sortBy';
  const showTimeframe = showDropdown === 'timeframe';

  return (
    <div ref={containerRef} className={`mb-2 w-fit ${sortByType === 'top' && 'flex'}`}>
      <div>
        <ChevronButton
          customFunc={() =>
            setShowDropdown((prev) => (prev === 'sortBy' ? null : 'sortBy'))
          }
          text={sortByDisplay}
          className={`${showDropdown === 'sortBy' && 'bg-accent-gray'}`}
        />
        <DropdownMenu
          className={`-ml-[10px] -mt-5 w-20 rounded-md transition-opacity duration-300 df
            ${showDropdown === 'sortBy' ? 'z-10 opacity-100' : '-z-10 opacity-0'} `}
        >
          <span className="mb-1 cursor-default select-none">Sort by</span>

          <DropdownButton
            text="Hot"
            show={showSortBy}
            isSelected={sortByType === 'hot'}
            customFunc={() => onSortByClick('hot')}
          />

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

      {sortByType === 'top' && (
        <div>
          <ChevronButton
            customFunc={() =>
              setShowDropdown((prev) => (prev === 'timeframe' ? null : 'timeframe'))
            }
            text={getTimeframeText(timeframe)}
            className={`!w-fit ${showDropdown === 'timeframe' && 'bg-accent-gray'}`}
          />
          <DropdownMenu
            className={`-ml-[10px] -mt-5 w-[112px] rounded-md transition-opacity duration-300 df
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
    </div>
  );
}
