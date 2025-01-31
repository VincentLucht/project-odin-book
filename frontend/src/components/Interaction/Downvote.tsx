import { ArrowBigDown } from 'lucide-react';
import { VoteType } from '@/interface/backendTypes';

interface DownvoteProps {
  isActive: boolean;
  isOtherActive: boolean;
  onVote: (voteType: VoteType) => void;
}

export default function Downvote({ isActive, isOtherActive, onVote }: DownvoteProps) {
  return (
    <button
      className={`group interaction-button-arrow
        ${isActive ? (!isOtherActive ? 'hover-downvote' : 'hover-upvote') : isOtherActive ? 'hover-upvote' : ''}`}
      onClick={() => onVote('DOWNVOTE')}
    >
      <div className="scale-x-110 scale-y-125 transform">
        <ArrowBigDown
          strokeWidth={1.7}
          className={`h-5 w-5
            ${!isActive ? (!isOtherActive ? 'group-hover:text-purple-500' : '') : 'fill-white'}`}
        />
      </div>
    </button>
  );
}
