import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

import { Virtuoso } from 'react-virtuoso';
import Comment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/Comment';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';

import handleCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/handleCommentVote';
import handleDeleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/handleDeleteComment';
import confirmDelete from '@/util/confirmDelete';
import { toast } from 'react-toastify';
import handleFetchComments from '@/Main/Post/components/CommentSection/api/handleFetchComments';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import {
  CommentSortBy,
  OnCompleteCommentSection,
} from '@/Main/Post/components/CommentSection/CommentSection';
import { TokenUser } from '@/context/auth/AuthProvider';
import { TimeFrame } from '@/Main/Community/Community';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

interface VirtualizedComments {
  comments: DBCommentWithReplies[];
  post: { id: string; title: string; lock_comments: boolean };
  user: TokenUser | null;
  token: string | null;
  originalPoster: string | null;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  sortByType: CommentSortBy;
  timeframe: TimeFrame;
  cursorId: string;
  hasMore: boolean;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  onComplete: OnCompleteCommentSection;
  isMod: IsMod;
  onModerationCb?: (action: 'APPROVED' | 'REMOVED') => void;
  isMobile: boolean;
  isBelow550px: boolean;
}

export default function VirtualizedComments({
  comments,
  post,
  user,
  token,
  originalPoster,
  setComments,
  setPost,
  sortByType,
  timeframe,
  cursorId,
  hasMore,
  loading,
  setLoading,
  onComplete,
  isMod,
  onModerationCb,
  isMobile,
  isBelow550px,
}: VirtualizedComments) {
  const { id: postId } = post;

  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const [showModDropdown, setShowModDropdown] = useState<string | null>(null);

  const { parentCommentId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (showModDropdown && showDropdown) {
      setShowModDropdown?.(null);
    }
  }, [showModDropdown, showDropdown, setShowModDropdown]);

  const loadMore = () => {
    setLoading(true);
    handleFetchComments(
      postId,
      token,
      sortByType,
      cursorId,
      timeframe,
      false,
      onComplete,
    );
  };

  const onVote = useCallback(
    (commentId: string, voteType: VoteType, previousVoteType: VoteType | undefined) => {
      void handleCommentVote(
        commentId,
        user?.id,
        voteType,
        token,
        setComments,
        previousVoteType,
      );
    },
    [user?.id, token, setComments],
  );

  const onDelete = useCallback(
    (commentId: string) => {
      if (!token) {
        toast.error('You are not logged in');
        return;
      }

      if (confirmDelete('comment')) {
        handleDeleteComment(token, commentId, setComments);
      }
    },
    [token, setComments],
  );

  const ItemRenderer = useCallback(
    (index: number) => {
      const comment = comments[index];

      /* Flattens the comments in order and returns their id's */
      function getAllCommentsInOrder(comments: DBCommentWithReplies[]): string[] {
        const result: string[] = [];

        /* Traverses comments in DFS and saves id's */
        function traverse(commentList: DBCommentWithReplies[]): void {
          for (const comment of commentList) {
            result.push(comment.id);
            if (comment.replies && comment.replies.length > 0) {
              traverse(comment.replies);
            }
          }
        }

        traverse(comments);
        return result;
      }

      const allComments = getAllCommentsInOrder(comments);
      const lastCommentId: string = allComments[allComments.length - 1];
      const penultimateCommentId: string = allComments[allComments.length - 2];

      if (!comment) return null;

      return (
        <Comment
          comment={comment}
          depth={0}
          post={{ ...post }}
          user={user}
          token={token}
          originalPoster={originalPoster}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          showModDropdown={showModDropdown}
          setShowModDropdown={setShowModDropdown}
          isMod={isMod}
          onModerationCb={onModerationCb}
          isMobile={isMobile}
          isBelow550px={isBelow550px}
          lastCommentId={lastCommentId}
          penultimateCommentId={penultimateCommentId}
          navigate={navigate}
          onVote={onVote}
          onDelete={onDelete}
          setComments={setComments}
          setPost={setPost}
        />
      );
    },
    [
      comments,
      user,
      post,
      originalPoster,
      token,
      setComments,
      setPost,
      onDelete,
      onVote,
      navigate,
      showDropdown,
      showModDropdown,
      isMod,
      onModerationCb,
      isMobile,
      isBelow550px,
    ],
  );

  return (
    <div className="my-8">
      {comments.length > 0 ? (
        <>
          <ul
            className="comment"
            style={{ '--left-offset': `${21}px` } as React.CSSProperties}
          >
            <Virtuoso
              data={comments}
              itemContent={(index) => ItemRenderer(index)}
              overscan={200}
              useWindowScroll
              components={{
                Footer: () => (loading ? <LogoLoading className="mt-4" /> : null),
              }}
              endReached={() => {
                if (hasMore && !loading && !parentCommentId) {
                  loadMore();
                }
              }}
            />
          </ul>
        </>
      ) : !loading ? (
        <div>No comments available</div>
      ) : (
        <LogoLoading className="mt-8" />
      )}
    </div>
  );
}
