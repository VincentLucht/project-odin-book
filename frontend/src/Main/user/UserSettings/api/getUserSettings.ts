import API_URL from '@/auth/ApiUrl';
import { DBUser, DBUserSettings } from '@/interface/dbSchema';

interface GetUserSettingsResponse {
  message: string;
  error?: string;
  data: {
    user: DBUser;
    userSettings: DBUserSettings;
  };
}

export default async function getUserSettings(token: string) {
  const response = await fetch(`${API_URL}/user/settings`, {
    method: 'GET',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as GetUserSettingsResponse;
  return result;
}
