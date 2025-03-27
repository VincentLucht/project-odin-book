import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { QueryType } from '@/Main/SearchResults/SearchResults';
import { SortByTypeSearch } from '@/Main/SearchResults/SearchResults';
import { TimeFrame } from '@/Main/Community/Community';

/**
 * Hook for managing changes in the url for search results.
 */
export default function useGetSearchState(initialQuery: string | null) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get values from URL or use defaults
  const query = searchParams.get('q') ?? initialQuery;
  const urlQueryType = (searchParams.get('type') as QueryType) || 'posts';
  const urlSortByType = (searchParams.get('sbt') as SortByTypeSearch) || 'relevance';
  const urlTimeframe = (searchParams.get('t') as TimeFrame) || 'all';
  const urlSafeSearch = searchParams.get('safe') === 'true';
  const urlCursorId = searchParams.get('cursor') ?? '';

  const [sortByType, setSortByType] = useState<SortByTypeSearch>(urlSortByType);
  const [timeframe, setTimeframe] = useState<TimeFrame>(urlTimeframe);
  const [safeSearch, setSafeSearch] = useState(urlSafeSearch);
  const [queryType, setQueryType] = useState<QueryType>(urlQueryType);
  const [cursorId, setCursorId] = useState(urlCursorId);

  // Update URL on query change
  useEffect(() => {
    navigate(`/search/${queryType}${window.location.search}`, { replace: true });

    const newParams = new URLSearchParams();

    if (query) newParams.set('q', query);
    newParams.set('type', queryType);
    newParams.set('sbt', sortByType);
    newParams.set('t', timeframe);
    newParams.set('safe', safeSearch.toString());
    if (cursorId) newParams.set('cursor', cursorId);

    setSearchParams(newParams);
  }, [
    queryType,
    sortByType,
    timeframe,
    safeSearch,
    cursorId,
    query,
    navigate,
    setSearchParams,
  ]);

  return {
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
  };
}
