import axios from "axios";

// Base axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
};

// Tests API
export const testsAPI = {
  getAll: () => api.get("/tests"),
  getById: (id) => api.get(`/tests/${id}`),
  create: (data) => api.post("/tests", data),
};

// Appointments API
export const appointmentsAPI = {
  create: (data) => api.post("/appointments", data),
  getByUser: (userId) => api.get(`/appointments/user/${userId}`),
  getAll: () => api.get(`/appointments`),
  updateStatus: (id, status) =>
    api.patch(`/appointments/${id}/status`, { status }),
};

// Results API
export const resultsAPI = {
  getAll: () => api.get("/results"),
  getByPatient: (patientId) => api.get(`/results/patient/${patientId}`),
  get: (id) => api.get(`/results/${id}`),
  update: (id, data) => api.put(`/results/${id}`, data),
  publish: (id, data) => api.patch(`/results/${id}/publish`, data),
};

export default api;
