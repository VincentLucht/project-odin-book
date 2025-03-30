import API_URL from '@/auth/ApiUrl';

interface DeleteAccountResponse {
  message: string;
  error?: string;
}

export default async function deleteAccount(token: string) {
  const response = await fetch(`${API_URL}/user`, {
    method: 'DELETE',
    headers: {
      'content-type': 'application/json',
      authorization: token,
    },
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  const result = (await response.json()) as DeleteAccountResponse;
  return result;
}
