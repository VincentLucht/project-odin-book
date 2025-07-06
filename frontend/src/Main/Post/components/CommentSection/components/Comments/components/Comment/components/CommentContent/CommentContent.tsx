import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';

import CommentEditor from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/components/CommentContent/components/CommentEditor';
import RemovalMessage from '@/components/Message/RemovalMessage';
import { Transition } from '@headlessui/react';

import transitionPropsHeight from '@/util/transitionProps';

import { DBCommentModeration, DBCommentWithReplies } from '@/interface/dbSchema';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

interface CommentContentProps {
  comment: {
    id: string;
    content: string;
    moderation: DBCommentModeration;
    is_deleted: boolean;
  };
  isMod: IsMod;
  depth: number;
  isEditActive: boolean;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  token: string | null;
}

export default function CommentContent({
  comment,
  isMod,
  depth,
  isEditActive,
  setIsEditActive,
  setComments,
  token,
}: CommentContentProps) {
  const { id: commentId, content: commentText, is_deleted: isDeleted } = comment;
  const isRemoved = comment?.moderation?.action === 'REMOVED';

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
        <div
          className={`whitespace-pre-line break-all text-sm ${depth === 0 ? 'ml-[5px]' : 'ml-[5px]'}`}
        >
          {isRemoved && !isMod ? (
            <RemovalMessage show={true} type="comment" className="!my-0" />
          ) : isDeleted ? (
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
