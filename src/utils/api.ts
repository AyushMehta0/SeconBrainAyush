import axios from 'axios';

// In a real implementation, this would come from environment variables
const API_URL = 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  login: (username: string, password: string) => 
    api.post('/auth/signin', { username, password }),
  register: (username: string, password: string) => 
    api.post('/auth/signup', { username, password }),
  getCurrentUser: () => 
    api.get('/auth/me'),
};

// Content API
export const contentAPI = {
  getAll: () => 
    api.get('/content'),
  getById: (id: string) => 
    api.get(`/content/${id}`),
  create: (contentData: any) => 
    api.post('/content', contentData),
  update: (id: string, contentData: any) => 
    api.put(`/content/${id}`, contentData),
  delete: (id: string) => 
    api.delete(`/content/${id}`),
};

// Tags API
export const tagsAPI = {
  getAll: () => 
    api.get('/tags'),
  create: (title: string) => 
    api.post('/tags', { title }),
};

// Share API
export const shareAPI = {
  createShareLink: () => 
    api.post('/share'),
  getSharedContent: (hash: string) => 
    api.get(`/share/${hash}`),
};

// Search API
export const searchAPI = {
  semanticSearch: (query: string) => 
    api.post('/search/semantic', { query }),
};

export default api;