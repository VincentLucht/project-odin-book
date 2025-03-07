import { CommunityTypes } from '@/interface/dbSchema';
import { GlobeIcon, EyeIcon, LockIcon } from 'lucide-react';

interface DisplayCommunityTypeProps {
  communityType: CommunityTypes;
}

export default function DisplayCommunityType({
  communityType,
}: DisplayCommunityTypeProps) {
  const iconClass = 'h-[18px] w-[18px]';

  let icon;
  let name;
  if (communityType === 'PUBLIC') {
    icon = <GlobeIcon className={iconClass} strokeWidth={1.7} />;
    name = 'Public';
  } else if (communityType === 'RESTRICTED') {
    icon = <EyeIcon className={iconClass} strokeWidth={1.7} />;
    name = 'Restricted';
  } else if (communityType === 'PRIVATE') {
    icon = <LockIcon className={iconClass} strokeWidth={1.7} />;
    name = 'Private';
  }

  return (
    <div className="flex items-center gap-1">
      {icon}

      <span className="text-sm font-light df">{name}</span>
    </div>
  );
}
