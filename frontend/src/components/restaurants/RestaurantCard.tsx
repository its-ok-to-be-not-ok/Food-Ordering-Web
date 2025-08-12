import React from "react";
import Link from "next/link";
import { Restaurant } from "@/types/restaurant";
import styles from "@/styles/RestaurantCard.module.css";

type Props = {
  restaurant: Restaurant;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export default function RestaurantCard({ restaurant, onToggleStatus, onDelete }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.name}>{restaurant.name}</h2>
        <span className={styles.rating}>⭐ {restaurant.rating.toFixed(1)}</span>
      </div>
      <div className={styles.categories}>
        <span className={styles.label}>Danh mục:</span>{" "}
        {Array.isArray(restaurant.categories) && restaurant.categories.length > 0 ? (
          restaurant.categories.map((cat, idx) => (
            <span key={idx} className={styles.categoryBadge}>
              {cat}
            </span>
          ))
        ) : (
          <span className={styles.categoryBadge}>Chưa có</span>
        )}
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
      {/* Trạng thái */}
      <div className={styles.status}>
        Trạng thái:{" "}
        {restaurant.status === "active" ? (
          <span className={styles.statusActive}>Mở cửa</span>
        ) : restaurant.status === "inactive" ? (
          <span className={styles.statusInactive}>Đóng cửa</span>
        ) : (
          <span className={styles.statusBanned}>Cấm bán</span>
        )}
      </div>
      {/* Các nút tương tác */}
      <div className={styles.actions}>
        <Link
          href={`/user/my-restaurants/${restaurant.id}`}
          className={styles.actionBtn + " " + styles.infoBtn}
        >
          Quản lý thông tin
        </Link>
        <Link
          href={`/user/my-restaurants/${restaurant.id}/menu`}
          className={styles.actionBtn + " " + styles.menuBtn}
        >
          Quản lý thực đơn
        </Link>
        <Link
          href={`/owner/restaurants/${restaurant.id}/orders`}
          className={styles.actionBtn + " " + styles.orderBtn}
        >
          Đơn đặt hàng
        </Link>
        <Link
          href={`/owner/restaurants/${restaurant.id}/report`}
          className={styles.actionBtn + " " + styles.reportBtn}
        >
          Báo cáo kinh doanh
        </Link>
        {/* Chỉ hiện nút mở/đóng cửa nếu không bị cấm bán */}
        {restaurant.status !== "banned" && onToggleStatus && (
          <button
            onClick={onToggleStatus}
            className={
              styles.actionBtn +
              " " +
              (restaurant.status === "active" ? styles.closeBtn : styles.openBtn)
            }
          >
            {restaurant.status === "active" ? "Đóng cửa" : "Mở cửa"}
          </button>
        )}
        {onDelete && (
          <button
            onClick={onDelete}
            className={styles.actionBtn + " " + styles.deleteBtn}
          >
            Xoá nhà hàng
          </button>
        )}
      </div>
      </div>
  );
}