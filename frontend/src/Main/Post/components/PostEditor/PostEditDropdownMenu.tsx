import Ellipsis from '@/components/Interaction/Ellipsis';
import NotUserEllipsis from '@/components/Interaction/NotUserEllipsis';

import confirmDelete from '@/util/confirmDelete';
import handleDeletePost from '@/Main/Post/api/delete/handleDeletePost';
import handleEditPost from '@/Main/Post/api/edit/handleEditPost';

import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import catchError from '@/util/catchError';
import apiRequest from '@/util/apiRequest';

import { DBPostWithCommunity } from '@/interface/dbSchema';

interface PostEditDropdownMenuProps {
  hasReported: boolean;
  isUserPoster: boolean;
  userId: string | undefined;
  postId: string;
  token: string | null;
  showDropdown: string | null;
  setShowDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  setIsEditActive: React.Dispatch<React.SetStateAction<boolean>>;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  newBody: string;
  isMature: boolean;
  isSpoiler: boolean;
  isSaved: boolean;
  setShowPostFlairSelection: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PostEditDropdownMenu({
  hasReported,
  userId,
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
  isSaved,
  setShowPostFlairSelection,
}: PostEditDropdownMenuProps) {
  const deletePost = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    // TODO: Replace with custom modal
    if (confirmDelete('post')) {
      const toastId = toast.loading('Deleting post...');
      handleDeletePost(postId, token, setPost, toastId);
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
      isMature ? false : true,
      setIsEditActive,
      setPost,
    );
  };

  const addSpoilerTag = () => {
    if (!token) {
      toast.error('You are not logged in');
      return;
    }

    handleEditPost(
      token,
      postId,
      newBody,
      isSpoiler ? false : true,
      isMature,
      setIsEditActive,
      setPost,
    );
  };

  const postFlairFunc = () => {
    setShowPostFlairSelection((v) => !v);
  };

  const manageSavedPost = (action: boolean) => {
    if (!token || !userId) {
      toast.error('You are not logged in');
      return;
    }

    const toastId = toast.loading(
      action ? 'Saving post...' : 'Removing post from saved...',
    );

    const method = action ? 'POST' : 'DELETE';
    apiRequest('/post/save', method, token, { post_id: postId })
      .then(() => {
        setPost((prev) => {
          if (!prev) return prev;
          return action
            ? { ...prev, saved_by: [{ user_id: userId }] }
            : { ...prev, saved_by: [] };
        });

        toastUpdate(
          toastId,
          'success',
          action
            ? 'Successfully saved this post'
            : 'Successfully removed post from saved',
        );
      })
      .catch((error) => {
        toastUpdate(
          toastId,
          'error',
          action ? 'Failed to save post' : 'Failed to remove post from saved',
        );
        catchError(error);
      });
  };

  return (
    <div>
      {isUserPoster ? (
        <Ellipsis
          token={token}
          isUserSelf={isUserPoster}
          id={postId}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          setIsEditActive={setIsEditActive}
          deleteFunc={deletePost}
          postFlairFunc={postFlairFunc}
          isMature={isMature}
          matureFunc={addMatureTag}
          isSpoiler={isSpoiler}
          spoilerFunc={addSpoilerTag}
          isSaved={isSaved}
          manageSaveFunc={manageSavedPost}
        />
      ) : (
        <NotUserEllipsis
          hasReported={hasReported}
          token={token}
          id={postId}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          setPost={setPost}
          isSaved={isSaved}
          manageSaveFunc={manageSavedPost}
        />
      )}
    </div>
  );
}
