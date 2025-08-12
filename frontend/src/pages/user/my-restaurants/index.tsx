import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Restaurant } from "@/types/restaurant";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { getUserRestaurants, toggleRestaurantStatus, deleteRestaurant } from "@/services/restaurantService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import styles from "@/styles/MyRestaurants.module.css";
import RegisterRestaurantsTab from "@/components/restaurants/RegisterRestaurantsTab";

export default function MyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"restaurants" | "registers">("restaurants");

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const accessToken = useSelector((state: RootState) => state.auth.access);
  const router = useRouter();

  useEffect(() => {
    if (!userId || !accessToken) {
      setRestaurants([]);
      setLoading(false);
      return;
    }
    if (activeTab === "restaurants") {
      setLoading(true);
      getUserRestaurants(userId, accessToken)
        .then((res) => {
          setRestaurants(Array.isArray(res.data) ? res.data : res.data.results || []);
        })
        .catch(() => {
          setRestaurants([]);
        })
        .finally(() => setLoading(false));
    }
  }, [userId, accessToken, activeTab]);

  // Đóng/mở cửa nhà hàng
  const handleToggleStatus = async (restaurantId: number, currentStatus: string) => {
    if (!accessToken) return;
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await toggleRestaurantStatus(restaurantId, newStatus, accessToken);
    setRestaurants((prev) =>
      prev.map((r) => (String(r.id) === String(restaurantId) ? { ...r, status: newStatus } : r))
    );
  };

  // Xoá nhà hàng
  const handleDelete = async (restaurantId: number) => {
    if (!accessToken) return;
    if (window.confirm("Bạn có chắc muốn xoá nhà hàng này?")) {
      try {
        await deleteRestaurant(String(restaurantId), accessToken);
        setRestaurants((prev) => prev.filter((r) => String(r.id) !== String(restaurantId)));
        alert("Xoá thành công!");
      } catch (err: any) {
        alert("Xoá thất bại! " + (err?.response?.data?.error || err.message));
      }
    }
  };

  return (
    <main className={styles.container}>
      {/* Header */}
      <div className={styles.headerRow}>
        <button
          className={styles.backBtn}
          onClick={() => router.push("/")}
          title="Trở về trang chủ"
        >
          ← Trang chủ
        </button>
        <h1 className={styles.headerTitle}>Quản lý quán ăn</h1>
      </div>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tabBtn} ${activeTab === "restaurants" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("restaurants")}
        >
          Quán ăn hiện có
        </button>
        <button
          className={`${styles.tabBtn} ${activeTab === "registers" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("registers")}
        >
          Đơn đăng ký quán ăn
        </button>
      </div>
      {/* Content */}
      {activeTab === "restaurants" && (
        <>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : restaurants.length === 0 ? (
            <div className={styles.empty}>
              <p>Bạn chưa đăng ký quán ăn nào.</p>
              <Link href="/restaurant/register" className={styles.registerLink}>
                Đăng ký mở quán ăn
              </Link>
            </div>
          ) : (
            <div className={styles.list}>
              {restaurants.map((res) => (
                <RestaurantCard
                  key={res.id}
                  restaurant={res}
                  onToggleStatus={() => handleToggleStatus(Number(res.id), res.status)}
                  onDelete={() => handleDelete(Number(res.id))}
                />
              ))}
            </div>
          )}
        </>
      )}
      {activeTab === "registers" && (
        <div className={styles.registerTabContent}>
          <RegisterRestaurantsTab />
        </div>
      )}
    </main>
  );
}