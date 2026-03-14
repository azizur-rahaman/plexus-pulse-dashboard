const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email = 'admin@plexus.com', password = 'password123') {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }

  return res.json(); // returns { user, token }
}

export async function getDevices(token: string) {
  const res = await fetch(`${API_URL}/devices`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch devices');
  }

  return res.json();
}

export async function updateDeviceStatus(token: string, id: string, status: 'online' | 'offline') {
  const res = await fetch(`${API_URL}/devices/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to update status');
  }

  return res.json();
}
