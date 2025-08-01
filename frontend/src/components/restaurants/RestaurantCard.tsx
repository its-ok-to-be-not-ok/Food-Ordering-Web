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
        {restaurant.categories.map((cat) => (
          <span key={cat} className={styles.categoryBadge}>
            {cat}
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