export default function formatVotes(
  count: number,
  type: 'upvote' | 'downvote' | 'public score' | 'time',
) {
  const label =
    type === 'public score' ? 'public score' : count === 1 ? type : `${type}s`;
  return `${count} ${label}`;
}
