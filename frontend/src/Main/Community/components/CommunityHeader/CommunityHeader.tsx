import { PlusIcon } from 'lucide-react';
import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';

interface CommunityHeaderProps {
  community: FetchedCommunity;
}

export default function CommunityHeader({ community }: CommunityHeaderProps) {
  const isMember = true;

  const toggleMembership = () => {
    console.log(community);
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

      <div className="ml-4 flex justify-between">
        <div className="flex">
          <div className="border-bg-gray z-10 -mt-10 h-[88px] w-[88px] rounded-full border-4 bg-gray-400 df">
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
          <button className="transparent-btn h-[38px] gap-1 !font-medium">
            <PlusIcon className="-ml-2" strokeWidth={1.7} />
            Create Post
          </button>

          <div className="transition-all">
            {isMember ? (
              <button
                className="transparent-btn h-[38px] max-w-[65px] !px-10 !font-medium"
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
