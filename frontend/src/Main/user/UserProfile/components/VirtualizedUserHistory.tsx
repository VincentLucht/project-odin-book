import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Virtuoso } from 'react-virtuoso';
import PostOverview from '@/Main/Post/components/PostOverview/PostOverview';
import CommentOverview from '@/Main/CommentOverview/CommentOverview';
import EndMessageHandler from '@/Main/Global/EndMessageHandler';
import CommunityPostManager from '@/Main/Community/util/CommunityPostManager';
import UserNotFound from '@/components/partials/UserNotFound';

import CommunityPostHandler from '@/Main/Community/handlers/CommunityPostHandler';

import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { UserProfilePagination } from '@/Main/user/UserProfile/UserProfile';
import { TokenUser } from '@/context/auth/AuthProvider';
import { UserHistoryUser } from '@/Main/user/UserProfile/UserProfile';

interface VirtualizedModQueueProps {
  token: string | null;
  fetchedUser: UserHistoryUser | null;
  user: TokenUser | null;
  userHistory: UserHistoryItem[];
  setUserHistory: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  pagination: UserProfilePagination;
  loadMore: (pagination: UserProfilePagination, initialFetch: boolean) => void;
  loading: boolean;
}

export default function VirtualizedUserHistory({
  token,
  fetchedUser,
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

  const communityPostHandler = useMemo(
    () =>
      new CommunityPostHandler<UserHistoryItem & { item_type: 'post' }>(
        new CommunityPostManager(token),
        setUserHistory as React.Dispatch<
          React.SetStateAction<(UserHistoryItem & { item_type: 'post' })[]>
        >,
      ),
    [token, setUserHistory],
  );

  const ItemRenderer = useCallback(
    (index: number) => {
      const item = userHistory[index];
      if (!item) return null;

      const showRemovedByModeration = item.removed_by_moderation === true;
      const isLast = index === userHistory.length - 1 && userHistory.length > 1;

      return (
        <div>
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
              showRemovedByModeration={showRemovedByModeration}
              isLast={isLast}
              // Post edit functions
              deleteFunc={() => communityPostHandler.handleDeletePost(item.id)}
              spoilerFunc={() => communityPostHandler.handleSpoilerFunc(item)}
              matureFunc={() => communityPostHandler.handleMatureFunc(item)}
              removePostFlairFunc={() =>
                communityPostHandler.handleDeletePostFlair(item, () =>
                  navigate(`/r/${item.community.name}/${item.id}?edit-post-flair=true`),
                )
              }
              manageSaveFunc={(action) =>
                communityPostHandler.handleManageSavedPost(
                  item.id,
                  user?.id ?? '',
                  action,
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
              showPrivate={true}
              showRemovedByModeration={showRemovedByModeration}
              isLast={isLast}
              showCommentDropdown={showCommentDropdown}
              setShowCommentDropdown={setShowCommentDropdown}
              navigate={navigate}
              setUserHistory={setUserHistory}
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
      communityPostHandler,
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
        loading={fetchedUser ? loading : false}
        hasMorePages={fetchedUser ? pagination.hasMore : false}
        dataLength={fetchedUser ? userHistory.length : 0}
        endMessageClassName="mt-14"
        noResultsComponent={
          fetchedUser ? (
            <div className="mt-14 text-center">
              <div className="text-xl font-semibold">No activity yet</div>
              <div className="mt-2 text-sm">Check back later for updates</div>
            </div>
          ) : (
            <UserNotFound className="mt-10" />
          )
        }
      />
    </div>
  );
}
