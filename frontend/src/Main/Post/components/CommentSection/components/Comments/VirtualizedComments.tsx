import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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

interface VirtualizedComments {
  comments: DBCommentWithReplies[];
  user: TokenUser | null;
  token: string | null;
  postId: string;
  postName: string;
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
}

export default function VirtualizedComments({
  comments,
  user,
  token,
  postId,
  postName,
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
}: VirtualizedComments) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);
  const virtuosoRef = useRef(null);

  const navigate = useNavigate();

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
      if (!comment) return null;

      return (
        <div data-post-id={comment.id}>
          <Comment
            comment={comment}
            depth={0}
            user={user}
            token={token}
            postId={postId}
            postName={postName}
            originalPoster={originalPoster}
            navigate={navigate}
            onVote={onVote}
            onDelete={onDelete}
            setComments={setComments}
            setPost={setPost}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        </div>
      );
    },
    [
      comments,
      user,
      postId,
      postName,
      originalPoster,
      token,
      setComments,
      setPost,
      onDelete,
      onVote,
      navigate,
      showDropdown,
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
              ref={virtuosoRef}
              data={comments}
              totalCount={comments.length}
              itemContent={(index) => ItemRenderer(index)}
              overscan={200}
              useWindowScroll
              components={{
                Footer: () => (loading ? <LogoLoading className="mt-4" /> : null),
              }}
              endReached={() => {
                if (hasMore && !loading) {
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
