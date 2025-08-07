import { useEffect, useState } from "react";
import Link from "next/link";
import { Restaurant } from "@/types/restaurant";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { getUserRestaurants, toggleRestaurantStatus, deleteRestaurant } from "@/services/service";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function MyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const accessToken = useSelector((state: RootState) => state.auth.access);

  useEffect(() => {
    if (!userId || !accessToken) {
      setRestaurants([]);
      setLoading(false);
      return;
    }
    getUserRestaurants(userId, accessToken)
      .then((res) => {
        setRestaurants(Array.isArray(res.data) ? res.data : res.data.results || []);
      })
      .catch(() => {
        setRestaurants([]);
      })
      .finally(() => setLoading(false));
  }, [userId, accessToken]);

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
      await deleteRestaurant(restaurantId, accessToken);
      setRestaurants((prev) => prev.filter((r) => String(r.id) !== String(restaurantId)));
      alert("Xoá thành công!");
    } catch (err: any) {
      alert("Xoá thất bại! " + (err?.response?.data?.error || err.message));
    }
  }
};

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>Quản lý quán ăn của tôi</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <>
          {restaurants.length === 0 ? (
            <div style={{ background: "#FEF9C3", padding: 16, borderRadius: 8 }}>
              <p>Bạn chưa đăng ký quán ăn nào.</p>
              <Link href="/restaurant/register" style={{ color: "#2563eb", textDecoration: "underline" }}>
                Đăng ký mở quán ăn
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 20 }}>
              {restaurants.map((res) => (
                <div key={res.id}>
                  <RestaurantCard restaurant={res} />
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <Link
                      href={`/user/my-restaurants/${res.id}`}
                      style={{
                        padding: "6px 14px",
                        background: "#2563eb",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Quản lý thông tin
                    </Link>
                    <Link
                      href={`/user/my-restaurants/${res.id}/menu`}
                      style={{
                        padding: "6px 14px",
                        background: "#22c55e",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Quản lý thực đơn
                    </Link>
                    <Link
                      href={`/owner/restaurants/${res.id}/orders`}
                      style={{
                        padding: "6px 14px",
                        background: "#f59e42",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Đơn đặt hàng
                    </Link>
                    <Link
                      href={`/owner/restaurants/${res.id}/report`}
                      style={{
                        padding: "6px 14px",
                        background: "#64748b",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 14,
                        textDecoration: "none",
                      }}
                    >
                      Báo cáo kinh doanh
                    </Link>
                    <button
                      onClick={() => handleToggleStatus(Number(res.id), res.status)}
                      style={{
                        padding: "6px 14px",
                        background: res.status === "active" ? "#f87171" : "#22d3ee",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {res.status === "active" ? "Đóng cửa" : "Mở cửa"}
                    </button>
                    <button
                      onClick={() => handleDelete(Number(res.id))}
                      style={{
                        padding: "6px 14px",
                        background: "#ef4444",
                        color: "#fff",
                        borderRadius: 6,
                        fontSize: 14,
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Xoá nhà hàng
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}