import { axiosInstance, buildConfig } from "@/utils/axios";

// Đăng nhập admin
export const adminLogin = (data: { email: string; password: string }) =>
  axiosInstance.post("/users/admin/login/", data);

// Lấy danh sách tài khoản admin
export const getAdminAccounts = (accessToken: string) =>
  axiosInstance.get("/users/admins/", buildConfig(accessToken));

// Xoá tài khoản admin
export const deleteAdminAccount = (id: number, accessToken: string) =>
  axiosInstance.delete(`/users/admins/${id}/`, buildConfig(accessToken));

// Cập nhật quyền admin
export const updateAdminPermissions = (
  id: number,
  data: { permissions: string },
  accessToken: string
) =>
  axiosInstance.patch(`/users/admins/${id}/`, data, buildConfig(accessToken));

// Tạo tài khoản admin mới
export const createAdminAccount = (
  data: { username: string; email: string; password: string; permissions?: string },
  accessToken: string
) =>
  axiosInstance.post("/users/admins/", data, buildConfig(accessToken));

// ...existing code...

// Tìm user theo email hoặc số điện thoại
export const searchUserByContact = (contact: string, accessToken: string) =>
  axiosInstance.get("/users/search/", buildConfig(accessToken, { contact }));

// Lấy danh sách nhà hàng của owner
export const getRestaurantsByOwner = (ownerId: number, accessToken: string) =>
  axiosInstance.get(`/restaurants/user/?user=${ownerId}/restaurants/`, buildConfig(accessToken));

// Lấy danh sách tố cáo vi phạm của nhà hàng
export const getFaultsByRestaurant = (restaurantId: number, accessToken: string) =>
  axiosInstance.get(`/faults/${restaurantId}/`, buildConfig(accessToken));

// Cấm bán nhà hàng
export const banRestaurant = (restaurantId: number, accessToken: string) =>
  axiosInstance.post(`/restaurants/${restaurantId}/ban/`, {}, buildConfig(accessToken));

// Cấm bán toàn bộ nhà hàng của user
export const banUser = (userId: number, accessToken: string) =>
  axiosInstance.post(`/users/${userId}/ban-restaurants/`, {}, buildConfig(accessToken));

// Bỏ cấm bán nhà hàng
export const unbanRestaurant = (restaurantId: number, accessToken: string) =>
  axiosInstance.post(`/restaurants/${restaurantId}/unban/`, {}, buildConfig(accessToken));

// Bỏ cấm bán toàn bộ nhà hàng của user
export const unbanUser = (userId: number, accessToken: string) =>
  axiosInstance.post(`/users/${userId}/unban-restaurants/`, {}, buildConfig(accessToken));

// Xoá user
export const deleteUser = (userId: number, accessToken: string) =>
  axiosInstance.delete(`/users/${userId}/`, buildConfig(accessToken));

