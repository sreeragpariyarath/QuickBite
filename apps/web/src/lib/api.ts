export const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ?? 'http://localhost:3000';
export const RESTAURANT_URL =
  process.env.NEXT_PUBLIC_RESTAURANT_URL ?? 'http://localhost:3001';
export const ORDER_URL =
  process.env.NEXT_PUBLIC_ORDER_URL ?? 'http://localhost:3002';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('qb_access_token');
}

export function storeTokens(accessToken: string, refreshToken?: string) {
  localStorage.setItem('qb_access_token', accessToken);
  if (refreshToken) localStorage.setItem('qb_refresh_token', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('qb_access_token');
  localStorage.removeItem('qb_refresh_token');
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = localStorage.getItem('qb_refresh_token');
  if (!refreshToken) return false;
  const res = await fetch(`${AUTH_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return false;
  const body = (await res.json()) as { accessToken: string };
  storeTokens(body.accessToken);
  return true;
}

export async function api<T>(
  base: string,
  path: string,
  options: { method?: string; body?: unknown; auth?: boolean } = {},
  isRetry = false,
): Promise<T> {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers['Content-Type'] = 'application/json';
  if (options.auth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${base}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (res.status === 401 && options.auth && !isRetry && (await tryRefresh())) {
    return api<T>(base, path, options, true);
  }

  const text = await res.text();
  const body = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const message = Array.isArray(body?.message)
      ? body.message.join(', ')
      : (body?.message ?? `Request failed (${res.status})`);
    throw new ApiError(res.status, message);
  }

  return body as T;
}
