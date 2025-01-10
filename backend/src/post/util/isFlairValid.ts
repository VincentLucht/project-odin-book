import { Community } from '.prisma/client';
import db from '@/db/db';

export default async function isFlairValid(
  flair_id: string,
  community: Community,
) {
  if (typeof flair_id !== 'string') {
    throw new Error('Invalid flair type detected');
  }

  const flair = await db.communityFlair.getById(community.id, flair_id);
  if (!flair) {
    throw new Error('Flair not found');
  }
  if (!flair.is_assignable_to_posts) {
    throw new Error('Flair is only assignable to posts');
  }

  return true;
}
