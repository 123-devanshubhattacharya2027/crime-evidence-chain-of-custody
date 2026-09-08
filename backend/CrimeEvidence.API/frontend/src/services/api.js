import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5087/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("crime_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle unauthorized requests
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("crime_token");
      localStorage.removeItem("crime_user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;