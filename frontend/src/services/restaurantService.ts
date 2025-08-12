import { axiosInstance, buildConfig } from "@/utils/axios";
import { RestaurantCreate } from "@/types/restaurant";

// Lấy tất cả nhà hàng
export const getAllRestaurants = () => axiosInstance.get("/restaurants/");

// Lấy chi tiết nhà hàng
export const getRestaurantDetail = (id: string, accessToken?: string) =>
  axiosInstance.get(`/restaurants/${id}/`, buildConfig(accessToken));

// Tìm kiếm nhà hàng
export const searchRestaurants = (query: string, accessToken?: string) =>
  axiosInstance.get("/restaurants/search/", buildConfig(accessToken, { q: query }));

// Tạo nhà hàng mới
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
  return axiosInstance.post("/restaurants/create/", formData, buildConfig(accessToken));
};

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
  return axiosInstance.put(`/restaurants/${id}/`, formData, buildConfig(accessToken));
};

// Xoá nhà hàng
export const deleteRestaurant = (id: string, accessToken: string) =>
  axiosInstance.delete(`/restaurants/${id}/`, buildConfig(accessToken));

// Đóng/mở cửa nhà hàng
export const toggleRestaurantStatus = (
  restaurantId: number,
  status: string,
  accessToken: string
) =>
  axiosInstance.patch(
    `/restaurants/${restaurantId}/`,
    { status },
    buildConfig(accessToken)
  );

// Lấy menu của nhà hàng
export const getRestaurantMenus = (restaurantId: string, accessToken?: string) =>
  axiosInstance.get(`/restaurants/${restaurantId}/menus/`, buildConfig(accessToken));

// Lấy nhà hàng của user
export const getUserRestaurants = (userId: string, accessToken: string) =>
  axiosInstance.get(`/restaurants/user/${userId}/restaurants/`, buildConfig(accessToken));

// Lấy nhà hàng nổi bật
export const getPopularRestaurants = () =>
  axiosInstance.get("/restaurants/popular/");

// Lấy đăng ký của user
export const getUserRegistrations = (accessToken: string, status?: string) =>
  axiosInstance.get("/users/registrations/", buildConfig(accessToken, status ? { status } : {}));

// Lấy tất cả đăng ký đang chờ duyệt
export const getAllPendingRegistrations = (accessToken: string) =>
  axiosInstance.get("/users/registrations/pending/", buildConfig(accessToken));

// Rút đăng ký
export const withdrawRegistration = (accessToken: string, id: number) =>
  axiosInstance.delete(`/users/registrations/${id}/`, buildConfig(accessToken));

export const updateRegistrationStatus = (accessToken: string, id: number, status: string) =>
  axiosInstance.patch(`/users/registrations/${id}/status/`, { status }, buildConfig(accessToken));

// Lấy món ăn của menu
export const getMenuItems = async (menuId: string, accessToken?: string) => {
  const response = await axiosInstance.get(
    `/restaurants/menus/${menuId}/items/`,
    buildConfig(accessToken)
  );
  return response.data;
};

// Lấy chi tiết món ăn
export const getMenuItemDetails = (id: string, accessToken?: string) =>
  axiosInstance.get(`/menu-items/${id}/`, buildConfig(accessToken));

// MENU APIs
export const createMenu = (
  restaurantId: string,
  data: { title: string; description?: string },
  accessToken: string
) =>
  axiosInstance.post(
    `/restaurants/${restaurantId}/menus/`,
    data,
    buildConfig(accessToken)
  );

export const updateMenu = (
  menuId: string,
  data: { title?: string; description?: string },
  accessToken: string
) =>
  axiosInstance.put(
    `/restaurants/menus/${menuId}/`,
    data,
    buildConfig(accessToken)
  );

export const deleteMenu = (menuId: string, accessToken: string) =>
  axiosInstance.delete(
    `/restaurants/menus/${menuId}/`,
    buildConfig(accessToken)
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
  axiosInstance.post(
    `/restaurants/menus/${menuId}/items/`,
    data,
    buildConfig(accessToken)
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
  axiosInstance.put(
    `/restaurants/menu-items/${itemId}/`,
    data,
    buildConfig(accessToken)
  );

export const deleteMenuItem = (itemId: string, accessToken: string) =>
  axiosInstance.delete(
    `/restaurants/menu-items/${itemId}/`,
    buildConfig(accessToken)
  );

// // Lấy tất cả món ăn của tất cả nhà hàng
// export const getAllMenuItems = async (accessToken?: string): Promise<MenuItem[]> => {
//   try {
//     const res = await axiosInstance.get("/restaurants/", buildConfig(accessToken));
//     const restaurants = res.data.results;

//     if (!Array.isArray(restaurants) || restaurants.length === 0) {
//       console.warn("No restaurants found.");
//       return [];
//     }

//     const menuPromises = restaurants.map((restaurant: any) =>
//       getRestaurantMenus(restaurant.id.toString(), accessToken)
//     );
//     const menuResponses = await Promise.all(menuPromises);

//     const allItems: MenuItem[] = [];
//     for (const resMenus of menuResponses) {
//       const menus = resMenus.data || [];
//       if (Array.isArray(menus)) {
//         const itemPromises = menus.map((menu: any) =>
//           getMenuItems(menu.id.toString(), accessToken)
//         );
//         const itemResponses = await Promise.all(itemPromises);
//         itemResponses.forEach((items) => allItems.push(...(items || [])));
//       }
//     }

//     return allItems;
//   } catch (error) {
//     console.error("Lỗi khi lấy danh sách món ăn:", error);
//     throw error;
//   }
// };