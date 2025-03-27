import { useMemo } from 'react';

import Separator from '@/components/Separator';
import '@/css/skeleton.css';
import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import getBiasedRandomNumber from '@/util/getBiasedRandomNumber';

interface PostOverviewSearchLazyProps {
  includeMatureTag: boolean;
}

export default function PostOverviewSearchLazy({
  includeMatureTag,
}: PostOverviewSearchLazyProps) {
  const randomValues = useMemo(() => {
    return {
      isSpoiler: Math.random() < 0.1,
      isMature: Math.random() < 0.1,
      communityNameLength: Math.floor(Math.random() * (100 - 20 + 1)) + 20,
      postLines: getBiasedRandomNumber(),
    };
  }, []);

  const { isSpoiler, isMature, communityNameLength, postLines } = randomValues;

  return (
    <div>
      <Separator className="my-[3px]" />

      <div className="flex flex-col gap-2 rounded-2xl px-4 py-6 text-sm">
        <div className="flex items-center gap-1">
          {/* PFP */}
          <PFPLazy />

          {/* Community name */}
          <LazyCompartment width={communityNameLength} />

          {/* Date */}
          <LazyCompartment width={82} />
        </div>

        {/* Tags */}
        {(isSpoiler || (isMature && includeMatureTag)) && (
          <div className="my-1 flex items-center gap-1">
            {isSpoiler && <LazyCompartment height={22} width={77} />}
            {isMature && includeMatureTag && (
              <LazyCompartment
                className="skeleton-rd h-[22px] w-[64px]"
                height={22}
                width={64}
              />
            )}
          </div>
        )}

        {/* Post title */}
        <LazyCompartment height={28 * postLines} />

        <div className="flex gap-1">
          {/* Votes */}
          <LazyCompartment height={14} width={55} />
          {/* Comments */}
          <LazyCompartment height={14} width={84} />
        </div>
      </div>
    </div>
  );
}
