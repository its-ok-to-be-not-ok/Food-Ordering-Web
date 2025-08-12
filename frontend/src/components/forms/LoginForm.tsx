import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { login as loginAction } from "@/store/slices/authSlice";
import { login as loginService } from "@/services/authService";

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setError("");
    try {
      const res = await loginService(email, password);

      // Lưu Redux
      dispatch(loginAction({
        user: res.user,
        access: res.access,
        refresh: res.refresh,
        
      }));

      // Lưu localStorage
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("accessToken", res.access);
      localStorage.setItem("refresh", res.refresh);

      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đăng nhập thất bại!");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2 className={styles.title}>Đăng nhập</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />

        <button type="submit" className={styles.button}>
          Đăng nhập
        </button>

        <p className={styles.linkText}>
          Chưa có tài khoản?{" "}
          <Link href="/register" className={styles.link}>
            Đăng ký
          </Link>
        </p>

        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default LoginForm;
