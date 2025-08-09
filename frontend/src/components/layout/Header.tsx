"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import styles from "./Header.module.css";
import SearchBar from "@/components/search/SearchBar";

export default function Header() {
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const totalItems = useSelector((state: RootState) =>
    state.cart.items?.reduce((sum: number, item: any) => sum + item.quantity, 0)
  );

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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refresh");
    setUser(null);
    setShowDropdown(false);
    router.push("/");
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCartClick = () => {
    router.push("/cart");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <Link href="/">FastFood</Link>
      </div>

      <div className={styles.searchWrapper}>
        <SearchBar
          onSearch={(value) => {
            router.push(`/search?query=${encodeURIComponent(value)}`);
          }}
        />
      </div>

      <div className={styles.userSection}>
        <div
          className={styles.cartIconWrapper}
          onClick={handleCartClick}
          title="Giỏ hàng"
          style={{ display: "inline-block", marginRight: 12, cursor: "pointer", position: "relative" }}
        >
          <img
            src="/images/cart.png"
            alt="Cart"
            className={styles.cartIcon}
            style={{ width: 32, height: 32 }}
          />
          {totalItems > 0 && (
            <span className={styles.cartBadge}>{totalItems}</span>
          )}
        </div>

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
