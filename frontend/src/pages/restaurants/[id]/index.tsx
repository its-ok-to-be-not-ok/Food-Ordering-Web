import { useEffect, useState } from "react";
import styles from "@/styles/RestaurantDetail.module.css";
import { getRestaurantDetail } from "@/services/service";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function RestaurantDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useSelector((state: RootState) => state.auth.access); // Lấy accessToken từ authSlice
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await getRestaurantDetail(id as string, accessToken ?? "");
        setRestaurant(res.data);
      } catch {
        setRestaurant(null);
      }
      setLoading(false);
    };
    fetchDetail();
  }, [id, accessToken]);

  if (loading) return <div className={styles.loading}>Đang tải...</div>;
  if (!restaurant) return <div className={styles.error}>Không tìm thấy nhà hàng.</div>;

  return (
    <div className={styles.container}>
      {/* Phần thông tin nhà hàng */}
      <div className={styles.header}>
        <img
          src={restaurant.image || "/default-restaurant.jpg"}
          alt={restaurant.name}
          className={styles.restaurantImage}
        />
        <div className={styles.info}>
          <h1 className={styles.name}>{restaurant.name}</h1>
          <div className={styles.status}>
            <span
              className={
                restaurant.status === "active"
                  ? styles.active
                  : restaurant.status === "inactive"
                  ? styles.inactive
                  : styles.suspended
              }
            >
              {restaurant.status === "active"
                ? "Hoạt động"
                : restaurant.status === "inactive"
                ? "Không hoạt động"
                : "Tạm ngưng"}
            </span>
          </div>
          <div className={styles.rating}>
            ⭐ {restaurant.rating?.toFixed(1) || "Chưa có đánh giá"}
          </div>
          <div className={styles.address}>📍 {restaurant.address}</div>
          <div className={styles.contact}>
            ☎ {restaurant.phone} | ✉ {restaurant.email}
          </div>
          <div className={styles.categories}>
            <b>Loại món:</b>{" "}
            {(restaurant.categories || []).map((cat: string) => (
              <span key={cat} className={styles.categoryTag}>{cat}</span>
            ))}
          </div>
          <div className={styles.description}>{restaurant.description}</div>
          <div className={styles.registered}>
            Đăng ký: {new Date(restaurant.registered_date).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Phần menu đặt món */}
      <div className={styles.menuSection}>
        <h2 className={styles.menuTitle}>Menu</h2>
        {restaurant.menus && restaurant.menus.length > 0 ? (
          restaurant.menus.map((menu: any) => (
            <div key={menu.id} className={styles.menuBlock}>
              <h3 className={styles.menuName}>{menu.title}</h3>
              <div className={styles.menuDesc}>{menu.description}</div>
              <div className={styles.menuItems}>
                {menu.items && menu.items.length > 0 ? (
                  menu.items.map((item: any) => (
                    <div key={item.id} className={styles.menuItemCard}>
                      <img
                        src={item.image || "/default-food.jpg"}
                        alt={item.name}
                        className={styles.menuItemImage}
                      />
                      <div className={styles.menuItemInfo}>
                        <div className={styles.menuItemName}>{item.name}</div>
                        <div className={styles.menuItemDesc}>{item.description}</div>
                        <div className={styles.menuItemPrice}>
                          Giá: {item.price}₫{" "}
                          {item.discount > 0 && (
                            <span className={styles.menuItemDiscount}>
                              -{item.discount}₫
                            </span>
                          )}
                        </div>
                        <div className={styles.menuItemStatus}>
                          {item.status === "available"
                            ? "Còn hàng"
                            : item.status === "out_of_stock"
                            ? "Hết hàng"
                            : "Ngừng bán"}
                        </div>
                        <button
                          className={styles.orderBtn}
                          disabled={item.status !== "available"}
                          onClick={() => alert(`Đặt món: ${item.name}`)}
                        >
                          Đặt món
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={styles.menuItemEmpty}>Menu chưa có món nào.</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={styles.menuEmpty}>Nhà hàng chưa có menu.</div>
        )}
      </div>
    </div>
  );
}