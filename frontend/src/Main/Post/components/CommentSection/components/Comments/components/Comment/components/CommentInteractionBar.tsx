import Upvote from '@/components/Interaction/Upvote';
import Downvote from '@/components/Interaction/Downvote';
import Reply from '@/components/Interaction/Reply';
import Share from '@/components/Interaction/Share';

import { VoteType } from '@/interface/backendTypes';

interface CommentInteractionBarProps {
  totalVoteCount: number;
  userVote: { hasVoted: boolean; voteType: VoteType | undefined };
  commentId: string;
  onVoteComment: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
  toggleShow: () => void;
}

export default function CommentInteractionBar({
  totalVoteCount,
  userVote,
  commentId,
  onVoteComment,
  toggleShow,
}: CommentInteractionBarProps) {
  const isUpvote = userVote?.voteType === 'UPVOTE';
  const isDownVote = userVote?.voteType === 'DOWNVOTE';

  return (
    <div className="-ml-[2px] pt-1">
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
      </div>
    </div>
  );
}
