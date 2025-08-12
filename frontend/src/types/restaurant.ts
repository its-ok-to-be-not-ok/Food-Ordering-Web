
export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  description: string;
  rating: number;
  categories: [];
  status: "active" | "inactive" | "banned";
  images: string[];
}

export interface RestaurantCreate {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description?: string;
  categories: string[];
  images?: File[];
}