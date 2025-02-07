import { useEffect, useState } from 'react';

import Comments from '@/Main/Post/components/CommentSection/components/Comments/Comments';

import handleFetchComments from '@/Main/Post/components/CommentSection/api/handleFetchComments';

import { DBCommentWithReplies } from '@/interface/dbSchema';

interface CommentSectionProps {
  postId: string;
  userId: string | undefined;
  token: string | null;
}

export default function CommentSection({ postId, userId, token }: CommentSectionProps) {
  const [comments, setComments] = useState<DBCommentWithReplies[] | null>(null);

  useEffect(() => {
    handleFetchComments(postId, token, setComments);
  }, [postId, token]);

  return (
    <div className="pt-2">
      <div>Write a comment</div>

      <Comments
        comments={comments}
        userId={userId}
        token={token}
        setComments={setComments}
      />
    </div>
  );
}
