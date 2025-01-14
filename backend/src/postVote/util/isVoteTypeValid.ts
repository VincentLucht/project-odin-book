import { VoteType } from '@prisma/client/default';

export default function isVoteTypeValid(vote: string) {
  if (!vote) {
    throw new Error('Vote type is required');
  }

  const types = Object.keys(VoteType);

  let isValid = false;
  for (let i = 0; i < types.length; i++) {
    if (types[i] === vote) {
      isValid = true;
    }
  }

  if (!isValid) {
    throw new Error(`Invalid post vote type detected: ${vote}`);
  }

  return true;
}
