import { useEffect, useState } from 'react';
import useAuthGuard from '@/context/auth/hook/useAuthGuard';

import EditUserEmail from '@/Main/user/UserSettings/components/EditUserEmail';
import EditUserPassword from '@/Main/user/UserSettings/components/EditUserPassword';
import EditDisplayName from '@/Main/user/UserSettings/components/EditDisplayName';
import EditUserDescription from '@/Main/user/UserSettings/components/EditUserDescription';
import EditUserPFP from '@/Main/user/UserSettings/components/EditUserPFP';
import EditUserCakeDay from '@/Main/user/UserSettings/components/EditUserCakeDay';
import DeleteUserAccount from '@/Main/user/UserSettings/components/DeleteUserAccount';

import CommunityNotificationToggle from '@/Main/user/UserSettings/components/Notifications/CommunityNotificationToggle';
import PostNotificationToggle from '@/Main/user/UserSettings/components/Notifications/PostNotificationToggle';
import CommentNotificationToggle from '@/Main/user/UserSettings/components/Notifications/CommentNotificationToggle';
import ModNotificationToggle from '@/Main/user/UserSettings/components/Notifications/ModNotificationToggle';
import ChatNotificationToggle from '@/Main/user/UserSettings/components/Notifications/ChatNotificationToggle';

import UserSettingsSidebar from '@/Main/user/UserSettings/components/UserSettingsSidebar/UserSettingsSidebar';

import handleGetUserSettings from '@/Main/user/UserSettings/api/handleGetUserSettings';
import formatDate from '@/util/formatDate';

import { DBUser, DBUserSettings } from '@/interface/dbSchema';

// TODO: Add loading screen when all settings are here
export default function UserSettings() {
  const [user, setUser] = useState<DBUser | null>(null);
  const [settings, setSettings] = useState<DBUserSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const { token, logout } = useAuthGuard();

  useEffect(() => {
    handleGetUserSettings(setUser, setSettings, setLoading, token);
  }, [token]);

  return (
    <div className="overflow-y-scroll p-4 center-main">
      <div className="center-main-content">
        <div>
          <h2 className="mb-4 text-3xl font-semibold">Settings</h2>

          <h3 className="text-xl font-medium">General</h3>
          <div className="flex flex-col gap-1">
            <EditUserEmail
              email={user?.email ?? ''}
              setSettings={setUser}
              token={token}
              loading={loading}
            />

            <EditUserPassword token={token} />
          </div>

          <h3 className="mt-5 text-xl font-semibold">Profile</h3>
          <div className="flex flex-col gap-1">
            <EditDisplayName
              displayName={user?.display_name as string | undefined}
              setSettings={setUser}
              token={token}
              loading={loading}
            />

            <EditUserPFP logout={logout} setSettings={setUser} token={token} />

            <EditUserDescription setSettings={setUser} token={token} />

            <EditUserCakeDay
              cakeDay={user?.cake_day ? formatDate(user?.cake_day) : 'Not set'}
              setSettings={setUser}
              token={token}
              loading={loading}
            />
          </div>

          <h3 className="mt-5 text-xl font-medium">Notifications</h3>
          <div className="flex flex-col text-sm">
            <CommunityNotificationToggle
              communityEnabled={settings?.community_enabled ?? true}
              setSettings={setSettings}
              token={token}
              loading={loading}
            />

            <PostNotificationToggle
              postsEnabled={settings?.posts_enabled ?? true}
              setSettings={setSettings}
              token={token}
              loading={loading}
            />

            <CommentNotificationToggle
              commentsEnabled={settings?.comments_enabled ?? true}
              setSettings={setSettings}
              token={token}
              loading={loading}
            />

            <ModNotificationToggle
              modsEnabled={settings?.mods_enabled ?? true}
              setSettings={setSettings}
              token={token}
              loading={loading}
            />

            <ChatNotificationToggle
              chatsEnabled={settings?.chats_enabled ?? true}
              setSettings={setSettings}
              token={token}
              loading={loading}
            />
          </div>

          <h3 className="mt-5 text-lg font-semibold">Advanced</h3>
          <div className="flex flex-col text-sm">
            <DeleteUserAccount logout={logout} token={token} />
          </div>
        </div>

        <UserSettingsSidebar user={user} loading={loading} />
      </div>
    </div>
  );
}
