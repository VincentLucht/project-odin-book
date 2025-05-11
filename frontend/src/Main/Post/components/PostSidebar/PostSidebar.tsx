import CommunitySidebar from '@/Main/Community/components/CommunitySidebar/CommunitySidebar';

import handleCommunityMembershipHeader from '@/Main/Community/components/CommunityHeader/api/handleCommunityMembershipHeader';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { NavigateFunction } from 'react-router-dom';
import { TokenUser } from '@/context/auth/AuthProvider';
import { DBPostWithCommunity } from '@/interface/dbSchema';

interface PostSidebarProps {
  community: FetchedCommunity | null;
  setPost: React.Dispatch<React.SetStateAction<DBPostWithCommunity | null>>;
  user: TokenUser | null;
  token: string | null;
  navigate: NavigateFunction;
  showMembership: {
    show: boolean;
    isMember: boolean;
  };
  isMod: boolean;
}

export default function PostSidebar({
  community,
  setPost,
  user,
  token,
  navigate,
  showMembership,
  isMod,
}: PostSidebarProps) {
  if (!community) {
    return;
  }

  const toggleMembership = () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    void handleCommunityMembershipHeader(
      community,
      user.id,
      token,
      (newCommunity) =>
        setPost((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            community: newCommunity,
          } as DBPostWithCommunity;
        }),
      showMembership.isMember,
    );
  };

  return (
    <CommunitySidebar
      token={token}
      community={community}
      navigate={navigate}
      showMembership={{
        show: showMembership.show,
        isMember: showMembership.isMember,
        toggleMembership,
      }}
      isMod={isMod}
    />
  );
}
