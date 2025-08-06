import axios from "axios";
import { User, AuthResponse } from "@/types/user";
import { RestaurantCreate } from "@/types/restaurant";
import { Menu } from "@/types/menu";


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

<<<<<<< HEAD
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
=======
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
>>>>>>> 2725845c2be318bf4ceaa0dfb42fca2314e3efee

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

<<<<<<< HEAD
export const getMenuItemDetails = (id: string) =>
  axiosInstance.get(`/menu-items/${id}/`);
=======
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
>>>>>>> 2725845c2be318bf4ceaa0dfb42fca2314e3efee

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