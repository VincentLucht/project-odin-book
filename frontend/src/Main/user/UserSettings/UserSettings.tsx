import { useEffect, useState } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import EditUserEmail from '@/Main/user/UserSettings/components/EditUserEmail';
import EditUserPassword from '@/Main/user/UserSettings/components/EditUserPassword';
import EditDisplayName from '@/Main/user/UserSettings/components/EditDisplayName';
import EditUserDescription from '@/Main/user/UserSettings/components/EditUserDescription';
import EditUserPFP from '@/Main/user/UserSettings/components/EditUserPFP';
import EditUserCakeDay from '@/Main/user/UserSettings/components/EditUserCakeDay';
import DeleteUserAccount from '@/Main/user/UserSettings/components/DeleteUserAccount';

import UserSettingsSidebar from '@/Main/user/UserSettings/components/UserSettingsSidebar';

import handleGetUserSettings from '@/Main/user/UserSettings/api/handleGetUserSettings';
import formatDate from '@/util/formatDate';

import { DBUser } from '@/interface/dbSchema';

// TODO: Add loading screen when all settings are here
export default function UserSettings() {
  const [settings, setSettings] = useState<DBUser | null>(null);
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuthGuard();

  useEffect(() => {
    handleGetUserSettings(setSettings, setLoading, token);
  }, [token]);

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div className="center-main-content">
        <div>
          <h2 className="mb-4 text-3xl font-bold">Settings</h2>

          <h3 className="text-lg font-medium">General</h3>
          <div className="flex flex-col gap-1">
            <EditUserEmail
              email={settings?.email ?? ''}
              setSettings={setSettings}
              token={token}
            />

            <EditUserPassword token={token} />
          </div>

          <h3 className="mt-5 text-lg font-medium">Profile</h3>
          <div className="flex flex-col gap-1">
            <EditDisplayName
              displayName={settings?.display_name as string | undefined}
              setSettings={setSettings}
              token={token}
            />

            <EditUserPFP setSettings={setSettings} token={token} />

            <EditUserDescription setSettings={setSettings} token={token} />

            <EditUserCakeDay
              cakeDay={settings?.cake_day ? formatDate(settings?.cake_day) : ''}
              setSettings={setSettings}
              token={token}
            />
          </div>

          <h3 className="mt-5 text-lg font-medium">Advanced</h3>
          <div className="flex flex-col text-sm">
            <DeleteUserAccount logout={logout} token={token} />
          </div>
        </div>

        <UserSettingsSidebar user={settings} />
      </div>
    </div>
  );
}
