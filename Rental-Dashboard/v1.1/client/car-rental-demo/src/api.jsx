import axios from 'axios';

export const base_url = "http://localhost:3000/"

const api = axios.create({
  // Centralized base URL configuration
  baseURL: base_url,
  timeout: 10000, // Optional: cancels request if backend takes >10 seconds
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;