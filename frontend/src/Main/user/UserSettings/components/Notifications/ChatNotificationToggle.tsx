import Switch from '@/Main/user/UserSettings/components/Notifications/components/Switch';
import { toast } from 'react-toastify';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { DBUserSettings } from '@/interface/dbSchema';

interface ChatNotificationToggleProps {
  chatsEnabled: boolean;
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings | null>>;
  token: string;
}

export default function ChatNotificationToggle({
  chatsEnabled,
  setSettings,
  token,
}: ChatNotificationToggleProps) {
  const handleToggle = async () => {
    const toastId = toast.loading('Updating notification settings...');

    try {
      await editUserSettings(token, { chats_enabled: !chatsEnabled });

      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, chats_enabled: !chatsEnabled };
      });

      toast.update(toastId, {
        type: 'success',
        render: `Chat notifications ${!chatsEnabled ? 'enabled' : 'disabled'}`,
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
        id="chats-toggle"
        label="Chat Messages"
        description="Receive notifications for new chat messages"
        checked={chatsEnabled}
        onChange={handleToggle}
      />
    </div>
  );
}
