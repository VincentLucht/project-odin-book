import Ellipsis from '@/components/Interaction/Ellipsis';
import Save from '@/components/Interaction/Save';

import { NavigateFunction } from 'react-router-dom';

interface PostEditDropdownMenuPostProps {
  isUserPoster: boolean;
  communityName: string;
  postId: string;
  postName: string;
  hasPostFlair: boolean;
  isMature: boolean;
  isSpoiler: boolean;
  showEditDropdown: string | null;
  setShowEditDropdown: React.Dispatch<React.SetStateAction<string | null>>;
  navigate: NavigateFunction;

  // Edit functions
  deleteFunc: () => void;
  spoilerFunc: () => void;
  matureFunc: () => void;
  removePostFlairFunc: () => void;
}

export default function PostEditDropdownMenuPost({
  isUserPoster,
  communityName,
  postId,
  postName,
  hasPostFlair,
  isMature,
  isSpoiler,
  showEditDropdown,
  setShowEditDropdown,
  navigate,
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
        <Save isSaved={false} />
      )}
    </div>
  );
}
