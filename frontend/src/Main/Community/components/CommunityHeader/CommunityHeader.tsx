import MemberShipButton from '@/Main/Global/MemberShipButton';
import { PlusIcon } from 'lucide-react';

import handleCommunityMembershipHeader from '@/Main/Community/components/CommunityHeader/api/handleCommunityMembershipHeader';
import handleCreatePostClick from '@/Header/components/CreateButton/util/handleCreatePostClick';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { TokenUser } from '@/context/auth/AuthProvider';
import { NavigateFunction } from 'react-router-dom';
import { IsMod } from '@/Main/Community/components/Virtualization/VirtualizedPostOverview';

interface CommunityHeaderProps {
  community: FetchedCommunity;
  setCommunity: React.Dispatch<React.SetStateAction<FetchedCommunity | null>>;
  isMember: boolean;
  isMod: IsMod;
  user: TokenUser | null;
  token: string | null;
  navigate: NavigateFunction;
  pathname: string;
}

export default function CommunityHeader({
  community,
  setCommunity,
  isMember,
  isMod,
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

      <div className="ml-4 flex justify-between max-md:flex-col">
        <div className="flex">
          <div
            className="z-10 -mt-10 h-[88px] w-[88px] flex-shrink-0 rounded-full border-4 bg-gray-400 df
              border-bg-gray"
          >
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

          <h3 className="ml-2 break-all text-3xl font-bold">r/{community.name}</h3>

          {(community.type === 'PRIVATE' || community.type === 'RESTRICTED') && (
            <div className="mb-1 flex items-center text-sm text-gray-secondary">
              {community.type === 'PRIVATE' && '(PRIVATE)'}
              {community.type === 'RESTRICTED' && '(RESTRICTED)'}
            </div>
          )}
        </div>

        <div className="ml-3 flex items-center justify-center gap-2 max-md:mt-4 max-md:self-end">
          <button
            className={'h-[38px] gap-1 !font-medium leading-4 transparent-btn'}
            onClick={() => handleCreatePostClick(pathname, navigate)}
          >
            <PlusIcon className="flex-shrink-0 md:-ml-2" strokeWidth={1.7} />
            Create Post
          </button>

          {isMod && (
            <button
              className="min-h-[38px] flex-shrink-0 !font-medium prm-button-blue"
              onClick={() => navigate(`/r/${community.name}/mod/queue`)}
            >
              Mod tools
            </button>
          )}

          <MemberShipButton isMember={isMember} onClick={toggleMembership} />
        </div>
      </div>
    </div>
  );
}
