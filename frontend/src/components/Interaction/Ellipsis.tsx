import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import { EllipsisIcon } from 'lucide-react';

interface EllipsisProps {
  isUserSelf: boolean;
  commentId: string;
  mode?: 'overview' | 'comment';
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Ellipsis({
  isUserSelf,
  commentId,
  mode = 'overview',
  showDropdown,
  setShowDropdown,
  setIsEditActive,
}: EllipsisProps) {
  const divRef = useClickOutside(() => {
    setShowDropdown(null);
  });

  return (
    <div className="relative" ref={divRef}>
      <div
        className={`cursor-pointer px-3 transition-all hover:bg-hover-gray active:bg-active-gray
          ${mode === 'overview' ? 'interaction-button-wrapper' : 'text-gray-400 interaction-button-wrapper-secondary hover:text-white'}`}
        onClick={() =>
          setShowDropdown((prev) => (prev === commentId ? null : commentId))
        }
        onMouseDown={(e) => e.stopPropagation()}
      >
        <EllipsisIcon className={`${mode === 'overview' ? 'h-5 w-5' : 'h-4 w-4'}`} />
      </div>

      <DropdownMenu
        className={`!-left-[216px] !top-9 min-w-[256px] rounded-md text-white transition-all duration-300 df
          ${showDropdown === commentId ? '!z-10 opacity-100' : '!-z-10 opacity-0'} `}
      >
        {isUserSelf ? (
          <div className="w-full" onClick={() => setIsEditActive(true)}>
            <DropdownButton
              text="Edit comment"
              src={''}
              alt="Edit comment"
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={showDropdown === commentId}
            />
          </div>
        ) : (
          <></>
        )}
        {
          <DropdownButton
            text="Save comment"
            src={''}
            alt="Save comment"
            imgClassName="rounded-full border h-[32px] w-[32px]"
            setterFunc={setShowDropdown}
            show={showDropdown === commentId}
          />
        }
        {isUserSelf ? (
          <DropdownButton
            text="Delete comment"
            src={''}
            alt="Delete comment"
            imgClassName="rounded-full border h-[32px] w-[32px]"
            setterFunc={setShowDropdown}
            show={showDropdown === commentId}
          />
        ) : (
          <></>
        )}
      </DropdownMenu>
    </div>
  );
}
