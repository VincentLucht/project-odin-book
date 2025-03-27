import { useMemo } from 'react';

import Separator from '@/components/Separator';
import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';
import getBiasedRandomNumber from '@/util/getBiasedRandomNumber';

interface CommunityOverviewLazyProps {
  includeMatureTag: boolean;
}

export default function CommunityOverviewLazy({
  includeMatureTag,
}: CommunityOverviewLazyProps) {
  const randomValues = useMemo(
    () => ({
      nameLength: Math.floor(Math.random() * (240 - 50 + 1)) + 50,
      isMature: Math.random() < 0.05,
      isPrivate: Math.random() < 0.05,
      descriptionLines: getBiasedRandomNumber(),
    }),
    [],
  );

  const { nameLength, isMature, isPrivate, descriptionLines } = randomValues;

  return (
    <div>
      <Separator className="my-2" />

      <div className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-3">
        <div className="mt-1 flex-shrink-0 self-start">
          {/* PFP */}
          <PFPLazy className="!h-12 !w-12" />
        </div>

        <div className="flex w-full flex-col gap-1">
          {/* Community Name */}
          <LazyCompartment className="mt-1" height={22} width={nameLength} />

          {/* Tags */}
          <div className="my-[2px] flex gap-[6px]">
            {isMature && includeMatureTag && <LazyCompartment width={62} height={22} />}
            {isPrivate && <LazyCompartment width={73} height={22} />}
          </div>

          {/* Members */}
          <LazyCompartment width={76} height={12} className="mb-1" />

          {/* Description */}
          <LazyCompartment height={20 * descriptionLines} />
        </div>
      </div>
    </div>
  );
}
