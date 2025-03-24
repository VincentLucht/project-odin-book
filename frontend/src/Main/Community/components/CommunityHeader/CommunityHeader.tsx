import { useMemo } from 'react';

import handleCommunityMembershipHeader from '@/Main/Community/components/CommunityHeader/api/handleCommunityMembershipHeader';
import handleCreatePostClick from '@/Header/components/CreateButton/util/handleCreatePostClick';

import { PlusIcon } from 'lucide-react';
import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';
import { TokenUser } from '@/context/auth/AuthProvider';
import { NavigateFunction } from 'react-router-dom';

interface CommunityHeaderProps {
  community: FetchedCommunity;
  setCommunity: React.Dispatch<React.SetStateAction<FetchedCommunity | null>>;
  isMember: boolean;
  user: TokenUser | null;
  token: string | null;
  navigate: NavigateFunction;
  pathname: string;
}

export default function CommunityHeader({
  community,
  setCommunity,
  isMember,
  user,
  token,
  navigate,
  pathname,
}: CommunityHeaderProps) {
  const toggleMembership = () => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    void handleCommunityMembershipHeader(
      community,
      user.id,
      token,
      setCommunity,
      isMember,
    );
  };

  const isMod = useMemo(() => {
    if (!user?.id || !community?.community_moderators) return false;

    return (
      community.community_moderators.find((mod) => mod.user.id === user.id) ?? false
    );
  }, [community.community_moderators, user]);

  return (
    <div className="mb-8">
      <div className="my-2 max-h-[128px] max-w-[1072px] overflow-hidden rounded-lg df">
        {community.banner_url_desktop ? (
          <img
            className="h-auto w-full rounded-lg object-contain"
            src={community.banner_url_desktop}
            alt="Community Banner"
          />
        ) : (
          <div className="min-h-[64px] w-full bg-gray-700 text-2xl font-semibold df text-bg-gray"></div>
        )}
      </div>

      <div className="ml-4 flex justify-between">
        <div className="flex">
          <div className="z-10 -mt-10 h-[88px] w-[88px] rounded-full border-4 bg-gray-400 df border-bg-gray">
            {community.profile_picture_url ? (
              <img
                className="rounded-full"
                src={community.profile_picture_url}
                alt="Community Icon"
              />
            ) : (
              <div className="text-4xl font-bold">r/</div>
            )}
          </div>

          <h3 className="ml-2 text-3xl font-bold">r/{community.name}</h3>
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            className="h-[38px] gap-1 !font-medium transparent-btn"
            onClick={() => handleCreatePostClick(pathname, navigate)}
          >
            <PlusIcon className="-ml-2" strokeWidth={1.7} />
            Create Post
          </button>

          {isMod && (
            <button
              className="h-[38px] !font-medium prm-button-blue"
              onClick={() => navigate(`/r/${community.name}/mod/`)}
            >
              Mod tools
            </button>
          )}

          <div className="transition-all">
            {isMember ? (
              <button
                className="h-[38px] max-w-[65px] !px-10 !font-medium transparent-btn"
                onClick={toggleMembership}
              >
                Joined
              </button>
            ) : (
              <button
                className="h-[38px] max-w-[50px] !px-7 !font-medium df prm-button-blue"
                onClick={toggleMembership}
              >
                Join
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
