import { useMemo } from 'react';

import Separator from '@/components/Separator';
import PFPLazy from '@/components/Lazy/PFPLazy';
import LazyCompartment from '@/components/Lazy/LazyCompartment';

interface UserOverviewLazyProps {
  includeMatureTag: boolean;
}

export default function UserOverviewLazy({ includeMatureTag }: UserOverviewLazyProps) {
  const randomValues = useMemo(
    () => ({
      nameLength: Math.floor(Math.random() * (240 - 50 + 1)) + 50,
      isMature: Math.random() < 0.05,
    }),
    [],
  );

  const { nameLength, isMature } = randomValues;

  return (
    <div>
      <Separator className="my-2" />

      <div className="flex cursor-pointer items-center gap-3 rounded-2xl px-2 py-3 bg-transition-hover">
        <div className="mt-1 flex-shrink-0 self-start">
          <PFPLazy className="!h-12 !w-12" />
        </div>

        <div>
          {/* Username */}
          <LazyCompartment width={nameLength} height={24} className="mb-2" />

          {/* Tag */}
          {isMature && includeMatureTag && (
            <div className="mb-2">
              <LazyCompartment width={62} height={22} />
            </div>
          )}

          {/* Karma */}
          <LazyCompartment width={80} height={12} />
        </div>
      </div>
    </div>
  );
}
