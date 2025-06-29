import { useSkeletonRandomValues } from '@/Main/Post/components/Loading/hook/useSkeletonRandomValuesProps';

import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import LazyTags from '@/components/Lazy/LazyTags';
import LazyPostFlair from '@/components/Lazy/LazyPostFlair';
import ContentLazy from '@/components/Lazy/ContentLazy';
import Separator from '@/components/Separator';
import SidebarLazy from '@/components/Lazy/SidebarLazy';

function LazyPostOverview() {
  const {
    communityNameLength,
    postTitleLength,
    contentLines,
    isMature,
    isSpoiler,
    lastLineRandom,
    hasFlair,
  } = useSkeletonRandomValues();

  return (
    <div>
      <Separator />

      <div className="my-[6px] rounded-2xl px-2 py-2 pt-3 transition-all hover:cursor-pointer">
        <div className="flex justify-between">
          {/* UPPER SECTION */}
          <div className="gap-1 df">
            <PFPLazy />

            {/* Community name / Username */}
            <LazyCompartment height={16} width={communityNameLength} />

            {/* Time Created */}
            <LazyCompartment height={16} width={Math.floor(Math.random() * 21) + 40} />
          </div>

          <LazyCompartment height={20} width={20} />
        </div>

        <LazyTags isMature={isMature} isSpoiler={isSpoiler} className="mt-3" />

        {/* Title */}
        <LazyCompartment height={28 * postTitleLength} className="mt-3" />
        {hasFlair && <LazyPostFlair className="mt-2" />}

        {/* Content */}
        <div className="mb-2"></div>
        <ContentLazy contentLines={contentLines} lastLineRandom={lastLineRandom} />

        {/* INTERACTION BAR */}
        <div className="-mt-2 flex items-center gap-3">
          <LazyCompartment height={28} width={84} className="!rounded-full" />
          <LazyCompartment height={28} width={76} className="!rounded-full" />
          <LazyCompartment height={28} width={85} className="!rounded-full" />
        </div>
      </div>
    </div>
  );
}

interface LazyPostOverviewsProps {
  amount: number;
  showSidebar: boolean;
}
export default function LazyPostOverviews({
  amount,
  showSidebar,
}: LazyPostOverviewsProps) {
  return (
    <div className="center-main">
      <div className={`w-full ${showSidebar ? 'center-main-content' : ''}`}>
        {Array.from({ length: amount }, (_, index) => (
          <LazyPostOverview key={index} />
        ))}
      </div>

      {showSidebar && <SidebarLazy min={400} max={1200} className="rounded-md" />}
    </div>
  );
}
