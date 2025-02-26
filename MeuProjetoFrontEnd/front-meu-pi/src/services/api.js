// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7075/api", // URL base da API
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;