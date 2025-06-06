import { ChevronRightIcon } from 'lucide-react';
import randomNumberBetween from '@/util/randomNumberBetween';

interface UserSettingsCompartmentProps {
  name: string;
  onClick: () => void;
  additionalName?: string;
  loading?: boolean;
  skeletonRange?: { min: number; max: number };
}

export default function UserSettingsOption({
  name,
  onClick,
  additionalName,
  loading,
  skeletonRange,
}: UserSettingsCompartmentProps) {
  let skeletonWidth = 0;
  if (skeletonRange) {
    skeletonWidth = randomNumberBetween(skeletonRange.min, skeletonRange.max);
  }

  return (
    <button
      className="-ml-2 flex cursor-pointer items-center justify-between gap-2 rounded py-2 pl-2 text-sm
        bg-transition-hover"
      onClick={onClick}
    >
      <span>{name}</span>

      <div className="flex items-center gap-4">
        {loading ? (
          <div
            className="skeleton-rd h-4"
            style={{ width: `${skeletonWidth}px` }}
          ></div>
        ) : (
          <span className="break-all text-xs">{additionalName}</span>
        )}

        <ChevronRightIcon />
      </div>
    </button>
  );
}
