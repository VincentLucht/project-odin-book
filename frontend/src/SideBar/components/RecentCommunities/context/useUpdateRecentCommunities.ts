import { useEffect, useCallback, useRef } from 'react';
import useRecentCommunities from '@/Sidebar/components/RecentCommunities/context/useRecentCommunities';

interface CommunityBase {
  id: string;
  name: string;
  profile_picture_url: string | null;
}

/**
 * Hook that updates recent communities when a community is visited
 */
export function useUpdateRecentCommunities<T extends CommunityBase>(
  community: T | null | undefined,
  user: { id: string } | null | undefined,
) {
  const { isLoadingRecentCommunities, setRecentCommunities } = useRecentCommunities();
  const isInitialFetchRef = useRef(true);

  useEffect(() => {
    if (community && isInitialFetchRef.current && !isLoadingRecentCommunities && user) {
      setRecentCommunities((prev) => {
        if (!prev) return prev;

        const recent = prev.find((recent) => recent.community_id === community.id);

        if (!recent) {
          return [
            {
              id: `temp-${new Date().toISOString()}`,
              interacted_at: new Date(),
              community_id: community.id,
              user_id: user.id,
              community: {
                name: community.name,
                profile_picture_url: community.profile_picture_url,
              },
            },
            ...prev.slice(0, 4),
          ];
        }

        const recentWithout = prev.filter(
          (recent) => recent.community_id !== community.id,
        );
        return [recent, ...recentWithout];
      });

      isInitialFetchRef.current = false;
    }
  }, [community, isLoadingRecentCommunities, setRecentCommunities, user]);

  const resetInitialFetch = useCallback(() => {
    isInitialFetchRef.current = true;
  }, []);

  return {
    isInitialFetch: isInitialFetchRef.current,
    resetInitialFetch,
  };
}
