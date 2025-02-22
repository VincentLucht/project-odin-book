import { useState, useRef } from 'react';
import useFocusLastPosition from '@/hooks/useFocusLastPosition';

import TextareaAutosize from 'react-textarea-autosize';

import handleEditPost from '@/Main/Post/api/edit/handleEditPost';
import handleInputKeyDown from '@/util/handleInputKeyDown';
import { toast } from 'react-toastify';
import { DBPostWithCommunity } from '@/interface/dbSchema';

interface PostEditorProps {
  post: DBPostWithCommunity;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  toggleShow: () => void;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  token: string | null;
}

// TODO: Complete UI (border color => grey, white on focus, buttons)
// TODO: Add Text Editor
export default function PostEditor({
  post,
  setPost,
  toggleShow,
  setIsEditActive,
  token,
}: PostEditorProps) {
  const [editText, setEditText] = useState(post.body);
  const [isSpoiler, setIsSpoiler] = useState(post.is_spoiler);
  const [isMature, setIsMature] = useState(post.is_mature);

  const textareaRef = useRef(null);
  useFocusLastPosition(textareaRef);

  const handleSubmit = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    if (editText.trim()) {
      handleEditPost(
        token,
        post.id,
        editText,
        isSpoiler,
        isMature,
        setIsEditActive,
        setPost,
        post.post_assigned_flair?.[0]?.community_flair_id,
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
              Edit Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
