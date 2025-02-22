import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import { EllipsisIcon, PencilIcon, BookmarkIcon, TrashIcon } from 'lucide-react';
import { SquarePenIcon, TagIcon, CircleAlertIcon, BanIcon } from 'lucide-react';

interface EllipsisProps {
  isUserSelf: boolean;
  commentId: string;
  mode?: 'post' | 'comment';
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditActive?: React.Dispatch<React.SetStateAction<boolean>>;
  deleteFunc: (commentId: string) => void;
  postFlairFunc?: () => void;
  spoilerFunc?: () => void;
  matureFunc?: () => void;
  editFunc?: () => void;
}

export default function Ellipsis({
  isUserSelf,
  commentId,
  mode = 'post',
  showDropdown,
  setShowDropdown,
  setIsEditActive,
  deleteFunc,
  postFlairFunc,
  spoilerFunc,
  matureFunc,
  editFunc,
}: EllipsisProps) {
  const divRef = useClickOutside(() => {
    setShowDropdown(null);
  });

  return (
    <div className="relative" ref={divRef}>
      <div
        className={`cursor-pointer px-3 transition-all interaction-button-wrapper-secondary
          hover:bg-hover-gray active:bg-active-gray ${ mode === 'comment' &&
          'text-gray-400 hover:text-white' }`}
        onClick={() =>
          setShowDropdown((prev) => (prev === commentId ? null : commentId))
        }
        onMouseDown={(e) => e.stopPropagation()}
      >
        {mode === 'post' ? (
          <SquarePenIcon className="h-5 w-5" />
        ) : (
          <EllipsisIcon className="h-[18px] w-[18px]" />
        )}
      </div>

      <DropdownMenu
        className={`!-left-[216px] !top-9 min-w-[256px] rounded-md text-white transition-all duration-300 df
          ${showDropdown === commentId ? '!z-10 opacity-100' : '!-z-10 opacity-0'} `}
      >
        {isUserSelf ? (
          <div
            className="w-full"
            onClick={() => {
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
              show={showDropdown === commentId}
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
            show={showDropdown === commentId}
          />
        }
        {isUserSelf ? (
          <div className="w-full" onClick={() => deleteFunc(commentId)}>
            <DropdownButton
              text={`${mode === 'post' ? 'Delete post' : 'Delete comment'}`}
              icon={<TrashIcon />}
              alt={`${mode === 'post' ? 'Delete post' : 'Delete comment'}`}
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={showDropdown === commentId}
            />
          </div>
        ) : (
          <></>
        )}

        {/* POST ADDITIONS */}
        {mode === 'post' && isUserSelf ? (
          <div className="w-full" onClick={() => postFlairFunc && postFlairFunc()}>
            <DropdownButton
              text="Add Post Flair"
              icon={<TagIcon />}
              alt="Add Post Flair"
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={showDropdown === commentId}
            />
          </div>
        ) : (
          <></>
        )}

        {mode === 'post' && isUserSelf ? (
          <div className="w-full" onClick={() => matureFunc && matureFunc()}>
            <DropdownButton
              text="Add NSFW tag"
              icon={<BanIcon />}
              alt="Add NSFW tag"
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={showDropdown === commentId}
            />
          </div>
        ) : (
          <></>
        )}

        {mode === 'post' && isUserSelf ? (
          <div className="w-full" onClick={() => spoilerFunc && spoilerFunc()}>
            <DropdownButton
              text="Add spoiler tag"
              icon={<CircleAlertIcon />}
              alt="Add spoiler tag"
              imgClassName="rounded-full border h-[32px] w-[32px]"
              setterFunc={setShowDropdown}
              show={showDropdown === commentId}
            />
          </div>
        ) : (
          <></>
        )}
      </DropdownMenu>
    </div>
  );
}
