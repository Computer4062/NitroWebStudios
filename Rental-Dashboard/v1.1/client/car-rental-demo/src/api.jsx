import axios from 'axios';

const api = axios.create({
  // Centralized base URL configuration
  baseURL: 'http://localhost:3000',
  timeout: 10000, // Optional: cancels request if backend takes >10 seconds
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;