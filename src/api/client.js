const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const API_BASE_URL = configuredBaseUrl.replace(/\/$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'REQUEST_FAILED', details = null } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

function getStoredToken() {
  try {
    const stored = localStorage.getItem('bandhan_auth');
    return stored ? JSON.parse(stored)?.token || null : null;
  } catch {
    return null;
  }
}

export function getApiUrl(path = '') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiRequest(path, options = {}) {
  const {
    body,
    headers: customHeaders,
    signal,
    token = getStoredToken(),
    ...fetchOptions
  } = options;

  const headers = new Headers(customHeaders || {});
  headers.set('Accept', 'application/json');

  const isFormData = body instanceof FormData;
  if (body !== undefined && !isFormData) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let response;
  try {
    response = await fetch(getApiUrl(path), {
      credentials: 'include',
      ...fetchOptions,
      headers,
      signal,
      body: body === undefined || isFormData ? body : JSON.stringify(body),
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Unable to reach the Bandhan service. Please try again.', {
      code: 'NETWORK_ERROR',
      details: error.message,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json')
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const errorPayload = payload?.error;
    const message = typeof errorPayload === 'string'
      ? errorPayload
      : errorPayload?.message || payload?.message || `Request failed (${response.status}).`;

    throw new ApiError(message, {
      status: response.status,
      code: errorPayload?.code || payload?.code || 'REQUEST_FAILED',
      details: errorPayload?.details || payload?.details || null,
    });
  }

  return payload?.data ?? payload;
}
