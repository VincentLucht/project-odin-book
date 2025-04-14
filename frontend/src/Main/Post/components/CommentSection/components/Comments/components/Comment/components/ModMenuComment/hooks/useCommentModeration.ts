import { useCallback } from 'react';

import ModMenuComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/ModMenuComment/ModMenuComment';

import { DBComment, DBCommentWithReplies } from '@/interface/dbSchema';
import { IsModPost } from '@/Main/Post/Post';

/**
 * Traverses the nested comment structure of {@link DBComment} with DFS and uses a cb function to update the comment.
 */
function onCommentModeration(
  comment_id: string,
  updateFn: (comment: DBCommentWithReplies) => DBCommentWithReplies,
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
) {
  function editComment(
    comment_id: string,
    comments: DBCommentWithReplies[],
  ): DBCommentWithReplies[] {
    return comments.map((comment) => {
      // comment found && is root comment
      if (comment.id === comment_id) {
        return updateFn(comment);
      }

      // comment not found &&  has replies
      if (comment.replies.length > 0) {
        const updatedReplies = editComment(comment_id, comment.replies);
        return { ...comment, replies: updatedReplies };
      }

      return comment;
    });
  }

  setComments((prev) => {
    return editComment(comment_id, prev);
  });
}

function createTempModeration(
  action: 'APPROVED' | 'REMOVED',
  commentId: string,
  isMod: Exclude<IsModPost, false>,
) {
  return {
    id: 'tempId',
    action,
    created_at: new Date().toISOString(),
    moderator_id: isMod.user.id,
    comment_id: commentId,
    moderator: {
      user: {
        username: isMod.user.username,
        profile_picture_url: isMod.user.profile_picture_url,
      },
    },
  };
}

/**
 * Hook for on complete functions for Community Posts.
 *
 * Called by {@link ModMenuComment}
 */
export default function useCommentModeration(
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
) {
  const onApproveComplete = useCallback(
    (commentId: string, success: boolean, isMod: IsModPost) => {
      if (!success || !isMod) return;

      return onCommentModeration(
        commentId,
        (comment) => ({
          ...comment,
          moderation: createTempModeration('APPROVED', commentId, isMod),
        }),
        setComments,
      );
    },
    [setComments],
  );

  const onRemoveComplete = useCallback(
    (commentId: string, success: boolean, isMod: IsModPost) => {
      if (!success || !isMod) return;

      return onCommentModeration(
        commentId,
        (comment) => ({
          ...comment,
          moderation: createTempModeration('REMOVED', commentId, isMod),
        }),
        setComments,
      );
    },
    [setComments],
  );

  const onUpdateRemovalReason = useCallback(
    (commentId: string, newReason: string, success: boolean) => {
      if (!success) return;

      return onCommentModeration(
        commentId,
        (comment) => ({
          ...comment,
          moderation: {
            ...comment.moderation,
            reason: newReason,
          },
        }),
        setComments,
      );
    },
    [setComments],
  );

  return { onApproveComplete, onRemoveComplete, onUpdateRemovalReason };
}
