import { useSkeletonRandomValues } from '@/Main/Post/components/Loading/hook/useSkeletonRandomValuesProps';

import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import LazyTags from '@/components/Lazy/LazyTags';
import LazyPostFlair from '@/components/Lazy/LazyPostFlair';
import Separator from '@/components/Separator';

interface PostLazyProps {
  mode?: 'fetched' | 'normal' | 'overview';
}

export default function PostLazy({ mode = 'normal' }: PostLazyProps) {
  const {
    communityNameLength,
    usernameLength,
    postTitleLength,
    contentLines,
    isMature,
    isSpoiler,
    lastLineRandom,
  } = useSkeletonRandomValues();

  const isUserProfileMode = mode === 'overview';

  return (
    <>
      {isUserProfileMode && <Separator />}

      <div className={`${!isUserProfileMode ? 'p-4 center-main' : 'my-[6px] p-2'}`}>
        <div
          className={` ${mode === 'fetched' && '!block'} ${!isUserProfileMode && 'center-main-content'}`}
        >
          <div className="flex flex-col">
            <div className="flex gap-1 text-sm">
              <PFPLazy
                className={`${!isUserProfileMode ? '!h-9 !w-9' : '!h-6 !w-6'}`}
              />

              <div
                className={`flex-1 text-xs ${isUserProfileMode && 'item-center flex'}`}
              >
                <div className="flex items-center gap-1">
                  {/* Community Name */}
                  <LazyCompartment height={20} width={communityNameLength} />

                  {/* Creation Date */}
                  <LazyCompartment height={14} width={84} />
                </div>

                {/* Username */}
                {!isUserProfileMode && (
                  <LazyCompartment
                    height={12}
                    width={usernameLength}
                    className="mt-[4px]"
                  />
                )}
              </div>

              <LazyCompartment className="mr-4 !rounded-full" height={22} width={77} />

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
          </div>

          {/* TODO: Complete this when done with sidebar */}
          {/* Sidebar */}
        </div>
      </div>
    </>
  );
}
