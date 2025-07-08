import API_URL from '@/auth/ApiUrl';

export default async function apiRequest<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  token: string | null,
  body?: any,
  abortSignal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers: {
      'content-type': 'application/json',
      ...(token && { authorization: token }),
    },
    ...(body && { body: JSON.stringify(body) }),
    ...(abortSignal && { signal: abortSignal }),
  } as RequestInit);

  if (!response.ok) {
    const errorObject = (await response.json()) as string;
    throw errorObject;
  }

  // Check if there's content to parse
  const contentType = response.headers.get('content-type');
  if (response.status === 204 || !contentType?.includes('application/json')) {
    return {} as T;
  }

  try {
    return (await response.json()) as T;
  } catch (e) {
    return {} as T;
  }
}
