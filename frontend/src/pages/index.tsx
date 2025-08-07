import { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import styles from "@/styles/HomePages.module.css";
import { getAllMenuItems } from "@/services/service";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export default function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items: MenuItem[] = await getAllMenuItems();

        // Kiểm tra dữ liệu hợp lệ trước khi set
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
        <h3>Danh sách món ăn</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p className={styles.errorMessage}>{error}</p>
        ) : menuItems.length === 0 ? (
          <p>Không có món ăn nào.</p>
        ) : (
          <ul className={styles.menuList}>
            {menuItems.map((item) => (
              <li key={item.id} className={styles.menuItem}>
                <h4>{item.name}</h4>
                <p>Giá: {item.price.toLocaleString()}₫</p>
                {item.description && <p>{item.description}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
