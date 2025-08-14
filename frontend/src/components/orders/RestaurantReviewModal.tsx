import { useState } from "react";
import styles from "@/styles/RestaurantReviewModal.module.css";



interface RestaurantReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  restaurantName: string;
}

export default function RestaurantReviewModal({
  open,
  onClose,
  onSubmit,
  restaurantName,
}: RestaurantReviewModalProps) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!rating) {
      setError("Vui lòng chọn số sao đánh giá.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Nhận xét tối thiểu 10 ký tự.");
      return;
    }
    setError("");
    onSubmit(rating, comment);
    setRating(5);
    setComment("");
  };

  return (
    <div className={styles.reviewModalOverlay}>
      <div className={styles.reviewModal}>
        <h2 className={styles.reviewTitle}>
          Đánh giá nhà hàng <span className={styles.reviewRestaurant}>{restaurantName}</span>
        </h2>
        <div className={styles.ratingRow}>
          <span>Chấm điểm: </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= (hover || rating) ? styles.starActive : styles.star}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
              onClick={() => setRating(star)}
              title={
                star === 1
                  ? "Rất tệ"
                  : star === 2
                  ? "Tệ"
                  : star === 3
                  ? "Bình thường"
                  : star === 4
                  ? "Tốt"
                  : "Xuất sắc"
              }
            >
              ★
            </span>
          ))}
          <span className={styles.ratingLabel}>
            {["", "Rất tệ", "Tệ", "Bình thường", "Tốt", "Xuất sắc"][hover || rating]}
          </span>
        </div>
        <textarea
          className={styles.reviewTextarea}
          placeholder="Nhận xét của bạn về chất lượng món ăn, phục vụ, giao hàng..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={300}
        />
        <div className={styles.reviewCharCount}>{comment.length}/300 ký tự</div>
        {error && <div className={styles.reviewError}>{error}</div>}
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <button className={styles.detailBtn} onClick={handleSubmit}>
            Gửi đánh giá
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}