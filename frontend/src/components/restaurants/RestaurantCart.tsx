import './RestaurantCart';
import { Restaurant } from '@/types/restaurant';

interface Props {
  restaurant: Restaurant;
}

export default function RestaurantCard({ restaurant }: Props) {
  return (
    <div className="restaurant-card">
      <h3 className="restaurant-name">{restaurant.name}</h3>
      <p className="restaurant-description">{restaurant.description}</p>
      <a href={`/restaurants/${restaurant.id}`} className="menu-link">
        Xem thực đơn
      </a>
    </div>
  );
}
