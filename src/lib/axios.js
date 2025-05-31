import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: 'https://chattraverse-backend.onrender.com/api/',
  withCredentials: true,
});
