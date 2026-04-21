import axios from "axios";

export const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
});

API.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});



