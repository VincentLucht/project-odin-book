import { RecentCommunityContext } from '@/Sidebar/components/RecentCommunities/context/RecentCommunitiesProvider';
import { useContext } from 'react';

export default function useRecentCommunities() {
  const context = useContext(RecentCommunityContext);
  if (!context) {
    throw new Error(
      'useRecentCommunities must be used within a RecentCommunitiesProvider',
    );
  }
  return context;
}
