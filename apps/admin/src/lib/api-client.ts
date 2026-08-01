import { getAuthToken } from './api';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

export async function request<T>(
  baseUrl: string,
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {}
): Promise<T> {
  const headers: Record<string, string> = {};
  
  if (options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  
  if (options.auth) {
    const token = getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${baseUrl}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }

  if (!res.ok) {
    const errMessage = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message || `Request failed (${res.status})`);
    throw new ApiError(res.status, errMessage);
  }

  return body as T;
}
