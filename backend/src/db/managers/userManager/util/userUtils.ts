import { Comment, Post } from '.prisma/client';
import { SortByUser } from '@/db/managers/util/types';

export const userSelectFields = {
  id: true,
  username: true,
  email: true,
  display_name: true,
  profile_picture_url: true,
  description: true,
  cake_day: true,
  created_at: true,
  deleted_at: true,
  post_karma: true,
  comment_karma: true,
};

export function sortByNew(
  post: Post[],
  comment: Comment[],
  sortBy: SortByUser,
) {
  const combined = [...post, ...comment];

  return sortBy === 'new'
    ? combined.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
    : combined.sort((a, b) => b.total_vote_score - a.total_vote_score);
}
