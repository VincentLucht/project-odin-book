import { useMemo } from 'react';

import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import LazyTags from '@/components/Lazy/LazyTags';
import LazyPostFlair from '@/components/Lazy/LazyPostFlair';

import getBiasedRandomNumber from '@/util/getBiasedRandomNumber';

interface PostLazyProps {
  communityNameLengthProp: number;
}

export default function PostLazy({ communityNameLengthProp }: PostLazyProps) {
  const randomValues = useMemo(
    () => ({
      communityNameLength: (communityNameLengthProp + 2) * 6,
      commentLength: Math.floor(Math.random() * 10) + 1,
      usernameLength: Math.floor(Math.random() * (170 - 20 + 1)) + 20,
      postTitleLength: getBiasedRandomNumber(),
      contentLines: Math.floor(Math.random() * 10) + 3, // 3-12 randint
      isMature: Math.random() < 0.05,
      isSpoiler: Math.random() < 0.05,
      lastLineRandom: Math.floor(Math.random() * (80 - 20 + 1)) + 20,
    }),
    [communityNameLengthProp],
  );

  const {
    communityNameLength,
    usernameLength,
    postTitleLength,
    contentLines,
    isMature,
    isSpoiler,
    lastLineRandom,
  } = randomValues;

  return (
    <div className="p-4 center-main">
      <div className="center-main-content">
        <div className="flex flex-col">
          <div className="flex gap-1 text-sm">
            <PFPLazy className="!h-9 !w-9" />

            <div className="flex-1 text-xs">
              <div className="flex items-center gap-1">
                {/* Community Name */}
                <LazyCompartment height={20} width={communityNameLength} />

                {/* Creation Date */}
                <LazyCompartment height={14} width={84} />
              </div>

              {/* Username */}
              <LazyCompartment
                height={12}
                width={usernameLength}
                className="mt-[4px]"
              />
            </div>

            {/* Ellipsis */}
            <LazyCompartment height={22} width={22} />
          </div>

          {/* Tags */}
          <LazyTags isMature={isMature} isSpoiler={isSpoiler} className="mb-0 mt-2" />

          {/* Title */}
          <LazyCompartment height={28 * postTitleLength} className="mt-2" />

          {/* Post Flair */}
          <LazyPostFlair className="mt-2" />

          {/* Content */}
          <div className="!mb-4 !mt-2">
            {Array.from({ length: contentLines }).map((_, i) => (
              <div
                key={i}
                className={`skeleton h-6 ${i === 0 && 'rounded-t-md'} ${i === contentLines - 1 && 'rounded-b-md'}
                ${i === contentLines - 2 && 'rounded-bl-none rounded-br-md'} `}
                style={i === contentLines - 1 ? { width: `${lastLineRandom}%` } : {}}
              />
            ))}
          </div>

          {/* Interaction bar */}
          <div className="flex items-center gap-3">
            <LazyCompartment height={28} width={84} className="!rounded-full" />
            <LazyCompartment height={28} width={76} className="!rounded-full" />
            <LazyCompartment height={28} width={85} className="!rounded-full" />
          </div>

          {/* Comment section => separate? */}
        </div>

        {/* TODO: Complete this when done with sidebar */}
        {/* Sidebar */}
      </div>
    </div>
  );
}
