import { useNavigate } from 'react-router-dom';

import Comment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/Comment';
import handleCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/handleCommentVote';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';

interface CommentsProps {
  comments: DBCommentWithReplies[] | null;
  userId: string | undefined;
  token: string | null;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
}

export default function Comments({
  comments,
  userId,
  token,
  setComments,
}: CommentsProps) {
  const navigate = useNavigate();

  // TODO: Add proper no comments
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
      userId,
      voteType,
      token,
      setComments,
      previousVoteType,
    );
  };

  return (
    <div>
      {comments.map((comment) => (
        <Comment
          comment={comment}
          depth={0}
          userId={userId}
          navigate={navigate}
          key={comment.id}
          onVote={onVote}
        />
      ))}
    </div>
  );
}
