import { useMemo } from 'react';

import { TokenUser } from '@/context/auth/AuthProvider';

export default function useIsModerator<
  Mod extends { is_active: boolean; user: { id: string | number } },
>(user: TokenUser | null, communityModerators: Mod[] | undefined) {
  return useMemo(() => {
    if (!user?.id || !communityModerators) return false;

    const activeModerator = communityModerators.find(
      (mod) => mod.user.id === user.id && mod.is_active,
    );

    return activeModerator?.is_active ? activeModerator : false;
  }, [communityModerators, user]);
}
