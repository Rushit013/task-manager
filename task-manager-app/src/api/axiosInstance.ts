import axios from "axios";
import { store } from "../reduxStore/store";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Create an Axios instance with common configurations
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout (adjust as needed)
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const state = store.getState(); // Get the latest state from Redux
    const token = state?.auth?.userToken; // Retrieve token from Redux
    if (token && config.headers) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
