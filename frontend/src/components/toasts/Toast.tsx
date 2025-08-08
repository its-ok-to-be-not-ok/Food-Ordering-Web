
"use client";

import { useEffect } from "react";
import styles from "@/components/toasts/Toast.module.css";

type ToastProps = {
  message: string;
  onClose: () => void;
};

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000); // 3s rồi ẩn
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.toast}>
      {message}
    </div>
  );
}
