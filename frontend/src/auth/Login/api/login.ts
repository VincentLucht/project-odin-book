import API_URL from '@/auth/ApiUrl';

interface LoginResponse {
  token: string;
}

export default async function login(username: string, password: string) {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const errorObject = (await response.json()) as LoginResponse;
    throw errorObject;
  }

  const token = (await response.json()) as LoginResponse;
  return token;
}
