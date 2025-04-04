import { Comment } from '.prisma/client';

export type TimeFrame = 'day' | 'week' | 'month' | 'year' | 'all';

export type SortBy = 'new' | 'top' | 'hot';

export type SortBySearch = 'relevance' | 'top' | 'new';

export type SortByUser = 'new' | 'top';

export type CommentWithReplies = Comment & {
  replies?: Comment[];
};

export type Pagination = { nextCursor: string | undefined; hasMore: boolean };
