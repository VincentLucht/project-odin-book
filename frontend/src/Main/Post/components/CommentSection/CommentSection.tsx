import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import Comments from '@/Main/Post/components/CommentSection/components/Comments/Comments';
import AddComment from '@/Main/Post/components/CommentSection/components/AddComment/AddComment';
import LogoLoading from '@/components/Lazy/Logo/LogoLoading';

import handleFetchComments from '@/Main/Post/components/CommentSection/api/handleFetchComments';
import handleFetchReplies from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/MoreRepliesButton/api/handleFetchReplies';
import getBaseURL from '@/Main/Post/components/CommentSection/util/getBaseURL';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { TokenUser } from '@/context/auth/AuthProvider';

interface CommentSectionProps {
  postId: string;
  postName?: string;
  originalPoster: string | null;
  user: TokenUser | null;
  token: string | null;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
}

export default function CommentSection({
  postId,
  postName,
  originalPoster,
  user,
  token,
  setPost,
}: CommentSectionProps) {
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<DBCommentWithReplies[] | null>(null);

  const { parentCommentId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);

    const onComplete = () => setLoading(false);

    if (parentCommentId) {
      handleFetchReplies(token, postId, parentCommentId, setComments, onComplete);
    } else {
      handleFetchComments(postId, token, setComments, onComplete);
    }
  }, [postId, token, parentCommentId]);

  if (loading) {
    return <LogoLoading />;
  }

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
        postName={postName ?? ''}
        originalPoster={originalPoster}
        setComments={setComments}
        setPost={setPost}
      />
    </div>
  );
}
