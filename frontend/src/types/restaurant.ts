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
  phone: string;
  description: string;
  rating: number;
  categories: string[];
  active?: boolean;
  imageUrl?: string;
}

export interface RestaurantCreate {
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  categories: string[];
  images?: File[];
}