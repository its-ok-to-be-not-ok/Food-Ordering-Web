// ✅ Phải như thế này
import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <Link href="/">Trang chủ</Link>
        <Link href="/login">Đăng nhập</Link>
        <Link href="/register">Đăng ký</Link>
      </nav>
    </header>
  );
}
