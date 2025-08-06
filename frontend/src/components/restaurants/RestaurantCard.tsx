import React from "react";
import { Restaurant } from "@/types/restaurant";
import styles from "@/styles/RestaurantCard.module.css";


export default function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{restaurant.name}</h2>
        <span className={styles.rating}>⭐ {restaurant.rating.toFixed(1)}</span>
      </div>
      <div className={styles.categories}>
        console.log("Restaurant categories:", restaurant.categories);
        {restaurant.categories
          ?.filter((cat) => cat && cat.id && cat.name)
          .map((cat) => (
            <span key={cat.id} className={styles.categoryBadge}>
              {cat.name}
            </span>
          ))}
      </div>
      <p className={styles.description}>{restaurant.description}</p>
      <div className={styles.info}>
        <div>
          <span className={styles.label}>Địa chỉ:</span> {restaurant.address}
        </div>
        <div>
          <span className={styles.label}>SĐT:</span> {restaurant.phone}
        </div>
      </div>
    </div>
  );
}