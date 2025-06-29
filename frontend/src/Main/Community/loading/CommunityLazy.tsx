import { useSkeletonRandomValues } from '@/Main/Post/components/Loading/hook/useSkeletonRandomValuesProps';

import LazyCompartment from '@/components/Lazy/LazyCompartment';
import LazyPostOverviews from '@/components/Lazy/LazyPostOverviews';
import SidebarLazy from '@/components/Lazy/SidebarLazy';

interface CommunityLazyProps {
  isMobile: boolean;
}
export default function CommunityLazy({ isMobile }: CommunityLazyProps) {
  const { communityNameLength } = useSkeletonRandomValues();

  return (
    <div className="p-4 pt-1 center-main">
      <div className="w-full max-w-[1072px]">
        {/* HEADER */}
        <header className="mb-8">
          <div className="mb-8">
            {/* Banner */}
            <LazyCompartment className="my-2 min-h-[128px] max-w-[1072px] overflow-hidden rounded-lg df" />
          </div>

          <div className="-mt-6 ml-4 flex justify-between max-md:flex-col">
            <div className="flex">
              {/* PFP */}
              <div
                className="z-10 -mt-10 h-[88px] w-[88px] flex-shrink-0 rounded-full border-4 df bg-gray
                  border-bg-gray"
              >
                <LazyCompartment
                  className="z-10 min-h-[88px] min-w-[88px] flex-shrink-0 !rounded-full border-4 df bg-gray
                    border-bg-gray"
                />
              </div>

              {/* Community Name */}
              <LazyCompartment
                className="ml-2"
                height={32}
                width={communityNameLength * 3}
              />
            </div>

            {/* INTERACTION BAR */}
            <div className="ml-3 flex items-center justify-center gap-2 max-md:mt-4 max-md:self-end">
              {/* Create Posts */}
              <LazyCompartment height={36} width={138} className="!rounded-full" />

              {/* Membership */}
              <LazyCompartment height={36} width={80} className="!rounded-full" />
            </div>
          </div>
        </header>

        {/* MAIN */}
        <div className="relative md:center-main-content">
          <div>
            <div className="flex-items flex justify-between gap-2">
              {/* Api Filters */}
              <LazyCompartment
                height={20}
                width={50}
                className="mb-[14px] ml-3 mt-[6px]"
              />

              {/* Show about button */}
              {isMobile && (
                <LazyCompartment
                  height={32}
                  width={104}
                  className="-mt-[6px] !rounded-full"
                />
              )}
            </div>

            {/* Posts */}
            <LazyPostOverviews amount={6} showSidebar={false} />
          </div>

          {!isMobile && <SidebarLazy min={400} max={1200} className="rounded-md" />}
        </div>
      </div>
    </div>
  );
}
