import getUserSettings from '@/Main/user/UserSettings/api/getUserSettings';
import catchError from '@/util/catchError';
import { DBUser, DBUserSettings } from '@/interface/dbSchema';

export default function handleGetUserSettings(
  setUser: React.Dispatch<React.SetStateAction<DBUser | null>>,
  setSettings: React.Dispatch<React.SetStateAction<DBUserSettings | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
) {
  setLoading(true);

  getUserSettings(token)
    .then((response) => {
      setUser(response.data.user);
      setSettings(response.data.userSettings);
      setLoading(false);
    })
    .catch((error) => {
      catchError(error);
      setLoading(false);
    });
}
