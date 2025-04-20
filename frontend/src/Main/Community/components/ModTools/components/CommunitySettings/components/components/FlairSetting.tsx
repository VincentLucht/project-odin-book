import CommunityFlairTag from '@/Main/Global/CommunityFlairTag';

import { PenIcon, TrashIcon } from 'lucide-react';

interface FlairSettingProps {
  flair: {
    color: string;
    textColor: string;
    name: string;
    emoji: string | null;
  };
  className?: string;
  onDelete: () => void;
  onOpenEdit: () => void;
}

export default function FlairSetting({
  flair,
  className,
  onDelete,
  onOpenEdit,
}: FlairSettingProps) {
  return (
    <div className="flex items-center gap-3">
      <CommunityFlairTag flair={flair} className={className} />

      <button className="rounded-full !p-[6px] prm-button-red" onClick={onDelete}>
        <TrashIcon className="h-4 w-4" />
      </button>

      <button
        className="rounded-full !p-[6px] prm-button normal-bg-transition"
        onClick={onOpenEdit}
      >
        <PenIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
