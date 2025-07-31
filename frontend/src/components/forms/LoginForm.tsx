import { useState } from "react";
import { login as loginService } from "@/services/service";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./LoginForm.module.css";
import { useDispatch } from "react-redux";
import { login, logout } from "@/store/slices/authSlice";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Vui lòng nhập đầy đủ email và mật khẩu.");
      return;
    }

    setError("");

    try {
      const res = await loginService(email, password);
      dispatch(login(res));
    
      router.push("/");
    } catch (err) {
      setError("Đăng nhập thất bại!");
    }
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
}