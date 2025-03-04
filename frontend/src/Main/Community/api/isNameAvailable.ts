import API_URL from '@/auth/ApiUrl';
import { IsValid } from '@/Main/Community/components/CreateCommunity/CreateCommunity';

interface IsNameAvailableResponse {
  message: string;
  error?: string;
  isNameAvailable: boolean;
}

export default async function isNameAvailable(
  communityName: string,
  setIsValid: React.Dispatch<React.SetStateAction<IsValid>>,
  setLevel: React.Dispatch<React.SetStateAction<number>>,
  token: string,
) {
  const response = await fetch(
    `${API_URL}/community/is-name-available?community_name=${communityName}`,
    {
      method: 'GET',
      headers: {
        'content-type': 'application/json',
        authorization: token,
      },
    },
  );

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    setIsValid((prev) => {
      return { ...prev, 1: false };
    });
    setLevel(1);
    throw errorObject;
  }

  const result = (await response.json()) as IsNameAvailableResponse;
  return result;
}
