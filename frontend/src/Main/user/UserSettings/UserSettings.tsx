import { useEffect, useState } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import EditUserEmail from '@/Main/user/UserSettings/components/EditUserEmail';
import EditUserPassword from '@/Main/user/UserSettings/components/EditUserPassword';
import EditDisplayName from '@/Main/user/UserSettings/components/EditDisplayName';

import UserSettingsSidebar from '@/Main/user/UserSettings/components/UserSettingsSidebar';
import DeleteUserAccount from '@/Main/user/UserSettings/components/DeleteUserAccount';
import { DBUser } from '@/interface/dbSchema';
import handleGetUserSettings from '@/Main/user/UserSettings/api/handleGetUserSettings';

// TODO: Add loading screen when all settings are here
export default function UserSettings() {
  const [settings, setSettings] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, token, logout } = useAuthGuard();

  useEffect(() => {
    handleGetUserSettings(setSettings, setLoading, token);
  }, [token]);

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div className="center-main-content">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Settings</h2>

          <h3 className="mb-2 text-lg font-medium">General</h3>
          <div className="flex flex-col gap-1">
            <EditUserEmail
              email={settings?.email ?? ''}
              setSettings={setSettings}
              token={token}
            />

            <EditUserPassword token={token} />

            <EditDisplayName
              displayName={settings?.display_name as string | undefined}
              setSettings={setSettings}
              token={token}
            />
          </div>

          <h3 className="mb-2 mt-5 text-lg font-medium">Advanced</h3>
          <div className="flex flex-col text-sm">
            <DeleteUserAccount logout={logout} token={token} />
          </div>
        </div>

        <UserSettingsSidebar user={user} />
      </div>
    </div>
  );
}
