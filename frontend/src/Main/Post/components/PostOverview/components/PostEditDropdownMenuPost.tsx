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
  isSaved: boolean;
  showEditDropdown: string | null;
  isLast?: boolean;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;
  setFetchedUser?: React.Dispatch<React.SetStateAction<UserHistoryItem[] | null>>;
  setPosts?: React.Dispatch<React.SetStateAction<DBPostWithCommunityName[]>>;

  // Edit functions
  deleteFunc: () => void;
  spoilerFunc: () => void;
  matureFunc: () => void;
  removePostFlairFunc: () => void;
  manageSaveFunc: (action: boolean) => void;
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
  isSaved,
  showEditDropdown,
  isLast,
  setShowEditDropdown,
  navigate,
  setFetchedUser,
  setPosts,
  // edit functions
  deleteFunc,
  spoilerFunc,
  matureFunc,
  removePostFlairFunc,
  manageSaveFunc,
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
          isLast={isLast}
          // edit functions
          editFunc={redirectToEdit}
          deleteFunc={deleteFunc}
          spoilerFunc={spoilerFunc}
          matureFunc={matureFunc}
          postFlairFunc={removePostFlairFunc}
          manageSaveFunc={manageSaveFunc}
          isSaved={isSaved}
        />
      ) : (
        <NotUserEllipsis
          hasReported={hasReported}
          token={token}
          id={postId}
          showDropdown={showEditDropdown}
          setShowDropdown={setShowEditDropdown}
          setUserHistory={setFetchedUser}
          setPosts={setPosts}
          isSaved={isSaved}
          manageSaveFunc={manageSaveFunc}
        />
      )}
    </div>
  );
}
