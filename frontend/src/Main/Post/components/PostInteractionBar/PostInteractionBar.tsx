import Upvote from '@/components/Interaction/Upvote';
import Downvote from '@/components/Interaction/Downvote';
import Reply from '@/components/Interaction/Reply';
import Share from '@/components/Interaction/Share';
import { VoteType } from '@/interface/backendTypes';

interface PostInteractionBarProps {
  totalVoteCount: number;
  totalCommentCount: number;
  userVote: { hasVoted: boolean; voteType: VoteType | undefined };
  onVote: (voteType: VoteType) => void;
  postRedirect: () => void;
  mode?: 'post';
}

export default function PostInteractionBar({
  totalVoteCount,
  totalCommentCount,
  userVote,
  onVote,
  postRedirect,
  mode,
}: PostInteractionBarProps) {
  const isUpvote = userVote?.voteType === 'UPVOTE';
  const isDownVote = userVote?.voteType === 'DOWNVOTE';

  return (
    <div className="flex items-center gap-3">
      <div
        className={`interaction-button-wrapper
          ${userVote.voteType ? (isUpvote ? '!bg-orange-500' : '!bg-purple-500') : ''}`}
      >
        <Upvote
          isActive={userVote.hasVoted && isUpvote}
          isOtherActive={isDownVote}
          onVote={onVote}
        />

        {/* TODO: Really change this to not visible?? */}
        <span className="-mx-[2px] text-sm font-medium">
          {totalVoteCount <= 0 ? 0 : totalVoteCount}
        </span>

        <Downvote
          isActive={userVote.hasVoted && isDownVote}
          isOtherActive={isUpvote}
          onVote={onVote}
        />
      </div>

      <Reply totalCommentCount={totalCommentCount} onClick={postRedirect} />

      <Share mode={mode && mode} />
    </div>
  );
}
