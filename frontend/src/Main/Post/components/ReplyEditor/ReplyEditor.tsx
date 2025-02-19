import { useEffect, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';

import TextareaAutosize from 'react-textarea-autosize';
import { Transition } from '@headlessui/react';

import handlePostComment from '@/Main/Post/components/ReplyEditor/api/post/handlePostComment';
import handleInputKeyDown from '@/util/handleInputKeyDown';
import transitionProps from '@/util/transitionProps';

import { DBPostWithCommunity } from '@/interface/dbSchema';
import { DBCommentWithReplies } from '@/interface/dbSchema';
import { TokenUser } from '@/context/auth/AuthProvider';

interface ReplyEditorProps {
  show: boolean;
  repliesHidden: boolean;
  depth: number;
  toggleShow: (wasSubmitted?: boolean) => void;
  commentText: string;
  setCommentText: React.Dispatch<React.SetStateAction<string>>;
  postId: string;
  commentId: string;
  parentCommentId: string | undefined;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  user: TokenUser | null;
  token: string | null;
  isReply?: boolean;
  hasReply?: boolean;
}

// TODO: Complete UI (border color => grey, white on focus, buttons)
// TODO: Add Text Editor
export default function ReplyEditor({
  show,
  repliesHidden,
  depth,
  toggleShow,
  commentText,
  setCommentText,
  postId,
  commentId,
  parentCommentId,
  setComments,
  setPost,
  user,
  token,
  isReply = false,
  hasReply = false,
}: ReplyEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const ranOnce = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (show) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 1); // ? Small delay to ensure it's mounted bc of Transition component

      if (show && depth >= 8 && !location.pathname.endsWith(commentId)) {
        navigate(`${location.pathname}/${commentId}?reply=${commentId}`);
      }
    }
  }, [show, depth, commentId, location.pathname, navigate]);

  useEffect(() => {
    const replyId = searchParams.get('reply');
    if (commentId === replyId && !ranOnce.current) {
      toggleShow();
      ranOnce.current = true;
    }
  }, [searchParams, commentId, toggleShow]);

  const handleSubmit = () => {
    if (commentText.trim()) {
      void handlePostComment(
        commentText,
        postId,
        parentCommentId,
        user?.id,
        user?.username,
        user?.profile_picture_url as string | undefined,
        token,
        setComments,
        setPost,
        toggleShow,
      );
    }
  };

  return (
    <Transition show={show} {...transitionProps}>
      <div className={`${isReply && 'ml-10'}`}>
        {isReply && hasReply && !repliesHidden && (
          <div
            className="width-[2px] absolute -ml-[19px] -mt-[10px] h-24 border-l-[1px] border-r-[1px]
              border-gray-500"
          ></div>
        )}

        <div className="rounded-[20px] border">
          <TextareaAutosize
            className="w-full rounded-t-[20px] p-2 px-4 text-sm bg-gray focus:outline-none focus:ring-0"
            placeholder="Write your comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) =>
              handleInputKeyDown(e, commentText, setCommentText, handleSubmit)
            }
            ref={textareaRef}
          />

          <div className="flex justify-between p-1 px-2">
            <div></div>

            <div className="flex gap-2">
              <button
                className="!px-3 py-2 text-xs prm-button-red"
                onClick={() => toggleShow()}
              >
                Cancel
              </button>

              <button
                className="!px-3 py-2 text-xs prm-button-blue"
                onClick={() => handleSubmit()}
              >
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  );
}
