import { useMemo } from 'react';
import { TokenUser } from '@/context/auth/AuthProvider';

export default function useIsMember(
  user: TokenUser | null,
  community: { user_communities?: { user_id: string | number }[] } | null | undefined,
) {
  return useMemo(() => {
    if (!user?.id || !community?.user_communities?.length) return false;
    return community.user_communities.some(
      (membership) => membership.user_id === user.id,
    );
  }, [community?.user_communities, user?.id]);
}
