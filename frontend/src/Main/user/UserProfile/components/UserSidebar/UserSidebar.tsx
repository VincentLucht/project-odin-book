import { UserAndHistory } from '@/Main/user/UserProfile/api/fetchUserProfile';

interface UserSidebarProps {
  user: UserAndHistory | null;
}

export default function UserSideBar({ user }: UserSidebarProps) {
  if (!user) {
    return null;
  }

  return (
    <div className="sticky top-4 flex h-fit flex-col gap-2 rounded-2xl bg-black p-4">
      <div className="flex justify-between">
        <div className="font-semibold">{user.username}</div>

        <div>Dots</div>
      </div>

      <div className="flex gap-1">
        <div>follow</div>

        <div>chat</div>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col">
          <span className="text-sm">{user.post_karma}</span>
          <span className="text-xs text-gray-secondary">Post karma</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm">{user.comment_karma}</span>
          <span className="text-xs text-gray-secondary">Comment karma</span>
        </div>

        <div className="flex flex-col">
          <span className="text-sm">{user.cake_day}</span>
          <span className="text-xs text-gray-secondary">Cake day</span>
        </div>
      </div>
    </div>
  );
}
