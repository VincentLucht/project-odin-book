import { useState, useEffect, useCallback, useRef } from 'react';

import handleSearchCommunities from '@/Main/SearchResults/api/communities/handleSearchCommunities';
import handleSearchPosts from '@/Main/SearchResults/api/posts/handleSearchPosts';
import handleSearchComments from '@/Main/SearchResults/api/comments/handleSearchComments';
import handleSearchUsers from '@/Main/SearchResults/api/users/handleSearchUsers';

import { TimeFrame } from '@/Main/Community/Community';
import { QueryType, SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { DBPostSearch } from '@/Main/SearchResults/SearchResults';
import { DBCommunity } from '@/interface/dbSchema';
import { DBCommentSearch } from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearch';
import { DBUser } from '@/interface/dbSchema';

/**
 * Hook for handling fetching search results, handles loading and setting state.
 */
export default function useSearchBy(
  query: string | null,
  queryType: QueryType,
  sortByType: SortByTypeSearch,
  timeframe: TimeFrame,
  safeSearch: boolean,
  cursorId: string,
  setPosts: React.Dispatch<React.SetStateAction<DBPostSearch[]>>,
  setCommunities: React.Dispatch<React.SetStateAction<DBCommunity[]>>,
  setComments: React.Dispatch<React.SetStateAction<DBCommentSearch[]>>,
  setUsers: React.Dispatch<React.SetStateAction<DBUser[]>>,
  setCursorId: React.Dispatch<React.SetStateAction<string>>,
) {
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [searchParamsChanged, setSearchParamsChanged] = useState(false);

  const requestInProgressRef = useRef(false);
  const noResultsRef = useRef(false);

  // Track previous search parameters to detect changes
  const searchParamsRef = useRef({
    query,
    queryType,
    sortByType,
    timeframe,
    safeSearch,
  });

  // Handle parameter changes
  useEffect(() => {
    const prevParams = searchParamsRef.current;
    const hasChanged =
      prevParams.query !== query ||
      prevParams.queryType !== queryType ||
      prevParams.sortByType !== sortByType ||
      prevParams.timeframe !== timeframe ||
      prevParams.safeSearch !== safeSearch;

    if (hasChanged) {
      searchParamsRef.current = {
        query,
        queryType,
        sortByType,
        timeframe,
        safeSearch,
      };

      setSearchParamsChanged(true);
      setCursorId('');
      setHasMore(true);
      if (prevParams.queryType !== queryType) {
        setInitialLoad(true);
        noResultsRef.current = false;
      }
    }
  }, [query, queryType, sortByType, timeframe, safeSearch, setCursorId]);

  const fetchResults = useCallback(
    (isInitialFetch: boolean) => {
      if (!query) return;

      setLoading(true);

      // Use the current cursorId from props, not from closure
      const currentCursorId = isInitialFetch ? '' : cursorId;

      const handleFetchedData = <T>(
        newItems: T[],
        setItems: React.Dispatch<React.SetStateAction<T[]>>,
        isInitialFetch: boolean,
      ) => {
        if (isInitialFetch) {
          newItems.length === 0
            ? (noResultsRef.current = true)
            : (noResultsRef.current = false);

          setItems(newItems);
        } else {
          setItems((prev) => [...prev, ...newItems]);
        }

        requestInProgressRef.current = false;
      };

      const onComplete = (nextCursor: string | null) => {
        setCursorId(nextCursor ?? '');
        setLoading(false);
        setInitialLoad(false);
        setHasMore(!!nextCursor);
        setSearchParamsChanged(false);
      };

      if (queryType === 'posts') {
        handleSearchPosts(
          query,
          sortByType,
          safeSearch,
          (newPosts) => handleFetchedData(newPosts, setPosts, isInitialFetch),
          onComplete,
          timeframe,
          currentCursorId,
        );
      } else if (queryType === 'communities') {
        handleSearchCommunities(
          query,
          timeframe,
          safeSearch,
          (newCommunities) =>
            handleFetchedData(newCommunities, setCommunities, isInitialFetch),
          onComplete,
          currentCursorId,
        );
      } else if (queryType === 'comments') {
        handleSearchComments(
          query,
          sortByType,
          safeSearch,
          (newComments) => handleFetchedData(newComments, setComments, isInitialFetch),
          onComplete,
          timeframe,
          currentCursorId,
        );
      } else if (queryType === 'people') {
        handleSearchUsers(
          query,
          sortByType,
          safeSearch,
          (newUsers) => handleFetchedData(newUsers, setUsers, isInitialFetch),
          onComplete,
          currentCursorId,
        );
      }
    },
    [
      query,
      queryType,
      sortByType,
      safeSearch,
      timeframe,
      cursorId,
      setPosts,
      setCommunities,
      setComments,
      setUsers,
      setCursorId,
    ],
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore && query) {
      requestInProgressRef.current = true;
      fetchResults(false);
    }
  }, [loading, hasMore, query, fetchResults]);

  // Handle initial load + parameter changes
  useEffect(() => {
    if (!query) return;

    // Only reset data and fetch if search parameters changed
    if (searchParamsChanged || initialLoad) {
      if (!initialLoad) {
        setPosts([]);
        setCommunities([]);
        setComments([]);
        setUsers([]);
      }

      // Fetch initial results when search parameters change
      fetchResults(true);
    }
  }, [
    fetchResults,
    initialLoad,
    query,
    searchParamsChanged,
    setPosts,
    setCommunities,
    setComments,
    setUsers,
  ]);

  return {
    loading,
    hasMore,
    initialLoad,
    noResults: noResultsRef.current,
    requestInProgress: requestInProgressRef.current,
    loadMore,
  };
}
