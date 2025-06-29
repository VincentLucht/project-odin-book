import { useMemo } from 'react';

import { TokenUser } from '@/context/auth/AuthProvider';

export default function useIsModerator(
  user: TokenUser | null,
  isModerator: boolean | undefined,
) {
  return useMemo(() => {
    if (!user || !isModerator) return false;

    return isModerator
      ? {
          id: user.id,
          profile_picture_url: user.profile_picture_url ?? '',
          username: user.username,
          is_active: true,
          user_assigned_flair: [],
        }
      : false;
  }, [isModerator, user]);
}
