import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const api = axios.create({
  baseURL,
  headers: { Accept: 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const hadToken = Boolean(error.config?.headers?.Authorization);
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token');
      if (!window.location.pathname.startsWith('/login')) {
        window.location.assign('/login');
      }
    }
    return Promise.reject(error);
  }
);

export const getErrorMessage = (error, fallback = 'Ocorreu um erro. Tente novamente.') =>
  error?.response?.data?.message ||
  (typeof error?.response?.data?.error === 'string' ? error.response.data.error : null) ||
  Object.values(error?.response?.data?.errors ?? {})?.[0]?.[0] ||
  fallback;

/* Auth */
export const loginRequest = (credentials) =>
  api.post('/api/login', credentials).then((response) => response.data);
export const registerRequest = (data) =>
  api.post('/api/register', data).then((response) => response.data);
export const logoutRequest = () => api.post('/api/logout').catch(() => null);
export const getCurrentUser = () => api.get('/api/user').then((response) => response.data);

/* Produtos */
export const getProducts = () => api.get('/api/products').then((response) => response.data);
export const getProduct = (id) =>
  api.get(`/api/products/${id}`).then((response) => response.data);
export const createProduct = (data) =>
  api.post('/api/products', data).then((response) => response.data);
export const updateProduct = (id, data) =>
  api.put(`/api/products/${id}`, data).then((response) => response.data);
export const deleteProduct = (id) => api.delete(`/api/products/${id}`);

/* Encomendas */
export const getOrders = () => api.get('/api/orders').then((response) => response.data);
export const getOrder = (id) => api.get(`/api/orders/${id}`).then((response) => response.data);
export const createOrder = (data) =>
  api.post('/api/orders', data).then((response) => response.data);
export const updateOrder = (id, data) =>
  api.put(`/api/orders/${id}`, data).then((response) => response.data);
export const deleteOrder = (id) => api.delete(`/api/orders/${id}`);

export default api;
