import { useState, useRef } from 'react';
import useClickOutside from '@/hooks/useClickOutside';

import DropdownMenu from '@/components/DropdownMenu/DropdownMenu';
import DropdownButton from '@/components/DropdownMenu/components/DropdownButton';
import ReportModal from '@/Main/Global/ReportModal';
import { EllipsisIcon, BookmarkIcon, FlagIcon } from 'lucide-react';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import {
  DBPostWithCommunityName,
  DBPostWithCommunity,
  DBCommentWithReplies,
} from '@/interface/dbSchema';

interface NotUserEllipsisProps {
  hasSaved: boolean;
  hasReported: boolean;
  token: string | null;
  id: string;
  mode?: 'post' | 'comment';
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setUserHistory?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  setComments?: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
}

export default function NotUserEllipsis({
  hasSaved = false, // TODO: Remove this and implement
  hasReported,
  token,
  id,
  mode = 'post',
  showDropdown,
  setShowDropdown,
  setUserHistory,
  setPosts,
  setPost,
  setComments,
}: NotUserEllipsisProps) {
  const [showReportModal, setShowReportModal] = useState(false);
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
        onClick={(e) => {
          e.stopPropagation();
          setShowDropdown((prev) => (prev === id ? null : id));
        }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <EllipsisIcon className="h-[18px] w-[18px]" />
      </div>

      <DropdownMenu
        className={`!-left-[216px] !top-9 min-w-[256px] rounded-md text-white transition-opacity
          duration-300 df ${show ? '!z-10 opacity-100' : '!-z-10 opacity-0'} `}
        ref={dropdownRef}
      >
        <DropdownButton
          text={hasSaved ? `Saved ${mode}` : `Save ${mode}`}
          icon={<BookmarkIcon />}
          alt={hasSaved ? `Saved ${mode}` : `Save ${mode}`}
          imgClassName="rounded-full border h-[32px] w-[32px]"
          setterFunc={setShowDropdown}
          show={show}
        />

        <DropdownButton
          text={hasReported ? `Already reported ${mode}` : `Report ${mode}`}
          icon={<FlagIcon />}
          alt={hasReported ? `Already reported ${mode}` : `Report ${mode}`}
          imgClassName="rounded-full border h-8 w-8"
          setterFunc={setShowDropdown}
          customFunc={() => {
            if (hasReported) return;
            setShowReportModal(true);
          }}
          show={show}
        />
      </DropdownMenu>

      <ReportModal
        show={showReportModal}
        onClose={() => setShowReportModal(false)}
        token={token}
        apiData={{ type: mode.toUpperCase() as 'POST' | 'COMMENT', item_id: id }}
        setFetchedUser={setUserHistory}
        setPosts={setPosts}
        setPost={setPost}
        setComments={setComments}
      />
    </div>
  );
}
