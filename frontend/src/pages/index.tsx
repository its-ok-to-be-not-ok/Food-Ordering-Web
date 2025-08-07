"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import styles from "@/styles/HomePages.module.css";
<<<<<<< HEAD
import { getPopularRestaurants } from '@/services/service';
import RestaurantCard2 from "@/components/restaurants/RestaurantCard2";
=======
import { getAllMenuItems } from "@/services/service";
>>>>>>> 70b1de870703059ac66ad67b8de14aabd513e3d2

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

interface CartItem extends MenuItem {
  quantity: number;
}

export default function HomePage() {
<<<<<<< HEAD
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
=======
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
>>>>>>> 70b1de870703059ac66ad67b8de14aabd513e3d2
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]); // giỏ hàng
  const [quantities, setQuantities] = useState<Record<number, number>>({}); // lưu số lượng cho từng món

  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
<<<<<<< HEAD
        const res = await getPopularRestaurants();
        // Nếu API trả về { results: [...] } hoặc { restaurants: [...] }
        const data = res.data?.restaurants || res.data?.results || res.data || [];
        setRestaurants(data);
      } catch (error: any) {
        setError(`Lỗi: ${error.message} (Mã lỗi: ${error.response?.status})`);
=======
        const items = await getAllMenuItems();
        if (Array.isArray(items)) {
          setMenuItems(items);
        } else {
          setError("Dữ liệu trả về không hợp lệ.");
        }
      } catch (err: any) {
        setError(
          `Lỗi: ${err.message || "Không xác định"} (Mã lỗi: ${err?.response?.status || "N/A"})`
        );
>>>>>>> 70b1de870703059ac66ad67b8de14aabd513e3d2
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = menuItems.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(query);
      const descMatch = item.description?.toLowerCase().includes(query);
      return nameMatch || descMatch;
    });
    setFilteredItems(filtered);
  }, [query, menuItems]);

  const handleQuantityChange = (id: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    const existing = cart.find((cartItem) => cartItem.id === item.id);

    if (existing) {
      setCart((prev) =>
        prev.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      );
    } else {
      setCart((prev) => [...prev, { ...item, quantity }]);
    }

    alert(`Đã thêm ${quantity} "${item.name}" vào giỏ hàng.`);
  };

  return (
    <>
      <Header />
      <div className={styles.banner}>
        <h2>
          <span>Nhà hàng nổi bật</span>
          <br />
          <span>Thượng hạng</span>
        </h2>
<<<<<<< HEAD
        <p>
          Khám phá các nhà hàng được đánh giá cao và yêu thích nhất!
        </p>
      </div>

      <div className={styles.menuSection}>
        <h3>Danh sách nhà hàng nổi bật</h3>
=======
        <p>Chuyên cung cấp món ăn đảm bảo dinh dưỡng và phù hợp đến người dùng</p>
      </div>

      <div className={styles.menuSection}>
        <h3>Danh sách món ăn {query && `(tìm: "${query}")`}</h3>
>>>>>>> 70b1de870703059ac66ad67b8de14aabd513e3d2
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
<<<<<<< HEAD
        ) : restaurants.length === 0 ? (
          <p>Không có nhà hàng nổi bật nào</p>
        ) : (
          <div className={styles.restaurantList}>
            {restaurants.map((restaurant) => (
              <RestaurantCard2 key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
=======
        ) : filteredItems.length === 0 ? (
          <p>Không tìm thấy món ăn phù hợp.</p>
        ) : (
          <ul className={styles.menuGrid}>
            {filteredItems.map((item) => (
              <li key={item.id} className={styles.menuCard}>
                <h4>{item.name}</h4>
                <p>Giá: {item.price.toLocaleString()}₫</p>
                {item.description && <p>{item.description}</p>}

                <div className={styles.controls}>
                  <input
                    type="number"
                    min="1"
                    defaultValue="1"
                    className={styles.quantityInput}
                  />
                  <button className={styles.addButton}>Thêm vào giỏ</button>
                </div>
              </li>
            ))}
          </ul>

>>>>>>> 70b1de870703059ac66ad67b8de14aabd513e3d2
        )}
      </div>
    </>
  );
}
