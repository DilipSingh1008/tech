// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      // optional: redirect user to login page
    }
    return Promise.reject(error);
  },
);

export const createItem = async (resource, data) => {
  try {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const response = await api.post(`/${resource}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getItems = async (resource) => {
  try {
    const response = await api.get(`/${resource}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getItemById = async (resource, id) => {
  try {
    const response = await api.get(`/${resource}/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Update item by ID
export const updateItem = async (resource, data) => {
  try {
    const headers =
      data instanceof FormData
        ? { "Content-Type": "multipart/form-data" }
        : { "Content-Type": "application/json" };

    const response = await api.put(`/${resource}`, data, { headers });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const patchItem = async (resource, data) => {
  try {
    // console.log(id)
    const response = await api.patch(`/${resource}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Delete item by ID
export const deleteItem = async (resource) => {
  try {
    const response = await api.delete(`/${resource}/`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;
