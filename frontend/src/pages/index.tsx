"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import styles from "@/styles/HomePages.module.css";
import { getAllMenuItems } from "@/services/service";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]); // giỏ hàng
  const [quantities, setQuantities] = useState<Record<number, number>>({}); // lưu số lượng cho từng món

  const searchParams = useSearchParams();
  const query = searchParams.get("query")?.toLowerCase() || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          <span>Thức ăn</span>
          <br />
          <span>Thượng hạng</span>
        </h2>
        <p>Chuyên cung cấp món ăn đảm bảo dinh dưỡng và phù hợp đến người dùng</p>
      </div>

      <div className={styles.menuSection}>
        <h3>Danh sách món ăn {query && `(tìm: "${query}")`}</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
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

        )}
      </div>
    </>
  );
}
