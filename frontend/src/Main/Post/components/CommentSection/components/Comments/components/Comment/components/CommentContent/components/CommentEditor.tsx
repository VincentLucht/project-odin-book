import { useState, useRef } from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import SpinnerDots from '@/components/SpinnerDots';

import handleInputKeyDown from '@/util/handleInputKeyDown';
import useFocusLastPosition from '@/hooks/useFocusLastPosition';
import handleEditComment from '@/Main/Post/components/CommentSection/components/Comments/components/Comment/api/edit/handleEditComment';
import { toast } from 'react-toastify';

import { DBCommentWithReplies } from '@/interface/dbSchema';

interface CommentEditorProps {
  toggleShow: (wasSubmitted?: boolean) => void;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  commentId: string;
  setComments: React.Dispatch<React.SetStateAction<DBCommentWithReplies[]>>;
  token: string | null;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
}

// TODO: Add Text Editor
export default function CommentEditor({
  toggleShow,
  editText,
  setEditText,
  commentId,
  setComments,
  token,
  setIsEditActive,
}: CommentEditorProps) {
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  useFocusLastPosition(textareaRef);

  const handleSubmit = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    if (editText.trim()) {
      setSubmitting(true);
      handleEditComment(
        token,
        commentId,
        editText,
        setComments,
        setIsEditActive,
        setSubmitting,
      );
    }
  };

  return (
    <div>
      <div className="rounded-[20px] border">
        <TextareaAutosize
          className="w-full rounded-t-[20px] p-2 px-4 text-sm bg-gray focus:outline-none focus:ring-0"
          placeholder="Write your comment..."
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={(e) => handleInputKeyDown(e, editText, setEditText, handleSubmit)}
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
              {submitting ? <SpinnerDots /> : 'Edit Comment'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
