import { CommunityType } from '.prisma/client';

export default function isCommunityTypeValid(input: string) {
  let found = false;
  for (const key in CommunityType) {
    if (CommunityType[key as keyof typeof CommunityType] === input) {
      found = true;
      break;
    }
  }

  if (found) {
    return true;
  }
}
