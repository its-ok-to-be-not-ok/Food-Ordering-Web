import axios from "axios";
import { User, AuthResponse } from "@/types/user";

const BASE_URL = "http://localhost:8000/api";

// Axios instance có gắn sẵn token
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- Auth APIs ----------
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

// ---------- User APIs ----------
export const getUserProfile = () => axiosInstance.get("/users/profile/");
export const updateUserProfile = (data: Partial<User>) =>
  axiosInstance.put("/users/profile/", data);

// ---------- Restaurant APIs ----------
export const getUserRestaurants = (userId: string) =>
  axiosInstance.get(`/restaurants/user/${userId}/restaurants/`);

export const getAllRestaurants = () =>
  axiosInstance.get(`/restaurants/`);

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

// ---------- Menu Item APIs ----------
export const getMenuItems = async (menuId: string) => {
  const response = await axios.get(`${BASE_URL}/restaurants/menus/${menuId}/items/`);
  return response.data;
};

export const getMenuItemDetails = (id: string) =>
  axios.get(`${BASE_URL}/restaurants/menu-items/${id}/`);

export const getAllMenuItems = async () => {
  const allItems: any[] = [];

  try {
    const resRestaurants = await getAllRestaurants();
    const restaurants = resRestaurants.data.results || resRestaurants.data;

    for (const restaurant of restaurants) {
      const resMenus = await getRestaurantMenus(restaurant.id);
      const menus = resMenus.data;

      for (const menu of menus) {
        const itemsResponse = await getMenuItems(menu.id);
        const items = Array.isArray(itemsResponse) ? itemsResponse : itemsResponse.data;

        if (Array.isArray(items)) {
          allItems.push(...items);
        } else {
          console.warn(`Menu ${menu.id} trả về dữ liệu không hợp lệ`, items);
        }
      }
    }

    return allItems;
  } catch (err) {
    console.error("Lỗi khi lấy tất cả món ăn:", err);
    return [];
  }
};

// ---------- Order APIs ----------
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

// ---------- Review APIs ----------
export const listReviews = (params: any = {}) =>
  axios.get(`${BASE_URL}/reviews/`, { params });

export const createReview = (data: any) =>
  axiosInstance.post("/reviews/create/", data);

export const getRestaurantReviews = (restaurantId: string) =>
  axios.get(`${BASE_URL}/reviews/restaurant/${restaurantId}/`);

export const getMenuItemReviews = (menuItemId: string) =>
  axios.get(`${BASE_URL}/reviews/menu-item/${menuItemId}/`);

export const getUserReviews = () => axiosInstance.get("/reviews/user/");