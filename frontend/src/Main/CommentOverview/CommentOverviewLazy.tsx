import { useMemo } from 'react';
import { useSkeletonRandomValues } from '@/Main/Post/components/Loading/hook/useSkeletonRandomValuesProps';

import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import Separator from '@/components/Separator';

export default function CommentOverviewLazy() {
  const { communityNameLength, usernameLength, lastLineRandom } =
    useSkeletonRandomValues();
  const postTitleLength = useMemo(
    () => Math.floor(Math.random() * (200 - 70 + 1)) + 70,
    [],
  );
  const contentLinesSmaller = useMemo(() => Math.floor(Math.random() * 8) + 1, []);

  return (
    <>
      <Separator />

      <div className="m-1 flex w-full gap-1 p-3">
        <PFPLazy />

        <div className="flex w-full flex-col gap-1">
          <div className="mt-1 flex items-center gap-1">
            {/* Community Name */}
            <LazyCompartment height={18} width={communityNameLength} />

            {/* Post Name */}
            <LazyCompartment height={18} width={postTitleLength} />
          </div>

          <div className="flex items-center gap-1 py-[6px]">
            {/* Username */}
            <LazyCompartment height={18} width={usernameLength} />

            {/* Comment creation date */}
            <LazyCompartment height={14} width={108} />
          </div>

          <div className="py-[6px]">
            {Array.from({ length: contentLinesSmaller }).map((_, i) => (
              <div
                key={i}
                className={`skeleton h-6 ${i === 0 && 'rounded-t-md'} ${ i === contentLinesSmaller - 1 &&
                'rounded-b-md' } ${i === contentLinesSmaller - 2 && 'rounded-bl-none rounded-br-md'} `}
                style={
                  i === contentLinesSmaller - 1 ? { width: `${lastLineRandom}%` } : {}
                }
              />
            ))}
          </div>

          {/* Interaction bar */}
          <div className="flex items-center gap-3 pt-1">
            <LazyCompartment height={28} width={84} className="!rounded-full" />
            <LazyCompartment height={28} width={76} className="!rounded-full" />
            <LazyCompartment height={28} width={85} className="!rounded-full" />
            <LazyCompartment height={18} width={26} className="!rounded-full" />
          </div>
        </div>
      </div>
    </>
  );
}
