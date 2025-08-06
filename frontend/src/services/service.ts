import axios from "axios";
import { User, AuthResponse } from "@/types/user";

const BASE_URL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- Auth APIs ----------
export const register = async (
  data: Omit<User, "id"> & { password: string }
): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/users/register/", data);
  return res.data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/users/login/", { email, password });
  return res.data;
};

// ---------- User APIs ----------
export const getUserProfile = () => axiosInstance.get("/users/profile/");
export const updateUserProfile = (data: Partial<User>) =>
  axiosInstance.put("/users/profile/", data);

// ---------- Restaurant APIs ----------
export const getUserRestaurants = (userId: string) =>
  axiosInstance.get(`/restaurants/user/${userId}/`);

export const getAllRestaurants = () =>
  axiosInstance.get("/restaurants/");

export const getRestaurantDetails = (id: string) =>
  axiosInstance.get(`/restaurants/${id}/`);

export const createRestaurant = (data: any) =>
  axiosInstance.post("/restaurants/", data);

export const getRestaurantMenus = (restaurantId: string) =>
  axiosInstance.get(`/restaurants/${restaurantId}/menus/`);

export const searchRestaurants = (query: string) =>
  axiosInstance.get("/restaurants/search/", { params: { q: query } });

export const getPopularRestaurants = () =>
  axiosInstance.get("/restaurants/popular/");

// ---------- Menu Item APIs ----------
export interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export const getMenuItems = async (menuId: string): Promise<MenuItem[]> => {
  const response = await axiosInstance.get(`/menus/${menuId}/items/`);
  return response.data?.items || response.data || [];
};

export const getMenuItemDetails = (id: string) =>
  axiosInstance.get(`/menu-items/${id}/`);

export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const resRestaurants = await getAllRestaurants();
    const restaurants = resRestaurants.data?.restaurants || resRestaurants.data?.results || [];
    console.log("Restaurants fetched:", restaurants);

    if (!Array.isArray(restaurants) || restaurants.length === 0) {
      console.warn("No restaurants found.");
      return [];
    }

    const menuPromises = restaurants.map((restaurant: any) =>
      getRestaurantMenus(restaurant.id.toString())
    );
    const menuResponses = await Promise.all(menuPromises);
    console.log("Menu responses:", menuResponses);

    const allItems: MenuItem[] = [];
    for (const resMenus of menuResponses) {
      const menus = resMenus.data?.menus || resMenus.data || [];
      console.log("Menus for restaurant:", menus);
      if (Array.isArray(menus)) {
        const itemPromises = menus.map((menu: any) =>
          getMenuItems(menu.id.toString())
        );
        const itemResponses = await Promise.all(itemPromises);
        console.log("Item responses:", itemResponses);
        itemResponses.forEach((items) => allItems.push(...(items || [])));
      }
    }

    console.log("All items collected:", allItems);
    return allItems;
  } catch (err: any) {
    console.error("Error fetching all menu items:", err.message, err.response?.status, err.config?.url);
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
  axiosInstance.get("/reviews/", { params });

export const createReview = (data: any) =>
  axiosInstance.post("/reviews/create/", data);

export const getRestaurantReviews = (restaurantId: string) =>
  axiosInstance.get(`/reviews/restaurant/${restaurantId}/`);

export const getMenuItemReviews = (menuItemId: string) =>
  axiosInstance.get(`/reviews/menu-item/${menuItemId}/`);

export const getUserReviews = () => axiosInstance.get("/reviews/user/");