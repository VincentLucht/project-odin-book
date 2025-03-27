import { forwardRef } from 'react';

import EndMessage from '@/components/partials/EndMessage';
import PostOverviewSearchLazy from '@/Main/SearchResults/components/DisplaySearchResults/components/PostOverviewSearchLazy';
import CommunityOverviewLazy from '@/Main/SearchResults/components/DisplaySearchResults/components/CommunityOverviewLazy';
import CommentOverviewSearchLazy from '@/Main/SearchResults/components/DisplaySearchResults/components/CommentOverviewSearchLazy';
import UserOverviewLazy from '@/Main/SearchResults/components/DisplaySearchResults/components/UserOverviewLazy';

import { QueryType } from '@/Main/SearchResults/SearchResults';

interface InfiniteLoaderProps {
  hasMore: boolean;
  loading: boolean;
  safeSearch: boolean;
  isInitialLoad: boolean;
  requestInProgress: boolean;
  queryType: QueryType;
}

const InfiniteLoader = forwardRef<HTMLDivElement, InfiniteLoaderProps>(
  (
    { hasMore, loading, safeSearch, isInitialLoad, requestInProgress, queryType },
    ref,
  ) => {
    const includeMatureTag = safeSearch === false;

    return (
      <div>
        {loading && (
          <>
            {Array.from({ length: isInitialLoad ? 10 : 5 }, (_, i) => {
              const renderedComponent = () => {
                if (queryType === 'posts') {
                  return (
                    <PostOverviewSearchLazy
                      key={i}
                      includeMatureTag={includeMatureTag}
                    />
                  );
                } else if (queryType === 'communities') {
                  return (
                    <CommunityOverviewLazy
                      key={i}
                      includeMatureTag={includeMatureTag}
                    />
                  );
                } else if (queryType === 'comments') {
                  return (
                    <CommentOverviewSearchLazy
                      key={i}
                      includeMatureTag={includeMatureTag}
                    />
                  );
                } else if (queryType === 'people') {
                  return (
                    <UserOverviewLazy key={i} includeMatureTag={includeMatureTag} />
                  );
                }
              };

              return renderedComponent();
            })}
          </>
        )}

        {!hasMore && !loading && requestInProgress === false && <EndMessage />}

        <div ref={ref} className="-mt-[1000px] h-0" />
      </div>
    );
  },
);

InfiniteLoader.displayName = 'InfiniteLoader';

export default InfiniteLoader;
