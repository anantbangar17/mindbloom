const BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export function getToken() { return localStorage.getItem('mb_token'); }
export function setToken(token) { localStorage.setItem('mb_token', token); }
export function clearToken() { localStorage.removeItem('mb_token'); }

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
}

export async function apiRegister(name, email, password) {
  const data = await request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) });
  setToken(data.token);
  return data.user;
}

export async function apiLogin(email, password) {
  const data = await request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
  setToken(data.token);
  return data.user;
}

export async function apiGetMe() {
  const data = await request('/api/auth/me');
  return data.user;
}

export async function apiCompleteOnboarding(profile) {
  const data = await request('/api/auth/onboarding', { method: 'PATCH', body: JSON.stringify({ profile }) });
  return data.user;
}

export async function apiUpdateProfile(updates) {
  const data = await request('/api/auth/profile', { method: 'PATCH', body: JSON.stringify(updates) });
  return data.user;
}

export async function apiDeleteAccount() {
  return request('/api/auth/account', { method: 'DELETE' });
}

export async function apiGetAllData() {
  return request('/api/data');
}

export async function apiGetData(key) {
  const data = await request(`/api/data/${key}`);
  return data.value;
}

export async function apiSetData(key, value) {
  const data = await request(`/api/data/${key}`, { method: 'PUT', body: JSON.stringify({ value }) });
  return data.value;
}

export function apiLogout() {
  clearToken();
  localStorage.removeItem('mb_current');
}