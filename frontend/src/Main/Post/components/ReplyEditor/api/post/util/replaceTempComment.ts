import { DBCommentWithReplies } from '@/interface/dbSchema';

export default function replaceTempComment(
  comment: DBCommentWithReplies,
  newCommentId: string,
  tempCommentId: string,
): DBCommentWithReplies {
  // Comment found
  if (comment.id === tempCommentId) {
    const newComment = { ...comment, id: newCommentId };
    return newComment;
  }

  // Has replies
  if (comment.replies && comment.replies.length > 0) {
    return {
      ...comment,
      replies: comment.replies.map((reply) =>
        replaceTempComment(reply, newCommentId, tempCommentId),
      ),
    };
  }

  return comment;
}
