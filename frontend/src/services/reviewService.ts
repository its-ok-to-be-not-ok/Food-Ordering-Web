import { axiosInstance, buildConfig } from "@/utils/axios";

// Lấy danh sách review (có thể truyền params lọc)
export const listReviews = (params: any = {}) =>
  axiosInstance.get("/reviews/", buildConfig(undefined, params));

// Tạo review mới
export const createReview = (data: any) =>
  axiosInstance.post("/reviews/create/", data);

// Lấy review của nhà hàng
export const getRestaurantReviews = (restaurantId: string) =>
  axiosInstance.get(`/reviews/restaurant/${restaurantId}/`);

// Lấy review của món ăn
export const getMenuItemReviews = (menuItemId: string) =>
  axiosInstance.get(`/reviews/menu-item/${menuItemId}/`);

// Lấy review của user hiện tại
export const getUserReviews = (accessToken?: string) =>
  axiosInstance.get("/reviews/user/", buildConfig(accessToken));