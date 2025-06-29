import { useMemo } from 'react';
import getBiasedRandomNumber from '@/util/getBiasedRandomNumber';

interface UseSkeletonRandomValuesProps {
  communityNameLengthProp?: number;
}

export function useSkeletonRandomValues({
  communityNameLengthProp,
}: UseSkeletonRandomValuesProps = {}) {
  const randomValues = useMemo(
    () => ({
      communityNameLength:
        communityNameLengthProp ?? Math.floor(Math.random() * (100 - 30 + 1)) + 30,
      commentLength: Math.floor(Math.random() * 10) + 1,
      usernameLength: Math.floor(Math.random() * (170 - 20 + 1)) + 20,
      postTitleLength: getBiasedRandomNumber(),
      contentLines: Math.floor(Math.random() * 10) + 3, // 3-12 randint
      isMature: Math.random() < 0.05,
      isSpoiler: Math.random() < 0.05,
      lastLineRandom: Math.floor(Math.random() * (80 - 20 + 1)) + 20,
      hasFlair: Math.random() < 0.5,
    }),
    [communityNameLengthProp],
  );

  return randomValues;
}
