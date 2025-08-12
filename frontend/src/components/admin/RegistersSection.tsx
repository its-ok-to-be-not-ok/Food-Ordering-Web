import { useState, useEffect } from "react";
import styles from "@/styles/RegistersSection.module.css";
import { getAllPendingRegistrations, updateRegistrationStatus } from "@/services/restaurantService";

const DEFAULT_CITIES = [
  "Hà Nội",
  "Hồ Chí Minh",
  "Đà Nẵng",
  "Nha Trang",
];

export default function RegistersSection({
  accessToken,
  isFull,
  isRegistrations,
}: {
  accessToken: string | null;
  isFull: boolean;
  isRegistrations: boolean;
}) {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cityFilter, setCityFilter] = useState("Hà Nội");
  const [searchUser, setSearchUser] = useState("");
  const [filtered, setFiltered] = useState<any[]>([]);

  // Lấy danh sách đăng ký đang chờ duyệt
  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await getAllPendingRegistrations(accessToken ?? "");
      setRegistrations(Array.isArray(res.data.results) ? res.data.results : []);
    } catch {
      setRegistrations([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!accessToken) return;
    if (isFull || isRegistrations) fetchRegistrations();
  }, [accessToken, isFull, isRegistrations]);

  // Filter và sort
  useEffect(() => {
    let result = registrations;
    // Lọc theo thành phố
    if (cityFilter && cityFilter !== "") {
      result = result.filter(
        (reg: any) =>
          reg.restaurant?.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }
    // Search theo email/SĐT của owner (user đăng ký)
    if (searchUser.trim()) {
      const keyword = searchUser.trim().toLowerCase();
      result = result.filter((reg: any) => {
        const owner = reg.restaurant?.owner || {};
        return (
          owner.email?.toLowerCase().includes(keyword) ||
          owner.phone?.toLowerCase().includes(keyword)
        );
      });
    }
    // Sort theo ngày đăng ký tăng dần
    result = result.slice().sort((a: any, b: any) =>
      new Date(a.registration_date).getTime() - new Date(b.registration_date).getTime()
    );
    setFiltered(result);
  }, [registrations, cityFilter, searchUser]);

  const handleApprove = async (id: number, status: "approved" | "rejected") => {
    if (!accessToken) return;
    if (
      window.confirm(
        status === "approved"
          ? "Bạn có chắc muốn duyệt đăng ký này?"
          : "Bạn có chắc muốn không duyệt đăng ký này?"
      )
    ) {
      await updateRegistrationStatus(accessToken, id, status);
      fetchRegistrations();
    }
  };

  if (!(isFull || isRegistrations)) {
    return (
      <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
        Bạn không có quyền truy cập chức năng này!
      </div>
    );
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Quản lý đơn mở bán</h2>
      <div className={styles.filterBar}>
        <select
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
          className={styles.input}
          style={{ minWidth: 180 }}
        >
          {DEFAULT_CITIES.map((c: string) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Tìm theo email hoặc SĐT người đăng ký"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          className={styles.input}
          style={{ minWidth: 220 }}
        />
        <button
          className={styles.cancelBtn}
          onClick={() => {
            setCityFilter("Hà Nội");
            setSearchUser("");
          }}
        >
          Xoá lọc
        </button>
      </div>
      {loading ? (
        <div>Đang tải...</div>
      ) : filtered.length === 0 ? (
        <div>Không có đơn đăng ký nào.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {filtered.map((reg: any) => (
            <div
              key={reg.id}
              style={{
                background: "#fff",
                borderRadius: 12,
                boxShadow: "0 2px 12px #e5e7eb",
                padding: 24,
                display: "flex",
                gap: 32,
                alignItems: "flex-start",
              }}
            >
              {/* Thông tin nhà hàng */}
              <div style={{ flex: 2 }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: 8 }}>
                  {reg.restaurant?.name}
                </div>
                <div><b>Thể loại:</b> {Array.isArray(reg.restaurant?.categories) ? reg.restaurant.categories.join(", ") : ""}</div>
                <div><b>Mô tả:</b> {reg.restaurant?.description || "Chưa có"}</div>
                <div><b>Địa chỉ:</b> {reg.restaurant?.address}</div>
                <div><b>Thành phố:</b> {reg.restaurant?.city}</div>
                <div><b>SĐT:</b> {reg.restaurant?.phone}</div>
                <div><b>Email:</b> {reg.restaurant?.email || "Chưa có"}</div>
                <div><b>Ngày đăng ký:</b> {reg.registration_date}</div>
                <button
                  className={styles.saveBtn}
                  style={{ marginTop: 12 }}
                  onClick={() => window.open(`/restaurants/${reg.restaurant?.id}`, "_blank")}
                >
                  Xem chi tiết nhà hàng
                </button>
              </div>
              {/* Thông tin user đăng ký (owner) */}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>Người đăng ký</div>
                <div><b>Họ tên:</b> {reg.restaurant?.owner?.username}</div>
                <div><b>Email:</b> {reg.restaurant?.owner?.email}</div>
                <div><b>SĐT:</b> {reg.restaurant?.owner?.phone}</div>
                <div><b>Địa chỉ:</b> {reg.restaurant?.owner?.address}</div>
              </div>
              {/* Nút thao tác */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  className={styles.saveBtn}
                  onClick={() => handleApprove(reg.id, "approved")}
                >
                  Duyệt
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleApprove(reg.id, "rejected")}
                >
                  Không duyệt
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}