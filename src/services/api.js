import axios from "axios";
import { useState, useEffect } from "react";

const API = axios.create({
  baseURL: "http://43.204.68.152:8080"
});

// Add JWT automatically (FIXED)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  // ❗ DO NOT attach token for login/register/reset-password
  if (
    token &&
    !config.url.includes("/login") &&
    !config.url.includes("/register") &&
    !config.url.includes("/forgot-password") &&
    !config.url.includes("/reset-password")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Handle expired token
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Token expired → logging out");

      localStorage.removeItem("token");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default API;