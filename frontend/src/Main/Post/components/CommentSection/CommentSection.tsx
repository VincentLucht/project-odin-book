import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useCompletionHandler, GenericOnComplete } from '@/hooks/useCompletionHandler';

import VirtualizedComments from '@/Main/Post/components/CommentSection/components/Comments/VirtualizedComments';
import AddComment from '@/Main/Post/components/CommentSection/components/AddComment/AddComment';
import SetSortByType from '@/Main/Community/components/CommunityHeader/components/SetSortByType';

import handleFetchComments from '@/Main/Post/components/CommentSection/api/handleFetchComments';
import handleFetchReplies from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/MoreRepliesButton/api/handleFetchReplies';
import getBaseURL from '@/Main/Post/components/CommentSection/util/getBaseURL';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { TokenUser } from '@/context/auth/AuthProvider';
import { TimeFrame } from '@/Main/Community/Community';
import { IsModPost } from '@/Main/Post/Post';

export type CommentSortBy = 'top' | 'new';

export type OnCompleteCommentSection = GenericOnComplete<DBCommentWithReplies>;

interface CommentSectionProps {
  post: { id: string; title: string; lock_comments: boolean };
  originalPoster: string | null;
  user: TokenUser | null;
  token: string | null;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  isMod: IsModPost;
}

export default function CommentSection({
  post,
  originalPoster,
  user,
  token,
  setPost,
  isMod,
}: CommentSectionProps) {
  const { id: postId, lock_comments } = post;

  const [loading, setLoading] = useState(true);
  const [sortByType, setSortByType] = useState<CommentSortBy>('top');
  const [hasMore, setHasMore] = useState(true);
  const [cursorId, setCursorId] = useState('');
  const [timeframe, setTimeframe] = useState<TimeFrame>('all');

  const [comments, setComments] = useState<DBCommentWithReplies[]>([]);

  const { parentCommentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCompletion = useCompletionHandler();
  const onComplete: OnCompleteCommentSection = useCallback(
    (
      comments?: DBCommentWithReplies[],
      cursorId?: string,
      hasMore?: boolean,
      isRefetch = false,
    ) => {
      handleCompletion(
        comments,
        setComments,
        cursorId,
        setCursorId,
        hasMore,
        setHasMore,
        setLoading,
        isRefetch,
      );
    },
    [handleCompletion],
  );

  useEffect(() => {
    setLoading(true);

    if (parentCommentId) {
      handleFetchReplies(token, postId, parentCommentId, setComments, onComplete);
    } else {
      handleFetchComments(postId, token, sortByType, '', timeframe, true, onComplete);
    }
  }, [token, postId, parentCommentId, onComplete, sortByType, timeframe]);

  return (
    <div className="pt-2">
      {!lock_comments && (
        <AddComment
          postId={postId}
          user={user}
          token={token}
          setComments={setComments}
          setPost={setPost}
        />
      )}

      <div className="relative -mb-5 mt-3">
        <SetSortByType
          sortByType={sortByType}
          setSortByType={(sortBy) => setSortByType(sortBy as CommentSortBy)}
          timeframe={timeframe}
          setTimeframe={setTimeframe}
          mode="comments"
        />
      </div>

      {parentCommentId && (
        <div className="-mb-4 mt-4 df">
          <button
            className="text-sm text-blue-400 transition-all duration-1000 hover:underline"
            onClick={() => navigate(getBaseURL(location.pathname))}
          >
            See full discussion
          </button>
        </div>
      )}

      <VirtualizedComments
        comments={comments}
        post={{ ...post }}
        user={user}
        token={token}
        originalPoster={originalPoster}
        setComments={setComments}
        setPost={setPost}
        sortByType={sortByType}
        timeframe={timeframe}
        cursorId={cursorId}
        hasMore={hasMore}
        loading={loading}
        setLoading={setLoading}
        onComplete={onComplete}
        isMod={isMod}
      />
    </div>
  );
}
