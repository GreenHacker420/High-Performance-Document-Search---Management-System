import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api` 
  : 'http://localhost:9000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// FAQ API
export const faqAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/faqs?page=${page}&limit=${limit}`),
  
  getById: (id) => 
    api.get(`/faqs/${id}`),
  
  create: (data) => 
    api.post('/faqs', data),
  
  update: (id, data) => 
    api.put(`/faqs/${id}`, data),
  
  delete: (id) => 
    api.delete(`/faqs/${id}`),
};

// Web Links API
export const linkAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/links?page=${page}&limit=${limit}`),
  
  getById: (id) => 
    api.get(`/links/${id}`),
  
  create: (data) => 
    api.post('/links', data),
  
  update: (id, data) => 
    api.put(`/links/${id}`, data),
  
  delete: (id) => 
    api.delete(`/links/${id}`),
};

// PDF API
export const pdfAPI = {
  getAll: (page = 1, limit = 10) => 
    api.get(`/pdfs?page=${page}&limit=${limit}`),
  
  getById: (id) => 
    api.get(`/pdfs/${id}`),
  
  upload: (formData) => 
    api.post('/pdfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
  
  delete: (id) => 
    api.delete(`/pdfs/${id}`),
  
  download: (id) => 
    api.get(`/pdfs/${id}/download`, {
      responseType: 'blob',
    }),
};


export const searchAPI = {
  search: (query, type = '', limit = 20) => 
    api.get(`/search?q=${encodeURIComponent(query)}&type=${type}&limit=${limit}`),
  
  getSuggestions: (partialQuery) =>
    api.get(`/search/suggestions?q=${encodeURIComponent(partialQuery)}`),
};

export default api;
