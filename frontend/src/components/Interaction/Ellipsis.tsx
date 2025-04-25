import { useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import { EllipsisIcon, PencilIcon, BookmarkIcon, TrashIcon } from 'lucide-react';
import { SquarePenIcon, TagIcon, CircleAlertIcon, BanIcon } from 'lucide-react';

interface EllipsisProps {
  isUserSelf: boolean;
  id: string;
  mode?: 'post' | 'comment';
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditActive?: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFunc: (commentId: string) => void;
  hasPostFlair?: boolean;
  postFlairFunc?: () => void;
  isSpoiler?: boolean;
  spoilerFunc?: () => void;
  isMature?: boolean;
  matureFunc?: () => void;
  editFunc?: () => void;
}

export default function Ellipsis({
  isUserSelf,
  id,
  mode = 'post',
  showDropdown,
  setShowDropdown,
  setIsEditActive,
  deleteFunc,
  hasPostFlair,
  postFlairFunc,
  isSpoiler,
  spoilerFunc,
  isMature,
  matureFunc,
  editFunc,
}: EllipsisProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const divRef = useClickOutside(() => {
    setShowDropdown(null);
  }, dropdownRef);

  const show = showDropdown === id;

  return (
    <div className="relative" ref={divRef}>
      <div
        className={`cursor-pointer px-3 transition-all interaction-button-wrapper-secondary
          hover:bg-hover-gray active:bg-active-gray ${ mode === 'comment' &&
          'text-gray-400 hover:text-white' }`}
        onClick={() => setShowDropdown((prev) => (prev === id ? null : id))}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {mode === 'post' ? (
          <SquarePenIcon className="h-5 w-5" />
        ) : (
          <EllipsisIcon className="h-[18px] w-[18px]" />
        )}
      </div>

      <DropdownMenu
        className={`!-left-[216px] !top-9 min-w-[256px] rounded-md text-white transition-opacity
          duration-300 df ${show ? '!z-10 opacity-100' : '!-z-10 opacity-0'} `}
        ref={dropdownRef}
      >
        {isUserSelf ? (
          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditActive && setIsEditActive(true);
              editFunc && editFunc();
            }}
          >
            <DropdownButton
              text={`${mode === 'post' ? 'Edit post' : 'Edit comment'}`}
              icon={<PencilIcon className="h-[22px] w-[22px]" />}
              alt={`${mode === 'post' ? 'Edit post' : 'Edit comment'}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={show}
            />
          </div>
        ) : (
          <></>
        )}
        {
          <DropdownButton
            text={`${mode === 'post' ? 'Save post' : 'Save comment'}`}
            icon={<BookmarkIcon />}
            alt={`${mode === 'post' ? 'Save post' : 'Save comment'}`}
            imgClassName="rounded-full border h-[32px] w-[32px]"
            setterFunc={setShowDropdown}
            show={show}
          />
        }
        {isUserSelf ? (
          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              deleteFunc(id);
            }}
          >
            <DropdownButton
              text={`${mode === 'post' ? 'Delete post' : 'Delete comment'}`}
              icon={<TrashIcon />}
              alt={`${mode === 'post' ? 'Delete post' : 'Delete comment'}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={show}
            />
          </div>
        ) : (
          <></>
        )}

        {/* POST ADDITIONS */}
        {mode === 'post' && isUserSelf ? (
          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              postFlairFunc && postFlairFunc();
            }}
          >
            <DropdownButton
              text={`${hasPostFlair ? 'Remove post flair' : 'Edit Post Flair'}`}
              icon={<TagIcon />}
              alt={`${hasPostFlair ? 'Remove post flair' : 'Edit Post Flair'}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={show}
            />
          </div>
        ) : (
          <></>
        )}

        {mode === 'post' && isUserSelf ? (
          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              matureFunc && matureFunc();
            }}
          >
            <DropdownButton
              text={`${isMature ? 'Remove NSFW tag' : 'Add NSFW tag'}`}
              icon={<BanIcon />}
              alt={`${isMature ? 'Remove NSFW tag' : 'Add NSFW tag'}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={show}
            />
          </div>
        ) : (
          <></>
        )}

        {mode === 'post' && isUserSelf ? (
          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              spoilerFunc && spoilerFunc();
            }}
          >
            <DropdownButton
              text={`${isSpoiler ? 'Remove spoiler tag' : 'Add spoiler tag'}`}
              icon={<CircleAlertIcon />}
              alt={`${isSpoiler ? 'Remove spoiler tag' : 'Add spoiler tag'}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={show}
            />
          </div>
        ) : (
          <></>
        )}
      </DropdownMenu>
    </div>
  );
}
