// pages/search/index.tsx
import { useState, useEffect } from "react";
import SearchBar from "@/components/search/SearchBar";
import MenuItem from "@/components/restaurants/MenuItemCard";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import styles from "@/styles/Search.module.css";

interface MenuItemType {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price?: number;
  discount?: number;
  status?: string;
  restaurantName?: string; // Thêm để truyền vào MenuItem
  menuName?: string;       // Thêm để truyền vào MenuItem
}

interface RestaurantType {
  id: string;
  name: string;
  address: string;
  phone: string;
  description: string;
  rating: number;
  categories: [];
  status: "active" | "inactive";
  images: string[];
  menus: {
    id: string;
    title: string;
    description?: string;
    items: MenuItemType[];
  }[];
}

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMenuItems, setFilteredMenuItems] = useState<MenuItemType[]>([]);
  const [restaurants, setRestaurants] = useState<RestaurantType[]>([]);

  useEffect(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (keyword === "") {
      setRestaurants([]);
      setFilteredMenuItems([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.warn("Chưa đăng nhập, không thể tìm cửa hàng");
          setRestaurants([]);
          setFilteredMenuItems([]);
          return;
        }

        const res = await fetch(
          `http://localhost:8000/api/restaurants/search/?q=${encodeURIComponent(keyword)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          console.error("Lỗi khi gọi API tìm kiếm nhà hàng:", res.status);
          setRestaurants([]);
          setFilteredMenuItems([]);
          return;
        }

        const data: RestaurantType[] = await res.json();
        setRestaurants(data);

        const matchedItems: MenuItemType[] = [];
        data.forEach((restaurant) => {
          restaurant.menus?.forEach((menu) => {
            menu.items?.forEach((item) => {
              if (item.name.toLowerCase().includes(keyword)) {
                matchedItems.push({
                  ...item,
                  restaurantName: restaurant.name, // Gán tên nhà hàng
                  menuName: menu.title,             // Gán tên menu
                });
              }
            });
          });
        });

        setFilteredMenuItems(matchedItems);
      } catch (error) {
        console.error("Lỗi khi tìm cửa hàng:", error);
        setRestaurants([]);
        setFilteredMenuItems([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className={styles.searchPage}>
      <div className={styles.searchBarWrapper}>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Món ăn</h2>
        <div className={styles.itemsGrid}>
          {filteredMenuItems.length > 0 ? (
            filteredMenuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))
          ) : (
            <p className={styles.empty}>Không tìm thấy món ăn phù hợp</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cửa hàng</h2>
        <div className={styles.restaurantsGrid}>
          {restaurants.length > 0 ? (
            restaurants.map((item) => (
              <RestaurantCard key={item.id} restaurant={item} />
            ))
          ) : (
            <p className={styles.empty}>Không tìm thấy cửa hàng phù hợp</p>
          )}
        </div>
      </section>
    </div>
  );
}
