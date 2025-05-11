import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import catchError from '@/util/catchError';

export interface UserSettings {
  email: string;
  password: string;
  display_name: string | null;
  description: string | null;
  profile_picture_url: string | null;
  cake_day: string | null;
  // Notifications
  community_enabled: boolean;
  posts_enabled: boolean;
  comments_enabled: boolean;
  mods_enabled: boolean;
  chats_enabled: boolean;
  follows_enabled: boolean;
}

export default function handleEditSettings(
  token: string,
  updateData: Partial<UserSettings>,
) {
  editUserSettings(token, updateData).catch((error) => {
    catchError(error);
  });
}
