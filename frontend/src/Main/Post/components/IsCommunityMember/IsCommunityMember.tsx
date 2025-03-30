import handleCommunityMembership from '@/Main/Community/api/handleCommunityMembership';

import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';
import { NavigateFunction } from 'react-router-dom';

interface IsCommunityMemberProps {
  userMember: {
    user_id: string;
  }[];
  userId: string | undefined;
  token: string | null;
  communityId: string;
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
  navigate: NavigateFunction;
}

export default function IsCommunityMember({
  userMember,
  userId,
  token,
  communityId,
  setFetchedUser,
  navigate,
}: IsCommunityMemberProps) {
  let isMember = false;
  if (userMember.length && userMember[0].user_id === userId) {
    isMember = true;
  }

  const toggleMembership = () => {
    if (!userId || !token) {
      navigate('/login');
      return;
    }

    void handleCommunityMembership(
      communityId,
      userId,
      token,
      setFetchedUser,
      isMember,
    );
  };

  return (
    <div className="transition-all">
      {isMember ? (
        <button className="h-6 text-[13px] transparent-btn" onClick={toggleMembership}>
          Joined
        </button>
      ) : (
        <button
          className="h-6 text-[13px] !font-semibold df prm-button-blue"
          onClick={toggleMembership}
        >
          Join
        </button>
      )}
    </div>
  );
}
