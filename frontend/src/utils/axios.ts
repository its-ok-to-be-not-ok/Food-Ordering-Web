import axios from "axios";

export const BASE_URL = "http://localhost:8000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export function buildConfig(token?: string, params?: any) {
  const config: any = {};
  if (token) {
    config.headers = { Authorization: `Bearer ${token}` };
  }
  if (params) {
    config.params = params;
  }
  return config;
}