/**
 * Pre-configured axios instance.
 * Reads the JWT from localStorage and attaches it to every request as
 * `Authorization: Bearer <token>`.
 */
import axios from 'axios';

const TOKEN_KEY = 'ledger_token';

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
