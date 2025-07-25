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
  phone?: string;
  description?: string;
  imageUrl?: string;
  menu: MenuItem[];
}
