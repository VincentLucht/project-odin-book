import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import Comments from '@/Main/Post/components/CommentSection/components/Comments/Comments';
import AddComment from '@/Main/Post/components/CommentSection/components/AddComment/AddComment';

import handleFetchComments from '@/Main/Post/components/CommentSection/api/handleFetchComments';
import handleFetchReplies from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/MoreRepliesButton/api/handleFetchReplies';
import getBaseURL from '@/Main/Post/components/CommentSection/util/getBaseURL';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { TokenUser } from '@/context/auth/AuthProvider';

interface CommentSectionProps {
  postId: string;
  originalPoster: string;
  user: TokenUser | null;
  token: string | null;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
}

export default function CommentSection({
  postId,
  originalPoster,
  user,
  token,
  setPost,
}: CommentSectionProps) {
  const [comments, setComments] = useState<DBCommentWithReplies[] | null>(null);

  const { parentCommentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (parentCommentId) {
      handleFetchReplies(token, postId, parentCommentId, setComments);
    } else {
      handleFetchComments(postId, token, setComments);
    }
  }, [postId, token, parentCommentId]);

  return (
    <div className="pt-2">
      <AddComment
        postId={postId}
        user={user}
        token={token}
        setComments={setComments}
        setPost={setPost}
      />

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

      <Comments
        comments={comments}
        user={user}
        token={token}
        postId={postId}
        originalPoster={originalPoster}
        setComments={setComments}
        setPost={setPost}
      />
    </div>
  );
}
