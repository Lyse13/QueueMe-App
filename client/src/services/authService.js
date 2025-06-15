import axios from "axios";

const API_URL = "http://localhost:3001/api/auth"; // Change port if your backend uses a different one

export const register = (data) => axios.post(`${API_URL}/register`, data);
export const login = (data) => axios.post(`${API_URL}/login`, data);