import { useState } from 'react';

import ReplyEditor from '@/Main/Post/components/ReplyEditor/ReplyEditor';

import { TokenUser } from '@/context/auth/AuthProvider';
import { DBPostWithCommunity } from '@/interface/dbSchema';
import { DBCommentWithReplies } from '@/interface/dbSchema';

interface AddCommentProps {
  postId: string;
  user: TokenUser | null;
  token: string | null;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
}

export default function AddComment({
  postId,
  user,
  token,
  setComments,
  setPost,
}: AddCommentProps) {
  const [show, setShow] = useState(false);
  const [commentText, setCommentText] = useState('');

  const toggleShow = (wasSubmitted = false) => {
    if (wasSubmitted) {
      setCommentText('');
      setShow(false);
      return;
    }

    if (commentText) {
      const cancel = confirm(
        'You have a comment in progress, are you sure you want to discard it?',
      );

      if (cancel) {
        setCommentText('');
        setShow(!show);
      }
    } else {
      setShow(!show);
    }
  };

  return (
    <div className="pt-2">
      <div
        className={`flex h-[42px] cursor-text items-center overflow-hidden rounded-[20px] text-sm
          text-gray-400 transition-all duration-300 ease-in-out hover:border-gray-200
          hover:text-gray-200 active:bg-gray-400/20 ${
          show
              ? 'max-h-0 border-0 p-0 opacity-0'
              : 'max-h-20 border border-gray-500 p-2 pl-4 opacity-100'
          }`}
        onClick={() => toggleShow()}
      >
        Add a comment
      </div>

      <ReplyEditor
        show={show}
        depth={0}
        toggleShow={toggleShow}
        commentText={commentText}
        setCommentText={setCommentText}
        postId={postId}
        parentCommentId={undefined}
        setComments={setComments}
        setPost={setPost}
        user={user}
        token={token}
        commentId=""
      />
    </div>
  );
}
