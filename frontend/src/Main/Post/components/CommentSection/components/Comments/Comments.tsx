import { useNavigate } from 'react-router-dom';

import Comment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/Comment';
import handleCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/handleCommentVote';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { TokenUser } from '@/context/auth/AuthProvider';

interface CommentsProps {
  comments: DBCommentWithReplies[] | null;
  user: TokenUser | null;
  token: string | null;
  postId: string;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
}

export default function Comments({
  comments,
  user,
  postId,
  token,
  setComments,
  setPost,
}: CommentsProps) {
  const navigate = useNavigate();

  // TODO: Add proper no comments + loading screen
  if (!comments) {
    return <div>No comments here... Feel free to post one!</div>;
  }

  const onVote = (
    commentId: string,
    voteType: VoteType,
    previousVoteType: VoteType | undefined,
  ) => {
    void handleCommentVote(
      commentId,
      user?.id,
      voteType,
      token,
      setComments,
      previousVoteType,
    );
  };

  return (
    <div className="my-8">
      <ul
        className="comment"
        style={{ '--left-offset': `${21}px` } as React.CSSProperties}
      >
        {comments.map((comment) => (
          <Comment
            comment={comment}
            depth={0}
            user={user}
            token={token}
            postId={postId}
            navigate={navigate}
            key={comment.id}
            onVote={onVote}
            setComments={setComments}
            setPost={setPost}
          />
        ))}
      </ul>
    </div>
  );
}
