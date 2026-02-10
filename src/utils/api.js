import axios from 'axios';
import { API_BASE_URL } from './apiBaseUrl';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API Services
export const authAPI = {
  login: (email, password) => api.post('/api/auth/login', { email, password }),
  logout: () => api.post('/api/auth/logout'),
  getMe: () => api.get('/api/auth/me')
};

export const eventsAPI = {
  getAll: (params) => api.get('/api/events', { params }),
  getById: (id) => api.get(`/api/events/${id}`),
  create: (data) => api.post('/api/events', data),
  update: (id, data) => api.put(`/api/events/${id}`, data),
  delete: (id) => api.delete(`/api/events/${id}`),
  getUpcoming: () => api.get('/api/events/upcoming')
};

export const sportsAPI = {
  getAll: () => api.get('/api/sports'),
  create: (data) => api.post('/api/sports', data),
  update: (id, data) => api.put(`/api/sports/${id}`, data),
  delete: (id) => api.delete(`/api/sports/${id}`),
  getTournaments: (params) => api.get('/api/sports/tournaments', { params }),
  getTournamentById: (id) => api.get(`/api/sports/tournaments/${id}`),
  createTournament: (data) => api.post('/api/sports/tournaments', data),
  updateTournament: (id, data) => api.put(`/api/sports/tournaments/${id}`, data),
  deleteTournament: (id) => api.delete(`/api/sports/tournaments/${id}`)
};

export const socialWorkAPI = {
  getAll: (params) => api.get('/api/social-work', { params }),
  getById: (id) => api.get(`/api/social-work/${id}`),
  create: (data) => api.post('/api/social-work', data),
  update: (id, data) => api.put(`/api/social-work/${id}`, data),
  delete: (id) => api.delete(`/api/social-work/${id}`),
  getImpactSummary: () => api.get('/api/social-work/impact/summary')
};

export const galleryAPI = {
  getAll: (params) => api.get('/api/gallery', { params }),
  getById: (id) => api.get(`/api/gallery/${id}`),
  create: (data) => api.post('/api/gallery', data),
  update: (id, data) => api.put(`/api/gallery/${id}`, data),
  delete: (id) => api.delete(`/api/gallery/${id}`),
  addMedia: (id, data) => api.post(`/api/gallery/${id}/media`, data)
};

export const sliderImagesAPI = {
  getLatest: (params) => api.get('/api/slider-images', { params }),
  getAll: () => api.get('/api/slider-images/admin'),
  create: (data) => api.post('/api/slider-images', data),
  update: (id, data) => api.put(`/api/slider-images/${id}`, data),
  delete: (id) => api.delete(`/api/slider-images/${id}`)
};

export const membersAPI = {
  getAll: (params) => api.get('/api/members', { params }),
  getById: (id) => api.get(`/api/members/${id}`),
  create: (data) => api.post('/api/members', data),
  update: (id, data) => api.put(`/api/members/${id}`, data),
  delete: (id) => api.delete(`/api/members/${id}`),
  getCommitteeByYear: (year) => api.get(`/api/members/committee/${year}`)
};

export const newsAPI = {
  getAll: (params) => api.get('/api/news', { params }),
  getById: (id) => api.get(`/api/news/${id}`),
  create: (data) => api.post('/api/news', data),
  update: (id, data) => api.put(`/api/news/${id}`, data),
  delete: (id) => api.delete(`/api/news/${id}`)
};

export const testimonialsAPI = {
  getAll: (params) => api.get('/api/testimonials', { params }),
  getById: (id) => api.get(`/api/testimonials/${id}`),
  create: (data) => api.post('/api/testimonials', data),
  update: (id, data) => api.put(`/api/testimonials/${id}`, data),
  delete: (id) => api.delete(`/api/testimonials/${id}`)
};

export const socialFeedAPI = {
  getAll: (params) => api.get('/api/social-posts', { params }),
  getById: (id) => api.get(`/api/social-posts/${id}`),
  create: (data) => api.post('/api/social-posts', data),
  update: (id, data) => api.put(`/api/social-posts/${id}`, data),
  delete: (id) => api.delete(`/api/social-posts/${id}`)
};

export const pressMentionsAPI = {
  getAll: (params) => api.get('/api/press-mentions', { params }),
  getById: (id) => api.get(`/api/press-mentions/${id}`),
  create: (data) => api.post('/api/press-mentions', data),
  update: (id, data) => api.put(`/api/press-mentions/${id}`, data),
  delete: (id) => api.delete(`/api/press-mentions/${id}`)
};

export const contactAPI = {
  getAll: (params) => api.get('/api/contact', { params }),
  getById: (id) => api.get(`/api/contact/${id}`),
  create: (data) => api.post('/api/contact', data),
  reply: (id, message) => api.put(`/api/contact/${id}/reply`, { message }),
  updateStatus: (id, status) => api.put(`/api/contact/${id}/status`, { status }),
  delete: (id) => api.delete(`/api/contact/${id}`),
  getStats: () => api.get('/api/contact/stats')
};

export const pagesAPI = {
  getAll: () => api.get('/api/pages'),
  getByName: (name) => api.get(`/api/pages/${name}`),
  update: (name, data) => api.put(`/api/pages/${name}`, data),
  updateSection: (name, sectionId, data) => api.put(`/api/pages/${name}/sections/${sectionId}`, data),
  deleteSection: (name, sectionId) => api.delete(`/api/pages/${name}/sections/${sectionId}`)
};

export const settingsAPI = {
  get: () => api.get('/api/settings'),
  update: (data) => api.put('/api/settings', data),
  updateSocialMedia: (data) => api.put('/api/settings/social-media', data),
  updateSEO: (data) => api.put('/api/settings/seo', data)
};

export const dashboardAPI = {
  getStats: () => api.get('/api/dashboard/stats'),
  getHealth: () => api.get('/api/dashboard/health')
};

export const activityLogsAPI = {
  getAll: (params) => api.get('/api/activity-logs', { params }),
  getById: (id) => api.get(`/api/activity-logs/${id}`),
  getStats: () => api.get('/api/activity-logs/stats')
};

export const uploadAPI = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/api/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

export const adminsAPI = {
  getAll: () => api.get('/api/admins'),
  create: (data) => api.post('/api/admins', data),
  update: (id, data) => api.put(`/api/admins/${id}`, data),
  resetPassword: (id, password) => api.put(`/api/admins/${id}/password`, { password })
};

export const publicAPI = {
  getStats: () => api.get('/api/public/stats')
};
