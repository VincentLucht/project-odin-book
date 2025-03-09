import { ReactNode } from 'react';

import formatDate from '@/util/formatDate';

import { CommunityMembership } from '@/interface/dbSchema';
import { CommunityTypes } from '@/interface/dbSchema';

export interface CommunitySideBar {
  id: string;
  name: string;
  description: string | null;
  profile_picture_url: string | null;
  created_at: string;
  is_mature: boolean;
  type: CommunityTypes;
  user_communities: CommunityMembership[];
}

interface PostSidebarProps {
  community: CommunitySideBar | null;
}

// TODO: Make it fixed
// TODO: Add community type icon + created at
export default function PostSidebar({ community }: PostSidebarProps) {
  if (!community) {
    return;
  }

  return (
    <div>
      <div className="community-sidebar">
        <div className="flex items-center justify-between">
          <h3 className="gap-1 text-xl font-semibold text-hidden-ellipsis">
            r/{community.name}
          </h3>

          <div>Is joined?</div>
        </div>

        <div>{community.description}</div>

        <div>
          <div>{formatDate(community.created_at)}</div>

          <div>{community.type as ReactNode}</div>
        </div>
      </div>
    </div>
  );
}
