import { useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import notLoggedInError from '@/util/notLoggedInError';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import {
  EllipsisIcon,
  PencilIcon,
  BookmarkIcon,
  BookmarkMinusIcon,
  TrashIcon,
} from 'lucide-react';
import { SquarePenIcon, TagIcon, CircleAlertIcon, BanIcon } from 'lucide-react';

interface EllipsisProps {
  token: string | null;
  isUserSelf: boolean;
  id: string;
  mode?: 'post' | 'comment';
  showDropdown: string | null;
  isLast?: boolean;
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
  isSaved?: boolean;
  manageSaveFunc?: (action: boolean) => void;
}

export default function Ellipsis({
  token,
  isUserSelf,
  id,
  mode = 'post',
  showDropdown,
  isLast,
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
  isSaved,
  manageSaveFunc,
}: EllipsisProps) {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const divRef = useClickOutside(() => {
    setShowDropdown(null);
  }, dropdownRef);

  const show = showDropdown === id;

  return (
    <div className="relative" ref={divRef}>
      <div
        className={`cursor-pointer px-[6px] transition-all interaction-button-wrapper-secondary
          hover:bg-hover-gray active:bg-active-gray md:px-3 ${ mode === 'comment' &&
          'text-gray-400 hover:text-white' }`}
        onClick={() => setShowDropdown((prev) => (prev === id ? null : id))}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {mode === 'post' || mode === 'comment' ? (
          <SquarePenIcon className="h-5 w-5" />
        ) : (
          <EllipsisIcon className="h-[18px] w-[18px]" />
        )}
      </div>

      <DropdownMenu
        className={`!-left-[216px] min-w-[256px] rounded-md text-white transition-opacity duration-300 df
          ${show ? '!z-10 opacity-100' : '!-z-10 opacity-0'} ${
          isLast && mode === 'post'
              ? '!-top-[308px]'
              : isLast && mode === 'comment'
                ? '!-top-[164px]'
                : '!top-9'
          } `}
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
              text={`Edit ${mode}`}
              icon={<PencilIcon className="h-[22px] w-[22px]" />}
              alt={`Edit ${mode}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={show}
            />
          </div>
        ) : (
          <></>
        )}

        {isSaved ? (
          <DropdownButton
            text={`${mode === 'post' ? 'Remove post from saved' : 'Remove comment from saved'}`}
            icon={<BookmarkMinusIcon />}
            alt={`${mode === 'post' ? 'Remove post from saved' : 'Remove comment from saved'}`}
            imgClassName="rounded-full border h-[32px] w-[32px]"
            setterFunc={setShowDropdown}
            customFunc={() => {
              if (!token) {
                notLoggedInError();
                return;
              }
              manageSaveFunc?.(false);
            }}
            show={show}
          />
        ) : (
          <DropdownButton
            text={`${mode === 'post' ? 'Save post' : 'Save comment'}`}
            icon={<BookmarkIcon />}
            alt={`${mode === 'post' ? 'Save post' : 'Save comment'}`}
            imgClassName="rounded-full border h-[32px] w-[32px]"
            setterFunc={setShowDropdown}
            customFunc={() => {
              manageSaveFunc?.(true);
            }}
            show={show}
          />
        )}

        {isUserSelf ? (
          <div
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              deleteFunc(id);
            }}
          >
            <DropdownButton
              text={`Delete ${mode}`}
              icon={<TrashIcon />}
              alt={`Delete ${mode}`}
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
