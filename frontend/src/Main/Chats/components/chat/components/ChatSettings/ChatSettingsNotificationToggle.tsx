import Switch from '@/Main/user/UserSettings/components/Notifications/components/Switch';

import { toast } from 'react-toastify';
import toastUpdate from '@/util/toastUpdate';
import { muteChat } from '@/Main/Chats/api/chatAPI';

import { FetchedChatOverview } from '@/Main/Chats/api/chatAPI';

interface ChatSettingsNotificationToggleProps {
  token: string;
  isMuted: boolean;
  chatId: string | undefined;
  setChatOverviews: React.Dispatch<React.SetStateAction<FetchedChatOverview[]>>;
  setCurrentChatOverview: React.Dispatch<
    React.SetStateAction<FetchedChatOverview | null>
  >;
}

export default function ChatSettingsNotificationToggle({
  token,
  isMuted,
  chatId,
  setChatOverviews,
  setCurrentChatOverview,
}: ChatSettingsNotificationToggleProps) {
  const handleToggle = async () => {
    const TOAST_ID = 'notification-settings-update';
    const toastId = toast.loading(
      isMuted ? 'Enabling notifications' : 'Disabling notifications',
      {
        toastId: TOAST_ID,
      },
    );

    if (!chatId) {
      toastUpdate(toastId, 'error', 'Chat id not provided');
      return;
    }

    try {
      await muteChat(token, chatId, !isMuted, () => {
        setCurrentChatOverview((prev) =>
          prev ? { ...prev, is_muted: !isMuted } : null,
        );
        setChatOverviews((prev) =>
          prev.map((overview) =>
            overview.chat_id === chatId
              ? { ...overview, is_muted: !isMuted }
              : overview,
          ),
        );

        const successMessage = isMuted
          ? 'Successfully enabled notifications'
          : 'Successfully disabled notifications';
        toastUpdate(toastId, 'success', successMessage);
      });
    } catch (error) {
      const errorMessage = isMuted
        ? 'Failed to enable notifications'
        : 'Failed to disable notifications';
      toastUpdate(toastId, 'error', errorMessage);
    }
  };

  return (
    <div className="w-full">
      <Switch
        id="notification-toggle"
        label="Manage notifications"
        description={isMuted ? 'Notifications off' : 'Notifications on'}
        checked={!isMuted}
        onChange={handleToggle}
      />
    </div>
  );
}
