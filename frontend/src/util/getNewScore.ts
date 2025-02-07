import { VoteType } from '@/interface/backendTypes';

export default function getNewScore(
  currentScore: number,
  voteType: VoteType,
  previousVoteType: VoteType | undefined,
) {
  if (previousVoteType === voteType) {
    // Removing vote
    return previousVoteType === 'UPVOTE' ? currentScore - 1 : currentScore + 1;
  } else {
    // Adding/Changing vote
    if (previousVoteType) {
      return voteType === 'UPVOTE' ? currentScore + 2 : currentScore - 2;
    } else {
      return voteType === 'UPVOTE' ? currentScore + 1 : currentScore - 1;
    }
  }
}
