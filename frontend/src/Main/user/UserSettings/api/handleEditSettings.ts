import editSettings from '@/Main/user/UserSettings/api/editUserSettings';
import catchError from '@/util/catchError';

export interface UserSettings {
  email: string;
  display_name: string;
  password: string;
}

export default function handleEditSettings(
  token: string,
  updateData: Partial<UserSettings>,
) {
  editSettings(token, updateData)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      catchError(error);
    });
}
