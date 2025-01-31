import { ArrowBigUp } from 'lucide-react';
import { VoteType } from '@/interface/backendTypes';

// TODO: Add transition here + downvote??
interface UpvoteProps {
  isActive: boolean;
  isOtherActive: boolean;
  onVote: (voteType: VoteType) => void;
}

export default function Upvote({ isActive, isOtherActive, onVote }: UpvoteProps) {
  return (
    <button
      className={`group interaction-button-arrow
        ${isActive ? (!isOtherActive ? 'hover-upvote' : 'hover-downvote') : isOtherActive ? 'hover-downvote' : ''}`}
      onClick={() => onVote('UPVOTE')}
    >
      <div className="scale-x-110 scale-y-125 transform rounded-full">
        <ArrowBigUp
          strokeWidth={1.7}
          className={`h-5 w-5
            ${!isActive ? (!isOtherActive ? 'group-hover:text-orange-500' : '') : 'fill-white'}`}
        />
      </div>
    </button>
  );
}
