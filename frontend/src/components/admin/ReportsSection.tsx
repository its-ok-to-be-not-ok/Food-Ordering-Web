import { useState, useEffect } from "react";
import styles from "@/styles/ReportsSection.module.css";
import { getFaults } from "@/services/faultService";

export default function ReportsSection({
  accessToken,
  isFull,
  isRestaurants,
}: {
  accessToken: string | null;
  isFull: boolean;
  isRestaurants: boolean;
}) {
  const [faults, setFaults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!accessToken) return;
    if (isFull || isRestaurants) {
      setLoading(true);
      getFaults(accessToken ?? "")
        .then((res) => {
          setFaults(Array.isArray(res.data) ? res.data : res.data.results || []);
        })
        .catch(() => setFaults([]))
        .finally(() => setLoading(false));
    }
  }, [accessToken, isFull, isRestaurants]);

  if (!(isFull || isRestaurants)) {
    return (
      <div className={styles.noAccess}>
        Bạn không có quyền truy cập chức năng này!
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.sectionTitle}>Báo cáo sai phạm</h2>
      {loading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : faults.length === 0 ? (
        <div className={styles.empty}>Không có báo cáo nào.</div>
      ) : (
        <div className={styles.faultSection}>
          {faults.map((fault: any) => (
            <div key={fault.id} className={styles.faultCard}>
              {/* Header: Người tố cáo & Ngày tố cáo */}
              <div className={styles.cardHeader}>
                <div className={styles.reporter}>
                  <span className={styles.iconUser}>👤</span>
                  <span className={styles.reporterLabel}>Người tố cáo:</span>
                  <span className={styles.reporterInfo}>
                    {fault.sender?.username} ({fault.sender?.email})
                  </span>
                </div>
                <div className={styles.date}>
                  <span className={styles.iconDate}>📅</span>
                  <span className={styles.dateLabel}>Ngày tố cáo:</span>
                  <span className={styles.dateInfo}>{fault.created_at}</span>
                </div>
              </div>
              {/* Thông tin nhà hàng bị tố cáo */}
              <div className={styles.restaurantBlock}>
                <span className={styles.restaurantLabel}>Nhà hàng bị tố cáo</span>
                <div className={styles.restaurantInfo}>
                  <div>
                    <span className={styles.iconStore}>🏪</span>
                    <b>Tên nhà hàng:</b> {fault.restaurant?.name}
                  </div>
                  <div>
                    <span className={styles.iconLocation}>📍</span>
                    <b>Địa chỉ:</b> {fault.restaurant?.address}
                  </div>
                  <div>
                    <span className={styles.iconOwner}>👔</span>
                    <b>Chủ nhà hàng:</b> {fault.restaurant?.owner?.username} - {fault.restaurant?.owner?.phone} - {fault.restaurant?.owner?.email}
                  </div>
                </div>
              </div>
              {/* Nội dung tố cáo */}
              <div className={styles.contentBlock}>
                <span className={styles.contentLabel}>Nội dung tố cáo</span>
                <div className={styles.contentBox}>
                  {fault.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}