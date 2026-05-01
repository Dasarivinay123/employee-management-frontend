import API from "./api";

const REST_API_BASE_URL = "/api/employees";

export const listEmployees = (page, size, keyword) => {
  return API.get(`/api/employees?page=${page}&size=${size}&keyword=${keyword}`);
};

export const createEmployee = (employee) => {
  return API.post(REST_API_BASE_URL, employee);
};

export const getEmployee = (employeeId) => {
  return API.get(`${REST_API_BASE_URL}/${employeeId}`);
};

export const updateEmployee = (employeeId, employee) => {
  return API.put(`${REST_API_BASE_URL}/${employeeId}`, employee);
};

export const deleteEmployee = (employeeId) => {
  return API.delete(`${REST_API_BASE_URL}/${employeeId}`);
};