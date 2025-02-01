import handleCommunityMembership from '@/Main/Community/api/handleCommunityMembership';

import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';

interface IsCommunityMemberProps {
  userMember: {
    user_id: string;
  }[];
  userId: string;
  token: string;
  communityId: string;
  setFetchedUser: React.Dispatch<React.SetStateAction<UserAndHistory | null>>;
}

export default function IsCommunityMember({
  userMember,
  userId,
  token,
  communityId,
  setFetchedUser,
}: IsCommunityMemberProps) {
  let isMember = false;
  if (userMember.length && userMember[0].user_id === userId) {
    isMember = true;
  }

  const toggleMembership = () =>
    handleCommunityMembership(communityId, userId, token, setFetchedUser, isMember);

  return (
    <div className="transition-all">
      {isMember ? (
        <button
          className="active:text-bg-gray h-6 max-w-[65px] border border-gray-400 text-[13px] !font-semibold
            transition-all duration-200 ease-in-out df prm-button hover:border-white active:scale-95
            active:border-gray-200 active:bg-gray-200"
          onClick={toggleMembership}
        >
          Joined
        </button>
      ) : (
        <button
          className="h-6 max-w-[50px] text-[13px] !font-semibold df prm-button-blue"
          onClick={toggleMembership}
        >
          Join
        </button>
      )}
    </div>
  );
}
