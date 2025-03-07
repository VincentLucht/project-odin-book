import DisplayCommunityType from '@/components/sidebar/DisplayCommunityType';
import DisplayCreationDate from '@/components/sidebar/DisplayCreationDate';
import DisplayMemberCount from '@/components/sidebar/DisplayMemberCount.tsx/DisplayMembercount';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunity';

interface CommunitySidebarProps {
  community: FetchedCommunity;
}

export default function CommunitySidebar({ community }: CommunitySidebarProps) {
  return (
    <div className="sidebar !gap-0 rounded-md bg-black px-4 py-2">
      <div className="font-medium">{community.name}</div>

      <div className="font-light">{community.description}</div>

      <div className="flex flex-col gap-1 py-2">
        <DisplayCreationDate creationDate={community.created_at} />
        <DisplayCommunityType communityType={community.type} />
      </div>

      <DisplayMemberCount memberCount={community.total_members} />
    </div>
  );
}
