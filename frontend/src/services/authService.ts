import { axiosInstance } from "@/utils/axios";
import { User, AuthResponse } from "@/types/user";

// Đăng ký
export const register = async (
  data: Omit<User, "id"> & { password: string }
): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/users/register/", data);
  return res.data;
};

// Đăng nhập
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await axiosInstance.post("/users/login/", { email, password });
  return res.data;
};

// Lấy thông tin user
export const getUserProfile = () => axiosInstance.get("/users/profile/");

// Cập nhật thông tin user
export const updateUserProfile = (data: Partial<User>) =>
  axiosInstance.put("/users/profile/", data);