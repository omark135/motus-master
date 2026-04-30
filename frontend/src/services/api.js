const API_URL = 'http://localhost:3000';

export function getToken() {
  return localStorage.getItem('motus_token');
}

export function getUser() {
  const raw = localStorage.getItem('motus_user');
  return raw ? JSON.parse(raw) : null;
}

export function logout() {
  localStorage.removeItem('motus_token');
  localStorage.removeItem('motus_user');
}

export async function apiFetch(path, options = {}) {
  const token = getToken();

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Erreur API');
  }

  return data;
}

export async function login(pseudo, password) {
  const data = await apiFetch('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ pseudo, password })
  });

  localStorage.setItem('motus_token', data.token);
  localStorage.setItem('motus_user', JSON.stringify(data.user));

  return data.user;
}

export async function register(pseudo, password) {
  const data = await apiFetch('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ pseudo, password })
  });

  localStorage.setItem('motus_token', data.token);
  localStorage.setItem('motus_user', JSON.stringify(data.user));

  return data.user;
}
