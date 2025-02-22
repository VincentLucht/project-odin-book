import { CircleAlert } from 'lucide-react';

export default function SpoilerTag() {
  return (
    <div className="-mb-[4px] mt-2 flex items-center gap-[2px] text-xs font-semibold">
      <CircleAlert className="fill-white text-bg-gray" />

      <span>SPOILER</span>
    </div>
  );
}
