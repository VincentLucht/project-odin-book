import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Virtuoso } from 'react-virtuoso';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import CommentOverview from '@/Main/CommentOverview/CommentOverview';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';
import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import UserProfilePostHandler from '@/Main/user/UserProfile/handlers/UserProfilePostHandler';
import UserNotFound from '@/components/partials/UserNotFound';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { UserProfilePagination } from '@/Main/user/UserProfile/UserProfile';
import { TokenUser } from '@/context/auth/AuthProvider';

interface VirtualizedModQueueProps {
  token: string | null;
  user: TokenUser | null;
  userHistory: UserHistoryItem[];
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  pagination: UserProfilePagination;
  loadMore: (pagination: UserProfilePagination, initialFetch: boolean) => void;
  loading: boolean;
}

export default function VirtualizedUserHistory({
  token,
  user,
  userHistory,
  setUserHistory,
  pagination,
  loadMore,
  loading,
}: VirtualizedModQueueProps) {
  const [showPostDropdown, setShowPostDropdown] = useState<string | null>(null);
  const [showCommentDropdown, setShowCommentDropdown] = useState<string | null>(null);
  const navigate = useNavigate();

  const userProfilePostHandler = useMemo(
    () => new UserProfilePostHandler(new CommunityPostManager(token), setUserHistory),
    [token, setUserHistory],
  );

  const ItemRenderer = useCallback(
    (index: number) => {
      const item = userHistory[index];
      if (!item) return null;

      return (
        <div data-id={item.id + item.created_at.toString()}>
          {item.item_type === 'post' ? (
            <PostOverview
              key={item.id + item.created_at.toString()}
              community={{
                ...item.community,
                type: item.community.type,
              }}
              post={item}
              userId={user?.id}
              token={token}
              setUserHistory={setUserHistory}
              navigate={navigate}
              showEditDropdown={showPostDropdown}
              setShowEditDropdown={setShowPostDropdown}
              showPrivate={true}
              showRemovedByModeration={item?.removed_by_moderation === true}
              // Post edit functions
              deleteFunc={() => userProfilePostHandler.handleDeletePost(item.id)}
              spoilerFunc={() => userProfilePostHandler.handleSpoilerFunc(item)}
              matureFunc={() => userProfilePostHandler.handleMatureFunc(item)}
              removePostFlairFunc={() =>
                userProfilePostHandler.handleDeletePostFlair(item, () =>
                  navigate(`/r/${item.community.name}/${item.id}?edit-post-flair=true`),
                )
              }
            />
          ) : (
            <CommentOverview
              key={item.id + item.created_at.toString()}
              urlItems={{
                communityName: item.post.community.name,
                postId: item.post_id,
                postName: item.post.title,
              }}
              comment={item}
              userId={user?.id}
              token={token}
              showCommentDropdown={showCommentDropdown}
              setShowCommentDropdown={setShowCommentDropdown}
              setUserHistory={setUserHistory}
              navigate={navigate}
            />
          )}
        </div>
      );
    },
    [
      userHistory,
      token,
      user,
      setUserHistory,
      navigate,
      showCommentDropdown,
      showPostDropdown,
      userProfilePostHandler,
    ],
  );

  return (
    <div>
      <Virtuoso
        data={userHistory}
        itemContent={(index) => ItemRenderer(index)}
        overscan={200}
        useWindowScroll
        scrollerRef={() => window}
        computeItemKey={(index) => {
          const item = userHistory[index];
          return item
            ? `${item.item_type}-${item.id}-${item.created_at.toString()}`
            : index.toString();
        }}
        endReached={() => {
          if (pagination.hasMore && !loading) {
            loadMore(pagination, false);
          }
        }}
      />

      <EndMessageHandler
        loading={loading}
        hasMorePages={pagination.hasMore}
        dataLength={userHistory.length}
        endMessageClassName="mt-14"
        noResultsComponent={<UserNotFound />}
      />
    </div>
  );
}
