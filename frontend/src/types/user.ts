

export type UserRole = "customer" | "restaurant_owner";

export interface User {
  id: string;
  username: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  access: string;
  refresh: string;
}
