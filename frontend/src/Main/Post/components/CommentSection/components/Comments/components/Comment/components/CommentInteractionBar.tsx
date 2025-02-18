import Upvote from '@/components/Interaction/Upvote';
import Downvote from '@/components/Interaction/Downvote';
import Reply from '@/components/Interaction/Reply';
import Share from '@/components/Interaction/Share';
import Ellipsis from '@/components/Interaction/Ellipsis';

import handleDeleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/handleDeleteComment';

import { VoteType } from '@/interface/backendTypes';
import { DBCommentWithReplies } from '@/interface/dbSchema';
import { toast } from 'react-toastify';

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
  toggleShow: () => void;
  isUserSelf: boolean;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  isEditActive: boolean;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
}

export default function CommentInteractionBar({
  totalVoteCount,
  userVote,
  commentId,
  isDeleted,
  onVoteComment,
  toggleShow,
  isUserSelf,
  showDropdown,
  setShowDropdown,
  isEditActive,
  setIsEditActive,
  token,
  setComments,
}: CommentInteractionBarProps) {
  const isUpvote = userVote?.voteType === 'UPVOTE';
  const isDownVote = userVote?.voteType === 'DOWNVOTE';

  const deleteComment = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    const willDelete = confirm(
      "Delete comment?\n\nAre you sure you want to delete your comment? You can't undo this.",
    );

    if (!willDelete) {
      return;
    }

    handleDeleteComment(token, commentId, setComments);
  };

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

        <Share mode="comment" commentId={commentId} />

        {!isDeleted && (
          <div>
            <Ellipsis
              isUserSelf={isUserSelf}
              mode="comment"
              commentId={commentId}
              showDropdown={showDropdown}
              setShowDropdown={setShowDropdown}
              setIsEditActive={setIsEditActive}
              deleteFunc={deleteComment}
            />
          </div>
        )}
      </div>
    </div>
  ) : (
    <div className="h-[32px]"></div>
  );
}
