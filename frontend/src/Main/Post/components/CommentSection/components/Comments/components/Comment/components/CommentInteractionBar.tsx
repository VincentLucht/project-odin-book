import Upvote from '@/components/Interaction/Upvote';
import Downvote from '@/components/Interaction/Downvote';
import Reply from '@/components/Interaction/Reply';
import Share from '@/components/Interaction/Share';
import Ellipsis from '@/components/Interaction/Ellipsis';

import { VoteType } from '@/interface/backendTypes';
import { UrlItems } from '@/components/Interaction/Share';

interface CommentInteractionBarProps {
  totalVoteCount: number;
  userVote: { hasVoted: boolean; voteType: VoteType | undefined };
  commentId: string;
  isDeleted: boolean;
  onVoteComment: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
  onDeleteComment: (commentId: string) => void;
  toggleShow: () => void;
  isUserSelf: boolean;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  isEditActive: boolean;
  setIsEditActive?: React.Dispatch<React.SetStateAction<boolean>>;
  urlItems?: UrlItems;
  onEdit?: () => void;
}

export default function CommentInteractionBar({
  totalVoteCount,
  userVote,
  commentId,
  isDeleted,
  onVoteComment,
  onDeleteComment,
  toggleShow,
  isUserSelf,
  showDropdown,
  setShowDropdown,
  isEditActive,
  setIsEditActive,
  urlItems,
  onEdit,
}: CommentInteractionBarProps) {
  const isUpvote = userVote?.voteType === 'UPVOTE';
  const isDownVote = userVote?.voteType === 'DOWNVOTE';

  return !isEditActive ? (
    <div className={`-ml-[2px] pt-1 ${isEditActive ? 'opacity-0' : 'opacity-100'}`}>
      <div className="flex items-center gap-1">
        <div className="flex h-8 items-center gap-1 rounded-full">
          <Upvote
            isActive={userVote.hasVoted && isUpvote}
            isOtherActive={isDownVote}
            mode="comment"
            commentId={commentId}
            onVoteComment={onVoteComment}
            previousVoteType={userVote.voteType}
          />

          {/* TODO: Add: 1000 => 1k... */}
          <span className="-mx-[2px] text-sm font-medium text-gray-400">
            {totalVoteCount <= 0 ? 0 : totalVoteCount}
          </span>

          <Downvote
            isActive={userVote.hasVoted && isDownVote}
            isOtherActive={isUpvote}
            mode="comment"
            commentId={commentId}
            onVoteComment={onVoteComment}
            previousVoteType={userVote.voteType}
          />
        </div>

        <div onClick={() => toggleShow()}>
          <Reply mode="comment" />
        </div>

        <Share mode="comment" commentId={commentId} urlItems={urlItems} />

        {!isDeleted && (
          <div onClick={(e) => e.stopPropagation()}>
            <Ellipsis
              isUserSelf={isUserSelf}
              mode="comment"
              commentId={commentId}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setIsEditActive={setIsEditActive && setIsEditActive}
              deleteFunc={onDeleteComment}
              editFunc={onEdit}
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="h-[32px]"></div>
  );
}
