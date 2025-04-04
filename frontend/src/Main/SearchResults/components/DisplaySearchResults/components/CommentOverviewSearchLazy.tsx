import { useMemo } from 'react';

import Separator from '@/components/Separator';
import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import LazyTags from '@/components/Lazy/LazyTags';

import getBiasedRandomNumber from '@/util/getBiasedRandomNumber';

interface CommentOverviewSearchLazyProps {
  includeMatureTag: boolean;
}

export default function CommentOverviewSearchLazy({
  includeMatureTag,
}: CommentOverviewSearchLazyProps) {
  const randomValues = useMemo(
    () => ({
      communityNameLength: Math.floor(Math.random() * (240 - 50 + 1)) + 50,
      commentLength: Math.floor(Math.random() * 10) + 1,
      usernameLength: Math.floor(Math.random() * (200 - 50 + 1)) + 50,
      postTitleLength: getBiasedRandomNumber(),
      isMature: Math.random() < 0.05,
      isSpoiler: Math.random() < 0.05,
    }),
    [],
  );

  const {
    communityNameLength,
    commentLength,
    usernameLength,
    postTitleLength,
    isMature,
    isSpoiler,
  } = randomValues;

  return (
    <div>
      <Separator className="my-2" />

      <div className="flex cursor-pointer flex-col gap-2 rounded-2xl p-4 text-sm bg-transition-hover">
        <div className="flex items-center gap-1">
          {/* Community PFP */}
          <PFPLazy />

          {/* Community Name */}
          <LazyCompartment width={communityNameLength} />

          {/* Post Creation Date */}
          <LazyCompartment width={82} />
        </div>

        {/* Tags */}
        <LazyTags
          isMature={isMature}
          isSpoiler={isSpoiler}
          includeMatureTag={includeMatureTag}
        />

        {/* Post Title */}
        <LazyCompartment height={26 * postTitleLength} />

        <div className="rounded-xl bg-neutral-950 p-4">
          <div className="flex items-center">
            {/* User PFP */}
            <PFPLazy />

            {/* Username */}
            <LazyCompartment className="ml-1 mr-1" height={20} width={usernameLength} />

            {/* Comment Creation Date */}
            <LazyCompartment height={16} width={82} />
          </div>

          {/* Comment Content */}
          <LazyCompartment className="mt-3" height={20 * commentLength} />

          {/* Votes */}
          <LazyCompartment className="mt-3" width={70} />
        </div>

        <div className="text-xs text-gray-secondary">
          {/* Go To Thread Button */}
          <LazyCompartment className="mb-[6px]" width={77} />

          <div className="flex gap-1">
            {/* Votes */}
            <LazyCompartment height={14} width={60} />
            {/* Comments */}
            <LazyCompartment height={14} width={84} />
          </div>
        </div>
      </div>
    </div>
  );
}
