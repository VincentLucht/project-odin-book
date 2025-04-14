import { useCallback } from 'react';

import Post from '@/Main/Post/Post';

import { DBPostWithCommunity } from '@/interface/dbSchema';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

/**
 * Hook for on complete functions for post moderation for a single Community Post.
 *
 * Called by {@link Post}.
 */
export default function usePostModerationPost(
  setPost?: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
) {
  const onApproveComplete = useCallback(
    (postId: string, success: boolean, isMod: IsMod) => {
      if (!success || isMod === false) return;

      setPost?.((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
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
        };
      });
    },
    [setPost],
  );

  const onRemoveComplete = useCallback(
    (postId: string, success: boolean, isMod: IsMod) => {
      if (!success || isMod === false) return;

      setPost?.((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
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
        };
      });
    },
    [setPost],
  );

  const onLockCommentsComplete = useCallback(
    (_postId: string, locked: boolean, success: boolean) => {
      if (!success) return;

      setPost?.((prev) => {
        if (!prev) return prev;
        return { ...prev, lock_comments: locked };
      });
    },
    [setPost],
  );

  const onUpdateNSFWComplete = useCallback(
    (_postId: string, isNSFW: boolean, success: boolean) => {
      if (!success) return;

      setPost?.((prev) => {
        if (!prev) return prev;
        return { ...prev, is_mature: isNSFW };
      });
    },
    [setPost],
  );

  const onUpdateSpoilerComplete = useCallback(
    (_postId: string, isSpoiler: boolean, success: boolean) => {
      if (!success) return;

      setPost?.((prev) => {
        if (!prev) return prev;
        return { ...prev, is_spoiler: isSpoiler };
      });
    },
    [setPost],
  );

  const onUpdateRemovalReason = useCallback(
    (_postId: string, newReason: string, success: boolean) => {
      if (!success) return;

      setPost?.((prev) => {
        if (!prev?.moderation) return prev;
        return {
          ...prev,
          moderation: {
            ...prev.moderation,
            id: prev.moderation.id,
            reason: newReason,
          },
        };
      });
    },
    [setPost],
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
