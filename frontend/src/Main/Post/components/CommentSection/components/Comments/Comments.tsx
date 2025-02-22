import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Comment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/Comment';
import handleCommentVote from '@/Main/Post/components/CommentSection/components/Comments/api/handleCommentVote';
import handleDeleteComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/delete/handleDeleteComment';
import confirmDelete from '@/util/confirmDelete';
import { toast } from 'react-toastify';

import { DBCommentWithReplies } from '@/interface/dbSchema';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { VoteType } from '@/interface/backendTypes';
import { TokenUser } from '@/context/auth/AuthProvider';

interface CommentsProps {
  comments: DBCommentWithReplies[] | null;
  user: TokenUser | null;
  token: string | null;
  postId: string;
  postName: string;
  originalPoster: string | null;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
}

export default function Comments({
  comments,
  user,
  postId,
  postName,
  originalPoster,
  token,
  setComments,
  setPost,
}: CommentsProps) {
  const [showDropdown, setShowDropdown] = useState<string | null>(null);

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

  const onDelete = (commentId: string) => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    if (confirmDelete('post')) {
      handleDeleteComment(token, commentId, setComments);
    }
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
            postName={postName}
            originalPoster={originalPoster}
            navigate={navigate}
            key={comment.id}
            onVote={onVote}
            onDelete={onDelete}
            setComments={setComments}
            setPost={setPost}
            showDropdown={showDropdown}
            setShowDropdown={setShowDropdown}
          />
        ))}
      </ul>
    </div>
  );
}
