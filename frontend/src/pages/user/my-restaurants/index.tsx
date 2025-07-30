import { useEffect, useState } from "react";
import Link from "next/link";
import { Restaurant } from "@/types/restaurant";
import RestaurantCard from "@/components/restaurants/RestaurantCard";

// Mock data cho các quán ăn đã đăng ký
const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Nhà hàng Hải Sản Biển Đông",
    address: "123 Đường Biển, Quận 7, TP.HCM",
    phone: "0909 123 456",
    description: "Chuyên các món hải sản tươi sống, không gian rộng rãi, phục vụ chuyên nghiệp.",
    rating: 4.7,
    categories: ["Hải sản", "Lẩu", "Nướng"],
    active: true,
  },
  {
    id: "2",
    name: "Bún Bò Huế O Loan",
    address: "45 Nguyễn Trãi, Quận 5, TP.HCM",
    phone: "0988 654 321",
    description: "Bún bò chuẩn vị Huế, nước dùng đậm đà, phục vụ nhanh chóng.",
    rating: 4.3,
    categories: ["Bún", "Món Huế"],
    active: true,
  },
];

export default function MyRestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập gọi API lấy danh sách quán ăn
    setTimeout(() => {
      setRestaurants(mockRestaurants);
      setLoading(false);
    }, 800);
  }, []);

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
                      href={`/owner/restaurants/${res.id}`}
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
                      href={`/owner/restaurants/${res.id}/menu`}
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