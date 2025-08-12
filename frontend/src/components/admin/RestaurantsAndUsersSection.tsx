import { useState } from "react";
import styles from "@/styles/RestaurantsAndUsersSection.module.css";
import {
  searchUserByContact,
  getFaultsByRestaurant,
  banRestaurant,
  unbanRestaurant,
  banUser,
  unbanUser,
  deleteUser,
} from "@/services/adminService";
import { getUserRestaurants } from "@/services/restaurantService";

export default function RestaurantsAndUsersSection({
  accessToken,
  isFull,
  isRestaurants,
}: {
  accessToken: string | null;
  isFull: boolean;
  isRestaurants: boolean;
}) {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState<any>(null);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [faults, setFaults] = useState<any[]>([]);
  const [showFaultsFor, setShowFaultsFor] = useState<number | null>(null);

  const handleSearchUser = async () => {
    if (!search.trim()) return;
    setLoading(true);
    setUser(null);
    setRestaurants([]);
    setFaults([]);
    setShowFaultsFor(null);
    try {
      const userRes = await searchUserByContact(search.trim(), accessToken ?? "");
      if (userRes.data) {
        setUser(userRes.data);
        const resRes = await getUserRestaurants(userRes.data.id, accessToken ?? "");
        setRestaurants(Array.isArray(resRes.data) ? resRes.data : []);
      } else {
        setUser(null);
        setRestaurants([]);
      }
    } catch {
      setUser(null);
      setRestaurants([]);
    }
    setLoading(false);
  };

  const handleShowFaults = async (restaurantId: number) => {
    setShowFaultsFor(restaurantId);
    setFaults([]);
    try {
      const res = await getFaultsByRestaurant(restaurantId, accessToken ?? "");
      setFaults(res.data.results || []);
    } catch {
      setFaults([]);
    }
  };

  const reloadRestaurants = async () => {
    if (user) {
      const resRes = await getUserRestaurants(user.id, accessToken ?? "");
      setRestaurants(Array.isArray(resRes.data) ? resRes.data : []);
    }
  };

  const reloadUser = async () => {
    const userRes = await searchUserByContact(search.trim(), accessToken ?? "");
    if (userRes.data) setUser(userRes.data);
  };

  const handleBanRestaurant = async (restaurantId: number) => {
    if (window.confirm("Bạn có chắc muốn cấm bán nhà hàng này?")) {
      await banRestaurant(restaurantId, accessToken ?? "");
      alert("Đã cấm bán nhà hàng!");
      await reloadRestaurants();
    }
  };

  const handleUnbanRestaurant = async (restaurantId: number) => {
    if (window.confirm("Bạn có chắc muốn bỏ cấm bán nhà hàng này?")) {
      await unbanRestaurant(restaurantId, accessToken ?? "");
      alert("Đã bỏ cấm bán nhà hàng!");
      await reloadRestaurants();
    }
  };

  const handleBanUser = async (userId: number) => {
  if (window.confirm("Bạn có chắc muốn cấm bán toàn bộ nhà hàng của user này?")) {
    // Ban toàn bộ nhà hàng trước
    for (const r of restaurants) {
      if (r.status !== "banned") {
        await banRestaurant(r.id, accessToken ?? "");
      }
    }
    // Ban user
    await banUser(userId, accessToken ?? "");
    alert("Đã cấm bán toàn bộ nhà hàng!");
    await reloadUser();
    await reloadRestaurants();
  }
};

const handleUnbanUser = async (userId: number) => {
  if (window.confirm("Bạn có chắc muốn bỏ cấm toàn bộ nhà hàng của user này?")) {
    // Unban toàn bộ nhà hàng trước
    for (const r of restaurants) {
      if (r.status === "banned") {
        await unbanRestaurant(r.id, accessToken ?? "");
      }
    }
    // Unban user
    await unbanUser(userId, accessToken ?? "");
    alert("Đã bỏ cấm bán toàn bộ nhà hàng!");
    await reloadUser();
    await reloadRestaurants();
  }
};

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Bạn có chắc muốn xoá user này?")) {
      await deleteUser(userId, accessToken ?? "");
      alert("Đã xoá user!");
      setUser(null);
      setRestaurants([]);
      setFaults([]);
      setShowFaultsFor(null);
    }
  };

  if (!(isFull || isRestaurants)) {
    return (
      <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
        Bạn không có quyền truy cập chức năng này!
      </div>
    );
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Tìm kiếm chủ nhà hàng và quản lý</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Nhập email hoặc số điện thoại user"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={styles.input}
        />
        <button className={styles.saveBtn} onClick={handleSearchUser}>
          Tìm kiếm
        </button>
        <button
          className={styles.cancelBtn}
          onClick={() => {
            setSearch("");
            setUser(null);
            setRestaurants([]);
            setFaults([]);
            setShowFaultsFor(null);
          }}
        >
          Xoá tìm kiếm
        </button>
      </div>
      {loading && <div>Đang tải...</div>}
      {user && (
        <div style={{ display: "flex", gap: 32, marginBottom: 32 }}>
          {/* Thẻ thông tin user */}
          <div className={styles.userCard}>
            <div className={styles.sectionTitle} style={{ fontSize: "1.15rem", marginBottom: 8 }}>
              Thông tin chủ nhà hàng
            </div>
            <div><b>Username:</b> {user.username}</div>
            <div><b>Email:</b> {user.email}</div>
            <div><b>SĐT:</b> {user.phone}</div>
            <div><b>Địa chỉ:</b> {user.address}</div>
            <div><b>Ngày tham gia:</b> {user.date_joined}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {user.status === "banned" ? (
                <button
                  className={styles.saveBtn}
                  style={{ background: "#22c55e", color: "#fff" }}
                  onClick={() => handleUnbanUser(user.id)}
                >
                  Bỏ cấm người dùng
                </button>
              ) : (
                <button className={styles.deleteBtn} onClick={() => handleBanUser(user.id)}>
                  Cấm bán người dùng
                </button>
              )}
              <button
                className={styles.deleteBtn}
                style={{ background: "#b91c1c" }}
                onClick={() => handleDeleteUser(user.id)}
              >
                Xoá user
              </button>
              </div>
              </div>
          {/* Thẻ danh sách nhà hàng */}
          <div className={styles.restaurantListCard}>
            <div className={styles.sectionTitle} style={{ fontSize: "1.15rem", marginBottom: 8 }}>
              Danh sách nhà hàng của user
              </div>
            {restaurants.length === 0 ? (
              <div>Không có nhà hàng nào.</div>
            ) : (
              restaurants.map((r: any) => (
                <div key={r.id} className={styles.restaurantRow}>
                  <div style={{ flex: 2 }}>
                    <div style={{ fontWeight: 600 }}>{r.name}</div>
                    <div><b>Địa chỉ:</b> {r.address}</div>
                    <div><b>Thành phố:</b> {r.province || r.city}</div>
                    <div><b>SĐT:</b> {r.phone}</div>
                    <div><b>Email:</b> {r.email}</div>
                    <div><b>Ngày tạo:</b> {r.registered_date}</div>
                </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <button
                      className={styles.saveBtn}
                      onClick={() => window.open(`/restaurants/${r.id}`, "_blank")}
                    >
                      Xem thông tin
                    </button>
                    <button
                      className={styles.saveBtn}
                      style={{ background: "#f59e42", color: "#fff" }}
                      onClick={() => handleShowFaults(r.id)}
                    >
                      Xem vi phạm
                    </button>
                    {r.status === "banned" ? (
                      <button
                        className={styles.saveBtn}
                        style={{ background: "#22c55e", color: "#fff" }}
                        onClick={() => handleUnbanRestaurant(r.id)}
                      >
                        Bỏ cấm bán
                      </button>
                    ) : (
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleBanRestaurant(r.id)}
                      >
                        Cấm bán
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {/* Section tố cáo vi phạm */}
      {showFaultsFor && (
        <div className={styles.faultSection}>
          <div className={styles.sectionTitle} style={{ fontSize: "1.15rem", marginBottom: 12 }}>
            Danh sách tố cáo vi phạm của khách hàng
                </div>
          {faults.length === 0 ? (
            <div>Không có tố cáo nào.</div>
          ) : (
            faults.map((f: any) => (
              <div key={f.id} className={styles.faultCard}>
                <div><b>Khách:</b> {f.sender?.username} - {f.sender?.email}</div>
                <div><b>Nội dung:</b> <span style={{ whiteSpace: "pre-line" }}>{f.content}</span></div>
                <div><b>Ngày gửi:</b> {f.created_at}</div>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}