import { useState, useCallback, useMemo } from 'react';

import { Virtuoso } from 'react-virtuoso';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';

import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';
import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import CommentOverview from '@/Main/CommentOverview/CommentOverview';

import {
  DBCommentWithCommunityName,
  DBPostWithCommunity,
  DBPostWithCommunityName,
  SavedComment,
} from '@/interface/dbSchema';
import { Pagination } from '@/interface/backendTypes';
import { NavigateFunction } from 'react-router-dom';

interface VirtualizedSavedProps {
  posts: DBPostWithCommunity[];
  setPosts: React.Dispatch<React.SetStateAction<DBPostWithCommunity[]>>;
  comments: SavedComment[];
  setComments: React.Dispatch<React.SetStateAction<SavedComment[]>>;
  typeFilter: 'posts' | 'comments';
  pagination: Pagination;
  loadMore: (cursorId: string, isInitialFetch?: boolean) => void;
  loading: boolean;
  navigate: NavigateFunction;
  token: string | null;
  userId: string | undefined;
}

export default function VirtualizedSaved({
  posts,
  setPosts,
  comments,
  setComments,
  typeFilter,
  pagination,
  loadMore,
  loading,
  navigate,
  token,
  userId,
}: VirtualizedSavedProps) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const communityPostHandler = useMemo(
    () => new CommunityPostHandler(new CommunityPostManager(token), setPosts),
    [setPosts, token],
  );

  const ItemRendererPost = useCallback(
    (index: number) => {
      const post = posts[index];
      const isLast = index === posts.length - 1 && posts.length > 1;
      if (!post) return null;

      return (
        <PostOverview
          key={post.id}
          post={post as DBPostWithCommunityName}
          community={post.community}
          userId={userId}
          token={token}
          setPosts={
            setPosts as React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>
          }
          navigate={navigate}
          showPoster={true}
          showMembership={false}
          showEditDropdown={showDropdown}
          setShowEditDropdown={setShowDropdown}
          showRemovedByModeration={post?.moderation?.action === 'REMOVED'}
          showPrivate={true}
          showCommunityAndUser={true}
          isLast={isLast}
          deleteFunc={() => communityPostHandler.handleDeletePost(post.id)}
          spoilerFunc={() => communityPostHandler.handleSpoilerFunc(post)}
          matureFunc={() => communityPostHandler.handleMatureFunc(post)}
          removePostFlairFunc={() =>
            communityPostHandler.handleDeletePostFlair(post, () =>
              navigate(`/r/${post.community.name}/${post.id}?edit-post-flair=true`),
            )
          }
          manageSaveFunc={(action) => {
            communityPostHandler.handleManageSavedPost(post.id, userId ?? '', action);
            setPosts((prev) => prev.filter((savedPost) => savedPost.id !== post.id));
          }}
        />
      );
    },
    [posts, userId, token, setPosts, navigate, communityPostHandler, showDropdown],
  );

  const ItemRendererComment = useCallback(
    (index: number) => {
      const comment = comments[index];
      const isLast = index === comments.length - 1 && comments.length > 1;
      if (!comment) return null;

      return (
        <CommentOverview
          key={comment.id}
          comment={comment as DBCommentWithCommunityName}
          urlItems={{
            communityName: comment.post.community.name,
            postId: comment.post_id,
            postName: comment.post.title,
          }}
          userId={userId}
          token={token}
          showPrivate={true}
          showRemovedByModeration={comment?.moderation?.action === 'REMOVED'}
          isLast={isLast}
          showCommentDropdown={showDropdown}
          setShowCommentDropdown={setShowDropdown}
          navigate={navigate}
          setSavedComments={setComments}
        />
      );
    },
    [comments, navigate, showDropdown, token, userId, setComments],
  );

  return (
    <Virtuoso
      data={
        (typeFilter === 'posts' ? posts : comments) as (
          | DBPostWithCommunity
          | SavedComment
        )[]
      }
      itemContent={(index) => {
        return typeFilter === 'posts'
          ? ItemRendererPost(index)
          : ItemRendererComment(index);
      }}
      overscan={200}
      useWindowScroll
      scrollerRef={() => window}
      computeItemKey={(index) =>
        typeFilter === 'posts'
          ? posts[index]?.id || index.toString()
          : comments[index]?.id || index.toString()
      }
      endReached={() => {
        if (pagination.hasMore && !loading) {
          loadMore(pagination.nextCursor, loading);
        }
      }}
      components={{
        Footer: () => (
          <EndMessageHandler
            loading={loading}
            hasMorePages={pagination.hasMore}
            dataLength={typeFilter === 'posts' ? posts.length : comments.length}
            logoClassName="mt-2"
            noResultsMessage={
              typeFilter === 'posts'
                ? 'No saved posts found'
                : 'No saved comments found'
            }
          />
        ),
      }}
    />
  );
}
