const API_BASE = '/api';

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  async get(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      // Collect specific field errors if returned as key-value pairs
      if (res.status === 400 && !errData.error) {
        throw new Error(JSON.stringify(errData));
      }
      throw new Error(errData.error || errData.message || 'GET Request failed');
    }
    return res.json();
  },

  async post(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      if (res.status === 400 && !errData.error) {
        throw new Error(JSON.stringify(errData));
      }
      throw new Error(errData.error || errData.message || 'POST Request failed');
    }
    return res.json();
  },

  async put(endpoint, data) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      if (res.status === 400 && !errData.error) {
        throw new Error(JSON.stringify(errData));
      }
      throw new Error(errData.error || errData.message || 'PUT Request failed');
    }
    return res.json();
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || errData.message || 'DELETE Request failed');
    }
    return res.json();
  }
};
