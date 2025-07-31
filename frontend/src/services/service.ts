// services/api.ts

import axios from "axios";
import { User, AuthResponse } from "@/types/user";

const BASE_URL = "http://localhost:8000/api";

// Create an Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = async (
  data: Omit<User, "id"> & { password: string }
): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/users/register/`, data);
  return res.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axios.post(`${BASE_URL}/users/login/`, { email, password });
  return res.data;
};

// User APIs
export const getUserProfile = () => axiosInstance.get("/users/profile/");
export const updateUserProfile = (data: Partial<User>) =>
  axiosInstance.put("/users/profile/", data);

// Restaurant APIs
export const getUserRestaurants = (userId: string, accessToken: string) =>
  axios.get(`${BASE_URL}/restaurants/user/${userId}/restaurants/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
export const getAllRestaurants = () => axios.get(`${BASE_URL}/restaurants/`);
export const getRestaurantDetails = (id: string) =>
  axios.get(`${BASE_URL}/restaurants/${id}/`);
export const createRestaurant = (data: any) =>
  axiosInstance.post("/restaurants/", data);
export const getRestaurantMenus = (restaurantId: string) =>
  axios.get(`${BASE_URL}/restaurants/${restaurantId}/menus/`);
export const searchRestaurants = (query: string) =>
  axios.get(`${BASE_URL}/restaurants/search/`, { params: { q: query } });
export const getPopularRestaurants = () =>
  axios.get(`${BASE_URL}/restaurants/popular/`);

// Menu Item APIs
export const getMenuItems = (menuId: string) =>
  axios.get(`${BASE_URL}/restaurants/menus/${menuId}/items/`);
export const getMenuItemDetails = (id: string) =>
  axios.get(`${BASE_URL}/restaurants/menu-items/${id}/`);

// Order APIs
export const createOrder = (orderData: any) =>
  axiosInstance.post("/orders/create/", orderData);
export const listOrders = () => axiosInstance.get("/orders/");
export const getOrderDetails = (id: string) =>
  axiosInstance.get(`/orders/${id}/`);
export const updateOrderStatus = (id: string, statusData: any) =>
  axiosInstance.patch(`/orders/${id}/status/`, statusData);
export const getOrderHistory = () => axiosInstance.get("/orders/history/");
export const getRestaurantOrders = (restaurantId: string) =>
  axiosInstance.get(`/orders/restaurant/${restaurantId}/`);

// Review APIs
export const listReviews = (params: any = {}) =>
  axios.get(`${BASE_URL}/reviews/`, { params });
export const createReview = (data: any) =>
  axiosInstance.post("/reviews/create/", data);
export const getRestaurantReviews = (restaurantId: string) =>
  axios.get(`${BASE_URL}/reviews/restaurant/${restaurantId}/`);
export const getMenuItemReviews = (menuItemId: string) =>
  axios.get(`${BASE_URL}/reviews/menu-item/${menuItemId}/`);
export const getUserReviews = () => axiosInstance.get("/reviews/user/");
