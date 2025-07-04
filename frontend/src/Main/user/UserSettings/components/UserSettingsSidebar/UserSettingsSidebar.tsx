import PFP from '@/components/PFP';
import Separator from '@/components/Separator';
import SidebarLazy from '@/components/Lazy/SidebarLazy';

import formatDate from '@/util/formatDate';

import { DBUser } from '@/interface/dbSchema';

interface UserSettingsSidebarProps {
  user: DBUser | null;
  loading: boolean;
  className: string;
}

export default function UserSettingsSidebar({
  user,
  loading,
  className,
}: UserSettingsSidebarProps) {
  if (loading) return <SidebarLazy min={225} max={335} className="mt-[70px]" />;

  if (!user) return;

  return (
    <div className={`${className} rounded-2xl bg-neutral-950 p-4 sidebar`}>
      <div className="flex gap-3">
        <PFP src={user.profile_picture_url} mode="user" className="!h-20 !w-20" />

        <div className="flex flex-col justify-center break-all">
          <div className="text-xl font-semibold">{user.username}</div>
          <div className="text-sm text-gray-secondary">{user.display_name}</div>
        </div>
      </div>

      <div className="mt-1 break-all text-sm text-gray-secondary">
        {user?.description}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-sm">{user.post_karma}</span>

            <span className="text-xs text-gray-secondary">Post karma</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm">{user.comment_karma}</span>

            <span className="text-xs text-gray-secondary">Comment karma</span>
          </div>
        </div>

        <div className="flex flex-col">
          <span className="text-sm">
            {user.cake_day ? formatDate(user?.cake_day) : 'Not set'}
          </span>

          <span className="text-xs text-gray-secondary">Cake day</span>
        </div>
      </div>
    </div>
  );
}
