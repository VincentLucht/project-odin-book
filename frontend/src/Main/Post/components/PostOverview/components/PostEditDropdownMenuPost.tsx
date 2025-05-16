import Ellipsis from '@/components/Interaction/Ellipsis';
import NotUserEllipsis from '@/components/Interaction/NotUserEllipsis';

import { NavigateFunction } from 'react-router-dom';
import { UserHistoryItem } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { DBPostWithCommunityName } from '@/interface/dbSchema';

interface PostEditDropdownMenuPostProps {
  token: string | null;
  isUserPoster: boolean;
  communityName: string;
  postId: string;
  postName: string;
  hasPostFlair: boolean;
  isMature: boolean;
  isSpoiler: boolean;
  hasReported: boolean;
  showEditDropdown: string | null;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;
  setFetchedUser?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;

  // Edit functions
  deleteFunc: () => void;
  spoilerFunc: () => void;
  matureFunc: () => void;
  removePostFlairFunc: () => void;
}

export default function PostEditDropdownMenuPost({
  token,
  isUserPoster,
  communityName,
  postId,
  postName,
  hasPostFlair,
  isMature,
  isSpoiler,
  hasReported,
  showEditDropdown,
  setShowEditDropdown,
  navigate,
  setFetchedUser,
  setPosts,
  // edit functions
  deleteFunc,
  spoilerFunc,
  matureFunc,
  removePostFlairFunc,
}: PostEditDropdownMenuPostProps) {
  const redirectToEdit = () => {
    navigate(`/r/${communityName}/${postId}/${postName}?edit=true`);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {isUserPoster ? (
        <Ellipsis
          isUserSelf={isUserPoster}
          id={postId}
          showDropdown={showEditDropdown}
          setShowDropdown={setShowEditDropdown}
          hasPostFlair={hasPostFlair}
          isSpoiler={isSpoiler}
          isMature={isMature}
          // edit functions
          editFunc={redirectToEdit}
          deleteFunc={deleteFunc}
          spoilerFunc={spoilerFunc}
          matureFunc={matureFunc}
          postFlairFunc={removePostFlairFunc}
        />
      ) : (
        <NotUserEllipsis
          hasSaved={false} // TODO: Implement saved
          hasReported={hasReported}
          token={token}
          id={postId}
          showDropdown={showEditDropdown}
          setShowDropdown={setShowEditDropdown}
          setUserHistory={setFetchedUser}
          setPosts={setPosts}
        />
      )}
    </div>
  );
}
