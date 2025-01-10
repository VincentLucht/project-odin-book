import { PostType } from '@prisma/client/default';

export default function isPostTypeValid(type: string) {
  let isValid = false;
  const types = Object.keys(PostType);
  for (let i = 0; i < types.length; i++) {
    if (types[i] === type) {
      isValid = true;
      break;
    }
  }

  if (!isValid) {
    throw new Error(`Invalid type detected: ${type}`);
  }

  return true;
}
