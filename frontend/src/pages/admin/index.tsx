import { useState, useRef, useEffect } from "react";
import styles from "@/styles/AdminDashboard.module.css";
import { getAdminAccounts, deleteAdminAccount, updateAdminPermissions, createAdminAccount, searchRestaurants } from "@/services/service";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

const PERMISSION_OPTIONS = [
  { value: "full", label: "Full" },
  { value: "registrations", label: "Manage Registrations" },
  { value: "restaurants", label: "Manage Restaurants" },
];

export default function AdminDashboard() {
  const accessToken = useSelector((state: RootState) => state.auth.access);
  const permissions = useSelector((state: RootState) => state.auth.permissions);

  const [admins, setAdmins] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "", permissions: "full" });
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("accounts");
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editPermission, setEditPermission] = useState<string>("full");
  const [search, setSearch] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Quyền truy cập
  const isFull = permissions === "Full";
  const isRestaurants = permissions === "Manage Restaurants";
  const isRegistrations = permissions === "Manage Registrations";

  // Admin accounts
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await getAdminAccounts(accessToken ?? "");
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch {
      setAdmins([]);
    }
    setLoading(false);
  };

  // Tìm kiếm nhà hàng theo email hoặc số điện thoại
  const handleSearchRestaurant = async () => {
    const keyword = search.trim();
    if (!keyword) {
      setRestaurants([]);
      return;
    }
    setLoading(true);
    try {
      const res = await searchRestaurants(keyword); // API này trả về mảng nhà hàng khớp
      setRestaurants(Array.isArray(res.data) ? res.data : []);
    } catch {
      setRestaurants([]);
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!accessToken) return;
    if (window.confirm("Bạn có chắc muốn xoá tài khoản này?")) {
      await deleteAdminAccount(id, accessToken);
      setAdmins((prev) => prev.filter((a: any) => a.id !== id));
    }
  };

  const handlePermissionChange = async (id: number, permissions: string) => {
    if (!accessToken) return;
    await updateAdminPermissions(id, { permissions }, accessToken);
    setEditRow(null);
    fetchAdmins();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;
    try {
      await createAdminAccount(newAdmin, accessToken);
      setMessage("Tạo tài khoản admin thành công!");
      setShowCreate(false);
      setNewAdmin({ username: "", email: "", password: "", permissions: "full" });
      fetchAdmins();
    } catch {
      setMessage("Tạo tài khoản thất bại!");
    }
  };

  const getPermissionLabel = (value: string) => {
    const found = PERMISSION_OPTIONS.find(opt => opt.value === value);
    return found ? found.label : value;
  };

  // Tự động fetch admin khi vào tab accounts
  useEffect(() => {
    if (!accessToken) return;
    if (activeTab === "accounts" && (isFull || isRegistrations)) fetchAdmins();
    // Tab nhà hàng chỉ tìm kiếm khi nhập từ khoá
  }, [activeTab, accessToken, isFull, isRegistrations]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Admin Dashboard</h1>
      <div className={styles.menu}>
        <button className={styles.menuBtn} onClick={() => setActiveTab("accounts")}>Admin Accounts</button>
        <button className={styles.menuBtn} onClick={() => setActiveTab("restaurants")}>Quản lý nhà hàng</button>
        <button className={styles.menuBtn} onClick={() => setActiveTab("orders")}>Quản lý đơn mở bán</button>
        <button className={styles.menuBtn} onClick={() => setActiveTab("reports")}>Báo cáo sai phạm</button>
      </div>
      <div className={styles.section}>
        {/* Tab Admin Accounts */}
        {activeTab === "accounts" && !(isFull || isRegistrations) && (
          <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
            Bạn không có quyền truy cập chức năng này!
          </div>
        )}
        {activeTab === "accounts" && (isFull || isRegistrations) && (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className={styles.sectionTitle}>Danh sách tài khoản admin</h2>
              <button className={styles.createBtn} onClick={() => setShowCreate(true)}>+ Tạo tài khoản admin</button>
            </div>
            {showCreate && (
              <form onSubmit={handleCreate} className={styles.createForm}>
                <input
                  type="text"
                  placeholder="Username"
                  value={newAdmin.username}
                  onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                  required
                  className={styles.input}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newAdmin.email}
                  onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  required
                  className={styles.input}
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={newAdmin.password}
                  onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                  required
                  className={styles.input}
                />
                <select
                  value={newAdmin.permissions}
                  onChange={(e) => setNewAdmin({ ...newAdmin, permissions: e.target.value })}
                  className={styles.input}
                  required
                >
                  {PERMISSION_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <button type="submit" className={styles.saveBtn}>Tạo</button>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowCreate(false)}>Huỷ</button>
                {message && <div className={styles.message}>{message}</div>}
              </form>
            )}
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Permissions</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5}>Đang tải...</td></tr>
                ) : admins.length === 0 ? (
                  <tr><td colSpan={5}>Không có tài khoản admin nào.</td></tr>
                ) : (
                  admins.map((admin: any) => (
                    <tr key={admin.id}>
                      <td>{admin.id}</td>
                      <td>{admin.username}</td>
                      <td>{admin.email}</td>
                      <td>
                        {editRow === admin.id ? (
                          <select
                            value={editPermission}
                            onChange={e => setEditPermission(e.target.value)}
                            className={styles.input}
                            style={{ minWidth: 180 }}
                          >
                            {PERMISSION_OPTIONS.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                        ) : (
                          getPermissionLabel(admin.permissions)
                        )}
                      </td>
                      <td>
                        {editRow === admin.id ? (
                          <button
                            className={styles.saveBtn}
                            onClick={() => handlePermissionChange(admin.id, editPermission)}
                          >
                            Lưu
                          </button>
                        ) : (
                          <button
                            className={styles.editBtn}
                            onClick={() => {
                              setEditRow(admin.id);
                              setEditPermission(admin.permissions);
                            }}
                          >
                            Chỉnh sửa quyền
                          </button>
                        )}
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(admin.id)}
                          style={{ marginLeft: 8 }}
                        >
                          Xoá
                        </button>
                        {editRow === admin.id && (
                          <button
                            className={styles.cancelBtn}
                            onClick={() => setEditRow(null)}
                            style={{ marginLeft: 8 }}
                          >
                            Huỷ
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </>
        )}

        {/* Tab Quản lý nhà hàng */}
        {activeTab === "restaurants" && !(isFull || isRestaurants) && (
          <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
            Bạn không có quyền truy cập chức năng này!
          </div>
        )}
        {activeTab === "restaurants" && (isFull || isRestaurants) && (
          <>
            <h2 className={styles.sectionTitle}>Danh sách nhà hàng</h2>
            <div style={{ marginBottom: 16 }}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Nhập email hoặc số điện thoại để tìm kiếm"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.input}
                style={{ minWidth: 220 }}
              />
              <button
                className={styles.saveBtn}
                onClick={handleSearchRestaurant}
                style={{ marginLeft: 8 }}
              >
                Tìm kiếm
              </button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setSearch("");
                  setRestaurants([]);
                  searchInputRef.current?.focus();
                }}
                style={{ marginLeft: 8 }}
              >
                Xoá tìm kiếm
              </button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24 }}>
              {loading ? (
                <div>Đang tải...</div>
              ) : restaurants.length === 0 ? (
                <div>Không có nhà hàng nào.</div>
              ) : (
                restaurants.map((r: any) => (
                  <div
                    key={r.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 10,
                      padding: 20,
                      minWidth: 280,
                      background: "#fff",
                      boxShadow: "0 2px 8px #e5e7eb"
                    }}
                  >
                    <div><b>{r.name}</b></div>
                    <div>Địa chỉ: {r.address}</div>
                    <div>Tỉnh thành: {r.province}</div>
                    <div>Số điện thoại: {r.phone}</div>
                    <div>Email: {r.email}</div>
                    <div>Chủ sở hữu: {r.owner?.username || r.owner}</div>
                    <div>Trạng thái: {r.status}</div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Tab Quản lý đơn mở bán */}
        {activeTab === "orders" && !(isFull || isRegistrations) && (
          <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
            Bạn không có quyền truy cập chức năng này!
          </div>
        )}
        {activeTab === "orders" && (isFull || isRegistrations) && (
          <>
            <h2 className={styles.sectionTitle}>Quản lý đơn mở bán</h2>
            {/* Nội dung quản lý đơn mở bán */}
          </>
        )}

        {/* Tab Báo cáo sai phạm */}
        {activeTab === "reports" && !(isFull || isRestaurants) && (
          <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
            Bạn không có quyền truy cập chức năng này!
          </div>
        )}
        {activeTab === "reports" && (isFull || isRestaurants) && (
          <>
            <h2 className={styles.sectionTitle}>Báo cáo sai phạm</h2>
            {/* Nội dung báo cáo sai phạm */}
          </>
        )}
      </div>
    </div>
    );
}