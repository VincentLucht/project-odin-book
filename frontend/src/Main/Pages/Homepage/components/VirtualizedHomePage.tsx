import { useState, useCallback, useRef, useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';
import { NavigateFunction } from 'react-router-dom';
import { HomepagePost } from '@/Main/Pages/Homepage/Homepage';
import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import { Pagination } from '@/interface/backendTypes';

interface VirtualizedPostOverviewProps {
  posts: HomepagePost[];
  setPosts: React.Dispatch<React.SetStateAction<HomepagePost[]>>;
  userId: string;
  token: string | null;
  navigate: NavigateFunction;
  loadingState: { initial: boolean; fetchMore: boolean };
  loadMore: (isInitialFetch: boolean, cursorId: string) => void;
  pagination: Pagination;
}
export default function VirtualizedHomePage({
  posts,
  setPosts,
  userId,
  token,
  navigate,
  loadingState,
  loadMore,
  pagination,
}: VirtualizedPostOverviewProps) {
  const [showEditDropdown, setShowEditDropdown] = useState<string | null>(null);
  const virtuosoRef = useRef(null);

  const communityPostHandler = useMemo(
    () =>
      new CommunityPostHandler<HomepagePost>(new CommunityPostManager(token), setPosts),
    [token, setPosts],
  );

  const ItemRenderer = useCallback(
    (index: number) => {
      const post = posts[index];
      if (!post) return null;

      return (
        <div data-post-id={post.id}>
          <PostOverview
            post={post}
            community={post.community}
            userId={userId}
            token={token}
            navigate={navigate}
            showEditDropdown={showEditDropdown}
            setShowEditDropdown={setShowEditDropdown}
            deleteFunc={() => {
              const deleteHandler = communityPostHandler.handleDeletePost(post.id);
              return deleteHandler();
            }}
            spoilerFunc={() => {
              const spoilerHandler = communityPostHandler.handleSpoilerFunc(post);
              return spoilerHandler();
            }}
            matureFunc={() => {
              const matureHandler = communityPostHandler.handleMatureFunc(post);
              return matureHandler();
            }}
            removePostFlairFunc={() => {
              const removeFlairHandler = communityPostHandler.handleDeletePostFlair(
                post,
                () =>
                  navigate(`/r/${post.community.name}/${post.id}?edit-post-flair=true`),
              );
              return removeFlairHandler();
            }}
          />
        </div>
      );
    },
    [posts, userId, token, navigate, showEditDropdown, communityPostHandler],
  );

  return (
    <div>
      {loadingState.initial ? (
        <div>
          <LogoLoading className="mt-8" />
        </div>
      ) : posts.length > 0 ? (
        <>
          <Virtuoso
            ref={virtuosoRef}
            data={posts}
            totalCount={posts.length}
            itemContent={(index) => ItemRenderer(index)}
            overscan={200}
            useWindowScroll
            scrollerRef={() => window}
            computeItemKey={(index) => posts[index]?.id || index.toString()}
            endReached={() => {
              if (!loadingState.fetchMore && pagination.hasMore) {
                loadMore(false, pagination.nextCursor);
              }
            }}
          />
          {loadingState.fetchMore && <LogoLoading className="mt-8" />}
        </>
      ) : !pagination.hasMore ? (
        <div>
          No posts to display yet. Join some communities to populate your feed, or be
          the first to create a post!
        </div>
      ) : (
        <div>
          <LogoLoading className="mt-8" />
        </div>
      )}
    </div>
  );
}
