import comment from '@/Main/Post/components/ReplyEditor/api/post/comment';
import catchError from '@/util/catchError';
import createTempComment from '@/Main/Post/components/ReplyEditor/api/post/util/createTempComment';
import replaceTempComment from '@/Main/Post/components/ReplyEditor/api/post/util/replaceTempComment';
import { toast } from 'react-toastify';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';

export default async function handlePostComment(
  text: string,
  postId: string,
  parentCommentId: string | undefined,
  userId: string | undefined,
  username: string | undefined,
  userPFP: string | undefined,
  token: string | null,
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>,
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>,
  toggleShow: (wasSubmitted?: boolean) => void,
) {
  if (!token || !userId || !username) {
    toast.error('Please log in to comment');
    return;
  }

  let previousPostState: DBPostWithCommunity | undefined = undefined;
  let previousCommentState: DBCommentWithReplies[] | undefined = undefined;

  const tempComment = createTempComment(
    text,
    postId,
    userId,
    username,
    userPFP,
    parentCommentId,
  );

  // Increment comment score + add comment
  const optimisticUpdate = () => {
    setPost((prev) => {
      if (!prev) return prev;
      previousPostState = { ...prev };

      return { ...prev, total_comment_score: prev.total_comment_score + 1 };
    });

    const findComment = (comment: DBCommentWithReplies) => {
      // Comment found
      if (comment.id === tempComment.parent_comment_id) {
        comment.replies = [tempComment, ...(comment.replies || [])];
        return true;
      }

      // has replies - recursively search
      if (comment.replies && comment.replies.length > 0) {
        for (const reply of comment.replies) {
          if (findComment(reply)) {
            return true;
          }
        }
      }

      return false; // Comment not found
    };

    setComments((prev) => {
      if (!prev) return prev;
      previousCommentState = JSON.parse(JSON.stringify(prev)) as DBCommentWithReplies[];

      // Comment is NOT reply
      if (!tempComment.parent_comment_id) {
        return [tempComment, ...prev];
      }

      // Comment IS reply
      return prev.map((comment) => {
        if (comment.replies) {
          findComment(comment);
        }
        return comment;
      });
    });
  };

  optimisticUpdate();
  toggleShow(true);

  try {
    const response = await comment(text, postId, parentCommentId, token);
    const newComment = response.comment;

    // Replace Temp Comment ID with real ID
    setComments((prev) => {
      if (!prev) return prev;

      return prev.map((comment) => {
        if (comment.id === tempComment.id) {
          return { ...comment, id: newComment.id };
        } else {
          if (comment.replies) {
            return replaceTempComment(comment, newComment.id, tempComment.id);
          }
          return comment;
        }
      });
    });
  } catch (error) {
    if (previousPostState) {
      setPost(previousPostState);
    }
    if (previousCommentState) {
      setComments(previousCommentState);
    }
    catchError(error);
  }
}
