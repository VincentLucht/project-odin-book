import CommunitySidebar from '@/Main/Community/components/CommunitySidebar/CommunitySidebar';

import { FetchedCommunity } from '@/Main/Community/api/fetch/fetchCommunityWithPosts';
import { NavigateFunction } from 'react-router-dom';

interface PostSidebarProps {
  community: FetchedCommunity | null;
  navigate: NavigateFunction;
}

export default function PostSidebar({ community, navigate }: PostSidebarProps) {
  if (!community) {
    return;
  }

  return <CommunitySidebar community={community} navigate={navigate} />;
}
