import { useState } from "react";
import { register } from "@/services/service";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "./RegisterForm.module.css"; // import file CSS module

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    role: "customer" as const,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form);
      router.push("/login");
    } catch (err) {
      setError("Đăng ký thất bại!");
    }
  };

  return (
    <div className={styles.boxLoginRegister}>
      <form onSubmit={handleSubmit} className={styles.formLoginRegister}>
        <h2 className={styles.title}>Đăng ký</h2>

        <input
          name="username"
          placeholder="Tên người dùng"
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="password"
          type="password"
          placeholder="Mật khẩu"
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="phone"
          placeholder="Số điện thoại"
          onChange={handleChange}
          className={styles.input}
        />
        <input
          name="address"
          placeholder="Địa chỉ"
          onChange={handleChange}
          className={styles.input}
        />
        <select
          name="role"
          onChange={handleChange}
          className={styles.select}
        >
          <option value="customer">Khách hàng</option>
          <option value="restaurant_owner">Chủ nhà hàng</option>
        </select>

        <button type="submit" className={styles.button}>
          Đăng ký
        </button>

        {error && <p className={styles.error}>{error}</p>}

        {/* Liên kết quay lại trang đăng nhập */}
        <p className={styles.link}>
          Đã có tài khoản? <Link href="/login">Đăng nhập</Link>
        </p>
      </form>
    </div>
  );
}
