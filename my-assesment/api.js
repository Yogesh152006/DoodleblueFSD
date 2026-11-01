import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.response.use(
  response => response,
  error => {
    const message = error.response?.data?.message || error.response?.data?.error ||
      error.message || "Something went wrong while contacting the server.";
    return Promise.reject(new Error(message));
  }
);

export default api;
