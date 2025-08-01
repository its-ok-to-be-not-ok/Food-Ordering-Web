export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
  status: string;
  category?: string;
  discount?: number;
}

export interface Menu {
  id: number;
  title: string;
  description: string;
  items: MenuItem[];
}