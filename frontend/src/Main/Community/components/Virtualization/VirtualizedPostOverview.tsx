import { useEffect, useCallback } from 'react';

import { Virtuoso } from 'react-virtuoso';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';

import handleFetchMorePosts from '@/Main/Community/api/fetch/posts/handleFetchMorePosts';

import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import { NavigateFunction } from 'react-router-dom';
import { CommunityInfo } from '@/Main/Post/components/PostOverview/PostOverview';
import { FetchedPost, SortByType, TimeFrame } from '@/Main/Community/Community';
import { CommunityModerator } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';

export type IsMod = CommunityModerator | false;

interface VirtualizedPostOverviewProps {
  community: CommunityInfo;
  posts: FetchedPost[];
  sortByType: SortByType;
  timeframe: TimeFrame;
  cursorId: string;
  hasMore: boolean;
  loadingMore: boolean;
  setLoadingMore: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: (posts?: FetchedPost[], cursorId?: string, hasMore?: boolean) => void;
  userId: string | undefined;
  token: string | null;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  navigate: NavigateFunction;
  showEditDropdown: string | null;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  communityPostHandler: CommunityPostHandler<FetchedPost>;
  communityName: string;
  isMod: IsMod;
  showModDropdown?: string | null;
  setShowModDropdown?: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function VirtualizedPostOverview({
  community,
  posts,
  sortByType,
  timeframe,
  cursorId,
  hasMore,
  loadingMore,
  setLoadingMore,
  onComplete,
  userId,
  token,
  setPosts,
  navigate,
  showEditDropdown,
  setShowEditDropdown,
  communityPostHandler,
  communityName,
  isMod,
  showModDropdown,
  setShowModDropdown,
}: VirtualizedPostOverviewProps) {
  const loadMore = () => {
    setLoadingMore(true);
    handleFetchMorePosts(
      community.id,
      sortByType,
      timeframe,
      token,
      cursorId,
      onComplete,
    );
  };

  // Handle only one of the 2 dropdowns being open at once
  useEffect(() => {
    if (showModDropdown && showEditDropdown) {
      setShowModDropdown?.(null);
    }
  }, [showModDropdown, showEditDropdown, setShowModDropdown]);

  // Item content renderer for Virtuoso
  const ItemRenderer = useCallback(
    (index: number) => {
      const post = posts[index];
      const isLast = index === posts.length - 1 && posts.length > 1;
      const isLastModeration =
        posts.length > 1 && (index === posts.length - 1 || index === posts.length - 2);

      if (!post) return null;

      return (
        <div data-post-id={post.id}>
          <PostOverview
            key={post.id}
            post={post}
            community={community}
            userId={userId}
            token={token}
            setPosts={setPosts}
            navigate={navigate}
            showPoster={true}
            showMembership={false}
            showEditDropdown={showEditDropdown}
            setShowEditDropdown={setShowEditDropdown}
            showModOptions={isMod !== false}
            isMod={isMod}
            isLast={isLast}
            isLastModeration={isLastModeration}
            showModDropdown={showModDropdown}
            setShowModDropdown={setShowModDropdown}
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
                () => navigate(`/r/${communityName}/${post.id}?edit-post-flair=true`),
              );
              return removeFlairHandler();
            }}
          />
        </div>
      );
    },
    [
      community,
      posts,
      userId,
      token,
      setPosts,
      navigate,
      showEditDropdown,
      setShowEditDropdown,
      communityPostHandler,
      communityName,
      isMod,
      showModDropdown,
      setShowModDropdown,
    ],
  );

  return (
    <Virtuoso
      data={posts}
      totalCount={posts.length}
      itemContent={(index) => ItemRenderer(index)}
      overscan={200} // Pre-render items outside viewport for smoother scrolling
      useWindowScroll
      scrollerRef={() => window}
      computeItemKey={(index) => posts[index]?.id || index.toString()}
      endReached={() => {
        if (hasMore && !loadingMore) {
          loadMore();
        }
      }}
      components={{
        Footer: () => (
          <EndMessageHandler
            loading={loadingMore}
            hasMorePages={hasMore}
            dataLength={posts.length}
            logoClassName="mt-2"
            noResultsMessage="No posts found"
          />
        ),
      }}
    />
  );
}
