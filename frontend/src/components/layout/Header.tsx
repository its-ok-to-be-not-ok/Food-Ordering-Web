"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./Header.module.css";
import SearchBar from "@/components/search/SearchBar";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowDropdown(false);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">FastFood</Link>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar />
      </div>

      <div className={styles.userSection}>
        {!user ? (
          <nav className={styles.authLinks}>
            <Link href="/login">Đăng nhập</Link>
            <Link href="/register">Đăng ký</Link>
          </nav>
        ) : (
          <div className={styles.userMenu}>
            <img
              src="/images/user.png"
              alt="User"
              className={styles.userIcon}
              onClick={toggleDropdown}
            />
            {showDropdown && (
              <div className={styles.dropdown}>
                <p><strong>{user.username}</strong></p>
                <p>{user.email}</p>
                <p>Vai trò: {user.role}</p>
                <button className={styles.button} onClick={handleLogout}>Đăng xuất</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
