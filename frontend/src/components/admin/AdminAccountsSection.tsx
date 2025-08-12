import { useState, useEffect } from "react";
import styles from "@/styles/AdminDashboard.module.css";
import { getAdminAccounts, deleteAdminAccount, updateAdminPermissions, createAdminAccount } from "@/services/adminService";

export default function AdminAccountsSection({
  accessToken,
  permissions,
  PERMISSION_OPTIONS,
  isFull,
  isRegistrations,
}: {
  accessToken: string | null;
  permissions: string;
  PERMISSION_OPTIONS: { value: string; label: string }[];
  isFull: boolean;
  isRegistrations: boolean;
}) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newAdmin, setNewAdmin] = useState({ username: "", email: "", password: "", permissions: "full" });
  const [message, setMessage] = useState("");
  const [editRow, setEditRow] = useState<number | null>(null);
  const [editPermission, setEditPermission] = useState<string>("full");

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

  useEffect(() => {
    if (!accessToken) return;
    if (isFull || isRegistrations) fetchAdmins();
  }, [accessToken, isFull, isRegistrations]);

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

  if (!(isFull || isRegistrations)) {
    return (
      <div style={{ color: "red", fontWeight: 600, fontSize: "1.2rem" }}>
        Bạn không có quyền truy cập chức năng này!
      </div>
    );
  }

  return (
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
  );
}