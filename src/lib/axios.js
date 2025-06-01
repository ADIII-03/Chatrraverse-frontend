import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://chattraverse-backend.onrender.com/api/',
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("chat-app-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
