import React from "react";
import { useRouter } from "next/router";
import styles from "@/styles/RestaurantCard2.module.css";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  status: string;
  rating: number;
  registered_date: string;
  categories: string[];
}

const RestaurantCard2: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/restaurants/${restaurant.id}`);
  };

  return (
    <div
      className={styles["restaurant-card"]}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      title={`Xem chi tiết ${restaurant.name}`}
    >
      <span className={styles.rating}>{restaurant.rating} ⭐</span>
      <h4>{restaurant.name}</h4>
      <div className={styles.desc}>{restaurant.description}</div>
      <div className={styles.info}><strong>Địa chỉ:</strong> {restaurant.address}</div>
      <div className={styles.info}><strong>Điện thoại:</strong> {restaurant.phone}</div>
      <div className={styles.info}><strong>Email:</strong> {restaurant.email}</div>
      <div className={styles.categories}>
        <strong>Danh mục:</strong> {restaurant.categories?.join(", ")}
      </div>
      <div className={styles.status}>
        <strong>Trạng thái:</strong> {restaurant.status}
      </div>
      <div className={styles.date}>
        <strong>Ngày đăng ký:</strong> {new Date(restaurant.registered_date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default RestaurantCard2;