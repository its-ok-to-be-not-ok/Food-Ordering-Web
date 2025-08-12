import { useState } from "react";
import { useRouter } from "next/router";
import styles from "@/styles/AdminLogin.module.css";
import { adminLogin } from "@/services/adminService";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await adminLogin({ email, password });
      dispatch(login({
        user: res.data.user,
        access: res.data.access,
        refresh: res.data.refresh,
        permissions: res.data.permissions,
      }));
      router.push("/admin");
    } catch (err: any) {
      setError("Đăng nhập thất bại. Vui lòng kiểm tra lại email hoặc mật khẩu.");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Đăng nhập Admin</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Email admin"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
        {error && <div className={styles.error}>{error}</div>}
      </form>
    </div>
  );
}