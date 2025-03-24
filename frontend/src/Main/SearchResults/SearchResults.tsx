import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useGetSearchState from '@/Main/SearchResults/hooks/useGetSearchState';
import useSearchBy from '@/Main/SearchResults/hooks/useSearchBy';

import SearchResultsSelector from '@/Main/SearchResults/components/SearchResultsSelector';
import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';

import { SortByType } from '@/Main/Community/Community';
import { CommunityTypes, DBCommunity, DBPost, DBUser } from '@/interface/dbSchema';
import DisplaySearchResults from '@/Main/SearchResults/components/DisplaySearchResults/DisplaySearchResults';
import { DBCommentSearch } from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearch';

export type SortByTypeSearch = 'relevance' | 'top' | 'new';
export type QueryType = 'posts' | 'communities' | 'comments' | 'people';

export interface DBPostSearch extends DBPost {
  community: {
    name: string;
    profile_picture_url: string | null;
    is_mature: boolean;
    type: CommunityTypes;
  };
}

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  const {
    query,
    queryType,
    sortByType,
    timeframe,
    safeSearch,
    cursorId,
    setQueryType,
    setSortByType,
    setTimeframe,
    setSafeSearch,
    setCursorId,
  } = useGetSearchState(initialQuery);

  const [posts, setPosts] = useState<DBPostSearch[]>([]);
  const [communities, setCommunities] = useState<DBCommunity[]>([]);
  const [comments, setComments] = useState<DBCommentSearch[]>([]);
  const [users, setUsers] = useState<DBUser[]>([]);

  const { loading, hasMore, loadMore } = useSearchBy(
    query,
    queryType,
    sortByType,
    timeframe,
    safeSearch,
    cursorId,
    setPosts,
    setCommunities,
    setComments,
    setUsers,
    setCursorId,
  );

  const excludeSortOptions =
    queryType === 'posts' || queryType === 'comments' ? false : true;

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div className="w-full max-w-[1072px]">
        <div>
          <SearchResultsSelector queryType={queryType} setQueryType={setQueryType} />

          <div className="relative">
            <SetSortByType
              sortByType={sortByType}
              setSortByType={setSortByType as (sortBy: SortByType) => void}
              timeframe={timeframe}
              setTimeframe={setTimeframe}
              excludeSortOptions={excludeSortOptions}
              mode="search"
              safeSearch={safeSearch}
              setSafeSearch={setSafeSearch}
            />
          </div>

          <DisplaySearchResults
            query={query}
            queryType={queryType}
            posts={posts}
            communities={communities}
            comments={comments}
            users={users}
          />
        </div>
      </div>
    </div>
  );
}
