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
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // ✅ Extract and log the actual error message from the server
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      // ✅ Handle network errors (no response from server)
      console.error("Network Error: No response received from server.");
    } else {
      // ✅ Handle unexpected errors
      console.error("Unexpected Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
