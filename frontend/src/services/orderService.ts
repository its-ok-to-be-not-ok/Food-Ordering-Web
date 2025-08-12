import { axiosInstance, buildConfig } from "@/utils/axios";

// Tạo đơn hàng mới
export const createOrder = (orderData: any) =>
  axiosInstance.post("/orders/create/", orderData);

// Lấy danh sách đơn hàng
export const listOrders = (accessToken?: string) =>
  axiosInstance.get("/orders/", buildConfig(accessToken));

// Lấy chi tiết đơn hàng
export const getOrderDetails = (id: string, accessToken?: string) =>
  axiosInstance.get(`/orders/${id}/`, buildConfig(accessToken));

// Cập nhật trạng thái đơn hàng
export const updateOrderStatus = (id: string, statusData: any, accessToken?: string) =>
  axiosInstance.patch(`/orders/${id}/status/`, statusData, buildConfig(accessToken));

// Lịch sử đơn hàng của user
export const getOrderHistory = (accessToken?: string) =>
  axiosInstance.get("/orders/history/", buildConfig(accessToken));

// Lấy đơn hàng của nhà hàng
export const getRestaurantOrders = (restaurantId: string, accessToken?: string) =>
  axiosInstance.get(`/orders/restaurant/${restaurantId}/`, buildConfig(accessToken));