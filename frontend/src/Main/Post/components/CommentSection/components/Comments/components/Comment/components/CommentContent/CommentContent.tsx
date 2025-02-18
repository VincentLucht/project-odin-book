import { useState } from 'react';

import CommentEditor from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentContent/components/CommentEditor';
import { Transition } from '@headlessui/react';

import { DBCommentWithReplies } from '@/interface/dbSchema';

interface CommentContentProps {
  commentId: string;
  commentText: string;
  isDeleted: boolean;
  depth: number;
  isEditActive: boolean;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[] | null>>;
  token: string | null;
}

export default function CommentContent({
  commentId,
  commentText,
  isDeleted,
  depth,
  isEditActive,
  setIsEditActive,
  setComments,
  token,
}: CommentContentProps) {
  const [editText, setEditText] = useState(commentText);

  const toggleShow = () => {
    setIsEditActive((prev) => !prev);
  };

  return (
    <div className="relative w-full">
      <Transition
        show={!isEditActive}
        unmount={true}
        enter="transition-all duration-200"
        enterFrom="opacity-0 max-h-0 overflow-hidden"
        enterTo="opacity-100 max-h-[300px]"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 max-h-[300px]"
        leaveTo="opacity-0 max-h-0"
      >
        <div className={`break-all text-sm ${depth === 0 ? 'ml-[5px]' : 'ml-[5px]'}`}>
          {isDeleted ? (
            <span className="text-gray-400">Comment deleted by user</span>
          ) : (
            commentText
          )}
        </div>
      </Transition>

      <Transition
        show={isEditActive}
        unmount={true}
        enter="transition-all duration-200"
        enterFrom="opacity-0 max-h-0 overflow-hidden"
        enterTo="opacity-100 max-h-[300px]"
        leave="transition-all duration-200"
        leaveFrom="opacity-100 max-h-[300px]"
        leaveTo="opacity-0 max-h-0"
      >
        <div>
          <CommentEditor
            commentId={commentId}
            show={isEditActive}
            toggleShow={toggleShow}
            editText={editText}
            setEditText={setEditText}
            setComments={setComments}
            token={token}
            setIsEditActive={setIsEditActive}
          />
        </div>
      </Transition>
    </div>
  );
}
