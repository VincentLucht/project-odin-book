import { TriangleAlertIcon } from 'lucide-react';

export default function MatureTag() {
  return (
    <div className="-mb-[4px] mt-2 flex items-center gap-[2px] text-xs font-semibold">
      <TriangleAlertIcon className="-mt-[2px] h-6 w-6 fill-white text-bg-gray" />

      <span>NSFW</span>
    </div>
  );
}
