import { MenuItem } from './restaurant';

export interface OrderItem {
  item: MenuItem;
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}