import Switch from '@/Main/user/UserSettings/components/Notifications/components/Switch';
import { toast } from 'react-toastify';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { DBUserSettings } from '@/interface/dbSchema';

interface CommentNotificationToggleProps {
  commentsEnabled: boolean;
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings | null>>;
  token: string;
}

export default function CommentNotificationToggle({
  commentsEnabled,
  setSettings,
  token,
}: CommentNotificationToggleProps) {
  const handleToggle = async () => {
    const toastId = toast.loading('Updating notification settings...');

    try {
      await editUserSettings(token, { comments_enabled: !commentsEnabled });

      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, comments_enabled: !commentsEnabled };
      });

      toast.update(toastId, {
        type: 'success',
        render: `Comment notifications ${!commentsEnabled ? 'enabled' : 'disabled'}`,
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
        id="comments-toggle"
        label="Comment Notifications"
        description="Receive notifications for comment replies"
        checked={commentsEnabled}
        onChange={handleToggle}
      />
    </div>
  );
}
