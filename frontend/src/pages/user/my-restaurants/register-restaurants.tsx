import { useEffect, useState } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import styles from "@/styles/RegisterRestaurants.module.css";
import { Registration } from "@/types/registration";
import { getUserRegistrations, withdrawRegistration } from "@/services/service";

const STATUS_OPTIONS = [
  { label: "Tất cả", value: "" },
  { label: "Chờ duyệt", value: "pending" },
  { label: "Đã duyệt", value: "approved" },
  { label: "Từ chối", value: "rejected" },
];

export default function RegisterRestaurantsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.access);

  useEffect(() => {
    if (!user || !accessToken) {
      setRegistrations([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getUserRegistrations(accessToken, filter)
      .then((res: any) => {
        // Đảm bảo registrations luôn là mảng
        const data = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data.results)
          ? res.data.results
          : [];
        setRegistrations(data);
      })
      .catch(() => setRegistrations([]))
      .finally(() => setLoading(false));
  }, [user, accessToken, filter]);

  const handleWithdraw = async (id: number) => {
    if (!accessToken) return;
    if (!confirm("Bạn có chắc muốn rút đơn này?")) return;
    await withdrawRegistration(accessToken, id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đăng ký nhà hàng</h1>
      <div className={styles.filterRow}>
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`${styles.filterBtn} ${filter === opt.value ? styles.active : ""}`}
          >
            {opt.label}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <Link href="/user/my-restaurants/create-restaurants">
          <button className={styles.registerBtn}>+ Đăng ký nhà hàng</button>
        </Link>
      </div>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : registrations.length === 0 ? (
        <div className={styles.emptyBox}>
          <p>Bạn chưa có đơn đăng ký nào.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {registrations.map((reg) => (
            <div key={reg.id} className={styles.card}>
              <div className={styles.cardInfo}>
                <div className={styles.restaurantName}>
                  {reg.restaurant?.name || "Chưa có tên"}
                </div>
                <div className={styles.restaurantDesc}>
                  {reg.restaurant?.description || "Không có mô tả"}
                </div>
                <div>
                  <span
                    className={
                      reg.status === "approved"
                        ? styles.statusApproved
                        : reg.status === "pending"
                        ? styles.statusPending
                        : styles.statusRejected
                    }
                  >
                    {reg.status === "approved"
                      ? "Đã duyệt"
                      : reg.status === "pending"
                      ? "Chờ duyệt"
                      : "Từ chối"}
                  </span>
                  <span className={styles.date}>
                    Ngày đăng ký: {new Date(reg.registration_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <Link href={`/user/my-restaurants/registration/${reg.id}`}>
                <button className={styles.detailBtn}>Xem chi tiết</button>
              </Link>
              <button
                onClick={() => handleWithdraw(reg.id)}
                className={styles.withdrawBtn}
              >
                Rút đơn
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}