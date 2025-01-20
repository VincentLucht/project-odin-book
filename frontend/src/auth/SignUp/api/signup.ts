import API_URL from '@/auth/ApiUrl';

export default async function signup(
  username: string,
  email: string,
  password: string,
  confirm_password: string,
) {
  const response = await fetch(`${API_URL}/auth/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username,
      email,
      password,
      confirm_password,
    }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as { error: 'string' };
    throw errorObject;
  }
}
