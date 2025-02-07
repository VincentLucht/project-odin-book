import { ArrowBigUp } from 'lucide-react';
import { VoteType } from '@/interface/backendTypes';

// TODO: Add transition here + downvote??
interface UpvoteProps {
  isActive: boolean;
  isOtherActive: boolean;
  mode?: 'overview' | 'comment';
  onVote?: (voteType: VoteType) => void;
  commentId?: string;
  onVoteComment?: (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => void;
  previousVoteType?: VoteType | undefined;
}

export default function Upvote({
  isActive,
  isOtherActive,
  mode = 'overview',
  onVote,
  commentId,
  onVoteComment,
  previousVoteType,
}: UpvoteProps) {
  const isOverview = mode === 'overview';

  const getClassMode = () => {
    if (isOverview) {
      return isActive
        ? !isOtherActive
          ? 'hover-upvote'
          : 'hover-downvote'
        : isOtherActive
          ? 'hover-downvote'
          : '';
    } else if (mode === 'comment') {
      return isActive ? (!isOtherActive ? '' : '') : isOtherActive ? '' : '';
    } else {
      return '';
    }
  };

  return (
    <button
      className={`group ${isOverview ? 'interaction-button-arrow' : 'interaction-button-arrow-secondary'}
        ${getClassMode()}`}
      onClick={() => {
        onVote && onVote('UPVOTE');
        onVoteComment && onVoteComment(commentId ?? '', 'UPVOTE', previousVoteType);
      }}
    >
      <div className="scale-x-110 scale-y-125 transform rounded-full">
        <ArrowBigUp
          strokeWidth={1.7}
          className={`h-5 w-5 ${!isOverview && 'text-gray-400'}
            ${!isActive ? (!isOtherActive ? 'group-hover:text-orange-500' : 'group-hover:text-orange-500') : isOverview ? 'fill-white' : 'fill-orange-500 text-orange-500'}`}
        />
      </div>
    </button>
  );
}
