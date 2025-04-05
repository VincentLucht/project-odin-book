import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import CommentEditor from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentContent/components/CommentEditor';
import { Transition } from '@headlessui/react';

import transitionPropsHeight from '@/util/transitionProps';

import { DBCommentWithReplies } from '@/interface/dbSchema';

interface CommentContentProps {
  commentId: string;
  commentText: string;
  isDeleted: boolean;
  depth: number;
  isEditActive: boolean;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
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
  const ranOnce = useRef(false);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const toggleShow = useCallback(() => {
    setIsEditActive((prev) => !prev);
  }, [setIsEditActive]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (commentId === editId && !ranOnce.current) {
      toggleShow();
      ranOnce.current = true;
    }
  }, [location, searchParams, commentId, toggleShow]);

  return (
    <div className="relative w-full">
      <Transition show={!isEditActive} {...transitionPropsHeight}>
        <div className={`break-all text-sm ${depth === 0 ? 'ml-[5px]' : 'ml-[5px]'}`}>
          {isDeleted ? (
            <span className="text-gray-400">Comment deleted by user</span>
          ) : (
            commentText
          )}
        </div>
      </Transition>

      <Transition show={isEditActive} {...transitionPropsHeight}>
        <div>
          <CommentEditor
            commentId={commentId}
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
