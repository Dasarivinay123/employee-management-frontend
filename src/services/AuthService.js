import API from "./api";

const AUTH_API_BASE_URL = "/api/auth";

export const registerUser = (user) => {
  return API.post(`${AUTH_API_BASE_URL}/register`, user);
};

export const loginUser = (loginData) => {
  return API.post(`${AUTH_API_BASE_URL}/login`, loginData);
};
export const sendResetLink = (email) => {
    return API.post("/api/auth/forgot-password", { email });
};