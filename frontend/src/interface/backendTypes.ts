export type SortBy = 'new' | 'top' | 'hot';

export type SortByUser = 'new' | 'top';

export type VoteType = 'UPVOTE' | 'DOWNVOTE';

export interface Pagination {
  nextCursor: string;
  hasMore: boolean;
}
