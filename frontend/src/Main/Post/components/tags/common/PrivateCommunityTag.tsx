import { LockIcon } from 'lucide-react';

export default function PrivateCommunityTag() {
  return (
    <div className="-mb-[4px] mt-2 flex h-[22px] items-center gap-[3px] text-xs font-semibold">
      <LockIcon className="-mt-[2px] h-5 w-5 text-red-500" />

      <span className="text-red-500">PRIVATE</span>
    </div>
  );
}
