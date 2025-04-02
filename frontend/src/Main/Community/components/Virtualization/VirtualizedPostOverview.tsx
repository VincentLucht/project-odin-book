import { useState, useRef, useCallback } from 'react';
import { Virtuoso } from 'react-virtuoso';

import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';

import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import { NavigateFunction } from 'react-router-dom';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

interface VirtualizedPostOverviewProps {
  posts: DBPostWithCommunityName[];
  userId: string | undefined;
  token: string | null;
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
  navigate: NavigateFunction;
  showEditDropdown: string | null;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  communityPostHandler: CommunityPostHandler;
  communityName: string;
}

export default function VirtualizedPostOverview({
  posts,
  userId,
  token,
  setPosts,
  navigate,
  showEditDropdown,
  setShowEditDropdown,
  communityPostHandler,
  communityName,
}: VirtualizedPostOverviewProps) {
  // Keep track of item heights for better rendering
  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});

  // Reference to virtuoso component for potential scrolling operations
  const virtuosoRef = useRef(null);

  // Callback to update item height when it changes
  const handleItemResize = useCallback((postId: string, height: number) => {
    setItemHeights((prev) => {
      if (prev[postId] === height) return prev;
      return { ...prev, [postId]: height };
    });
  }, []);

  // Item content renderer for Virtuoso
  const ItemRenderer = useCallback(
    (index: number) => {
      const post = posts[index];
      if (!post) return null;

      return (
        <div className="post-item-container" data-post-id={post.id}>
          <PostOverview
            key={post.id}
            post={post}
            userId={userId}
            token={token}
            setPosts={setPosts}
            navigate={navigate}
            showPoster={true}
            showMembership={false}
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
                () => navigate(`/r/${communityName}/${post.id}?edit-post-flair=true`),
              );
              return removeFlairHandler();
            }}
            onHeightChange={(height: number) => handleItemResize(post.id, height)}
          />
        </div>
      );
    },
    [
      posts,
      userId,
      token,
      setPosts,
      navigate,
      showEditDropdown,
      setShowEditDropdown,
      communityPostHandler,
      communityName,
      handleItemResize,
    ],
  );

  return (
    <div>
      {posts.length > 0 ? (
        <Virtuoso
          ref={virtuosoRef}
          data={posts}
          totalCount={posts.length}
          itemContent={(index) => ItemRenderer(index)}
          overscan={200} // Pre-render items outside viewport for smoother scrolling
          useWindowScroll
          scrollerRef={() => window}
          computeItemKey={(index) => posts[index]?.id || index.toString()}
          endReached={() => console.log('You reached the end!')}
        />
      ) : (
        <div className="no-posts-message">No posts available</div>
      )}
    </div>
  );
}
