import Switch from '@/Main/user/UserSettings/components/Notifications/components/Switch';
import { toast } from 'react-toastify';
import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import { DBUserSettings } from '@/interface/dbSchema';

interface ModNotificationToggleProps {
  modsEnabled: boolean;
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings | null>>;
  token: string;
  loading: boolean;
}

export default function ModNotificationToggle({
  modsEnabled,
  setSettings,
  token,
  loading,
}: ModNotificationToggleProps) {
  const handleToggle = async () => {
    const toastId = toast.loading('Updating notification settings...');

    try {
      await editUserSettings(token, { mods_enabled: !modsEnabled });

      setSettings((prev) => {
        if (!prev) return prev;
        return { ...prev, mods_enabled: !modsEnabled };
      });

      toast.update(toastId, {
        type: 'success',
        render: `Mod notifications ${!modsEnabled ? 'enabled' : 'disabled'}`,
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
        id="mods-toggle"
        label="Moderator Messages"
        description="Receive notifications for messages from moderators"
        checked={modsEnabled}
        onChange={handleToggle}
        loading={loading}
      />
    </div>
  );
}
