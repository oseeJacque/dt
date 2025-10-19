import axios from 'axios';

export const URL = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL
});