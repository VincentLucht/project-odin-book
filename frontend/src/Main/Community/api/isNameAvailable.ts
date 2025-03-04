import API_URL from '@/auth/ApiUrl';

interface IsNameAvailableResponse {
  message: string;
  error?: string;
  isNameAvailable: boolean;
}

export default async function isNameAvailable(communityName: string, token: string) {
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
    throw errorObject;
  }

  const result = (await response.json()) as IsNameAvailableResponse;
  return result;
}
