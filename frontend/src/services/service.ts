import axios from "axios";
import { User, AuthResponse } from "@/types/user";
import { RestaurantCreate } from "@/types/restaurant";
import { Menu, MenuItem } from "@/types/menu";


const BASE_URL = "http://localhost:8000/api";

// ------------------ Axios instance có token ------------------
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
export { axiosInstance };
// ------------------ Auth APIs ------------------
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

// ------------------ User APIs ------------------
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

// Đóng/mở cửa nhà hàng
export const toggleRestaurantStatus = (
  restaurantId: number,
  status: string,
  accessToken: string
) =>
  axios.patch(
    `${BASE_URL}/restaurants/${restaurantId}/`,
    { status },
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

// Xoá nhà hàng
export const deleteRestaurant = (
  restaurantId: number,
  accessToken: string
) =>
  axios.delete(
    `${BASE_URL}/restaurants/${restaurantId}/`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );

  // Lấy chi tiết nhà hàng
export const getRestaurantDetail = (id: string, accessToken: string) =>
  axios.get(`${BASE_URL}/restaurants/${id}/`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

// Cập nhật thông tin nhà hàng
export const updateRestaurant = (id: string, accessToken: string, data: RestaurantCreate) => {
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
  return axios.put(`${BASE_URL}/restaurants/${id}/`, formData, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

// ------------------ Menu Item APIs ------------------
export const getMenuItems = async (menuId: string) => {
  const response = await axios.get(`${BASE_URL}/restaurants/menus/${menuId}/items/`);
  return response.data;
};

export const getMenuItemDetails = (id: string) =>
  axiosInstance.get(`/menu-items/${id}/`);
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

export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  try {
    const res = await axiosInstance.get("/restaurants/");
    const restaurants = res.data.results;

    if (!Array.isArray(restaurants)) {
      throw new Error("Dữ liệu trả về không phải danh sách nhà hàng.");
    }

    // Remove the first allItems declaration and related unused code

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
      const menus = resMenus.data || [];
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
  } catch (error) {
    console.error("Lỗi khi lấy danh sách món ăn:", error);
    throw error;
  }
};
// ------------------ Order APIs ------------------
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

// ------------------ Review APIs ------------------
export const listReviews = (params: any = {}) =>
  axios.get(`${BASE_URL}/reviews/`, { params });

export const createReview = (data: any) =>
  axiosInstance.post("/reviews/create/", data);

export const getRestaurantReviews = (restaurantId: string) =>
  axios.get(`${BASE_URL}/reviews/restaurant/${restaurantId}/`);

export const getMenuItemReviews = (menuItemId: string) =>
  axios.get(`${BASE_URL}/reviews/menu-item/${menuItemId}/`);

export const getUserReviews = () => axiosInstance.get("/reviews/user/");

export const adminLogin = (data: { email: string; password: string }) =>
  axios.post(`${BASE_URL}/users/admin/login/`, data);

export const getAdminAccounts = (accessToken: string) =>
  axios.get(`${BASE_URL}/users/admins/`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

export const deleteAdminAccount = (id: number, accessToken: string) =>
  axios.delete(`${BASE_URL}/users/admins/${id}/`, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

export const updateAdminPermissions = (id: number, data: { permissions: string }, accessToken: string) =>
  axios.patch(`${BASE_URL}/users/admins/${id}/`, data, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });

export const createAdminAccount = (
  data: { username: string; email: string; password: string; permissions?: string },
  accessToken: string
) =>
  axios.post(`${BASE_URL}/users/admins/`, data, {
    headers: { Authorization: `Bearer ${accessToken}` }
  });