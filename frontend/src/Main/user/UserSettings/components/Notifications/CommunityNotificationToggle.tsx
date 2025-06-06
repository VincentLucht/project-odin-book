import Switch from '@/Main/user/UserSettings/components/Notifications/components/Switch';
import { toast } from 'react-toastify';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { DBUserSettings } from '@/interface/dbSchema';

interface CommunityNotificationToggleProps {
  communityEnabled: boolean;
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings | null>>;
  token: string;
  loading: boolean;
}

export default function CommunityNotificationToggle({
  communityEnabled,
  setSettings,
  token,
  loading,
}: CommunityNotificationToggleProps) {
  const handleToggle = async () => {
    const toastId = toast.loading('Updating notification settings...');

    try {
      await editUserSettings(token, { community_enabled: !communityEnabled });

      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, community_enabled: !communityEnabled };
      });

      toast.update(toastId, {
        type: 'success',
        render: `Community notifications ${!communityEnabled ? 'enabled' : 'disabled'}`,
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
        id="community-toggle"
        label="Community Notifications"
        description="Receive notifications for community activity"
        checked={communityEnabled}
        onChange={handleToggle}
        loading={loading}
      />
    </div>
  );
}
