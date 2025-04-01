import API_URL from '@/auth/ApiUrl';
import { UserSettings } from '@/Main/user/UserSettings/api/handleEditSettings';

interface EditSettingsResponse {
  message: string;
  error?: string;
}

export default async function editUserSettings(
  token: string,
  updateData: Partial<UserSettings>,
) {
  const response = await fetch(`${API_URL}/user/settings`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as EditSettingsResponse;
  return result;
}
