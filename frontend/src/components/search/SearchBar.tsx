"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (value: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      onSearch(trimmedQuery); // gọi hàm truyền từ cha trước
      router.push(`/search?query=${encodeURIComponent(trimmedQuery)}`); // chuyển trang
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className={styles.searchContainer}>
      <input
        type="text"
        placeholder="Tìm món ăn hoặc cửa hàng..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleKeyPress}
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>
        Tìm kiếm
      </button>
    </div>
  );
}
