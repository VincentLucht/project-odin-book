/**
 * Calculates a "hot" score based on upvotes and downvotes, and the time they were created
 */
export default function calculateHotScore(
  upvotes: number,
  downvotes: number,
  created_at: Date,
) {
  let score = upvotes - downvotes;

  // Handle zero score to avoid Math.log(0)
  if (score === 0) {
    score = 0;
  }

  // Calculate absolute value for the logarithm
  const absScore = Math.abs(score);

  // Calculate age in seconds
  const now = new Date();
  const ageInSeconds = (now.getTime() - created_at.getTime()) / 1000;

  // Calculate hot score using reddit-like formula
  const hotScore = Math.log10(Math.max(absScore, 1)) - ageInSeconds / 45000;

  // If the score is negative, make the hot score negative
  return score < 0 ? -hotScore : hotScore;
}
