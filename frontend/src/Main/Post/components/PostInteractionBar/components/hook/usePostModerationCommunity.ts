import { useCallback } from 'react';

import PostInteractionBar from '@/Main/Post/components/PostInteractionBar/PostInteractionBar';

import { DBPostWithCommunityName } from '@/interface/dbSchema';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

/**
 * Hook for on complete functions for post moderation for Community Posts.
 *
 * Called by {@link PostInteractionBar}.
 */
export default function usePostModerationCommunity(
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>,
) {
  const onApproveComplete = useCallback(
    (postId: string, success: boolean, isMod: IsMod) => {
      if (!success || isMod === false) return;

      setPosts?.((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                moderation: {
                  id: 'tempId',
                  action: 'APPROVED',
                  created_at: new Date().toISOString(),
                  moderator_id: isMod.user.id,
                  post_id: postId,
                  moderator: {
                    user: {
                      username: isMod.user.username,
                      profile_picture_url: isMod.user.profile_picture_url,
                    },
                  },
                },
              }
            : post,
        ),
      );
    },
    [setPosts],
  );

  const onRemoveComplete = useCallback(
    (postId: string, success: boolean, isMod: IsMod) => {
      if (!success || isMod === false) return;

      setPosts?.((prev) =>
        prev.map((post) =>
          post.id === postId
            ? {
                ...post,
                moderation: {
                  id: 'tempId',
                  action: 'REMOVED',
                  created_at: new Date().toISOString(),
                  moderator_id: isMod.user.id,
                  post_id: postId,
                  moderator: {
                    user: {
                      username: isMod.user.username,
                      profile_picture_url: isMod.user.profile_picture_url,
                    },
                  },
                },
              }
            : post,
        ),
      );
    },
    [setPosts],
  );

  const onLockCommentsComplete = useCallback(
    (postId: string, locked: boolean, success: boolean) => {
      if (!success) return;

      setPosts?.((prev) => {
        return prev.map((post) =>
          post.id === postId ? { ...post, lock_comments: locked } : post,
        );
      });
    },
    [setPosts],
  );

  const onUpdateNSFWComplete = useCallback(
    (postId: string, isNSFW: boolean, success: boolean) => {
      if (!success) return;

      setPosts?.((prev) => {
        return prev.map((post) =>
          post.id === postId ? { ...post, is_mature: isNSFW } : post,
        );
      });
    },
    [setPosts],
  );

  const onUpdateSpoilerComplete = useCallback(
    (postId: string, isSpoiler: boolean, success: boolean) => {
      if (!success) return;

      setPosts?.((prev) => {
        return prev.map((post) =>
          post.id === postId ? { ...post, is_spoiler: isSpoiler } : post,
        );
      });
    },
    [setPosts],
  );

  const onUpdateRemovalReason = useCallback(
    (postId: string, newReason: string, success: boolean) => {
      if (!success) return;
    },
    [setPosts],
  );

  return {
    onApproveComplete,
    onRemoveComplete,
    onLockCommentsComplete,
    onUpdateNSFWComplete,
    onUpdateSpoilerComplete,
    onUpdateRemovalReason,
  };
}
