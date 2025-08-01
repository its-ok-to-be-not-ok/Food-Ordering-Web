// services/api.ts

import axios from "axios";
import { User, AuthResponse } from "@/types/user";
import { RestaurantCreate } from "@/types/restaurant";
import { Menu } from "@/types/menu";


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

export const getUserRegistrations = (accessToken: string, status?: string) =>
  axios.get(`${BASE_URL}/users/registrations/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    params: status ? { status } : {},
  });

export const withdrawRegistration = (accessToken: string, id: number) =>
  axios.delete(`${BASE_URL}/users/registrations/${id}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

// Restaurant APIs
export const getUserRestaurants = (userId: string, accessToken: string) =>
  axios.get(`${BASE_URL}/restaurants/user/${userId}/restaurants/`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

export const createRestaurant = (accessToken: string, data: RestaurantCreate) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "images" && Array.isArray(value)) {
      value.forEach((file) => formData.append("images", file));
    } else if (key === "categories" && Array.isArray(value)) {
      formData.append("categories", JSON.stringify(value));
    } else if (value !== undefined) {
      formData.append(key, value as string);
    }
  });
  return axios.post(`${BASE_URL}/restaurants/create/`, formData, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};


export const getRestaurantMenus = (restaurantId: string, accessToken?: string) =>
  axios.get<Menu[]>(`${BASE_URL}/restaurants/${restaurantId}/menus/`, {
    headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
  });
  
export const getAllRestaurants = () => axios.get(`${BASE_URL}/restaurants/`);

export const getRestaurantDetails = (id: string) =>
  axios.get(`${BASE_URL}/restaurants/${id}/`);

export const searchRestaurants = (query: string) =>
  axios.get(`${BASE_URL}/restaurants/search/`, { params: { q: query } });
export const getPopularRestaurants = () =>
  axios.get(`${BASE_URL}/restaurants/popular/`);

// MENU APIs
export const createMenu = (
  restaurantId: string,
  data: { title: string; description?: string },
  accessToken: string
) =>
  axios.post(
    `${BASE_URL}/restaurants/${restaurantId}/menus/`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const updateMenu = (
  menuId: string,
  data: { title?: string; description?: string },
  accessToken: string
) =>
  axios.put(
    `${BASE_URL}/restaurants/menus/${menuId}/`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const deleteMenu = (menuId: string, accessToken: string) =>
  axios.delete(
    `${BASE_URL}/restaurants/menus/${menuId}/`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

// MENU ITEM APIs
export const createMenuItem = (
  menuId: string,
  data: {
    name: string;
    description?: string;
    price: number;
    image?: string;
    status?: string;
    category?: string;
    discount?: number;
  },
  accessToken: string
) =>
  axios.post(
    `${BASE_URL}/restaurants/menus/${menuId}/items/`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const updateMenuItem = (
  itemId: string,
  data: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
    status?: string;
    category?: string;
    discount?: number;
  },
  accessToken: string
) =>
  axios.put(
    `${BASE_URL}/restaurants/menu-items/${itemId}/`,
    data,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

export const deleteMenuItem = (itemId: string, accessToken: string) =>
  axios.delete(
    `${BASE_URL}/restaurants/menu-items/${itemId}/`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

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
