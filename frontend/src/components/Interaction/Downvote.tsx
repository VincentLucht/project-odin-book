import { ArrowBigDown } from 'lucide-react';
import { VoteType } from '@/interface/backendTypes';

interface DownvoteProps {
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

export default function Downvote({
  isActive,
  isOtherActive,
  mode = 'overview',
  onVote,
  commentId,
  onVoteComment,
  previousVoteType,
}: DownvoteProps) {
  const isOverview = mode === 'overview';

  const getClassMode = () => {
    if (isOverview) {
      return isActive
        ? !isOtherActive
          ? 'hover-downvote'
          : 'hover-upvote'
        : isOtherActive
          ? 'hover-upvote'
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
        onVote && onVote('DOWNVOTE');
        onVoteComment && onVoteComment(commentId ?? '', 'DOWNVOTE', previousVoteType);
      }}
    >
      <div className="scale-x-110 scale-y-125 transform">
        <ArrowBigDown
          strokeWidth={1.7}
          className={`h-5 w-5 ${!isOverview && 'text-gray-400'}
            ${!isActive ? (!isOtherActive ? 'group-hover:text-purple-500' : 'hover:text-purple-500') : isOverview ? 'fill-white' : 'fill-purple-500 text-purple-500'}`}
        />
      </div>
    </button>
  );
}
