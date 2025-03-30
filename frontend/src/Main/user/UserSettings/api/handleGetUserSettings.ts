import getUserSettings from '@/Main/user/UserSettings/api/getUserSettings';
import catchError from '@/util/catchError';
import { DBUser } from '@/interface/dbSchema';

export default function handleGetUserSettings(
  setSettings: React.Dispatch<React.SetStateAction<DBUser | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  token: string,
) {
  setLoading(true);

  getUserSettings(token)
    .then((response) => {
      setSettings(response.settings);
      setLoading(false);
    })
    .catch((error) => {
      catchError(error);
      setLoading(false);
    });
}
