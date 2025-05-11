import Switch from '@/Main/user/UserSettings/components/Notifications/components/Switch';
import { toast } from 'react-toastify';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { DBUserSettings } from '@/interface/dbSchema';

interface PostNotificationToggleProps {
  postsEnabled: boolean;
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings | null>>;
  token: string;
}

export default function PostNotificationToggle({
  postsEnabled,
  setSettings,
  token,
}: PostNotificationToggleProps) {
  const handleToggle = async () => {
    const toastId = toast.loading('Updating notification settings...');

    try {
      await editUserSettings(token, { posts_enabled: !postsEnabled });

      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, posts_enabled: !postsEnabled };
      });

      toast.update(toastId, {
        type: 'success',
        render: `Post notifications ${!postsEnabled ? 'enabled' : 'disabled'}`,
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        type: 'error',
        render: 'Failed to update notification settings',
        isLoading: false,
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex items-center justify-between py-2">
      <Switch
        id="posts-toggle"
        label="Post Notifications"
        description="Receive notifications for comments to your posts"
        checked={postsEnabled}
        onChange={handleToggle}
      />
    </div>
  );
}
