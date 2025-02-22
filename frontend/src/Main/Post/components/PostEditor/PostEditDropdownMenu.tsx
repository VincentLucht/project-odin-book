import Ellipsis from '@/components/Interaction/Ellipsis';
import Save from '@/components/Interaction/Save';

import confirmDelete from '@/util/confirmDelete';
import handleDeletePost from '@/Main/Post/api/delete/handleDeletePost';
import handleEditPost from '@/Main/Post/api/edit/handleEditPost';

import { toast } from 'react-toastify';
import { DBPostWithCommunity } from '@/interface/dbSchema';

interface PostEditDropdownMenuProps {
  isUserPoster: boolean;
  postId: string;
  token: string | null;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  newBody: string;
  isMature: boolean;
  isSpoiler: boolean;
  community_flair_id: string | null;
}

export default function PostEditDropdownMenu({
  isUserPoster,
  postId,
  token,
  showDropdown,
  setShowDropdown,
  setIsEditActive,
  setPost,
  newBody,
  isMature,
  isSpoiler,
  community_flair_id,
}: PostEditDropdownMenuProps) {
  const deletePost = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    if (confirmDelete('post')) {
      handleDeletePost(postId, token, setPost);
    }
  };

  const addPostFlair = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }
  };

  const addMatureTag = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    handleEditPost(
      token,
      postId,
      newBody,
      isSpoiler,
      true,
      setIsEditActive,
      setPost,
      community_flair_id,
    );
  };

  const addSpoilerTag = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    handleEditPost(
      token,
      postId,
      newBody,
      true,
      isMature,
      setIsEditActive,
      setPost,
      community_flair_id,
    );
  };

  return (
    <div>
      {isUserPoster ? (
        <Ellipsis
          isUserSelf={isUserPoster}
          commentId={postId}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          setIsEditActive={setIsEditActive}
          deleteFunc={deletePost}
          // post flair func
          matureFunc={addMatureTag}
          spoilerFunc={addSpoilerTag}
        />
      ) : (
        <Save isSaved={false} />
      )}
    </div>
  );
}
