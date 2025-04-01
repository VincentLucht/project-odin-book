import editUserSettings from '@/Main/user/UserSettings/api/editUserSettings';
import catchError from '@/util/catchError';

export interface UserSettings {
  email: string;
  password: string;
  display_name: string | null;
  description: string | null;
  profile_picture_url: string | null;
  cake_day: string | null;
}

export default function handleEditSettings(
  token: string,
  updateData: Partial<UserSettings>,
) {
  editUserSettings(token, updateData)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      catchError(error);
    });
}
