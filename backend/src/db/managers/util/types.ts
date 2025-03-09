import { Comment } from '.prisma/client';

export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

export type SortBy = 'new' | 'top' | 'hot';

export type SortByUser = 'new' | 'top';

export type CommentWithReplies = Comment & {
  replies?: Comment[];
};
