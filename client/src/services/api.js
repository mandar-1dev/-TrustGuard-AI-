import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('trustguard_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle expired sessions
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid or expired
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register' && window.location.pathname !== '/') {
        localStorage.removeItem('trustguard_token');
        localStorage.removeItem('trustguard_user');
        window.location.href = '/login?expired=1';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('trustguard_token');
      localStorage.removeItem('trustguard_user');
    }
  }
};

export const scanService = {
  analyze: async (data) => {
    const res = await api.post('/scans/analyze', data);
    return res.data;
  },
  getScans: async (params) => {
    const res = await api.get('/scans', { params });
    return res.data;
  },
  getScanById: async (id) => {
    const res = await api.get(`/scans/${id}`);
    return res.data;
  },
  deleteScan: async (id) => {
    const res = await api.delete(`/scans/${id}`);
    return res.data;
  }
};

export const privacyService = {
  redact: async (data) => {
    const res = await api.post('/privacy/redact', data);
    return res.data;
  }
};

export const dashboardService = {
  getStats: async () => {
    const res = await api.get('/dashboard/stats');
    return res.data;
  },
  getActivity: async (params) => {
    const res = await api.get('/dashboard/activity', { params });
    return res.data;
  }
};

export const profileService = {
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },
  updateProfile: async (data) => {
    const res = await api.put('/profile', data);
    return res.data;
  }
};

export default api;
