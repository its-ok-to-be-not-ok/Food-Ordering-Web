import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import styles from "@/styles/HomePages.module.css";
import { getPopularRestaurants } from '@/services/service';
import RestaurantCard2 from "@/components/restaurants/RestaurantCard2";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  status: string;
  rating: number;
  registered_date: string;
  categories: string[];
}

export default function HomePage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getPopularRestaurants();
        // Nếu API trả về { results: [...] } hoặc { restaurants: [...] }
        const data = res.data?.restaurants || res.data?.results || res.data || [];
        setRestaurants(data);
      } catch (error: any) {
        setError(`Lỗi: ${error.message} (Mã lỗi: ${error.response?.status})`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.banner}>
        <h2>
          <span>Nhà hàng nổi bật</span>
          <br />
          <span>Thượng hạng</span>
        </h2>
        <p>
          Khám phá các nhà hàng được đánh giá cao và yêu thích nhất!
        </p>
      </div>

      <div className={styles.menuSection}>
        <h3>Danh sách nhà hàng nổi bật</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : restaurants.length === 0 ? (
          <p>Không có nhà hàng nổi bật nào</p>
        ) : (
          <div className={styles.restaurantList}>
            {restaurants.map((restaurant) => (
              <RestaurantCard2 key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}